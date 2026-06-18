# Aemeath 环境搭建手册

> 完整的开发环境配置指南，让你快速启动 Aemeath 项目

---

## 目录

1. [系统要求](#1-系统要求)
2. [安装 Bun 运行时](#2-安装-bun-运行时)
3. [安装 Python 环境](#3-安装-python-环境)
4. [克隆项目](#4-克隆项目)
5. [安装依赖](#5-安装依赖)
6. [配置环境变量](#6-配置环境变量)
7. [获取 API 密钥](#7-获取-api-密钥)
8. [启动项目](#8-启动项目)
9. [开发工具配置](#9-开发工具配置)
10. [常见问题](#10-常见问题)

---

## 1. 系统要求

### 1.1 硬件要求

| 组件 | 最低要求 | 推荐配置 |
|------|----------|----------|
| CPU | 2核 | 4核+ |
| 内存 | 4GB | 8GB+ |
| 硬盘 | 10GB 可用空间 | 20GB+ SSD |
| 网络 | 需要互联网连接 | 稳定连接 |

### 1.2 软件要求

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| 操作系统 | Windows 10+ / macOS 12+ / Ubuntu 20.04+ | 跨平台支持 |
| Bun | latest | JavaScript 运行时 |
| Python | 3.11+ | 可选，用于 Python 版本 |
| Git | 2.30+ | 版本控制 |

---

## 2. 安装 Bun 运行时

### 2.1 Windows

```powershell
# 方法1: 使用 PowerShell (推荐)
powershell -c "irm bun.sh/install.ps1 | iex"

# 方法2: 使用 winget
winget install Oven-sh.Bun

# 方法3: 使用 npm
npm install -g bun
```

### 2.2 macOS

```bash
# 方法1: 使用 Homebrew (推荐)
brew install oven-sh/bun/bun

# 方法2: 使用官方脚本
curl -fsSL https://bun.sh/install | bash
```

### 2.3 Linux

```bash
# 方法1: 使用官方脚本 (推荐)
curl -fsSL https://bun.sh/install | bash

# 方法2: 使用 snap
sudo snap install bun
```

### 2.4 验证安装

```bash
# 检查版本
bun --version

# 输出示例: 1.0.0
```

---

## 3. 安装 Python 环境

> 如果只使用 TypeScript 版本，可跳过此步骤

### 3.1 安装 Python

```bash
# Windows: 从官网下载安装
# https://www.python.org/downloads/

# macOS
brew install python@3.11

# Ubuntu/Debian
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
```

### 3.2 验证安装

```bash
python3 --version
# 输出示例: Python 3.11.0

pip3 --version
# 输出示例: pip 23.0.0
```

---

## 4. 克隆项目

### 4.1 安装 Git

```bash
# Windows: 从官网下载安装
# https://git-scm.com/download/win

# macOS
brew install git

# Ubuntu/Debian
sudo apt install git
```

### 4.2 克隆仓库

```bash
# 克隆项目
git clone https://github.com/yourusername/aemeath.git

# 进入项目目录
cd aemeath

# 查看项目结构
ls -la
```

---

## 5. 安装依赖

### 5.1 TypeScript 依赖 (Bun)

```bash
# 安装所有依赖
bun install

# 或者使用 npm
npm install
```

### 5.2 Python 依赖 (可选)

```bash
# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 或者安装开发依赖
pip install -e ".[dev]"
```

### 5.3 验证依赖安装

```bash
# 检查 node_modules
ls node_modules

# 检查 bun lockfile
ls bun.lockb
```

---

## 6. 配置环境变量

### 6.1 创建 .env 文件

```bash
# 复制示例配置
cp .env.example .env

# 编辑配置文件
# Windows
notepad .env

# macOS
open -e .env

# Linux
nano .env
```

### 6.2 配置说明

```env
# ===========================================
# 必需配置
# ===========================================

# DeepSeek API密钥 (必须)
DEEPSEEK_API_KEY=your_api_key_here

# ===========================================
# 可选配置
# ===========================================

# 模型配置
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_BASE_URL=https://api.deepseek.com

# 语音配置
TTS_VOICE=zh-CN-XiaoxiaoNeural
WAKE_WORD=小爱

# 日志配置
LOG_LEVEL=INFO

# 数据目录
DATA_DIR=~/.aemeath/data
CACHE_DIR=~/.aemeath/cache
```

---

## 7. 获取 API 密钥

### 7.1 DeepSeek API (必须)

1. 访问 [DeepSeek Platform](https://platform.deepseek.com/)
2. 注册账号并登录
3. 进入 "API Keys" 页面
4. 点击 "Create API Key"
5. 复制生成的 API Key
6. 粘贴到 `.env` 文件的 `DEEPSEEK_API_KEY` 字段

**费用说明**：
- 新用户有免费额度
- 之后按使用量计费，约 $1-5/月

### 7.2 Whisper API (可选)

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册账号并登录
3. 进入 "API Keys" 页面
4. 创建 API Key
5. 粘贴到 `.env` 文件的 `WHISPER_API_KEY` 字段

**费用说明**：
- 按使用量计费，约 $5-10/月

### 7.3 Edge TTS (免费)

Edge TTS 是微软提供的免费语音合成服务，无需 API Key。

---

## 8. 启动项目

### 8.1 开发模式

```bash
# 使用 Bun 启动
bun run dev

# 或者直接运行
bun run src/index.ts
```

### 8.2 构建生产版本

```bash
# 构建可执行文件
bun run build

# 运行构建后的程序
./dist/aemeath

# 或者在 Windows
dist\aemeath.exe
```

### 8.3 Python 版本启动 (可选)

```bash
# 激活虚拟环境
source venv/bin/activate  # macOS/Linux
# 或
venv\Scripts\activate  # Windows

# 启动程序
python -m aemeath
# 或者
aemeath
```

### 8.4 验证启动

成功启动后，你会看到：

```
╭─────────────────────────────────────────────────────────────╮
│                                                             │
│     ╔═══════════════════════════════════════════════════╗   │
│     ║          A E M E A T H   v1.0.0                  ║   │
│     ║          爱弥斯 · 你的个人AI助手                  ║   │
│     ╚═══════════════════════════════════════════════════╝   │
│                                                             │
│     模型: deepseek-v4-flash                                 │
│     记忆: 0 条长期记忆                                      │
│     工具: calendar, email, files, search                    │
│                                                             │
│     输入 /help 查看命令 · /quit 退出                        │
│                                                             │
╰─────────────────────────────────────────────────────────────╯

❯ 
```

---

## 9. 开发工具配置

### 9.1 VS Code 配置

安装推荐扩展：

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "oven.bun-vscode"
  ]
}
```

### 9.2 ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

### 9.3 Prettier 配置

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

---

## 10. 常见问题

### 10.1 安装问题

#### Q: bun install 失败

```bash
# 清除缓存
bun install --force

# 或者删除 node_modules 重新安装
rm -rf node_modules
bun install
```

#### Q: sharp 安装失败

```bash
# Windows 需要安装 Visual C++ Build Tools
# 下载地址: https://visualstudio.microsoft.com/visual-cpp-build-tools/

# macOS
xcode-select --install

# Linux
sudo apt-get install build-essential
```

### 10.2 运行问题

#### Q: 启动时报错 "DEEPSEEK_API_KEY not found"

确保 `.env` 文件存在且包含有效的 API Key：

```bash
# 检查 .env 文件
cat .env

# 确保 API Key 格式正确
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
```

#### Q: 端口被占用

```bash
# 查找占用端口的进程
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# 杀死进程
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### 10.3 开发问题

#### Q: TypeScript 类型错误

```bash
# 运行类型检查
bun run typecheck

# 重新安装类型定义
bun install @types/bun @types/react
```

#### Q: ESLint 报错

```bash
# 自动修复
bun run lint:fix

# 或者手动检查
bun run lint
```

### 10.4 性能问题

#### Q: 启动速度慢

```bash
# 使用 --release 模式
bun run src/index.ts --release

# 或者构建后运行
bun run build
./dist/aemeath
```

#### Q: 内存占用高

```bash
# 检查内存使用
# Windows
tasklist /fi "imagename eq aemeath.exe"

# macOS/Linux
ps aux | grep aemeath
```

---

## 11. 开发工作流

### 11.1 日常开发

```bash
# 1. 启动开发服务器
bun run dev

# 2. 修改代码...

# 3. 运行测试
bun test

# 4. 检查代码质量
bun run lint
bun run typecheck

# 5. 构建生产版本
bun run build
```

### 11.2 代码提交

```bash
# 添加更改
git add .

# 提交更改
git commit -m "feat: 添加新功能"

# 推送到远程
git push origin main
```

### 11.3 版本发布

```bash
# 更新版本号
# 修改 package.json 中的 version 字段

# 创建标签
git tag -a v1.0.0 -m "Release v1.0.0"

# 推送标签
git push origin v1.0.0
```

---

## 12. 项目结构

```
aemeath/
├── src/                    # 源代码
│   ├── index.ts           # 入口文件
│   └── cli/               # CLI界面
│       └── App.tsx        # 主应用组件
├── docs/                  # 文档
├── tests/                 # 测试
├── .env.example          # 环境变量模板
├── .env                  # 环境变量 (不提交到Git)
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
├── README.md             # 项目说明
└── LICENSE               # 许可证
```

---

## 13. 获取帮助

### 13.1 文档

- [README.md](../README.md) - 项目介绍
- [ARCHITECTURE.md](../ARCHITECTURE.md) - 架构设计
- [CONTRIBUTING.md](../CONTRIBUTING.md) - 贡献指南
- [FAQ.md](FAQ.md) - 常见问题

### 13.2 社区

- GitHub Issues: https://github.com/yourusername/aemeath/issues
- Discord: https://discord.gg/your-invite

### 13.3 联系方式

- Email: your.email@example.com

---

## 14. 下一步

环境搭建完成后，建议按以下顺序开始开发：

1. **Phase 1**: 核心对话引擎 - 实现基础对话功能
2. **Phase 2**: 工具系统 - 集成常用工具
3. **Phase 3**: 记忆系统 - 实现记忆功能
4. **Phase 4**: 陪伴型AI人格 - 创建爱弥斯人格

详细开发计划请查看 [DEVELOPMENT_PLAN.md](../DEVELOPMENT_PLAN.md)

---

**最后更新**: 2025-01-15
**维护者**: Aemeath Team
