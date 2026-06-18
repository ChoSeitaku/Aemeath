# 安装指南

## 系统要求

- Python 3.11 或更高版本
- pip 或 poetry
- Git

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/yourusername/aemeath.git
cd aemeath
```

### 2. 创建虚拟环境

**Linux/Mac:**

```bash
python -m venv venv
source venv/bin/activate
```

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. 安装依赖

**使用 pip:**

```bash
pip install -e .
```

**使用 poetry:**

```bash
poetry install
```

### 4. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 必需配置
DEEPSEEK_API_KEY=your_deepseek_api_key

# 可选配置
WHISPER_API_KEY=your_whisper_api_key
TTS_VOICE=zh-CN-XiaoxiaoNeural
LOG_LEVEL=INFO
```

### 5. 验证安装

```bash
aemeath --version
```

## 获取API密钥

### DeepSeek API

1. 访问 [DeepSeek Platform](https://platform.deepseek.com/)
2. 注册并登录
3. 创建API密钥
4. 复制密钥到 `.env` 文件

### Whisper API (可选)

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 创建API密钥
3. 复制密钥到 `.env` 文件

## 高级安装

### 使用 Docker

```bash
docker build -t aemeath .
docker run -it -p 8000:8000 --env-file .env aemeath
```

### 从源码安装（开发模式）

```bash
git clone https://github.com/yourusername/aemeath.git
cd aemeath
pip install -e ".[dev]"
```

## 故障排除

### 依赖安装失败

```bash
# 升级pip
pip install --upgrade pip

# 清除缓存
pip cache purge

# 重新安装
pip install -e .
```

### 密钥错误

确保 `.env` 文件中的密钥格式正确，没有多余空格。

### 权限错误

在 Linux/Mac 上：

```bash
sudo chown -R $USER ~/.aemeath
```

## 下一步

安装完成后，请查看 [用户指南](USER_GUIDE.md) 了解如何使用。
