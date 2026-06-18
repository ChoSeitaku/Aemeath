/**
 * DeepSeek API 客户端测试
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { DeepSeekClient, createDeepSeekClient } from '../../src/ai/client';
import { AEMEATH_SYSTEM_PROMPT, buildMessages } from '../../src/ai/prompts';
import { StreamHandler, mockStream } from '../../src/ai/stream';

describe('DeepSeekClient', () => {
  // 检查是否有 API Key
  const hasApiKey = !!process.env.DEEPSEEK_API_KEY;

  describe('构造函数', () => {
    it('应该创建客户端实例', () => {
      const client = new DeepSeekClient({
        apiKey: 'test-key',
      });
      expect(client).toBeDefined();
    });

    it('应该使用默认配置', () => {
      const client = new DeepSeekClient({
        apiKey: 'test-key',
      });
      expect(client.getModel()).toBe('deepseek-v4-flash');
    });

    it('应该使用自定义配置', () => {
      const client = new DeepSeekClient({
        apiKey: 'test-key',
        model: 'custom-model',
      });
      expect(client.getModel()).toBe('custom-model');
    });
  });

  describe('模型管理', () => {
    it('应该获取当前模型', () => {
      const client = new DeepSeekClient({
        apiKey: 'test-key',
        model: 'test-model',
      });
      expect(client.getModel()).toBe('test-model');
    });

    it('应该设置新模型', () => {
      const client = new DeepSeekClient({
        apiKey: 'test-key',
      });
      client.setModel('new-model');
      expect(client.getModel()).toBe('new-model');
    });
  });

  describe('聊天功能', () => {
    // 跳过没有 API Key 的测试
    it.skipIf(!hasApiKey)('应该发送消息并获取响应', async () => {
      const client = createDeepSeekClient({
        apiKey: process.env.DEEPSEEK_API_KEY!,
      });

      const response = await client.chat([
        { role: 'user', content: '你好' },
      ]);

      expect(response).toBeDefined();
      expect(response.content).toBeTruthy();
      expect(response.role).toBe('assistant');
    });

    it.skipIf(!hasApiKey)('应该支持系统提示词', async () => {
      const client = createDeepSeekClient({
        apiKey: process.env.DEEPSEEK_API_KEY!,
      });

      const response = await client.sendMessage(
        '你好',
        AEMEATH_SYSTEM_PROMPT
      );

      expect(response.content).toBeTruthy();
    });

    it.skipIf(!hasApiKey)('应该支持对话历史', async () => {
      const client = createDeepSeekClient({
        apiKey: process.env.DEEPSEEK_API_KEY!,
      });

      const history = [
        { role: 'user' as const, content: '我叫小明' },
        { role: 'assistant' as const, content: '你好小明！' },
      ];

      const response = await client.sendMessage(
        '我叫什么名字？',
        undefined,
        history
      );

      expect(response.content).toContain('小明');
    });
  });

  describe('流式聊天', () => {
    it.skipIf(!hasApiKey)('应该支持流式输出', async () => {
      const client = createDeepSeekClient({
        apiKey: process.env.DEEPSEEK_API_KEY!,
      });

      const stream = client.chatStream([
        { role: 'user', content: '说你好' },
      ]);

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
      }

      expect(fullText).toBeTruthy();
    });
  });
});

describe('buildMessages', () => {
  it('应该构建消息数组', () => {
    const messages = buildMessages('你好');
    expect(messages).toHaveLength(1);
    expect(messages[0].role).toBe('user');
    expect(messages[0].content).toBe('你好');
  });

  it('应该包含系统提示词', () => {
    const messages = buildMessages('你好', [], '系统提示');
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe('system');
    expect(messages[0].content).toBe('系统提示');
  });

  it('应该包含历史消息', () => {
    const history = [
      { role: 'user' as const, content: '之前的问题' },
      { role: 'assistant' as const, content: '之前的回答' },
    ];
    const messages = buildMessages('新问题', history);
    expect(messages).toHaveLength(3);
  });
});

describe('StreamHandler', () => {
  it('应该处理流式响应', async () => {
    const handler = new StreamHandler();
    const stream = mockStream('你好世界', 10);
    const result = await handler.processStream(stream);
    expect(result).toBe('你好世界');
  });

  it('应该调用 onChunk 回调', async () => {
    const chunks: string[] = [];
    const handler = new StreamHandler({
      onChunk: (chunk) => chunks.push(chunk),
    });
    const stream = mockStream('测试', 10);
    await handler.processStream(stream);
    expect(chunks).toHaveLength(2);
  });

  it('应该调用 onComplete 回调', async () => {
    let completedText = '';
    const handler = new StreamHandler({
      onComplete: (text) => { completedText = text; },
    });
    const stream = mockStream('完成', 10);
    await handler.processStream(stream);
    expect(completedText).toBe('完成');
  });
});
