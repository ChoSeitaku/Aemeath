#!/usr/bin/env bun
// Test Ink Bun compatibility layer

import React from 'react'
import { render, Box, Text } from './render.js'

// Simple test component
const TestApp: React.FC = () => {
  return React.createElement(
    Box,
    { flexDirection: 'column', padding: 1 },
    React.createElement(
      Box,
      { marginBottom: 1 },
      React.createElement(
        Text,
        { bold: true, color: 'magenta' },
        '╔═══════════════════════════════════════════════════╗',
      ),
    ),
    React.createElement(
      Box,
      { marginBottom: 1 },
      React.createElement(
        Text,
        { bold: true, color: 'magenta' },
        '║          A E M E A T H   v1.0.0                  ║',
      ),
    ),
    React.createElement(
      Box,
      { marginBottom: 1 },
      React.createElement(
        Text,
        { bold: true, color: 'magenta' },
        '║          爱弥斯 · 你的个人AI助手                  ║',
      ),
    ),
    React.createElement(
      Box,
      { marginBottom: 1 },
      React.createElement(
        Text,
        { bold: true, color: 'magenta' },
        '╚═══════════════════════════════════════════════════╝',
      ),
    ),
    React.createElement(
      Box,
      { marginBottom: 1 },
      React.createElement(
        Text,
        { color: 'gray' },
        '模型: deepseek-v4-flash · 记忆: 0条 · 工具: 0个',
      ),
    ),
    React.createElement(
      Box,
      { marginBottom: 1 },
      React.createElement(
        Text,
        { color: 'gray' },
        '输入 /help 查看命令 · Tab 补全 · /quit 退出',
      ),
    ),
  )
}

// Test the render function
async function main() {
  console.log('Testing Ink Bun compatibility layer...\n')

  const instance = await render(React.createElement(TestApp))

  console.log('\n✅ Ink Bun compatibility layer loaded successfully!')
  console.log('Press Ctrl+C to exit')

  // Auto-exit after 2 seconds for testing
  setTimeout(() => {
    instance.unmount()
    console.log('\nTest completed!')
    process.exit(0)
  }, 2000)
}

main()
