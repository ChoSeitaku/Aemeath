#!/usr/bin/env bun

/**
 * Aemeath 简化启动脚本
 * 支持历史命令切换（上下箭头键）
 */

import { createClientFromEnv } from './src/ai/client';
import { AEMEATH_SYSTEM_PROMPT } from './src/ai/prompts';
import * as readline from 'readline';

console.log('');
console.log('╔═══════════════════════════════════════════════════╗');
console.log('║          A E M E A T H   v1.0.0                  ║');
console.log('║          爱弥斯 · 你的个人AI助手                  ║');
console.log('╚═══════════════════════════════════════════════════╝');
console.log('');

// 历史命令管理
const history: string[] = [];
let historyIndex = -1;

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 监听按键事件
process.stdin.on('data', (key) => {
  const keyStr = key.toString();
  
  // 上箭头键 (ESC [ A)
  if (keyStr === '\x1b[A') {
    if (history.length > 0 && historyIndex < history.length - 1) {
      historyIndex++;
      const cmd = history[history.length - 1 - historyIndex];
      // 清除当前行并显示历史命令
      process.stdout.write('\r\x1b[K');
      process.stdout.write(`❯ ${cmd}`);
    }
  }
  
  // 下箭头键 (ESC [ B)
  if (keyStr === '\x1b[B') {
    if (historyIndex > 0) {
      historyIndex--;
      const cmd = history[history.length - 1 - historyIndex];
      process.stdout.write('\r\x1b[K');
      process.stdout.write(`❯ ${cmd}`);
    } else if (historyIndex === 0) {
      historyIndex = -1;
      process.stdout.write('\r\x1b[K');
      process.stdout.write('❯ ');
    }
  }
});

// 封装问题函数
const askQuestion = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      // 清除输入行
      process.stdout.write('\r\x1b[K');
      resolve(answer);
    });
  });
};

async function main() {
  const client = createClientFromEnv();
  console.log(`✅ API 连接成功`);
  console.log(`模型: ${client.getModel()}`);
  console.log('');
  
  console.log('输入消息与爱弥斯对话，输入 /quit 退出');
  console.log('支持上下箭头键切换历史命令');
  console.log('────────────────────────────────────────────────────');
  console.log('');
  
  while (true) {
    const input = await askQuestion('❯ ');
    
    // 添加到历史记录
    if (input.trim()) {
      history.push(input);
      historyIndex = -1;
    }
    
    if (input === '/quit' || input === '/q' || input === '/exit') {
      console.log('');
      console.log('👋 再见！期待下次与你交流。');
      break;
    }
    
    if (!input.trim()) continue;
    
    try {
      const response = await client.sendMessage(input, AEMEATH_SYSTEM_PROMPT);
      console.log('');
      console.log(`💬 ${response.content}`);
      console.log('');
    } catch (error) {
      console.log('');
      console.log('❌ 抱歉，爱弥斯遇到了一些问题，请稍后再试。');
      console.log('');
    }
  }
  
  rl.close();
}

main().catch(console.error);
