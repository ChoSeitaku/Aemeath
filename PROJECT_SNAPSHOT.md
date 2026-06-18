# Aemeath 项目快照

> 最后更新：2025-01-15
> 项目状态：Phase 1 完成，可运行

---

## 1. 项目概述

| 项目 | 详情 |
|------|------|
| **名称** | Aemeath（爱弥斯/小爱） |
| **类型** | 个人AI助手（陪伴型） |
| **角色** | 鸣潮游戏中的爱弥斯角色 |
| **技术栈** | TypeScript + Ink + Bun |
| **AI模型** | DeepSeek V4 Flash |
| **版本** | v1.0.0 |
| **仓库** | https://github.com/ChoSeitaku/Aemeath |

---

## 2. 技术栈确认

| 组件 | 选择 | 版本 | 状态 |
|------|------|------|------|
| 运行时 | Bun | latest | ✅ 已集成 |
| 语言 | TypeScript | 5.x | ✅ 已集成 |
| CLI框架 | Ink | 4.x | ✅ 已集成 |
| AI客户端 | openai | 4.x | ✅ 已集成 |
| 语音合成 | Edge TTS | - | ✅ 已集成 |
| 数据库 | better-sqlite3 | - | ⬜ 待集成 |
| 向量DB | ChromaDB | - | ⬜ 待集成 |

---

## 3. 核心功能模块

### 3.1 已实现模块

| 模块 | 文件 | 状态 |
|------|------|------|
| AI 客户端 | `src/ai/client.ts` | ✅ 完成 |
| 系统提示词 | `src/ai/prompts.ts` | ✅ 完成 |
| 流式输出 | `src/ai/stream.ts` | ✅ 完成 |
| 对话管理器 | `src/core/conversation.ts` | ✅ 完成 |
| 上下文管理 | `src/core/context.ts` | ✅ 完成 |
| 核心引擎 | `src/core/engine.ts` | ✅ 完成 |
| 语音合成 | `src/voice/tts.ts` | ✅ 完成 |
| 语音配置 | `src/voice/config.ts` | ✅ 完成 |
| 语音管理 | `src/voice/manager.ts` | ✅ 完成 |
| CLI 界面 | `src/cli/App.tsx` | ✅ 完成 |
| 命令系统 | `src/cli/commands.ts` | ✅ 完成 |
| 自动补全 | `src/cli/hooks/useAutoComplete.ts` | ✅ 完成 |

### 3.2 待实现模块

| 模块 | 说明 | 优先级 |
|------|------|--------|
| 工具系统 | 日历、邮件、文件、搜索 | P0 |
| 记忆系统 | 短期/长期记忆 | P0 |
| 陪伴型AI人格 | 情感理解、关系管理 | P1 |
| 多模态支持 | 图像、视频、文档 | P1 |
| 多设备同步 | CRDT、端到端加密 | P2 |
| 插件系统 | 可扩展架构 | P2 |

### 3.3 爱弥斯角色设定

- **名字**：Aemeath / 爱弥斯 / 小爱
- **来源**：鸣潮 (Wuthering Waves)
- **背景**：星炬学院隧者适格者
- **当前状态**：电子幽灵
- **共鸣能力**：长航的星辉
- **外观**：粉发金瞳
- **性格**：俏皮活泼、忠诚守护、开朗乐观

---

## 4. 文档清单（20个）

### 根目录文档
| 文件 | 内容 | 状态 |
|------|------|------|
| `README.md` | 项目介绍、快速开始 | ✅ |
| `ARCHITECTURE.md` | 系统架构设计 | ✅ |
| `CLI_DESIGN.md` | CLI界面设计 | ✅ |
| `DEVELOPMENT_PLAN.md` | 完整开发计划（26周） | ✅ |
| `CONTRIBUTING.md` | 贡献指南 | ✅ |
| `CHANGELOG.md` | 更新日志 | ✅ |
| `PROJECT_SNAPSHOT.md` | 项目快照（本文件） | ✅ |
| `LICENSE` | MIT许可证 | ✅ |
| `package.json` | 依赖配置 | ✅ |
| `tsconfig.json` | TypeScript配置 | ✅ |
| `.env.example` | 环境变量模板 | ✅ |
| `.gitignore` | Git忽略规则 | ✅ |

### docs目录（12个）
| 文件 | 内容 | 状态 |
|------|------|------|
| `SETUP.md` | 环境搭建手册 | ✅ |
| `PHASE1_DEVELOPMENT.md` | Phase 1 开发手册 | ✅ |
| `LEARNING_GUIDE.md` | 项目学习文档 | ✅ |
| `INSTALL.md` | 安装指南 | ✅ |
| `USER_GUIDE.md` | 用户指南 | ✅ |
| `DEVELOPMENT.md` | 开发者指南 | ✅ |
| `API.md` | API文档 | ✅ |
| `CONFIG.md` | 配置指南 | ✅ |
| `FAQ.md` | 常见问题 | ✅ |
| `TECH_REFERENCE.md` | 技术参考 | ✅ |
| `DEPLOYMENT.md` | 部署指南 | ✅ |
| `PRODUCTION_CHECKLIST.md` | 生产就绪清单 | ✅ |
| `SELF_LEARNING.md` | 自我学习系统 | ✅ |
| `MULTI_DEVICE_SYNC.md` | 多设备同步系统 | ✅ |

---

## 5. 开发计划（26周）

| Phase | 内容 | 时间 | 状态 |
|-------|------|------|------|
| 1 | 核心对话引擎 | 第1-2周 | ✅ 完成 |
| 2 | 工具系统 | 第4-5周 | ⬜ |
| 3 | 记忆系统 | 第6周 | ⬜ |
| 4 | 陪伴型AI人格 | 第7-8周 | ⬜ |
| 5 | 语音交互 | 第9-10周 | ⬜ |
| 6 | 多模态支持 | 第11周 | ⬜ |
| 7 | 多设备同步 | 第12周 | ⬜ |
| 8 | 插件系统 | 第13周 | ⬜ |
| 9 | 安全与优化 | 第14周 | ⬜ |
| 10 | 国际化与测试 | 第15周 | ⬜ |
| 11 | 文档与发布 | 第16周 | ⬜ |
| 12 | 自我学习系统 | 第17-18周 | ⬜ |
| 13 | 自我进化引擎 | 第19-20周 | ⬜ |
| 14 | 主动式AI系统 | 第21-22周 | ⬜ |
| 15 | Loop Engineering | 第23-24周 | ⬜ |
| 16 | 人类化AI系统 | 第25-26周 | ⬜ |

---

## 6. 项目结构

```
Aemeath/
├── src/
│   ├── index.ts                     # 入口文件
│   ├── ai/                          # AI 模块
│   │   ├── client.ts               # DeepSeek API 客户端
│   │   ├── prompts.ts              # 系统提示词
│   │   ├── stream.ts               # 流式输出
│   │   └── index.ts                # 模块导出
│   ├── core/                        # 核心模块
│   │   ├── engine.ts               # 核心引擎
│   │   ├── conversation.ts         # 对话管理器
│   │   ├── context.ts              # 上下文管理
│   │   └── index.ts                # 模块导出
│   ├── voice/                       # 语音模块
│   │   ├── tts.ts                  # 语音合成
│   │   ├── config.ts               # 语音配置
│   │   ├── manager.ts              # 语音管理
│   │   └── index.ts                # 模块导出
│   └── cli/                         # CLI 界面
│       ├── App.tsx                 # 主应用组件
│       ├── commands.ts             # 命令系统
│       ├── components/             # UI 组件
│       │   ├── MessageList.tsx
│       │   ├── ChatInput.tsx
│       │   ├── StatusBar.tsx
│       │   └── WelcomeScreen.tsx
│       └── hooks/                  # React Hooks
│           └── useAutoComplete.ts
├── tests/                           # 测试
│   ├── ai/client.test.ts
│   ├── core/core.test.ts
│   ├── voice/voice.test.ts
│   └── cli/commands.test.ts
├── docs/                            # 文档（12个）
├── start.ts                         # 启动脚本
├── package.json
├── tsconfig.json
└── README.md
```

---

## 7. 依赖配置

### 核心依赖
```json
{
  "ink": "^4.0.0",
  "ink-text-input": "^6.0.0",
  "react": "^18.2.0",
  "openai": "^4.0.0",
  "zod": "^3.22.0",
  "better-sqlite3": "^9.0.0",
  "chalk": "^5.3.0",
  "dotenv": "^16.3.0",
  "yaml": "^2.3.0",
  "ws": "^8.14.0",
  "sharp": "^0.33.0",
  "pdf-parse": "^1.1.1"
}
```

### 开发依赖
```json
{
  "@types/bun": "latest",
  "@types/react": "^18.2.0",
  "typescript": "^5.3.0",
  "eslint": "^8.56.0",
  "prettier": "^3.2.0"
}
```

---

## 8. 测试状态

```
✅ 97 pass    - 测试通过
❌ 0 fail     - 测试失败
⏭️ 0 skip     - 测试跳过
```

### 测试覆盖

| 模块 | 测试文件 | 测试数量 |
|------|----------|----------|
| AI 客户端 | `tests/ai/client.test.ts` | 15 |
| 核心模块 | `tests/core/core.test.ts` | 33 |
| 语音模块 | `tests/voice/voice.test.ts` | 29 |
| CLI 命令 | `tests/cli/commands.test.ts` | 20 |

---

## 9. 系统架构

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
│  │  │ ✅      │  │ ✅       │  │ ⬜ (未来)         │   │   │
│  │  └─────────┘  └──────────┘  └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                   │
│                    ┌────┴────┐                              │
│                    ▼         ▼                              │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  DeepSeek API    │  │ Edge TTS         │               │
│  │  ✅ 已集成       │  │ ✅ 已集成        │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. 启动命令

```bash
# 安装依赖
bun install

# 配置环境变量
cp .env.example .env
# 编辑 .env 添加 DEEPSEEK_API_KEY

# 启动对话模式
bun run start

# 运行测试
bun test
```

---

## 11. 下一步行动

### Phase 2: 工具系统

| 任务 | 说明 | 预计时间 |
|------|------|----------|
| 2.1 | 创建工具注册框架 | 3小时 |
| 2.2 | 实现工具基类 | 2小时 |
| 2.3 | 实现工具调度器 | 3小时 |
| 2.4 | 实现日历工具 | 4小时 |
| 2.5 | 实现邮件工具 | 4小时 |
| 2.6 | 实现文件操作工具 | 3小时 |
| 2.7 | 实现网页搜索工具 | 3小时 |

---

## 12. 参考资源

### GitHub 项目
- [Claude Code](https://github.com/anthropics/claude-code)
- [Gemini CLI](https://github.com/google/generative-ai-cli)
- [MiMo Code](https://github.com/XiaomiMiMo/MiMo-Code)
- [Ink](https://github.com/vadimdemedes/ink)
- [Bun](https://github.com/oven-sh/bun)

### 文档
- [Ink 文档](https://github.com/vadimdemedes/ink#readme)
- [Bun 文档](https://bun.sh/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [DeepSeek API](https://platform.deepseek.com/)

---

## 13. 注意事项

1. **版本控制**：使用 Git，每个 Phase 完成后提交
2. **测试驱动**：每个功能完成后立即编写测试
3. **文档同步**：代码变更时同步更新文档
4. **代码规范**：使用 ESLint + Prettier
5. **安全第一**：API 密钥等敏感信息不要提交到 Git

---

**项目状态**：✅ Phase 1 完成，可运行
**下次行动**：开始 Phase 2，实现工具系统
