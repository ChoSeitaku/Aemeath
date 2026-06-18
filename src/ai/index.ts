/**
 * AI 模块导出
 */

export { DeepSeekClient, createDeepSeekClient, createClientFromEnv } from './client';
export type { DeepSeekConfig, ChatMessage, ChatResponse } from './client';

export { 
  AEMEATH_SYSTEM_PROMPT, 
  ASSISTANT_SYSTEM_PROMPT,
  buildMessages,
  getCharacterPrompt
} from './prompts';

export { StreamHandler, mockStream, streamToConsole } from './stream';
export type { StreamOptions } from './stream';
