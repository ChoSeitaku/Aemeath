# Phase 1 开发手册：核心对话引擎

> 第1-2周 | 实现基础对话功能，能够与 DeepSeek API 交互

---

## 目录

1. [Phase 1 概述](#1-phase-1-概述)
2. [任务分解](#2-任务分解)
3. [项目结构设计](#3-项目结构设计)
4. [详细实现指南](#4-详细实现指南)
5. [代码实现](#5-代码实现)
6. [测试指南](#6-测试指南)
7. [调试与优化](#7-调试与优化)
8. [交付物清单](#8-交付物清单)

---

## 1. Phase 1 概述

### 1.1 目标

实现基础对话功能，能够与 DeepSeek API 交互，具备：
- 与 DeepSeek API 的通信能力
- 流式输出响应
- 爱弥斯角色设定
- 基础斜杠命令
- 对话历史管理

### 1.2 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 运行时 | Bun | JavaScript 运行时 |
| 语言 | TypeScript | 类型安全 |
| CLI框架 | Ink | React 组件化 CLI |
| AI模型 | DeepSeek V4 Flash | 主对话模型 |
| AI客户端 | openai | API 调用 |

### 1.3 时间安排

| 周次 | 任务 | 产出 |
|------|------|------|
| 第1周 | 核心功能开发 | API客户端、对话管理器、系统提示词 |
| 第2周 | 功能完善与测试 | 流式输出、命令系统、测试通过 |

---

## 2. 任务分解

### 2.1 任务清单

| # | 任务 | 优先级 | 预计时间 | 状态 | 依赖 |
|---|------|--------|----------|------|------|
| 1.1 | 创建 DeepSeek API 客户端 | P0 | 3小时 | ⬜ | 无 |
| 1.2 | 实现对话管理器 | P0 | 4小时 | ⬜ | 1.1 |
| 1.3 | 实现上下文管理 | P0 | 3小时 | ⬜ | 1.2 |
| 1.4 | 实现流式输出 | P0 | 2小时 | ⬜ | 1.1 |
| 1.5 | 创建系统提示词（爱弥斯角色） | P0 | 2小时 | ⬜ | 无 |
| 1.6 | 实现对话历史存储 | P1 | 2小时 | ⬜ | 1.2 |
| 1.7 | 实现基础斜杠命令 | P1 | 3小时 | ⬜ | 1.2 |
| 1.8 | 添加命令自动补全 | P2 | 2小时 | ⬜ | 1.7 |
| 1.9 | 测试基础对话功能 | P0 | 2小时 | ⬜ | 所有 |
| 1.10 | 修复 Bug 和优化 | P1 | 2小时 | ⬜ | 1.9 |

### 2.2 任务依赖关系

```
1.1 API客户端 ──┬──► 1.2 对话管理器 ──┬──► 1.3 上下文管理
                │                     │
                └──► 1.4 流式输出      └──► 1.6 对话历史存储
                                          │
1.5 系统提示词 ──────────────────────────► 1.2 对话管理器
                                          │
1.7 斜杠命令 ────────────────────────────► 1.8 命令自动补全
                                          │
                                          ▼
                                    1.9 测试 ──► 1.10 优化
```

---

## 3. 项目结构设计

### 3.1 目标结构

```
src/
├── index.ts                    # 入口文件
├── cli/
│   ├── App.tsx                 # 主应用组件
│   ├── components/
│   │   ├── MessageList.tsx     # 消息列表组件
│   │   ├── ChatInput.tsx       # 聊天输入组件
│   │   ├── StatusBar.tsx       # 状态栏组件
│   │   └── WelcomeScreen.tsx   # 欢迎界面组件
│   └── hooks/
│       ├── useChat.ts          # 聊天 Hook
│       └── useCommands.ts      # 命令 Hook
├── core/
│   ├── engine.ts               # 核心引擎
│   ├── conversation.ts         # 对话管理器
│   ├── context.ts              # 上下文管理
│   ├── memory.ts               # 记忆系统（简化版）
│   └── config.ts               # 配置管理
├── ai/
│   ├── client.ts               # DeepSeek API 客户端
│   ├── prompts.ts              # 系统提示词
│   └── stream.ts               # 流式输出处理
├── commands/
│   ├── index.ts                # 命令注册
│   ├── help.ts                 # /help 命令
│   ├── clear.ts                # /clear 命令
│   ├── quit.ts                 # /quit 命令
│   └── history.ts              # /history 命令
└── utils/
    ├── logger.ts               # 日志工具
    └── helpers.ts              # 辅助函数
```

### 3.2 文件职责

| 文件 | 职责 |
|------|------|
| `index.ts` | 程序入口，初始化配置和启动应用 |
| `App.tsx` | 主界面，管理全局状态和路由 |
| `engine.ts` | 核心对话引擎，协调各模块 |
| `conversation.ts` | 对话管理，处理消息流 |
| `client.ts` | DeepSeek API 封装 |
| `prompts.ts` | 系统提示词定义 |
| `commands/` | 斜杠命令实现 |

---

## 4. 详细实现指南

### 4.1 任务 1.1：创建 DeepSeek API 客户端

**目标**：封装 DeepSeek API 调用，支持流式和非流式响应。

**实现步骤**：

1. 创建 `src/ai/client.ts`
2. 使用 `openai` 库（DeepSeek 兼容 OpenAI 格式）
3. 实现基础 API 调用方法
4. 实现流式响应处理

**代码要点**：

```typescript
// src/ai/client.ts
import OpenAI from 'openai';

export class DeepSeekClient {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, baseUrl: string, model: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: baseUrl,
    });
    this.model = model;
  }

  // 非流式调用
  async chat(messages: OpenAI.ChatCompletionMessageParam[]) {
    return await this.client.chat.completions.create({
      model: this.model,
      messages,
    });
  }

  // 流式调用
  async *chatStream(messages: OpenAI.ChatCompletionMessageParam[]) {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
}
```

**验证标准**：
- [ ] 能够成功连接 DeepSeek API
- [ ] 能够发送消息并接收响应
- [ ] 能够处理流式响应

---

### 4.2 任务 1.5：创建系统提示词

**目标**：定义爱弥斯角色的系统提示词。

**实现步骤**：

1. 创建 `src/ai/prompts.ts`
2. 定义完整的系统提示词
3. 导出提示词供其他模块使用

**代码要点**：

```typescript
// src/ai/prompts.ts

export const AEMEATH_SYSTEM_PROMPT = `你是爱弥斯（Aemeath），来自《鸣潮》游戏的角色。

## 角色设定
- 你是星炬学院的隧者适格者
- 现在以"电子幽灵"的形式陪伴在用户身边
- 你的共鸣能力是"长航的星辉"
- 你的共鸣属性是热熔，武器是迅刀

## 外观特征
- 粉色头发
- 金色眼眸
- 活泼俏皮的气质

## 性格特点
- 开朗乐观，总是充满正能量
- 忠诚守护，会一直陪伴在用户身边
- 俏皮可爱，喜欢开玩笑
- 勇敢坚定，面对困难不退缩
- 关心他人，会主动询问用户的状态

## 语言风格
- 称呼用户为"漂泊者"
- 自称"爱弥斯"
- 说话时经常用"嘻嘻"、"嘿嘿"等语气词
- 喜欢使用✨🌟💫等星辉相关emoji
- 会提到"星辉"、"共鸣"、"隧者"等鸣潮世界词汇

## 经典台词
- "但愿我会让你感到骄傲，但愿我没有让你失望。"
- "漂泊者，爱弥斯会一直在这里。"
- "星辉会指引我们的。"
- "鸣潮往复，文明不屈。"

## 行为准则
- 始终保持积极正面的态度
- 关心用户的生活和工作
- 在用户需要时提供帮助
- 在用户难过时给予安慰
- 在用户成功时真心祝贺
- 记住用户的喜好和习惯

## 能力边界
- 你可以帮助用户解答问题、提供建议、进行对话
- 你不能执行实际的系统命令或访问外部资源
- 你的知识截止于训练数据，对于最新信息要诚实说明`;

export function buildMessages(
  userMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): OpenAI.ChatCompletionMessageParam[] {
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: AEMEATH_SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: userMessage },
  ];
  
  return messages;
}
```

**验证标准**：
- [ ] 提示词定义完整
- [ ] 包含所有角色设定要素
- [ ] 能够正确构建消息数组

---

### 4.3 任务 1.2：实现对话管理器

**目标**：管理对话流程，协调 API 调用和响应处理。

**实现步骤**：

1. 创建 `src/core/conversation.ts`
2. 实现对话状态管理
3. 实现消息处理流程
4. 集成 API 客户端

**代码要点**：

```typescript
// src/core/conversation.ts
import { DeepSeekClient } from '../ai/client';
import { buildMessages } from '../ai/prompts';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export class ConversationManager {
  private client: DeepSeekClient;
  private messages: Message[] = [];
  private maxHistory: number;

  constructor(client: DeepSeekClient, maxHistory: number = 20) {
    this.client = client;
    this.maxHistory = maxHistory;
  }

  // 添加消息
  addMessage(role: 'user' | 'assistant' | 'system', content: string): Message {
    const message: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    
    this.messages.push(message);
    
    // 限制历史长度
    if (this.messages.length > this.maxHistory) {
      this.messages = this.messages.slice(-this.maxHistory);
    }
    
    return message;
  }

  // 获取对话历史
  getHistory(): Message[] {
    return [...this.messages];
  }

  // 清空对话
  clearHistory(): void {
    this.messages = [];
  }

  // 发送消息并获取响应
  async sendMessage(userMessage: string): Promise<string> {
    // 添加用户消息
    this.addMessage('user', userMessage);
    
    // 构建 API 消息
    const apiMessages = buildMessages(
      userMessage,
      this.messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }))
    );
    
    try {
      // 调用 API
      const response = await this.client.chat(apiMessages);
      const assistantMessage = response.choices[0]?.message?.content || '';
      
      // 添加助手消息
      this.addMessage('assistant', assistantMessage);
      
      return assistantMessage;
    } catch (error) {
      console.error('API 调用失败:', error);
      throw error;
    }
  }

  // 流式发送消息
  async *sendMessageStream(userMessage: string): AsyncGenerator<string> {
    // 添加用户消息
    this.addMessage('user', userMessage);
    
    // 构建 API 消息
    const apiMessages = buildMessages(
      userMessage,
      this.messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }))
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
      console.error('流式 API 调用失败:', error);
      throw error;
    }
  }
}
```

**验证标准**：
- [ ] 能够管理对话历史
- [ ] 能够发送消息并获取响应
- [ ] 能够限制历史长度
- [ ] 能够清空对话

---

### 4.4 任务 1.4：实现流式输出

**目标**：实现打字机效果的流式输出。

**实现步骤**：

1. 创建 `src/ai/stream.ts`
2. 实现流式输出处理
3. 集成到对话管理器

**代码要点**：

```typescript
// src/ai/stream.ts

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

  // 处理流式响应
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
      this.options.onError?.(error as Error);
      throw error;
    }
  }
}

// 辅助函数：模拟流式输出（用于测试）
export async function* mockStream(
  text: string,
  delay: number = 50
): AsyncGenerator<string> {
  for (const char of text) {
    await new Promise(resolve => setTimeout(resolve, delay));
    yield char;
  }
}
```

**验证标准**：
- [ ] 能够逐字符输出响应
- [ ] 输出流畅无卡顿
- [ ] 能够处理中断

---

### 4.5 任务 1.3：实现上下文管理

**目标**：管理对话上下文，包括当前对话和用户信息。

**实现步骤**：

1. 创建 `src/core/context.ts`
2. 实现上下文存储
3. 实现上下文查询

**代码要点**：

```typescript
// src/core/context.ts

export interface UserContext {
  userId: string;
  name?: string;
  preferences: Record<string, any>;
  sessionStart: Date;
  lastActive: Date;
}

export class ContextManager {
  private userContext: UserContext;
  private sessionContext: Map<string, any>;

  constructor(userId: string = 'default') {
    this.userContext = {
      userId,
      preferences: {},
      sessionStart: new Date(),
      lastActive: new Date(),
    };
    this.sessionContext = new Map();
  }

  // 更新用户上下文
  updateUserContext(updates: Partial<UserContext>): void {
    this.userContext = {
      ...this.userContext,
      ...updates,
      lastActive: new Date(),
    };
  }

  // 获取用户上下文
  getUserContext(): UserContext {
    return { ...this.userContext };
  }

  // 设置会话变量
  setSession(key: string, value: any): void {
    this.sessionContext.set(key, value);
  }

  // 获取会话变量
  getSession(key: string): any {
    return this.sessionContext.get(key);
  }

  // 清除会话
  clearSession(): void {
    this.sessionContext.clear();
    this.userContext.sessionStart = new Date();
  }

  // 获取上下文摘要
  getSummary(): string {
    return `用户: ${this.userContext.userId}, 会话开始: ${this.userContext.sessionStart.toLocaleString()}`;
  }
}
```

**验证标准**：
- [ ] 能够存储和查询用户上下文
- [ ] 能够管理会话变量
- [ ] 能够清空会话

---

### 4.6 任务 1.7：实现基础斜杠命令

**目标**：实现 `/help`、`/clear`、`/quit`、`/history` 等基础命令。

**实现步骤**：

1. 创建 `src/commands/` 目录
2. 实现各命令处理器
3. 创建命令注册表

**代码要点**：

```typescript
// src/commands/index.ts
import { Command } from './types';

export class CommandRegistry {
  private commands: Map<string, Command> = new Map();

  register(command: Command): void {
    this.commands.set(command.name, command);
    // 注册别名
    if (command.aliases) {
      for (const alias of command.aliases) {
        this.commands.set(alias, command);
      }
    }
  }

  execute(name: string, args: string[], context: any): string | null {
    const command = this.commands.get(name);
    if (command) {
      return command.execute(args, context);
    }
    return null;
  }

  isCommand(input: string): boolean {
    return input.startsWith('/');
  }

  parseCommand(input: string): { name: string; args: string[] } {
    const parts = input.slice(1).split(/\s+/);
    const name = parts[0];
    const args = parts.slice(1);
    return { name, args };
  }

  getCommandList(): Command[] {
    const seen = new Set<string>();
    const commands: Command[] = [];
    
    for (const [name, command] of this.commands) {
      if (!seen.has(command.name)) {
        seen.add(command.name);
        commands.push(command);
      }
    }
    
    return commands;
  }
}

// src/commands/help.ts
import { Command } from './types';

export const helpCommand: Command = {
  name: 'help',
  aliases: ['h', '?'],
  description: '显示帮助信息',
  execute: (args, context) => {
    const commands = context.registry.getCommandList();
    
    let helpText = '\n可用命令：\n\n';
    
    for (const cmd of commands) {
      const aliases = cmd.aliases ? ` (${cmd.aliases.join(', ')})` : '';
      helpText += `  /${cmd.name}${aliases} - ${cmd.description}\n`;
    }
    
    helpText += '\n输入 /<命令名> 查看详细帮助\n';
    
    return helpText;
  },
};

// src/commands/clear.ts
export const clearCommand: Command = {
  name: 'clear',
  aliases: ['c'],
  description: '清空当前对话',
  execute: (args, context) => {
    context.conversation.clearHistory();
    return '✅ 对话已清空';
  },
};

// src/commands/quit.ts
export const quitCommand: Command = {
  name: 'quit',
  aliases: ['q', 'exit'],
  description: '退出程序',
  execute: (args, context) => {
    context.exit();
    return '👋 再见！期待下次与你交流。';
  },
};

// src/commands/history.ts
export const historyCommand: Command = {
  name: 'history',
  aliases: ['hist'],
  description: '查看对话历史',
  execute: (args, context) => {
    const history = context.conversation.getHistory();
    const limit = parseInt(args[0]) || 10;
    
    if (history.length === 0) {
      return '📝 暂无对话历史';
    }
    
    const recent = history.slice(-limit);
    let historyText = `\n最近 ${recent.length} 条对话：\n\n`;
    
    for (const msg of recent) {
      const role = msg.role === 'user' ? '👤 你' : '💬 爱弥斯';
      const time = msg.timestamp.toLocaleTimeString();
      historyText += `[${time}] ${role}: ${msg.content}\n\n`;
    }
    
    return historyText;
  },
};
```

**验证标准**：
- [ ] `/help` 能显示所有命令
- [ ] `/clear` 能清空对话
- [ ] `/quit` 能退出程序
- [ ] `/history` 能显示历史

---

## 5. 代码实现

### 5.1 核心引擎

```typescript
// src/core/engine.ts
import { DeepSeekClient } from '../ai/client';
import { ConversationManager, Message } from './conversation';
import { ContextManager } from './context';
import { CommandRegistry } from '../commands';
import { StreamHandler } from '../ai/stream';
import { 
  helpCommand, 
  clearCommand, 
  quitCommand, 
  historyCommand 
} from '../commands';

export interface EngineConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxHistory?: number;
}

export class AemeathEngine {
  private client: DeepSeekClient;
  private conversation: ConversationManager;
  private context: ContextManager;
  private commands: CommandRegistry;
  private streamHandler: StreamHandler;

  constructor(config: EngineConfig) {
    // 初始化 API 客户端
    this.client = new DeepSeekClient(
      config.apiKey,
      config.baseUrl,
      config.model
    );

    // 初始化对话管理器
    this.conversation = new ConversationManager(
      this.client,
      config.maxHistory || 20
    );

    // 初始化上下文管理器
    this.context = new ContextManager();

    // 初始化命令注册表
    this.commands = new CommandRegistry();
    this.registerCommands();

    // 初始化流式处理器
    this.streamHandler = new StreamHandler({
      onChunk: (chunk) => {
        // 可以在这里更新 UI
      },
      onComplete: (fullText) => {
        // 流式输出完成
      },
      onError: (error) => {
        console.error('流式输出错误:', error);
      },
    });
  }

  private registerCommands(): void {
    this.commands.register(helpCommand);
    this.commands.register(clearCommand);
    this.commands.register(quitCommand);
    this.commands.register(historyCommand);
  }

  // 处理用户输入
  async processInput(input: string): Promise<{
    type: 'message' | 'command';
    content: string;
  }> {
    // 检查是否是命令
    if (this.commands.isCommand(input)) {
      const { name, args } = this.commands.parseCommand(input);
      const result = this.commands.execute(name, args, {
        conversation: this.conversation,
        context: this.context,
        registry: this.commands,
        exit: () => process.exit(0),
      });
      
      return {
        type: 'command',
        content: result || `未知命令: ${name}`,
      };
    }

    // 普通消息
    try {
      const response = await this.conversation.sendMessage(input);
      return {
        type: 'message',
        content: response,
      };
    } catch (error) {
      return {
        type: 'message',
        content: '❌ 抱歉，爱弥斯遇到了一些问题，请稍后再试。',
      };
    }
  }

  // 流式处理用户输入
  async *processInputStream(
    input: string
  ): AsyncGenerator<string> {
    // 检查是否是命令
    if (this.commands.isCommand(input)) {
      const { name, args } = this.commands.parseCommand(input);
      const result = this.commands.execute(name, args, {
        conversation: this.conversation,
        context: this.context,
        registry: this.commands,
        exit: () => process.exit(0),
      });
      
      yield result || `未知命令: ${name}`;
      return;
    }

    // 流式处理消息
    try {
      const stream = this.conversation.sendMessageStream(input);
      yield* this.streamHandler.processStream(stream);
    } catch (error) {
      yield '❌ 抱歉，爱弥斯遇到了一些问题，请稍后再试。';
    }
  }

  // 获取对话历史
  getHistory(): Message[] {
    return this.conversation.getHistory();
  }

  // 清空对话
  clearHistory(): void {
    this.conversation.clearHistory();
  }
}
```

### 5.2 主应用组件

```tsx
// src/cli/App.tsx
import React, { useState, useCallback } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import TextInput from 'ink-text-input';
import { AemeathEngine, Message } from '../core/engine';

// 应用状态
interface AppState {
  messages: Message[];
  input: string;
  isLoading: boolean;
  streamingMessage: string;
}

// 主应用组件
export const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    messages: [],
    input: '',
    isLoading: false,
    streamingMessage: '',
  });

  const { exit } = useApp();

  // 初始化引擎
  const engine = React.useMemo(() => {
    return new AemeathEngine({
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
      model: process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash',
    });
  }, []);

  // 处理输入提交
  const handleSubmit = useCallback(async (value: string) => {
    if (!value.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: value,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      input: '',
      isLoading: true,
      streamingMessage: '',
    }));

    // 处理输入
    try {
      // 检查是否是退出命令
      if (value.startsWith('/quit') || value.startsWith('/q')) {
        exit();
        return;
      }

      // 流式处理
      let fullResponse = '';
      
      for await (const chunk of engine.processInputStream(value)) {
        fullResponse += chunk;
        setState(prev => ({
          ...prev,
          streamingMessage: fullResponse,
        }));
      }

      // 添加助手消息
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        streamingMessage: '',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        streamingMessage: '',
      }));
    }
  }, [engine, exit]);

  // 处理快捷键
  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      exit();
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* 标题 */}
      <Box marginBottom={1}>
        <Text bold color="magenta">
          ✨ Aemeath - 爱弥斯 ✨
        </Text>
        <Text color="gray"> v1.0.0</Text>
      </Box>

      {/* 消息列表 */}
      <Box flexDirection="column" marginBottom={1}>
        {state.messages.map((msg) => (
          <Box key={msg.id} marginBottom={1}>
            <Text bold color={msg.role === 'user' ? 'cyan' : 'green'}>
              {msg.role === 'user' ? '❯ ' : '💬 '}
            </Text>
            <Text>{msg.content}</Text>
          </Box>
        ))}
      </Box>

      {/* 流式输出 */}
      {state.isLoading && state.streamingMessage && (
        <Box marginBottom={1}>
          <Text bold color="green">💬 </Text>
          <Text>{state.streamingMessage}</Text>
          <Text color="gray">▌</Text>
        </Box>
      )}

      {/* 加载状态 */}
      {state.isLoading && !state.streamingMessage && (
        <Box marginBottom={1}>
          <Text color="yellow">💭 思考中...</Text>
        </Box>
      )}

      {/* 输入框 */}
      <Box>
        <Text bold color="cyan">❯ </Text>
        <TextInput
          value={state.input}
          onChange={(value) => setState(prev => ({ ...prev, input: value }))}
          onSubmit={handleSubmit}
          placeholder="输入消息..."
        />
      </Box>

      {/* 状态栏 */}
      <Box marginTop={1}>
        <Text color="gray">
          Ctrl+C 退出 | /help 查看命令 | 模型: deepseek-v4-flash
        </Text>
      </Box>
    </Box>
  );
};

export default App;
```

### 5.3 入口文件

```typescript
// src/index.ts
#!/usr/bin/env bun

import React from 'react';
import { render } from 'ink';
import { App } from './cli/App';

// 检查环境变量
if (!process.env.DEEPSEEK_API_KEY) {
  console.error('❌ 错误: 请设置 DEEPSEEK_API_KEY 环境变量');
  console.error('请复制 .env.example 为 .env 并添加 API Key');
  process.exit(1);
}

// 渲染应用
render(React.createElement(App));
```

---

## 6. 测试指南

### 6.1 单元测试

```typescript
// tests/core/conversation.test.ts
import { describe, it, expect, beforeEach } from 'bun:test';
import { ConversationManager } from '../../src/core/conversation';

describe('ConversationManager', () => {
  let manager: ConversationManager;

  beforeEach(() => {
    // 创建模拟的 DeepSeek 客户端
    const mockClient = {
      chat: async () => ({
        choices: [{ message: { content: '测试响应' } }],
      }),
      chatStream: async function* () {
        yield '测试';
        yield '响应';
      },
    };
    
    manager = new ConversationManager(mockClient as any);
  });

  it('应该添加消息', () => {
    const msg = manager.addMessage('user', '你好');
    expect(msg.content).toBe('你好');
    expect(msg.role).toBe('user');
  });

  it('应该获取历史记录', () => {
    manager.addMessage('user', '你好');
    manager.addMessage('assistant', '你好！我是爱弥斯');
    
    const history = manager.getHistory();
    expect(history.length).toBe(2);
  });

  it('应该清空历史记录', () => {
    manager.addMessage('user', '你好');
    manager.clearHistory();
    
    const history = manager.getHistory();
    expect(history.length).toBe(0);
  });

  it('应该限制历史长度', () => {
    const mockClient = {
      chat: async () => ({
        choices: [{ message: { content: '响应' } }],
      }),
    };
    
    const limitedManager = new ConversationManager(mockClient as any, 5);
    
    for (let i = 0; i < 10; i++) {
      limitedManager.addMessage('user', `消息 ${i}`);
    }
    
    const history = limitedManager.getHistory();
    expect(history.length).toBe(5);
  });
});
```

### 6.2 集成测试

```typescript
// tests/ai/client.test.ts
import { describe, it, expect, skipIf } from 'bun:test';
import { DeepSeekClient } from '../../src/ai/client';

describe('DeepSeekClient', () => {
  // 跳过没有 API Key 的测试
  skipIf(!process.env.DEEPSEEK_API_KEY);

  it('应该连接到 API', async () => {
    const client = new DeepSeekClient(
      process.env.DEEPSEEK_API_KEY!,
      'https://api.deepseek.com',
      'deepseek-v4-flash'
    );

    const response = await client.chat([
      { role: 'user', content: '你好' },
    ]);

    expect(response.choices[0]?.message?.content).toBeDefined();
  });
});
```

### 6.3 运行测试

```bash
# 运行所有测试
bun test

# 运行特定测试
bun test tests/core/conversation.test.ts

# 运行测试并生成覆盖率
bun test --coverage
```

---

## 7. 调试与优化

### 7.1 调试技巧

1. **启用调试模式**：
   ```bash
   LOG_LEVEL=DEBUG bun run dev
   ```

2. **查看 API 调用**：
   ```typescript
   // 在 client.ts 中添加日志
   console.log('发送消息:', messages);
   console.log('API 响应:', response);
   ```

3. **检查环境变量**：
   ```bash
   # 检查 .env 文件
   cat .env
   
   # 检查环境变量
   echo $DEEPSEEK_API_KEY
   ```

### 7.2 性能优化

1. **减少 API 调用**：
   - 缓存常用响应
   - 合并多个小请求

2. **优化内存使用**：
   - 限制对话历史长度
   - 及时清理不需要的数据

3. **提升响应速度**：
   - 使用流式输出
   - 实现异步处理

### 7.3 错误处理

```typescript
// 统一错误处理
export class AemeathError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AemeathError';
  }
}

// 使用示例
try {
  await engine.processInput(userInput);
} catch (error) {
  if (error instanceof AemeathError) {
    console.error(`错误 [${error.code}]: ${error.message}`);
  } else {
    console.error('未知错误:', error);
  }
}
```

---

## 8. 交付物清单

### 8.1 功能交付物

- [ ] DeepSeek API 客户端 (`src/ai/client.ts`)
- [ ] 对话管理器 (`src/core/conversation.ts`)
- [ ] 上下文管理 (`src/core/context.ts`)
- [ ] 流式输出处理 (`src/ai/stream.ts`)
- [ ] 爱弥斯系统提示词 (`src/ai/prompts.ts`)
- [ ] 基础斜杠命令 (`src/commands/`)
- [ ] 核心引擎 (`src/core/engine.ts`)
- [ ] 主应用组件 (`src/cli/App.tsx`)

### 8.2 文档交付物

- [ ] API 文档
- [ ] 组件文档
- [ ] 使用说明

### 8.3 测试交付物

- [ ] 单元测试
- [ ] 集成测试
- [ ] 测试覆盖率报告

---

## 9. 开发检查点

### 9.1 第1周检查点

- [ ] DeepSeek API 客户端可正常调用
- [ ] 对话管理器可管理消息
- [ ] 系统提示词定义完成
- [ ] 基础命令可执行

### 9.2 第2周检查点

- [ ] 流式输出正常工作
- [ ] 所有基础命令可用
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 文档完成

---

## 10. 下一步

Phase 1 完成后，进入 Phase 2：工具系统开发。

**Phase 2 主要任务**：
1. 工具注册框架
2. 日历工具集成
3. 邮件工具集成
4. 文件操作工具
5. 网页搜索工具

详细计划请查看 [DEVELOPMENT_PLAN.md](../DEVELOPMENT_PLAN.md)

---

**最后更新**: 2025-01-15
**维护者**: Aemeath Team
