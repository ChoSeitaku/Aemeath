/**
 * DeepSeek API 客户端
 * 封装 DeepSeek API 调用，支持流式和非流式响应
 */

import OpenAI from 'openai';

export interface DeepSeekConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  id: string;
  content: string;
  role: string;
  finishReason: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class DeepSeekClient {
  private client: OpenAI;
  private model: string;

  constructor(config: DeepSeekConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl || 'https://api.deepseek.com',
    });
    this.model = config.model || 'deepseek-v4-flash';
  }

  /**
   * 非流式聊天请求
   */
  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
        max_tokens: 4096,
      });

      const choice = response.choices[0];
      return {
        id: response.id,
        content: choice?.message?.content || '',
        role: choice?.message?.role || 'assistant',
        finishReason: choice?.finish_reason || 'stop',
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      console.error('DeepSeek API 调用失败:', error);
      throw error;
    }
  }

  /**
   * 流式聊天请求
   */
  async *chatStream(messages: ChatMessage[]): AsyncGenerator<string, void, unknown> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
        max_tokens: 4096,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('DeepSeek 流式 API 调用失败:', error);
      throw error;
    }
  }

  /**
   * 发送单条消息并获取响应
   */
  async sendMessage(
    userMessage: string,
    systemPrompt?: string,
    history: ChatMessage[] = []
  ): Promise<ChatResponse> {
    const messages: ChatMessage[] = [];

    // 添加系统提示词
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    // 添加历史消息
    messages.push(...history);

    // 添加用户消息
    messages.push({ role: 'user', content: userMessage });

    return this.chat(messages);
  }

  /**
   * 流式发送单条消息
   */
  async *sendMessageStream(
    userMessage: string,
    systemPrompt?: string,
    history: ChatMessage[] = []
  ): AsyncGenerator<string, void, unknown> {
    const messages: ChatMessage[] = [];

    // 添加系统提示词
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    // 添加历史消息
    messages.push(...history);

    // 添加用户消息
    messages.push({ role: 'user', content: userMessage });

    yield* this.chatStream(messages);
  }

  /**
   * 获取当前模型
   */
  getModel(): string {
    return this.model;
  }

  /**
   * 设置模型
   */
  setModel(model: string): void {
    this.model = model;
  }
}

/**
 * 创建 DeepSeek 客户端实例
 */
export function createDeepSeekClient(config: DeepSeekConfig): DeepSeekClient {
  return new DeepSeekClient(config);
}

/**
 * 从环境变量创建客户端
 */
export function createClientFromEnv(): DeepSeekClient {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY 环境变量未设置');
  }

  return new DeepSeekClient({
    apiKey,
    baseUrl: process.env.DEEPSEEK_BASE_URL,
    model: process.env.DEEPSEEK_MODEL,
  });
}
