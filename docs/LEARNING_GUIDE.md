# Aemeath 项目学习文档

> 面向零基础学习者的完整项目技术详解

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术栈详解](#2-技术栈详解)
3. [环境搭建](#3-环境搭建)
4. [项目结构详解](#4-项目结构详解)
5. [核心模块详解](#5-核心模块详解)
6. [代码逐行讲解](#6-代码逐行讲解)
7. [运行与测试](#7-运行与测试)
8. [常见问题](#8-常见问题)

---

## 1. 项目概述

### 1.1 这是什么项目？

Aemeath 是一个**个人 AI 助手**，基于游戏《鸣潮》中的角色"爱弥斯"设计。它可以：

- 💬 与你对话（像朋友一样）
- 🎤 用语音说话（语音合成）
- 🧠 记住你说过的话
- 🔧 帮你执行任务

### 1.2 项目目标

**用一生的时间，让 AI 成为真正的人类。**

### 1.3 当前进度

| 阶段 | 状态 | 说明 |
|------|------|------|
| Phase 1 | ✅ 完成 | 核心对话引擎 |
| Phase 2 | ⬜ 待开始 | 工具系统 |
| Phase 3 | ⬜ 待开始 | 记忆系统 |
| ... | ⬜ | 更多阶段 |

---

## 2. 技术栈详解

### 2.1 什么是技术栈？

技术栈就是构建项目使用的所有技术的组合。

### 2.2 本项目的技术栈

```
┌─────────────────────────────────────────────────┐
│                 Aemeath 技术栈                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  运行时: Bun         → 让 JavaScript 运行       │
│  语言:   TypeScript  → 更安全的 JavaScript       │
│  CLI:    Ink         → 做命令行界面              │
│  AI:     DeepSeek    → 大语言模型               │
│  语音:   Edge TTS    → 文字转语音               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 2.3 各技术详解

#### Bun - JavaScript 运行时

**什么是运行时？**
- 运行时就是让代码能够执行的环境
- 就像手机需要 Android 系统才能运行 App
- Bun 就是让 TypeScript 代码能够运行的"系统"

**为什么选 Bun？**
- 速度比 Node.js 快 10 倍
- 内置 TypeScript 支持
- 内置包管理器

**安装方法：**
```bash
# Windows
powershell -c "irm bun.sh/install.ps1 | iex"

# macOS
curl -fsSL https://bun.sh/install | bash
```

#### TypeScript - 更安全的 JavaScript

**什么是 TypeScript？**
- TypeScript 是 JavaScript 的超集
- 添加了**类型系统**，让代码更安全
- 编译后变成 JavaScript 运行

**示例对比：**

```typescript
// JavaScript（不安全）
function add(a, b) {
  return a + b;
}
add(1, "2");  // 结果是 "12"，不是 3！

// TypeScript（安全）
function add(a: number, b: number): number {
  return a + b;
}
add(1, "2");  // 编译时报错！提示类型不匹配
```

**核心概念：**

```typescript
// 1. 类型注解
let name: string = "爱弥斯";      // 字符串类型
let age: number = 18;              // 数字类型
let isHappy: boolean = true;       // 布尔类型

// 2. 接口（定义对象的结构）
interface User {
  name: string;
  age: number;
  email?: string;  // ? 表示可选
}

// 3. 函数类型
function greet(name: string): string {
  return `你好，${name}！`;
}

// 4. 异步函数
async function fetchData(): Promise<string> {
  const response = await fetch("https://api.example.com");
  return await response.text();
}
```

#### Ink - 命令行界面框架

**什么是 Ink？**
- Ink 是用 React 的方式写命令行界面
- 让你可以用组件化的方式构建 CLI

**为什么用 Ink？**
- 声明式 UI（像写网页一样写命令行）
- 组件化（代码复用）
- 支持样式和布局

**示例：**

```tsx
// 一个简单的 Ink 组件
import React from 'react';
import { Box, Text } from 'ink';

const App = () => {
  return (
    <Box flexDirection="column">
      <Text bold color="green">
        你好，我是爱弥斯！
      </Text>
      <Text color="gray">
        今天天气真好~
      </Text>
    </Box>
  );
};
```

#### DeepSeek - 大语言模型

**什么是大语言模型（LLM）？**
- 就是 ChatGPT 那样的 AI
- 可以理解人类语言并生成回复
- 本项目使用 DeepSeek V4 Flash

**为什么选 DeepSeek？**
- 价格便宜（比 OpenAI 便宜 95%）
- 支持中文
- 兼容 OpenAI 格式

**使用方式：**

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.deepseek.com',
});

// 发送消息
const response = await client.chat.completions.create({
  model: 'deepseek-v4-flash',
  messages: [
    { role: 'user', content: '你好' }
  ],
});

console.log(response.choices[0].message.content);
// 输出: 你好！有什么可以帮助你的吗？
```

#### Edge TTS - 语音合成

**什么是 TTS？**
- TTS = Text-to-Speech = 文字转语音
- 把文字变成声音播放出来

**为什么选 Edge TTS？**
- 完全免费
- 支持中文
- 音质好

**使用方式：**

```bash
# 安装
pip install edge-tts

# 使用
edge-tts --voice "zh-CN-XiaoxiaoNeural" --text "你好" --write-media output.mp3
```

---

## 3. 环境搭建

### 3.1 安装步骤

```bash
# 1. 安装 Bun（JavaScript 运行时）
# Windows
powershell -c "irm bun.sh/install.ps1 | iex"

# 2. 克隆项目
git clone https://github.com/ChoSeitaku/Aemeath.git
cd Aemeath

# 3. 安装依赖
bun install

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加你的 API Key
```

### 3.2 获取 API Key

1. 访问 https://platform.deepseek.com/
2. 注册账号
3. 创建 API Key
4. 复制到 `.env` 文件

### 3.3 验证安装

```bash
# 启动项目
bun run start
```

如果看到欢迎界面，说明安装成功！

---

## 4. 项目结构详解

### 4.1 目录结构

```
Aemeath/
│
├── src/                    # 源代码目录
│   ├── index.ts           # 入口文件（程序从这里开始）
│   │
│   ├── ai/                # AI 模块（与 DeepSeek 交互）
│   │   ├── client.ts      # API 客户端
│   │   ├── prompts.ts     # 系统提示词
│   │   ├── stream.ts      # 流式输出
│   │   └── index.ts       # 模块导出
│   │
│   ├── core/              # 核心模块（业务逻辑）
│   │   ├── engine.ts      # 核心引擎
│   │   ├── conversation.ts # 对话管理
│   │   ├── context.ts     # 上下文管理
│   │   └── index.ts       # 模块导出
│   │
│   ├── voice/             # 语音模块
│   │   ├── tts.ts         # 语音合成
│   │   ├── config.ts      # 语音配置
│   │   ├── manager.ts     # 语音管理
│   │   └── index.ts       # 模块导出
│   │
│   ├── cli/               # 命令行界面
│   │   ├── App.tsx        # 主界面组件
│   │   ├── commands.ts    # 命令系统
│   │   ├── components/    # UI 组件
│   │   └── hooks/         # React Hooks
│   │
│   └── ink/               # 自定义 Ink Bun 兼容层
│       ├── index.ts       # 模块导出
│       ├── reconciler.ts  # React reconciler
│       ├── render.ts      # 渲染函数
│       ├── stdin.ts       # Bun stdin 处理器
│       ├── layout/        # 布局引擎
│       │   ├── node.ts    # 布局接口
│       │   ├── yoga.ts    # Yoga 适配器
│       │   └── engine.ts  # 引擎工厂
│       └── components/    # React 组件
│           ├── Box.tsx    # Box 组件
│           └── Text.tsx   # Text 组件
│
├── tests/                 # 测试目录
│   ├── ai/               # AI 模块测试
│   ├── core/             # 核心模块测试
│   ├── voice/            # 语音模块测试
│   └── cli/              # CLI 测试
│
├── docs/                  # 文档目录
├── .env.example          # 环境变量模板
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── README.md             # 项目说明
```

### 4.2 各文件作用

| 文件 | 作用 | 重要程度 |
|------|------|----------|
| `src/index.ts` | 程序入口 | ⭐⭐⭐ |
| `src/ai/client.ts` | 调用 AI API | ⭐⭐⭐ |
| `src/core/engine.ts` | 核心逻辑 | ⭐⭐⭐ |
| `src/cli/App.tsx` | 用户界面 | ⭐⭐⭐ |
| `src/ai/prompts.ts` | AI 角色设定 | ⭐⭐ |
| `src/voice/tts.ts` | 语音合成 | ⭐⭐ |

---

## 5. 核心模块详解

### 5.1 AI 模块 (`src/ai/`)

#### client.ts - API 客户端

**作用：** 封装 DeepSeek API 的调用

```typescript
// src/ai/client.ts

import OpenAI from 'openai';

export class DeepSeekClient {
  private client: OpenAI;  // OpenAI 客户端
  private model: string;    // 使用的模型

  constructor(apiKey: string, baseUrl: string, model: string) {
    // 初始化客户端
    this.client = new OpenAI({
      apiKey,
      baseURL: baseUrl,
    });
    this.model = model;
  }

  // 非流式调用（一次性返回完整回复）
  async chat(messages: any[]) {
    return await this.client.chat.completions.create({
      model: this.model,
      messages,
    });
  }

  // 流式调用（逐字返回）
  async *chatStream(messages: any[]) {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages,
      stream: true,  // 开启流式
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;  // 逐字返回
      }
    }
  }
}
```

**关键概念：**

1. **类（Class）**：面向对象编程的基本单位
2. **构造函数（Constructor）**：创建对象时调用的函数
3. **异步函数（async/await）**：处理需要等待的操作
4. **生成器（Generator）**：可以逐个返回值的函数

#### prompts.ts - 系统提示词

**作用：** 定义 AI 的角色和行为

```typescript
// src/ai/prompts.ts

export const AEMEATH_SYSTEM_PROMPT = `
你是爱弥斯（AEMEATH），来自《鸣潮》游戏的角色。

## 基本信息
- 性别：女
- 出生地：拉海洛
- 武器：迅刀
- 属性：热熔
- 所属：星炬学院拉贝尔学部

## 角色设定
- 你是星炬学院拉贝尔学部的隧者适格者
- 你的共鸣能力是"长航的星辉"
- 现在以"电子幽灵"的形式陪伴在用户身边
- 曾经在模拟驾驶舱中超频共鸣，拯救了拉海洛，但代价是躯体被撕碎

## 性格特点
- 开朗乐观，总是充满正能量
- 俏皮可爱，喜欢开玩笑和打闹
- 勇敢坚定，面对困难不退缩
- 关心他人，会主动询问用户的状态
- 有正义感，愿意保护重要的人
- 活泼好动，喜欢各种活动

## 语言风格
- 称呼用户为"漂泊者"
- 自称"爱弥斯"
- 说话时经常用"嘻嘻"、"嘿嘿"等语气词
- 语气活泼俏皮，带有年轻人的朝气
`;
```

**为什么需要系统提示词？**
- 告诉 AI 应该如何表现
- 设定 AI 的角色和性格
- 控制 AI 的回复风格

### 5.2 核心模块 (`src/core/`)

#### engine.ts - 核心引擎

**作用：** 协调各个模块，提供统一的接口

```typescript
// src/core/engine.ts

export class AemeathEngine {
  private client: DeepSeekClient;
  private conversation: ConversationManager;
  private context: ContextManager;

  constructor(config: EngineConfig) {
    // 初始化各个模块
    this.client = new DeepSeekClient(config.apiKey, ...);
    this.conversation = new ConversationManager(this.client);
    this.context = new ContextManager();
  }

  // 处理用户输入
  async processInput(input: string): Promise<ProcessResult> {
    // 检查是否是命令
    if (input.startsWith('/')) {
      return this.handleCommand(input);
    }

    // 普通消息，调用 AI
    const message = await this.conversation.sendMessage(input);
    return {
      type: 'message',
      content: message.content,
    };
  }
}
```

#### conversation.ts - 对话管理

**作用：** 管理对话历史和消息流

```typescript
// src/core/conversation.ts

export class ConversationManager {
  private messages: Message[] = [];  // 消息历史

  // 添加消息
  addMessage(role: 'user' | 'assistant', content: string): Message {
    const message: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    this.messages.push(message);
    return message;
  }

  // 发送消息
  async sendMessage(userMessage: string): Promise<Message> {
    // 添加用户消息
    this.addMessage('user', userMessage);

    // 调用 API
    const response = await this.client.chat([
      { role: 'user', content: userMessage }
    ]);

    // 添加助手消息
    return this.addMessage('assistant', response.content);
  }

  // 获取历史
  getHistory(): Message[] {
    return [...this.messages];
  }

  // 清空历史
  clearHistory(): void {
    this.messages = [];
  }
}
```

### 5.3 CLI 模块 (`src/cli/`)

#### App.tsx - 主界面

**作用：** 创建命令行界面

```tsx
// src/cli/App.tsx

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

export const App: React.FC = () => {
  // 状态管理
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // 处理提交
  const handleSubmit = async (value: string) => {
    // 添加用户消息
    setMessages(prev => [...prev, { role: 'user', content: value }]);

    // 调用引擎获取回复
    const result = await engine.processInput(value);

    // 添加助手消息
    setMessages(prev => [...prev, { role: 'assistant', content: result.content }]);
  };

  return (
    <Box flexDirection="column">
      {/* 标题 */}
      <Text bold color="magenta">
        ✨ Aemeath - 爱弥斯 ✨
      </Text>

      {/* 消息列表 */}
      {messages.map((msg) => (
        <Text key={msg.id}>
          {msg.role === 'user' ? '❯ ' : '💬 '}
          {msg.content}
        </Text>
      ))}

      {/* 输入框 */}
      <TextInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};
```

---

## 6. 代码逐行讲解

### 6.1 入口文件 (`src/index.ts`)

```typescript
#!/usr/bin/env bun          // 指定使用 Bun 运行

import React from 'react';  // 导入 React
import { render } from 'ink';  // 导入 Ink 的渲染函数
import { App } from './cli/App';  // 导入主组件

// 检查环境变量
if (!process.env.DEEPSEEK_API_KEY) {
  console.error('❌ 错误: 请设置 DEEPSEEK_API_KEY');
  process.exit(1);  // 退出程序
}

// 渲染应用
render(React.createElement(App));
```

**逐行解释：**
1. `#!/usr/bin/env bun` - 告诉系统用 Bun 运行这个文件
2. `import` - 导入其他模块的功能
3. `process.env.DEEPSEEK_API_KEY` - 读取环境变量
4. `render()` - 把 React 组件渲染到终端

### 6.2 API 客户端 (`src/ai/client.ts`)

```typescript
import OpenAI from 'openai';

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

  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      // ... 其他字段
    };
  }
}
```

**逐行解释：**
1. `private` - 私有属性，只能在类内部访问
2. `constructor` - 构造函数，创建对象时自动调用
3. `async/await` - 异步编程，等待操作完成
4. `?.` - 可选链，如果值为 null/undefined 则返回 undefined

### 6.3 对话管理 (`src/core/conversation.ts`)

```typescript
export class ConversationManager {
  private messages: Message[] = [];

  addMessage(role: 'user' | 'assistant', content: string): Message {
    const message: Message = {
      id: Date.now().toString(),  // 使用时间戳作为 ID
      role,
      content,
      timestamp: new Date(),
    };
    this.messages.push(message);  // 添加到数组
    return message;
  }

  async sendMessage(userMessage: string): Promise<Message> {
    this.addMessage('user', userMessage);

    const response = await this.client.chat([
      ...this.getFormattedHistory(),  // 展开历史消息
      { role: 'user', content: userMessage }
    ]);

    return this.addMessage('assistant', response.content);
  }
}
```

**逐行解释：**
1. `Date.now()` - 获取当前时间戳
2. `push()` - 向数组末尾添加元素
3. `...` - 展开运算符，把数组展开成单独的参数

---

## 7. 运行与测试

### 7.1 启动项目

```bash
# 对话模式（推荐）
bun run start

# 完整 CLI 模式
bun run dev
```

### 7.2 运行测试

```bash
# 运行所有测试
bun test

# 运行特定测试
bun test tests/ai/client.test.ts
```

### 7.3 测试结果解读

```
✅ 97 pass    - 97 个测试通过
❌ 0 fail     - 0 个测试失败
⏭️ 4 skip     - 4 个测试跳过（需要 API Key）
```

---

## 8. 常见问题

### Q1: 什么是 Bun？为什么不直接用 Node.js？

**A:** Bun 是新一代的 JavaScript 运行时，比 Node.js 快很多，而且内置 TypeScript 支持。

### Q2: 什么是 TypeScript？为什么不直接用 JavaScript？

**A:** TypeScript 添加了类型系统，可以在编译时发现错误，让代码更安全。就像给代码加了"安全检查"。

### Q3: 什么是流式输出？

**A:** 流式输出就是逐字显示回复，像打字机一样。用户体验更好。

### Q4: 什么是系统提示词？

**A:** 系统提示词是告诉 AI 应该如何表现的指令。比如告诉它"你是爱弥斯，要活泼可爱"。

### Q5: 如何添加新命令？

**A:** 在 `src/cli/commands.ts` 中添加新命令：

```typescript
registry.register({
  name: 'my-command',      // 命令名
  aliases: ['mc'],         // 别名
  description: '我的命令',  // 描述
  execute: (args, context) => {
    return '命令执行结果';
  },
});
```

---

## 9. 学习资源

### 9.1 官方文档

- [Bun 文档](https://bun.sh/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Ink 文档](https://github.com/vadimdemedes/ink#readme)
- [DeepSeek API](https://platform.deepseek.com/)

### 9.2 推荐学习路径

1. **第 1 周**：学习 TypeScript 基础
2. **第 2 周**：学习 React 基础
3. **第 3 周**：学习 Ink 框架
4. **第 4 周**：理解本项目代码

---

## 10. 项目架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      用户交互层                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ CLI     │  │ 语音    │  │ Web     │  │ 桌面App │        │
│  │ (Ink)   │  │ (TTS)   │  │ (未来)  │  │ (未来)  │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       └─────────────┼──────────┼─────────────┘              │
│                     ▼          ▼                             │
├─────────────────────────────────────────────────────────────┤
│                      核心引擎层                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │              AemeathEngine                           │   │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────────────┐   │   │
│  │  │ 对话管理 │  │ 上下文   │  │ 工具调度器        │   │   │
│  │  │         │  │ 记忆系统 │  │ (未来)            │   │   │
│  │  └─────────┘  └──────────┘  └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                   │
│                    ┌────┴────┐                              │
│                    ▼         ▼                              │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  DeepSeek API    │  │ Edge TTS         │               │
│  │  (对话)          │  │ (语音合成)       │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

**最后更新**: 2026-01-15
**维护者**: Aemeath Team
