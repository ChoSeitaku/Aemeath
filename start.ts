#!/usr/bin/env bun

/**
 * Aemeath 简化启动脚本
 * 用于测试 API 连接
 */

import { createClientFromEnv } from './src/ai/client';
import { AEMEATH_SYSTEM_PROMPT } from './src/ai/prompts';

console.log('');
console.log('╔═══════════════════════════════════════════════════╗');
console.log('║          A E M E A T H   v1.0.0                  ║');
console.log('║          爱弥斯 · 你的个人AI助手                  ║');
console.log('╚═══════════════════════════════════════════════════╝');
console.log('');

async function main() {
  const client = createClientFromEnv();
  console.log(`✅ API 连接成功`);
  console.log(`模型: ${client.getModel()}`);
  console.log('');
  
  // 测试对话
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  const askQuestion = (question: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  };
  
  console.log('输入消息与爱弥斯对话，输入 /quit 退出');
  console.log('────────────────────────────────────────────────────');
  console.log('');
  
  while (true) {
    const input = await askQuestion('❯ ');
    
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
