/**
 * CLI 组件测试
 */

import { describe, it, expect } from 'bun:test';
import { Message } from '../../src/cli/components/MessageList';

describe('Message', () => {
  it('应该创建消息对象', () => {
    const message: Message = {
      id: '1',
      role: 'user',
      content: '你好',
      timestamp: new Date(),
    };
    
    expect(message.id).toBe('1');
    expect(message.role).toBe('user');
    expect(message.content).toBe('你好');
    expect(message.timestamp).toBeInstanceOf(Date);
  });

  it('应该支持助手消息', () => {
    const message: Message = {
      id: '2',
      role: 'assistant',
      content: '你好！我是爱弥斯',
      timestamp: new Date(),
    };
    
    expect(message.role).toBe('assistant');
  });
});

describe('应用配置', () => {
  it('应该读取环境变量', () => {
    // 模拟环境变量
    process.env.DEEPSEEK_API_KEY = 'test-key';
    
    expect(process.env.DEEPSEEK_API_KEY).toBe('test-key');
    
    // 清理
    delete process.env.DEEPSEEK_API_KEY;
  });
});
