/**
 * 核心引擎
 * 协调各模块，提供统一的接口
 */

import { DeepSeekClient, createClientFromEnv, ChatMessage } from '../ai/client';
import { AEMEATH_SYSTEM_PROMPT } from '../ai/prompts';
import { ConversationManager, Message, ConversationConfig } from './conversation';
import { ContextManager } from './context';

/**
 * 引擎配置
 */
export interface EngineConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxHistory?: number;
  systemPrompt?: string;
  userId?: string;
}

/**
 * 处理结果
 */
export interface ProcessResult {
  type: 'message' | 'command';
  content: string;
  message?: Message;
}

/**
 * 核心引擎
 */
export class AemeathEngine {
  private client: DeepSeekClient;
  private conversation: ConversationManager;
  private context: ContextManager;

  constructor(config: EngineConfig = {}) {
    // 初始化 API 客户端
    if (config.apiKey) {
      this.client = new DeepSeekClient({
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
        model: config.model,
      });
    } else {
      this.client = createClientFromEnv();
    }

    // 初始化对话管理器
    const conversationConfig: ConversationConfig = {
      maxHistory: config.maxHistory,
      systemPrompt: config.systemPrompt || AEMEATH_SYSTEM_PROMPT,
    };
    this.conversation = new ConversationManager(this.client, conversationConfig);

    // 初始化上下文管理器
    this.context = new ContextManager(config.userId);
  }

  /**
   * 处理用户输入
   */
  async processInput(input: string): Promise<ProcessResult> {
    // 检查是否是命令
    if (input.startsWith('/')) {
      return this.handleCommand(input);
    }

    // 普通消息
    try {
      const message = await this.conversation.sendMessage(input);
      return {
        type: 'message',
        content: message.content,
        message,
      };
    } catch (error) {
      return {
        type: 'message',
        content: '❌ 抱歉，爱弥斯遇到了一些问题，请稍后再试。',
      };
    }
  }

  /**
   * 流式处理用户输入
   */
  async *processInputStream(input: string): AsyncGenerator<string, void, unknown> {
    // 检查是否是命令
    if (input.startsWith('/')) {
      const result = this.handleCommand(input);
      yield result.content;
      return;
    }

    // 流式处理消息
    try {
      yield* this.conversation.sendMessageStream(input);
    } catch (error) {
      yield '❌ 抱歉，爱弥斯遇到了一些问题，请稍后再试。';
    }
  }

  /**
   * 处理命令
   */
  private handleCommand(input: string): ProcessResult {
    const parts = input.slice(1).split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
      case 'h':
      case '?':
        return {
          type: 'command',
          content: this.getHelpText(),
        };

      case 'clear':
      case 'c':
        this.conversation.clearHistory();
        return {
          type: 'command',
          content: '✅ 对话已清空',
        };

      case 'quit':
      case 'q':
      case 'exit':
        return {
          type: 'command',
          content: '👋 再见！期待下次与你交流。',
        };

      case 'history':
      case 'hist':
        return {
          type: 'command',
          content: this.getHistoryText(parseInt(args[0]) || 10),
        };

      case 'status':
      case 'st':
        return {
          type: 'command',
          content: this.getStatusText(),
        };

      case 'clear-all':
        this.conversation.clearHistory();
        this.context.clearSession();
        return {
          type: 'command',
          content: '✅ 所有数据已清空',
        };

      default:
        return {
          type: 'command',
          content: `❌ 未知命令: /${command}\n输入 /help 查看可用命令`,
        };
    }
  }

  /**
   * 获取帮助文本
   */
  private getHelpText(): string {
    return `
可用命令：

  /help, /h, /?    - 显示帮助信息
  /clear, /c       - 清空当前对话
  /quit, /q, /exit - 退出程序
  /history, /hist  - 查看对话历史
  /status, /st     - 查看状态
  /clear-all       - 清空所有数据

直接输入消息即可与爱弥斯对话 ✨
`;
  }

  /**
   * 获取历史文本
   */
  private getHistoryText(limit: number): string {
    const history = this.conversation.getRecentMessages(limit);
    
    if (history.length === 0) {
      return '📝 暂无对话历史';
    }

    let text = `\n最近 ${history.length} 条对话：\n\n`;
    
    for (const msg of history) {
      const role = msg.role === 'user' ? '👤 你' : '💬 爱弥斯';
      const time = msg.timestamp.toLocaleTimeString();
      text += `[${time}] ${role}: ${msg.content}\n\n`;
    }
    
    return text;
  }

  /**
   * 获取状态文本
   */
  private getStatusText(): string {
    const messageCount = this.conversation.getMessageCount();
    const summary = this.conversation.getSummary();
    const contextSummary = this.context.getSummary();
    
    return `
📊 状态信息

${summary}
${contextSummary}
模型: ${this.client.getModel()}
`;
  }

  /**
   * 获取对话历史
   */
  getHistory(): Message[] {
    return this.conversation.getHistory();
  }

  /**
   * 清空对话
   */
  clearHistory(): void {
    this.conversation.clearHistory();
  }

  /**
   * 获取上下文管理器
   */
  getContext(): ContextManager {
    return this.context;
  }

  /**
   * 获取对话管理器
   */
  getConversation(): ConversationManager {
    return this.conversation;
  }
}
