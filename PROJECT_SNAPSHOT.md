# Aemeath 项目快照

> 最后更新：2025-01-15
> 项目状态：Phase 1 完成，v1.0.1

---

## 1. 项目概述

| 项目 | 详情 |
|------|------|
| **名称** | Aemeath（爱弥斯/小爱） |
| **类型** | 个人AI助手（陪伴型） |
| **角色** | 鸣潮游戏中的爱弥斯角色 |
| **技术栈** | TypeScript + Ink + Bun |
| **AI模型** | DeepSeek V4 Flash |
| **当前版本** | v1.0.1 |
| **仓库** | https://github.com/ChoSeitaku/Aemeath |

---

## 2. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0.0 | 2025-01-15 | Phase 1 完成 - 核心对话引擎 |
| v1.0.1 | 2025-01-15 | 修复输入框、修正角色设定、添加历史命令 |

### v1.0.1 更新内容

- ✅ 支持上下箭头键切换历史命令
- ✅ 修复输入框不清空的问题
- ✅ 修正爱弥斯角色设定
- ✅ 添加项目学习文档

---

## 3. 技术栈

| 组件 | 选择 | 版本 | 状态 |
|------|------|------|------|
| 运行时 | Bun | latest | ✅ 已集成 |
| 语言 | TypeScript | 5.x | ✅ 已集成 |
| CLI框架 | Ink | 4.x | ✅ 已集成 |
| AI客户端 | openai | 4.x | ✅ 已集成 |
| 语音合成 | Edge TTS | - | ✅ 已集成 |
| 数据库 | better-sqlite3 | - | ⬜ 待集成 |

---

## 4. 核心功能模块

### 4.1 已实现模块

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

### 4.2 爱弥斯角色设定

- **名字**：Aemeath / 爱弥斯 / 小爱
- **来源**：鸣潮 (Wuthering Waves)
- **性别**：女
- **出生地**：拉海洛
- **武器**：迅刀
- **属性**：热熔
- **所属**：星炬学院拉贝尔学部
- **共鸣能力**：长航的星辉
- **性格**：开朗乐观、俏皮可爱、勇敢坚定、关心他人

---

## 5. 项目结构

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
│       └── hooks/                  # React Hooks
├── tests/                           # 测试
├── docs/                            # 文档（12个）
├── start.ts                         # 启动脚本
├── package.json
├── tsconfig.json
└── README.md
```

---

## 6. 测试状态

```
✅ 97 pass
❌ 0 fail
```

---

## 7. 开发计划

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

## 8. 文档清单

### 根目录文档
| 文件 | 内容 |
|------|------|
| `README.md` | 项目介绍、快速开始 |
| `ARCHITECTURE.md` | 系统架构设计 |
| `CLI_DESIGN.md` | CLI界面设计 |
| `DEVELOPMENT_PLAN.md` | 完整开发计划（26周） |
| `CONTRIBUTING.md` | 贡献指南 |
| `CHANGELOG.md` | 更新日志 |
| `PROJECT_SNAPSHOT.md` | 项目快照（本文件） |

### docs目录
| 文件 | 内容 |
|------|------|
| `SETUP.md` | 环境搭建手册 |
| `PHASE1_DEVELOPMENT.md` | Phase 1 开发手册 |
| `LEARNING_GUIDE.md` | 项目学习文档 |
| `INSTALL.md` | 安装指南 |
| `USER_GUIDE.md` | 用户指南 |
| `DEVELOPMENT.md` | 开发者指南 |
| `API.md` | API文档 |
| `CONFIG.md` | 配置指南 |
| `FAQ.md` | 常见问题 |
| `TECH_REFERENCE.md` | 技术参考 |
| `DEPLOYMENT.md` | 部署指南 |
| `PRODUCTION_CHECKLIST.md` | 生产就绪清单 |
| `SELF_LEARNING.md` | 自我学习系统 |
| `MULTI_DEVICE_SYNC.md` | 多设备同步系统 |

---

## 9. 启动命令

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

## 10. 下一步行动

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

## 11. 已知问题

### Ink CLI 兼容性问题

- **问题**：Bun 运行时不支持 `process.stdin.setRawMode`，导致 Ink 无法正常工作
- **临时方案**：使用 `bun run start`（readline 版本）
- **长期方案**：参考 Claude Code 的自研 Ink 框架

### Claude Code 参考

Claude Code 使用了以下方案解决此问题：
1. `src/ink/` - 自研 Ink 终端渲染框架
2. `src/native-ts/` - 原生 TypeScript 桥接层
3. `src/parse-keypress.ts` - 自定义按键解析器

---

**项目状态**：✅ Phase 1 完成，可运行
**下次行动**：开始 Phase 2，实现工具系统
