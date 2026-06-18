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
  console.error('║          A E M E A T H   v1.0.0                  ║');
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

// 渲染应用
console.clear();
render(React.createElement(App));
