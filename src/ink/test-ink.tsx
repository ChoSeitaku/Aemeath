#!/usr/bin/env bun
// Simple test for Ink Bun compatibility layer
import React from 'react'
import { render, Box, Text } from './index.js'

const App: React.FC = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ╔═══════════════════════════════════════════════════╗
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ║          A E M E A T H   v2.0.0                  ║
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ║          爱弥斯 · 你的个人AI助手                  ║
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ╚═══════════════════════════════════════════════════╝
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="gray">
          ✅ Ink Bun 兼容层测试成功！
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="gray">
          模型: deepseek-v4-flash · 运行时: Bun
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="gray">
          按 Ctrl+C 退出
        </Text>
      </Box>
    </Box>
  )
}

// Run test
async function main() {
  const instance = await render(<App />)

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    instance.unmount()
    process.exit(0)
  })
}

main()
