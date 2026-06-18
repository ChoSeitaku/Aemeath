#!/usr/bin/env bun

/**
 * Aemeath 入口文件
 * 启动 CLI 应用
 */

import React from 'react';
import { render } from 'ink';
import { App } from './cli/App';

// 检查环境变量
if (!process.env.DEEPSEEK_API_KEY) {
  console.error('');
  console.error('╔═══════════════════════════════════════════════════╗');
  console.error('║          A E M E A T H   v1.0.1                  ║');
  console.error('╚═══════════════════════════════════════════════════╝');
  console.error('');
  console.error('❌ 错误: 请设置 DEEPSEEK_API_KEY 环境变量');
  console.error('');
  console.error('配置步骤:');
  console.error('  1. 复制 .env.example 为 .env');
  console.error('  2. 编辑 .env 文件，添加你的 API Key');
  console.error('  3. 获取 API Key: https://platform.deepseek.com/');
  console.error('');
  console.error('示例:');
  console.error('  DEEPSEEK_API_KEY=sk-your-api-key-here');
  console.error('');
  process.exit(1);
}

// 检查终端是否支持 raw mode
function isRawModeSupported(): boolean {
  try {
    return typeof process.stdin.setRawMode === 'function';
  } catch {
    return false;
  }
}

// 渲染应用
console.clear();

if (isRawModeSupported()) {
  // 完整 Ink 模式
  render(React.createElement(App));
} else {
  // 降级到简化模式
  console.log('');
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║          A E M E A T H   v1.0.1                  ║');
  console.log('║          爱弥斯 · 你的个人AI助手                  ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log('');
  console.log('⚠️  当前终端不支持完整 CLI 模式');
  console.log('   请使用 bun run start 启动简化版本');
  console.log('');
  console.log('   或者使用支持 raw mode 的终端：');
  console.log('   - Windows Terminal');
  console.log('   - PowerShell 7+');
  console.log('   - Git Bash');
  console.log('');
  
  // 动态导入简化版本
  import('./start.ts').catch(() => {
    console.log('运行命令: bun run start');
  });
}
