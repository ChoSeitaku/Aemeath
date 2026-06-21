#!/usr/bin/env bun

/**
 * Aemeath CLI - 星炬学院拉海洛风格
 * Ink 渲染 · 自适应终端宽度
 */

import React from 'react'
import { render } from './ink/index.js'
import { App } from './cli/App.js'

if (!process.env.DEEPSEEK_API_KEY) {
  console.error('')
  console.error('  ✗ DEEPSEEK_API_KEY 未设置')
  console.error('  配置: 复制 .env.example 为 .env，添加 API Key')
  console.error('  获取: https://platform.deepseek.com/')
  console.error('')
  process.exit(1)
}

console.clear()
render(React.createElement(App))
