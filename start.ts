#!/usr/bin/env bun

/**
 * Aemeath CLI - 星炬学院拉海洛风格
 * readline 稳定架构 · 复古未来主义设计
 */

import * as readline from 'readline'
import * as fs from 'fs'
import * as path from 'path'
import { createClientFromEnv, type DeepSeekClient, type ChatMessage } from './src/ai/client'
import { AEMEATH_SYSTEM_PROMPT } from './src/ai/prompts'

// ─── 配置加载 ────────────────────────────────────────
const XIAOAI_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '', '.xiaoai')
const SETTINGS_FILE = path.join(XIAOAI_DIR, 'settings.json')

interface Settings {
  api_key?: string
  model?: string
  api_base?: string
  theme?: { name?: string }
  personality?: { name?: string; 'user称呼'?: string }
}

function loadSettings(): Settings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'))
    }
  } catch {}
  return {}
}

const settings = loadSettings()

// 如果 .env 没有 key，从 settings 读取
if (!process.env.DEEPSEEK_API_KEY && settings.api_key) {
  process.env.DEEPSEEK_API_KEY = settings.api_key
}
if (!process.env.DEEPSEEK_MODEL && settings.model) {
  process.env.DEEPSEEK_MODEL = settings.model
}
if (!process.env.DEEPSEEK_BASE_URL && settings.api_base) {
  process.env.DEEPSEEK_BASE_URL = settings.api_base
}

// ─── 星炬学院配色 ────────────────────────────────────
const G = '\x1b[38;5;180m'   // 星辉金
const B = '\x1b[38;5;111m'   // 电子蓝
const W = '\x1b[38;5;252m'   // 幽灵白
const D = '\x1b[38;5;240m'   // 暗灰
const GR = '\x1b[38;5;114m'  // 绿
const R = '\x1b[38;5;131m'   // 热熔红
const CY = '\x1b[38;5;123m'  // 共鸣青
const RST = '\x1b[0m'
const BOLD = '\x1b[1m'
const DIM = '\x1b[2m'
const ITA = '\x1b[3m'
const NL = '\n'
const STAR = '✦'
const SEP = '─────────────────────────────────────────────────────'

function p(s: string) { process.stdout.write(s) }

// ─── Banner ──────────────────────────────────────────
function banner() {
  p(NL)
  p(`${G}${BOLD}  ╔══════════════════════════════════════════════════╗${RST}${NL}`)
  p(`${G}${BOLD}  ║  ${STAR}  ${STAR}   A E M E A T H   ${STAR}  ${STAR}              ║${RST}${NL}`)
  p(`${G}${BOLD}  ║  ${STAR}${STAR}  星 炬 学 院 · 拉 海 洛  ${STAR}${STAR}            ║${RST}${NL}`)
  p(`${G}${BOLD}  ║  ${G}${ITA}${DIM}    拉贝尔学部 · 电子幽灵终端            ${RST}${G}${BOLD}║${RST}${NL}`)
  p(`${G}${BOLD}  ║  ${STAR}  ${STAR}                      ${STAR}  ${STAR}            ║${RST}${NL}`)
  p(`${G}${BOLD}  ╚══════════════════════════════════════════════════╝${RST}${NL}`)
  p(NL)
}

// ─── 状态栏 ──────────────────────────────────────────
function status(model: string, count: number) {
  p(`${D}  ${SEP}${RST}${NL}`)
  p(`${G}  ${STAR}${RST} ${B}模型${RST} ${D}·${RST} ${W}${model}${RST} ${D}│${RST} ${B}记忆${RST} ${D}·${RST} ${W}${count}条${RST} ${D}│${RST} ${B}工具${RST} ${D}·${RST} ${W}0个${RST}${NL}`)
  p(`${D}  ${SEP}${RST}${NL}${NL}`)
}

// ─── 帮助 ────────────────────────────────────────────
function help() {
  p(NL)
  p(`${G}  ${STAR}${RST} ${G}${BOLD}可用命令${RST}${NL}${NL}`)
  p(`    ${B}${BOLD}/help${RST}      ${D}显示帮助信息${RST}${NL}`)
  p(`    ${B}${BOLD}/clear${RST}     ${D}清空对话历史${RST}${NL}`)
  p(`    ${B}${BOLD}/history${RST}   ${D}查看对话历史${RST}${NL}`)
  p(`    ${B}${BOLD}/model${RST}     ${D}查看或切换模型${RST}${NL}`)
  p(`    ${B}${BOLD}/settings${RST}  ${D}查看配置信息${RST}${NL}`)
  p(`    ${B}${BOLD}/quit${RST}      ${D}退出终端${RST}${NL}`)
  p(NL)
  p(`${D}  直接输入文字与爱弥斯对话${RST}${NL}`)
  p(`${D}  支持上下箭头键切换历史命令${RST}${NL}`)
  p(`${D}  配置文件: ~/.xiaoai/settings.json${RST}${NL}`)
  p(NL)
}

// ─── 历史 ────────────────────────────────────────────
function history(msgs: ChatMessage[]) {
  if (!msgs.length) { p(`${D}  暂无对话历史${RST}${NL}${NL}`); return }
  p(NL)
  p(`${G}  ${STAR}${RST} ${G}${BOLD}对话历史${RST} ${D}(${msgs.length}条)${RST}${NL}${NL}`)
  for (const m of msgs) {
    const icon = m.role === 'user' ? `${B}${BOLD}❯${RST}` : `${G}${BOLD}✦${RST}`
    const role = m.role === 'user' ? `${B}你${RST}` : `${G}爱弥斯${RST}`
    const pre = m.content.length > 45 ? m.content.slice(0, 45) + '...' : m.content
    p(`    ${icon} ${BOLD}${role}${RST} ${D}${pre}${RST}${NL}`)
  }
  p(NL)
}

// ─── 流式输出 ────────────────────────────────────────
async function stream(client: DeepSeekClient, msg: string, hist: ChatMessage[]): Promise<string> {
  let full = ''
  p(`${G}  ${STAR}${RST} ${G}${BOLD}✦ ${RST}`)
  for await (const chunk of client.sendMessageStream(msg, AEMEATH_SYSTEM_PROMPT, hist)) {
    full += chunk
    process.stdout.write(chunk)
  }
  p(`${RST}${NL}${NL}`)
  return full
}

// ─── 主程序 ──────────────────────────────────────────
const chatHistory: ChatMessage[] = []

async function main() {
  let client: DeepSeekClient
  try { client = createClientFromEnv() } catch {
    banner()
    p(`${R}  ✗ DEEPSEEK_API_KEY 未设置${RST}${NL}`)
    p(`${D}  配置: 在 ~/.xiaoai/settings.json 中设置 api_key_env${RST}${NL}`)
    p(`${D}  或设置环境变量 DEEPSEEK_API_KEY${RST}${NL}`)
    p(`${D}  获取: ${CY}https://platform.deepseek.com/${RST}${NL}${NL}`)
    process.exit(1)
  }

  // 应用 settings 中的模型配置
  if (settings.model) client.setModel(settings.model)

  banner()
  status(client.getModel(), chatHistory.length)
  const themeName = settings.theme?.name || '拉海洛星炬学院'
  const userName = settings.personality?.['user称呼'] || '漂泊者'
  p(`${GR}  ✓ 星炬终端已就绪${RST}${NL}`)
  p(`${D}  ${themeName} · 共鸣能力: 长航的星辉${RST}${NL}`)
  p(`${D}  你好，${userName}！爱弥斯已连接${RST}${NL}${NL}`)

  // 历史命令
  const cmdHist: string[] = []
  let cmdIdx = -1

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })

  // 上下箭头
  process.stdin.on('data', (key) => {
    const s = key.toString()
    if (s === '\x1b[A' && cmdHist.length > 0 && cmdIdx < cmdHist.length - 1) {
      cmdIdx++
      const val = cmdHist[cmdHist.length - 1 - cmdIdx]
      process.stdout.write('\r\x1b[K')
      p(`${G}  ${STAR}${RST} ${G}❯${RST} ${val}`)
    }
    if (s === '\x1b[B') {
      if (cmdIdx > 0) {
        cmdIdx--
        const val = cmdHist[cmdHist.length - 1 - cmdIdx]
        process.stdout.write('\r\x1b[K')
        p(`${G}  ${STAR}${RST} ${G}❯${RST} ${val}`)
      } else if (cmdIdx === 0) {
        cmdIdx = -1
        process.stdout.write('\r\x1b[K')
        p(`${G}  ${STAR}${RST} ${G}❯${RST} `)
      }
    }
  })

  const ask = (): Promise<string> => new Promise(r => rl.question(`${G}  ${STAR}${RST} ${G}❯${RST} `, r))

  while (true) {
    const input = await ask()
    const trimmed = input.trim()
    if (trimmed) { cmdHist.push(trimmed); cmdIdx = -1 }
    if (!trimmed) continue

    // 命令
    if (trimmed.startsWith('/')) {
      const parts = trimmed.slice(1).split(/\s+/)
      const cmd = parts[0]!.toLowerCase()
      const args = parts.slice(1).join(' ')

      if (cmd === 'help' || cmd === 'h' || cmd === '?') { help(); continue }
      if (cmd === 'clear' || cmd === 'c') { chatHistory.length = 0; p(`${GR}  ✓ 对话已清空${RST}${NL}${NL}`); continue }
      if (cmd === 'history' || cmd === 'hist') { history(chatHistory); continue }
      if (cmd === 'model') {
        if (args) { client.setModel(args); p(`${GR}  ✓ 模型已切换为: ${args}${RST}${NL}${NL}`) }
        else { p(`${D}  当前模型: ${BOLD}${client.getModel()}${RST}${NL}${NL}`) }
        continue
      }
      if (cmd === 'settings' || cmd === 'config') {
        p(NL)
        p(`${G}  ${STAR}${RST} ${G}${BOLD}配置信息${RST}${NL}${NL}`)
        p(`    ${B}配置文件${RST}  ${D}${SETTINGS_FILE}${RST}${NL}`)
        p(`    ${B}当前模型${RST}  ${D}${client.getModel()}${RST}${NL}`)
        p(`    ${B}主题${RST}      ${D}${settings.theme?.name || '拉海洛星炬学院'}${RST}${NL}`)
        p(`    ${B}称呼${RST}      ${D}${settings.personality?.['user称呼'] || '漂泊者'}${RST}${NL}`)
        p(NL)
        continue
      }
      if (cmd === 'quit' || cmd === 'q' || cmd === 'exit') {
        p(NL); p(`${G}  ${STAR} ${ITA}星辉会指引我们再会。${RST}${NL}${NL}`); break
      }
      p(`${R}  ✗ 未知命令: /${cmd}${RST}${NL}${D}  输入 /help 查看可用命令${RST}${NL}${NL}`)
      continue
    }

    // 对话
    chatHistory.push({ role: 'user', content: trimmed })
    try {
      const reply = await stream(client, trimmed, chatHistory)
      chatHistory.push({ role: 'assistant', content: reply })
    } catch {
      p(`${R}  ✗ 爱弥斯遇到了一些问题${RST}${NL}${NL}`)
      chatHistory.pop()
    }
    p(NL)
  }

  rl.close()
}

main().catch(console.error)
