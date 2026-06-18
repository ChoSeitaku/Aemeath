/**
 * 对话管理器
 * 管理对话流程，协调 API 调用和响应处理
 */

import { DeepSeekClient, ChatMessage } from '../ai/client';
import { AEMEATH_SYSTEM_PROMPT, buildMessages } from '../ai/prompts';

/**
 * 消息接口
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

/**
 * 对话管理器配置
 */
export interface ConversationConfig {
  maxHistory?: number;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * 对话管理器
 */
export class ConversationManager {
  private client: DeepSeekClient;
  private messages: Message[] = [];
  private config: ConversationConfig;

  constructor(client: DeepSeekClient, config: ConversationConfig = {}) {
    this.client = client;
    this.config = {
      maxHistory: config.maxHistory || 20,
      systemPrompt: config.systemPrompt || AEMEATH_SYSTEM_PROMPT,
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 4096,
    };
  }

  /**
   * 添加消息
   */
  addMessage(role: 'user' | 'assistant' | 'system', content: string): Message {
    const message: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    
    this.messages.push(message);
    
    // 限制历史长度（不包括系统消息）
    const nonSystemMessages = this.messages.filter(m => m.role !== 'system');
    if (nonSystemMessages.length > this.config.maxHistory!) {
      // 保留系统消息和最近的历史
      const systemMessages = this.messages.filter(m => m.role === 'system');
      const recentMessages = nonSystemMessages.slice(-this.config.maxHistory!);
      this.messages = [...systemMessages, ...recentMessages];
    }
    
    return message;
  }

  /**
   * 获取对话历史
   */
  getHistory(): Message[] {
    return [...this.messages];
  }

  /**
   * 获取格式化的历史（用于 API 调用）
   */
  getFormattedHistory(): ChatMessage[] {
    return this.messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role,
        content: m.content,
      }));
  }

  /**
   * 清空对话
   */
  clearHistory(): void {
    this.messages = [];
  }

  /**
   * 获取最近的消息
   */
  getRecentMessages(count: number): Message[] {
    return this.messages.slice(-count);
  }

  /**
   * 发送消息并获取响应
   */
  async sendMessage(userMessage: string): Promise<Message> {
    // 添加用户消息
    this.addMessage('user', userMessage);
    
    // 构建 API 消息
    const apiMessages = buildMessages(
      userMessage,
      this.getFormattedHistory(),
      this.config.systemPrompt
    );
    
    try {
      // 调用 API
      const response = await this.client.chat(apiMessages);
      const assistantContent = response.content || '';
      
      // 添加助手消息
      const assistantMessage = this.addMessage('assistant', assistantContent);
      
      return assistantMessage;
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  }

  /**
   * 流式发送消息
   */
  async *sendMessageStream(userMessage: string): AsyncGenerator<string, void, unknown> {
    // 添加用户消息
    this.addMessage('user', userMessage);
    
    // 构建 API 消息
    const apiMessages = buildMessages(
      userMessage,
      this.getFormattedHistory(),
      this.config.systemPrompt
    );
    
    let fullResponse = '';
    
    try {
      // 流式调用 API
      for await (const chunk of this.client.chatStream(apiMessages)) {
        fullResponse += chunk;
        yield chunk;
      }
      
      // 添加完整的助手消息
      this.addMessage('assistant', fullResponse);
    } catch (error) {
      console.error('流式发送消息失败:', error);
      throw error;
    }
  }

  /**
   * 重新生成最后一条助手消息
   */
  async regenerateLastMessage(): Promise<Message> {
    // 找到最后一条用户消息
    const lastUserMessageIndex = this.messages.findLastIndex(m => m.role === 'user');
    
    if (lastUserMessageIndex === -1) {
      throw new Error('没有找到用户消息');
    }
    
    // 移除最后的助手消息（如果有）
    if (this.messages[lastUserMessageIndex + 1]?.role === 'assistant') {
      this.messages.splice(lastUserMessageIndex + 1, 1);
    }
    
    // 获取用户消息
    const userMessage = this.messages[lastUserMessageIndex].content;
    
    // 重新发送
    return this.sendMessage(userMessage);
  }

  /**
   * 编辑消息
   */
  editMessage(messageId: string, newContent: string): boolean {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.content = newContent;
      return true;
    }
    return false;
  }

  /**
   * 删除消息
   */
  deleteMessage(messageId: string): boolean {
    const index = this.messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      this.messages.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 获取消息数量
   */
  getMessageCount(): number {
    return this.messages.length;
  }

  /**
   * 获取对话摘要
   */
  getSummary(): string {
    const userMessages = this.messages.filter(m => m.role === 'user').length;
    const assistantMessages = this.messages.filter(m => m.role === 'assistant').length;
    return `对话包含 ${userMessages} 条用户消息和 ${assistantMessages} 条助手回复`;
  }
}
