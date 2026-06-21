// Ink-compatible render function for Bun
import React from 'react'
import { createContainer, updateContainer, type TerminalContainer } from './reconciler.js'
import { StdinHandler, type Key } from './stdin.js'
import { setRerenderCallback, clearRerenderCallback, dispatchInputEvent, type InputEvent } from './input.js'

type RenderOptions = {
  stdout?: NodeJS.WriteStream
  stdin?: NodeJS.ReadStream
  exitOnCtrlC?: boolean
}

type Instance = {
  unmount: () => void
  waitUntilExit: () => Promise<void>
}

// ANSI
const ESC = '\x1b'
const CLEAR = `${ESC}[2J${ESC}[H`
const HIDE_CUR = `${ESC}[?25l`
const SHOW_CUR = `${ESC}[?25h`
const CLEAR_LINE = `${ESC}[2K`
const CURSOR_COL = (n: number) => `${ESC}[${n}G`

const COLOR_MAP: Record<string, string> = {
  black: '30', red: '31', green: '32', yellow: '33',
  blue: '34', magenta: '35', cyan: '36', white: '37',
  gray: '90', grey: '90',
  redBright: '91', greenBright: '92', yellowBright: '93',
  blueBright: '94', magentaBright: '95', cyanBright: '96', whiteBright: '97',
}

function styleText(text: string, opts: { color?: string; bold?: boolean; dim?: boolean; italic?: boolean }): string {
  const codes: string[] = []
  if (opts.bold) codes.push('1')
  if (opts.dim) codes.push('2')
  if (opts.italic) codes.push('3')
  if (opts.color && COLOR_MAP[opts.color]) codes.push(COLOR_MAP[opts.color])
  if (codes.length === 0) return text
  return `${ESC}[${codes.join(';')}m${text}${ESC}[0m`
}

function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, '')
}

// ─── Render ──────────────────────────────────────────
export async function render(
  element: React.ReactNode,
  options: RenderOptions = {},
): Promise<Instance> {
  const stdout = options.stdout || process.stdout
  const stdin = options.stdin || process.stdin

  const container = createContainer(stdout.columns || 80, stdout.rows || 24)
  let isRunning = true
  let exitResolve!: () => void
  const exitPromise = new Promise<void>(r => { exitResolve = r })

  // Full render
  function fullRender() {
    if (!isRunning) return
    container.layoutNode.calculateLayout(container.width, container.height)
    const lines = renderNode(container.root.containerInfo)
    stdout.write(CLEAR + HIDE_CUR + lines.join('\n') + '\n')
  }

  // Incremental render: clear screen, rewrite all (simple but reliable)
  let renderQueued = false
  function scheduleRender() {
    if (renderQueued || !isRunning) return
    renderQueued = true
    // Use setTimeout(0) to let React process state updates first
    setTimeout(async () => {
      renderQueued = false
      if (!isRunning) return
      await updateContainer(container, element)
      fullRender()
    }, 10)
  }

  // Stdin
  const stdinHandler = new StdinHandler({
    stdin, stdout,
    onKey: (key: Key) => {
      const event = keyToEvent(key)
      if (!event) return
      if (event.type === 'ctrl+c') { unmount(); process.exit(0); return }
      dispatchInputEvent(event)
    },
    onRawData: () => {},
  })
  stdinHandler.setRawMode(true)
  setRerenderCallback(scheduleRender)

  // Initial render
  await updateContainer(container, element)
  fullRender()

  // Resize
  const onResize = () => {
    if (!isRunning) return
    container.width = stdout.columns || 80
    container.height = stdout.rows || 24
    fullRender()
  }
  process.on('resize', onResize)

  function unmount() {
    isRunning = false
    stdinHandler.destroy()
    clearRerenderCallback()
    process.removeListener('resize', onResize)
    stdout.write(SHOW_CUR + '\n')
    exitResolve()
  }

  return { unmount, waitUntilExit: () => exitPromise }
}

// ─── Key → Event ─────────────────────────────────────
function keyToEvent(key: Key): InputEvent | null {
  if (key.ctrl && key.name === 'c') return { type: 'ctrl+c' }
  if (key.ctrl && key.name === 'd') return { type: 'ctrl+d' }
  switch (key.name) {
    case 'return': return { type: 'return' }
    case 'backspace': return { type: 'backspace' }
    case 'delete': return { type: 'delete' }
    case 'tab': return { type: 'tab' }
    case 'up': return { type: 'up' }
    case 'down': return { type: 'down' }
    case 'left': return { type: 'left' }
    case 'right': return { type: 'right' }
    case 'home': return { type: 'home' }
    case 'end': return { type: 'end' }
    default:
      if (key.sequence && !key.ctrl && !key.meta) return { type: 'char', char: key.sequence }
      return null
  }
}

// ─── Node → Lines ────────────────────────────────────
function renderNode(node: any): string[] {
  if (node.tag === 'TEXT') {
    const text = node.text || ''
    if (!text) return []
    return [styleText(text, {
      color: node.props?.color,
      bold: node.props?.bold,
      dim: node.props?.dimColor,
      italic: node.props?.italic,
    })]
  }

  if (node.tag === 'BOX' || node.tag === 'CONTAINER') {
    const p = node.props || {}
    const dir = p.flexDirection || 'column'
    const mTop = p.marginTop || 0
    const mBot = p.marginBottom || 0
    const pad = p.padding || 0
    const padL = p.paddingLeft || pad
    const padR = p.paddingRight || pad
    const padT = p.paddingTop || pad
    const padB = p.paddingBottom || pad

    // Text component: inline children
    const isText = !p.flexDirection && !p.width && !p.height &&
      (p.color || p.bold || p.backgroundColor || p.italic)

    const childLines: string[] = []
    for (const child of node.children || []) {
      const cl = renderNode(child)
      if (isText || dir === 'row') {
        if (childLines.length === 0) { childLines.push(...cl) }
        else {
          for (let i = 0; i < Math.max(childLines.length, cl.length); i++) {
            childLines[i] = (childLines[i] || '') + (cl[i] || '')
          }
        }
      } else {
        childLines.push(...cl)
      }
    }

    if (isText) {
      return [styleText(childLines.join(''), {
        color: p.color, bold: p.bold, dim: p.dimColor, italic: p.italic,
      })]
    }

    const result: string[] = []
    for (let i = 0; i < mTop; i++) result.push('')
    result.push(...childLines)
    for (let i = 0; i < mBot; i++) result.push('')

    if (padL > 0 || padR > 0) {
      const l = ' '.repeat(padL), r = ' '.repeat(padR)
      for (let i = 0; i < result.length; i++) result[i] = l + result[i] + r
    }

    for (let i = 0; i < padT; i++) result.unshift('')
    for (let i = 0; i < padB; i++) result.push('')

    return result
  }

  return []
}

export { Box } from './components/Box.js'
export { Text } from './components/Text.js'
