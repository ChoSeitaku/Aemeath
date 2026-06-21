/**
 * Aemeath CLI - 星炬学院拉海洛风格
 * Ink 渲染 · 自适应终端宽度
 */

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { Box, Text, useInput, type InputEvent } from '../ink/index.js'
import { AemeathEngine, Message } from '../core/engine.js'
import { createDefaultCommandRegistry } from './commands.js'

interface AppState {
  messages: Message[]
  isLoading: boolean
  streamingMessage: string
  isReady: boolean
  error: string | null
}

const STAR = '✦'
const SEP = '─────────────────────────────────────────────────────'

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    messages: [], isLoading: false, streamingMessage: '', isReady: false, error: null,
  })
  const [inputValue, setInputValue] = useState('')
  const cursorRef = useRef(0)

  const engine = useMemo(() => {
    try {
      return new AemeathEngine({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseUrl: process.env.DEEPSEEK_BASE_URL,
        model: process.env.DEEPSEEK_MODEL,
      })
    } catch { return null }
  }, [])

  const registry = useMemo(() => createDefaultCommandRegistry(), [])
  const commandList = useMemo(() => registry.getCommandList().map(c => `/${c.name}`), [registry])
  const completionsRef = useRef<string[]>([])

  const getCompletions = useCallback((input: string) => {
    if (!input.startsWith('/')) return []
    const q = input.slice(1).toLowerCase()
    return commandList.filter(c => c.replace('/', '').toLowerCase().startsWith(q))
  }, [commandList])

  useEffect(() => { if (engine) setState(p => ({ ...p, isReady: true })) }, [engine])

  const handleSubmit = useCallback(async (value: string) => {
    if (!value.trim() || !engine) return
    if (value.startsWith('/quit') || value.startsWith('/q') || value === '/exit') process.exit(0)

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: value, timestamp: new Date() }
    setState(p => ({ ...p, messages: [...p.messages, userMsg], isLoading: true, streamingMessage: '' }))
    setInputValue('')
    cursorRef.current = 0
    completionsRef.current = []

    try {
      if (value.startsWith('/')) {
        const { name, args } = registry.parseCommand(value)
        const result = registry.execute(name, args, { engine, registry, exit: () => process.exit(0) })
        if (result) {
          const aMsg: Message = { id: String(Date.now() + 1), role: 'assistant', content: result, timestamp: new Date() }
          setState(p => ({ ...p, messages: [...p.messages, aMsg], isLoading: false }))
        }
      } else {
        let full = ''
        for await (const chunk of engine.processInputStream(value)) {
          full += chunk
          setState(p => ({ ...p, streamingMessage: full }))
        }
        const aMsg: Message = { id: String(Date.now() + 1), role: 'assistant', content: full, timestamp: new Date() }
        setState(p => ({ ...p, messages: [...p.messages, aMsg], isLoading: false, streamingMessage: '' }))
      }
    } catch {
      setState(p => ({ ...p, isLoading: false, streamingMessage: '', error: '爱弥斯遇到了一些问题' }))
    }
  }, [engine, registry])

  useInput(useCallback((event: InputEvent) => {
    if (state.isLoading) return
    switch (event.type) {
      case 'return': handleSubmit(inputValue); break
      case 'char': setInputValue(prev => prev + event.char); break
      case 'backspace': setInputValue(prev => prev.length > 0 ? prev.slice(0, -1) : prev); break
      case 'home': break
      case 'end': break
      case 'tab': {
        const c = getCompletions(inputValue)
        completionsRef.current = c
        if (c.length === 1) setInputValue(c[0] + ' ')
        break
      }
    }
  }, [inputValue, state.isLoading, handleSubmit, getCompletions]))

  if (!engine) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="red">{'  ✗ DEEPSEEK_API_KEY 未设置'}</Text>
        <Text dim color="gray">{'  复制 .env.example 为 .env，添加 API Key'}</Text>
      </Box>
    )
  }

  if (!state.isReady) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="yellow">{'  ✦ 正在连接星炬终端...'}</Text>
      </Box>
    )
  }

  const model = engine.getModel()
  const msgCount = state.messages.length

  return (
    <Box flexDirection="column">
      <Box marginTop={1} marginBottom={1}>
        <Text bold color="yellow">{'  ╔══════════════════════════════════════════════════╗'}</Text>
      </Box>
      <Box>
        <Text bold color="yellow">{'  ║  ✦  ✦   A E M E A T H   ✦  ✦              ║'}</Text>
      </Box>
      <Box>
        <Text bold color="yellow">{'  ║  ✦✦  星 炬 学 院 · 拉 海 洛  ✦✦            ║'}</Text>
      </Box>
      <Box>
        <Text dim italic color="yellow">{'  ║      拉贝尔学部 · 电子幽灵终端            ║'}</Text>
      </Box>
      <Box>
        <Text bold color="yellow">{'  ║  ✦  ✦                      ✦  ✦            ║'}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="yellow">{'  ╚══════════════════════════════════════════════════╝'}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text dim color="gray">{'  ──────────────────────────────────────────────────────'}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="yellow">{'  ✦ 模型 · '}{model}{' │ 记忆 · '}{String(msgCount) + '条'}{' │ 工具 · 0个'}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text dim color="gray">{'  ──────────────────────────────────────────────────────'}</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        {state.messages.map(msg => (
          <Box key={msg.id} marginBottom={1}>
            <Text bold color={msg.role === 'user' ? 'blue' : 'yellow'}>
              {msg.role === 'user' ? '  ✦ ' : '  ✦ '}
            </Text>
            <Text color="white">{msg.content}</Text>
          </Box>
        ))}
      </Box>

      {state.isLoading && state.streamingMessage && (
        <Box marginBottom={1}>
          <Text bold color="yellow">{'  ✦ '}</Text>
          <Text color="white">{state.streamingMessage}</Text>
          <Text dim color="gray">{'▌'}</Text>
        </Box>
      )}

      {state.isLoading && !state.streamingMessage && (
        <Box marginBottom={1}>
          <Text color="yellow">{'  ✦ 思考中...'}</Text>
        </Box>
      )}

      {completionsRef.current.length > 1 && (
        <Box marginBottom={1}>
          <Text dim color="gray">{'    补全: ' + completionsRef.current.join(' │ ')}</Text>
        </Box>
      )}

      {state.error && (
        <Box marginBottom={1}>
          <Text color="red">{'  ✗ ' + state.error}</Text>
        </Box>
      )}

      <Box flexDirection="row">
        <Text bold color="yellow">{'  ✦ ❯ '}</Text>
        <Text color="white">{inputValue}</Text>
        <Text dim color="gray">{'▌'}</Text>
      </Box>

      <Box marginTop={1}>
        <Text dim color="gray">{'  Ctrl+C 退出 · 上下键历史 · Tab 补全 · ' + model}</Text>
      </Box>
    </Box>
  )
}

export { App }
export default App
