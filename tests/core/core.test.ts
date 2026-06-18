/**
 * 核心模块测试
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { ConversationManager, Message } from '../../src/core/conversation';
import { ContextManager } from '../../src/core/context';
import { AemeathEngine } from '../../src/core/engine';

// 模拟 DeepSeek 客户端
const createMockClient = () => ({
  chat: async (messages: any[]) => ({
    id: 'test-id',
    content: '测试响应',
    role: 'assistant',
    finishReason: 'stop',
    usage: {
      promptTokens: 10,
      completionTokens: 5,
      totalTokens: 15,
    },
  }),
  chatStream: async function* () {
    yield '测试';
    yield '响应';
  },
  getModel: () => 'test-model',
  setModel: () => {},
});

describe('ConversationManager', () => {
  let manager: ConversationManager;

  beforeEach(() => {
    manager = new ConversationManager(createMockClient() as any);
  });

  describe('消息管理', () => {
    it('应该添加用户消息', () => {
      const msg = manager.addMessage('user', '你好');
      expect(msg.content).toBe('你好');
      expect(msg.role).toBe('user');
      expect(msg.id).toBeDefined();
      expect(msg.timestamp).toBeInstanceOf(Date);
    });

    it('应该添加助手消息', () => {
      const msg = manager.addMessage('assistant', '你好！我是爱弥斯');
      expect(msg.content).toBe('你好！我是爱弥斯');
      expect(msg.role).toBe('assistant');
    });

    it('应该获取对话历史', () => {
      manager.addMessage('user', '消息1');
      manager.addMessage('assistant', '回复1');
      manager.addMessage('user', '消息2');
      
      const history = manager.getHistory();
      expect(history.length).toBe(3);
    });

    it('应该清空历史记录', () => {
      manager.addMessage('user', '你好');
      manager.clearHistory();
      
      const history = manager.getHistory();
      expect(history.length).toBe(0);
    });

    it('应该限制历史长度', () => {
      const limitedManager = new ConversationManager(createMockClient() as any, {
        maxHistory: 5,
      });
      
      for (let i = 0; i < 10; i++) {
        limitedManager.addMessage('user', `消息 ${i}`);
      }
      
      const history = limitedManager.getHistory();
      expect(history.length).toBe(5);
    });

    it('应该获取最近的消息', () => {
      manager.addMessage('user', '消息1');
      manager.addMessage('assistant', '回复1');
      manager.addMessage('user', '消息2');
      
      const recent = manager.getRecentMessages(2);
      expect(recent.length).toBe(2);
      expect(recent[0].content).toBe('回复1');
    });

    it('应该编辑消息', () => {
      const msg = manager.addMessage('user', '原始消息');
      const result = manager.editMessage(msg.id, '编辑后的消息');
      
      expect(result).toBe(true);
      expect(manager.getHistory()[0].content).toBe('编辑后的消息');
    });

    it('应该删除消息', () => {
      const msg = manager.addMessage('user', '要删除的消息');
      const result = manager.deleteMessage(msg.id);
      
      expect(result).toBe(true);
      expect(manager.getHistory().length).toBe(0);
    });

    it('应该获取消息数量', () => {
      manager.addMessage('user', '消息1');
      manager.addMessage('assistant', '回复1');
      
      expect(manager.getMessageCount()).toBe(2);
    });

    it('应该获取摘要', () => {
      manager.addMessage('user', '消息1');
      manager.addMessage('assistant', '回复1');
      
      const summary = manager.getSummary();
      expect(summary).toContain('1');
    });
  });

  describe('格式化历史', () => {
    it('应该格式化历史用于 API', () => {
      manager.addMessage('user', '你好');
      manager.addMessage('assistant', '你好！');
      
      const formatted = manager.getFormattedHistory();
      expect(formatted.length).toBe(2);
      expect(formatted[0].role).toBe('user');
      expect(formatted[1].role).toBe('assistant');
    });
  });

  describe('发送消息', () => {
    it('应该发送消息并获取响应', async () => {
      const response = await manager.sendMessage('你好');
      
      expect(response).toBeDefined();
      expect(response.role).toBe('assistant');
      expect(manager.getHistory().length).toBe(2); // 用户消息 + 助手回复
    });
  });
});

describe('ContextManager', () => {
  let context: ContextManager;

  beforeEach(() => {
    context = new ContextManager('test-user');
  });

  describe('用户上下文', () => {
    it('应该获取用户上下文', () => {
      const userContext = context.getUserContext();
      expect(userContext.userId).toBe('test-user');
      expect(userContext.sessionStart).toBeInstanceOf(Date);
    });

    it('应该更新用户上下文', () => {
      context.updateUserContext({ name: '小明' });
      const userContext = context.getUserContext();
      expect(userContext.name).toBe('小明');
    });
  });

  describe('会话变量', () => {
    it('应该设置和获取会话变量', () => {
      context.setSession('theme', 'dark');
      expect(context.getSession('theme')).toBe('dark');
    });

    it('应该检查会话变量是否存在', () => {
      context.setSession('key', 'value');
      expect(context.hasSession('key')).toBe(true);
      expect(context.hasSession('nonexistent')).toBe(false);
    });

    it('应该删除会话变量', () => {
      context.setSession('key', 'value');
      const result = context.deleteSession('key');
      expect(result).toBe(true);
      expect(context.hasSession('key')).toBe(false);
    });

    it('应该清除所有会话', () => {
      context.setSession('key1', 'value1');
      context.setSession('key2', 'value2');
      context.clearSession();
      expect(context.hasSession('key1')).toBe(false);
      expect(context.hasSession('key2')).toBe(false);
    });

    it('应该获取所有会话变量', () => {
      context.setSession('key1', 'value1');
      context.setSession('key2', 'value2');
      
      const all = context.getAllSession();
      expect(all.key1).toBe('value1');
      expect(all.key2).toBe('value2');
    });
  });

  describe('用户偏好', () => {
    it('应该设置和获取用户偏好', () => {
      context.setPreference('language', 'zh-CN');
      expect(context.getPreference('language')).toBe('zh-CN');
    });

    it('应该获取所有偏好', () => {
      context.setPreference('lang', 'zh');
      context.setPreference('theme', 'dark');
      
      const all = context.getAllPreferences();
      expect(all.lang).toBe('zh');
      expect(all.theme).toBe('dark');
    });
  });

  describe('摘要', () => {
    it('应该获取摘要', () => {
      const summary = context.getSummary();
      expect(summary).toContain('test-user');
    });
  });
});

describe('AemeathEngine', () => {
  let engine: AemeathEngine;

  beforeEach(() => {
    engine = new AemeathEngine({
      apiKey: 'test-key',
      baseUrl: 'https://api.deepseek.com',
      model: 'test-model',
    });
  });

  describe('处理输入', () => {
    it('应该处理普通消息', async () => {
      const result = await engine.processInput('你好');
      expect(result.type).toBe('message');
      expect(result.content).toBeDefined();
    });

    it('应该处理帮助命令', async () => {
      const result = await engine.processInput('/help');
      expect(result.type).toBe('command');
      expect(result.content).toContain('帮助');
    });

    it('应该处理清空命令', async () => {
      await engine.processInput('你好');
      const result = await engine.processInput('/clear');
      expect(result.type).toBe('command');
      expect(result.content).toContain('清空');
      expect(engine.getHistory().length).toBe(0);
    });

    it('应该处理状态命令', async () => {
      const result = await engine.processInput('/status');
      expect(result.type).toBe('command');
      expect(result.content).toContain('状态');
    });

    it('应该处理未知命令', async () => {
      const result = await engine.processInput('/unknown');
      expect(result.type).toBe('command');
      expect(result.content).toContain('未知命令');
    });
  });

  describe('流式处理', () => {
    it('应该流式处理消息', async () => {
      const stream = engine.processInputStream('你好');
      let fullText = '';
      
      for await (const chunk of stream) {
        fullText += chunk;
      }
      
      expect(fullText).toBeTruthy();
    });

    it('应该流式处理命令', async () => {
      const stream = engine.processInputStream('/help');
      let fullText = '';
      
      for await (const chunk of stream) {
        fullText += chunk;
      }
      
      expect(fullText).toContain('帮助');
    });
  });

  describe('历史管理', () => {
    it('应该获取历史', () => {
      const conversation = engine.getConversation();
      conversation.addMessage('user', '你好');
      conversation.addMessage('assistant', '你好！');
      const history = engine.getHistory();
      expect(history.length).toBe(2);
    });

    it('应该清空历史', () => {
      const conversation = engine.getConversation();
      conversation.addMessage('user', '你好');
      engine.clearHistory();
      expect(engine.getHistory().length).toBe(0);
    });
  });

  describe('上下文管理', () => {
    it('应该获取上下文管理器', () => {
      const context = engine.getContext();
      expect(context).toBeInstanceOf(ContextManager);
    });

    it('应该获取对话管理器', () => {
      const conversation = engine.getConversation();
      expect(conversation).toBeInstanceOf(ConversationManager);
    });
  });
});
