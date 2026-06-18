/**
 * 流式输出处理
 * 实现打字机效果的流式输出
 */

export interface StreamOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

export class StreamHandler {
  private options: StreamOptions;

  constructor(options: StreamOptions = {}) {
    this.options = options;
  }

  /**
   * 处理流式响应
   */
  async processStream(
    stream: AsyncGenerator<string>
  ): Promise<string> {
    let fullText = '';
    
    try {
      for await (const chunk of stream) {
        fullText += chunk;
        this.options.onChunk?.(chunk);
      }
      
      this.options.onComplete?.(fullText);
      return fullText;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.options.onError?.(err);
      throw err;
    }
  }
}

/**
 * 模拟流式输出（用于测试）
 */
export async function* mockStream(
  text: string,
  delay: number = 50
): AsyncGenerator<string> {
  for (const char of text) {
    await new Promise(resolve => setTimeout(resolve, delay));
    yield char;
  }
}

/**
 * 流式输出到控制台
 */
export async function streamToConsole(
  stream: AsyncGenerator<string>
): Promise<string> {
  let fullText = '';
  
  for await (const chunk of stream) {
    process.stdout.write(chunk);
    fullText += chunk;
  }
  
  console.log(); // 换行
  return fullText;
}
