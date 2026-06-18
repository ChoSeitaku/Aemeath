# Aemeath 项目快照

> 最后更新：2025-01-15
> 项目状态：设计完成，准备开发

---

## 1. 项目概述

| 项目 | 详情 |
|------|------|
| **名称** | Aemeath（爱弥斯/小爱） |
| **类型** | 个人AI助手（陪伴型） |
| **角色** | 鸣潮游戏中的爱弥斯角色 |
| **技术栈** | TypeScript + Ink + Bun |
| **AI模型** | DeepSeek V4 Flash |
| **预计工期** | 20周 |

---

## 2. 技术栈确认

| 组件 | 选择 | 版本 |
|------|------|------|
| 运行时 | Bun | latest |
| 语言 | TypeScript | 5.x |
| CLI框架 | Ink | 4.x |
| AI客户端 | openai | 4.x |
| 数据库 | better-sqlite3 | - |
| 配置 | Zod | 3.x |
| 向量DB | ChromaDB | - |

**参考项目**：Claude Code、Gemini CLI、MiMo Code（均为TypeScript）

---

## 3. 核心功能模块

### 3.1 已设计模块
- ✅ CLI界面（Ink组件化）
- ✅ 核心对话引擎
- ✅ 工具系统
- ✅ 记忆系统
- ✅ 陪伴型AI人格
- ✅ 语音交互
- ✅ 多模态支持
- ✅ 多设备同步（CRDT）
- ✅ 插件系统
- ✅ 自我学习与进化
- ✅ 安全与加密
- ✅ 主动式AI
- ✅ Loop Engineering
- ✅ 人类化AI

### 3.2 爱弥斯角色设定
- **名字**：Aemeath / 爱弥斯 / 小爱
- **来源**：鸣潮 (Wuthering Waves)
- **背景**：星炬学院隧者适格者
- **当前状态**：电子幽灵
- **共鸣能力**：长航的星辉
- **外观**：粉发金瞳
- **性格**：俏皮活泼、忠诚守护、开朗乐观

---

## 4. 文档清单（18个）

### 根目录文档
| 文件 | 内容 |
|------|------|
| `README.md` | 项目介绍、快速开始 |
| `ARCHITECTURE.md` | 系统架构设计 |
| `CLI_DESIGN.md` | CLI界面设计 |
| `DEVELOPMENT_PLAN.md` | 完整开发计划（20周） |
| `CONTRIBUTING.md` | 贡献指南 |
| `CHANGELOG.md` | 更新日志 |
| `LICENSE` | MIT许可证 |
| `package.json` | 依赖配置 |
| `tsconfig.json` | TypeScript配置 |
| `.env.example` | 环境变量模板 |
| `.gitignore` | Git忽略规则 |

### docs目录（11个）
| 文件 | 内容 |
|------|------|
| `INSTALL.md` | 安装指南 |
| `USER_GUIDE.md` | 用户指南 |
| `DEVELOPMENT.md` | 开发者指南 |
| `API.md` | API文档 |
| `CONFIG.md` | 配置指南 |
| `FAQ.md` | 常见问题 |
| `TECH_REFERENCE.md` | 技术参考（30+库） |
| `SELF_LEARNING.md` | 自我学习系统 |
| `MULTI_DEVICE_SYNC.md` | 多设备同步系统 |
| `DEPLOYMENT.md` | 部署指南 |
| `PRODUCTION_CHECKLIST.md` | 生产就绪清单 |

---

## 5. 开发计划（20周）

| Phase | 内容 | 时间 | 状态 |
|-------|------|------|------|
| 0 | 项目基础设施 | 第1周 | ⬜ |
| 1 | 核心对话引擎 | 第2-3周 | ⬜ |
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

---

## 6. 项目结构

```
aemeath/
├── src/
│   ├── index.ts                     # 入口
│   ├── cli/                         # CLI界面 (Ink)
│   │   ├── App.tsx                  # 主应用组件
│   │   ├── components/              # UI组件
│   │   └── hooks/                   # React Hooks
│   ├── core/                        # 核心引擎
│   ├── agent/                       # 代理系统
│   ├── tools/                       # 工具系统
│   ├── voice/                       # 语音系统
│   ├── multimodal/                  # 多模态
│   ├── sync/                        # 同步系统
│   ├── learning/                    # 自我学习系统
│   ├── plugin/                      # 插件系统
│   ├── security/                    # 安全系统
│   ├── i18n/                        # 国际化
│   └── utils/                       # 工具函数
├── tests/                           # 测试
├── docs/                            # 文档（11个）
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

## 8. 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      用户交互层                              │
├─────────────────────────────────────────────────────────────┤
│  CLI (Ink) · 语音 · Web UI                                 │
├─────────────────────────────────────────────────────────────┤
│                      核心引擎层                              │
├─────────────────────────────────────────────────────────────┤
│  对话管理 · 记忆系统 · 人格系统 · 工具调度                   │
├─────────────────────────────────────────────────────────────┤
│                      AI模型层                                │
├─────────────────────────────────────────────────────────────┤
│  DeepSeek V4 Flash · Whisper · Edge TTS                     │
├─────────────────────────────────────────────────────────────┤
│                      功能层                                  │
├─────────────────────────────────────────────────────────────┤
│  工具 · 语音 · 多模态 · 同步 · 学习 · 插件                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. 关键设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 技术栈 | TypeScript + Ink + Bun | 与Claude/Gemini/MiMo一致 |
| AI模型 | DeepSeek V4 Flash | 性价比高、兼容OpenAI格式 |
| CLI框架 | Ink | React组件化、声明式UI |
| 数据库 | SQLite + ChromaDB | 轻量、向量搜索 |
| 同步方案 | CRDT | 无冲突合并 |
| 人格系统 | 爱弥斯角色 | 鸣潮角色、陪伴型AI |

---

## 10. 下一步行动

### 立即行动
1. [ ] 安装 Bun 运行时
2. [ ] 初始化项目（`bun install`）
3. [ ] 开始 Phase 0：项目基础设施

### Phase 0 任务
1. [ ] 创建完整目录结构
2. [ ] 配置 TypeScript
3. [ ] 实现基础 CLI 框架（Ink）
4. [ ] 配置日志系统
5. [ ] 配置配置管理
6. [ ] 验证环境可运行

---

## 11. 参考资源

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

## 12. 注意事项

1. **版本控制**：使用 Git，每个 Phase 完成后提交
2. **测试驱动**：每个功能完成后立即编写测试
3. **文档同步**：代码变更时同步更新文档
4. **代码规范**：使用 ESLint + Prettier
5. **安全第一**：API 密钥等敏感信息不要提交到 Git

---

**项目状态**：✅ 设计完成，准备开发
**下次行动**：开始 Phase 0，搭建项目基础框架
