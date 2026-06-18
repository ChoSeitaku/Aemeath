# 技术参考文档

> Aemeath 项目技术栈参考，包含推荐的库、框架和最佳实践

## 1. 核心框架

### 1.1 AI模型调用

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `openai` | >=1.0.0 | OpenAI/DeepSeek API客户端 | [github.com/openai/openai-python](https://github.com/openai/openai-python) |
| `httpx` | >=0.24.0 | 异步HTTP客户端 | [github.com/encode/httpx](https://github.com/encode/httpx) |
| `litellm` | >=1.0.0 | 多模型统一接口 | [github.com/BerriAI/litellm](https://github.com/BerriAI/litellm) |

**推荐**：使用 `openai` 库，DeepSeek 兼容 OpenAI 格式。

```python
from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key="your-deepseek-api-key",
    base_url="https://api.deepseek.com"
)

response = await client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[{"role": "user", "content": "你好"}],
    stream=True
)
```

### 1.2 语音处理

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `openai-whisper` | >=20230918 | 语音识别(STT) | [github.com/openai/whisper](https://github.com/openai/whisper) |
| `edge-tts` | >=6.0.0 | 微软TTS语音合成 | [github.com/rany2/edge-tts](https://github.com/rany2/edge-tts) |
| `RealtimeSTT` | >=0.1.0 | 实时语音识别 | [github.com/KoljaB/RealtimeSTT](https://github.com/KoljaB/RealtimeSTT) |
| `pyaudio` | >=0.2.14 | 音频输入输出 | [pypi.org/project/PyAudio](https://pypi.org/project/PyAudio/) |
| `sounddevice` | >=0.4.6 | 音频播放 | [github.com/sporsounddevice](https://github.com/spatialaudio/python-sounddevice) |
| `vosk` | >=0.3.45 | 离线语音识别 | [github.com/alphacep/vosk-api](https://github.com/alphacep/vosk-api) |

**推荐组合**：
- **云端方案**：Whisper API + Edge TTS（高质量）
- **本地方案**：RealtimeSTT + Edge TTS（低延迟）
- **离线方案**：Vosk + pyttsx3（无需网络）

```python
# Edge TTS 语音合成示例
import edge_tts
import asyncio

async def text_to_speech(text: str, output_file: str):
    communicate = edge_tts.Communicate(text, "zh-CN-XiaoxiaoNeural")
    await communicate.save(output_file)

# 使用
asyncio.run(text_to_speech("你好，漂泊者！", "output.mp3"))
```

### 1.3 向量数据库（记忆系统）

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `chromadb` | >=0.4.0 | 轻量级向量数据库 | [github.com/chroma-core/chroma](https://github.com/chroma-core/chroma) |
| `faiss-cpu` | >=1.7.4 | Facebook向量搜索 | [github.com/facebookresearch/faiss](https://github.com/facebookresearch/faiss) |
| `milvus` | >=2.3.0 | 分布式向量数据库 | [github.com/milvus-io/milvus](https://github.com/milvus-io/milvus) |
| `pinecone-client` | >=2.0.0 | 云向量数据库 | [pypi.org/project/pinecone-client](https://pypi.org/project/pinecone-client/) |

**推荐**：ChromaDB（本地部署，轻量级，易于使用）。

```python
import chromadb

# 创建客户端
client = chromadb.Client()

# 创建集合
collection = client.create_collection("memories")

# 添加记忆
collection.add(
    documents=["用户喜欢喝咖啡", "用户是软件工程师"],
    ids=["mem1", "mem2"],
    metadatas=[{"type": "preference"}, {"type": "info"}]
)

# 搜索记忆
results = collection.query(
    query_texts=["用户的爱好"],
    n_results=2
)
```

### 1.4 数据库

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `sqlite3` | 内置 | 轻量级关系数据库 | - |
| `aiosqlite` | >=0.19.0 | 异步SQLite | [github.com/omnilib/aiosqlite](https://github.com/omnilib/aiosqlite) |
| `sqlalchemy` | >=2.0.0 | ORM框架 | [github.com/sqlalchemy/sqlalchemy](https://github.com/sqlalchemy/sqlalchemy) |

**推荐**：aiosqlite（异步）+ SQLAlchemy（ORM）。

---

## 2. CLI框架

### 2.1 终端UI

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `rich` | >=13.0.0 | 终端富文本渲染 | [github.com/Textualize/rich](https://github.com/Textualize/rich) |
| `textual` | >=0.40.0 | 终端应用框架 | [github.com/Textualize/textual](https://github.com/Textualize/textual) |
| `click` | >=8.0.0 | CLI命令框架 | [github.com/pallets/click](https://github.com/pallets/click) |
| `typer` | >=0.9.0 | 类型安全CLI | [github.com/tiangolo/typer](https://github.com/tiangolo/typer) |
| `prompt_toolkit` | >=3.0.0 | 交互式输入 | [github.com/prompt-toolkit/python-prompt-toolkit](https://github.com/prompt-toolkit/python-prompt-toolkit) |

**推荐组合**：
- **Rich**：终端渲染（流式输出、语法高亮）
- **Click/Typer**：命令解析
- **prompt_toolkit**：交互式输入（自动补全、历史）

```python
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown

console = Console()

# 流式输出
async def stream_response(text: str):
    with console.status("[bold green]思考中..."):
        # 模拟流式输出
        for char in text:
            print(char, end="", flush=True)
            await asyncio.sleep(0.02)
    print()

# 面板输出
console.print(Panel(
    Markdown("# 你好\n这是**爱弥斯**的回复"),
    border_style="green"
))
```

### 2.2 输入处理

```python
from prompt_toolkit import PromptSession
from prompt_toolkit.completion import WordCompleter

# 命令自动补全
commands = ["/help", "/clear", "/quit", "/memory", "/voice"]
completer = WordCompleter(commands)

# 交互式输入
session = PromptSession(completer=completer)
user_input = await session.prompt_async("❯ ")
```

---

## 3. 配置管理

### 3.1 配置库

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `pydantic` | >=2.0.0 | 数据验证 | [github.com/pydantic/pydantic](https://github.com/pydantic/pydantic) |
| `pydantic-settings` | >=2.0.0 | 环境变量配置 | [github.com/pydantic/pydantic-settings](https://github.com/pydantic/pydantic-settings) |
| `python-dotenv` | >=1.0.0 | .env文件加载 | [github.com/theskumar/python-dotenv](https://github.com/theskumar/python-dotenv) |
| `pyyaml` | >=6.0 | YAML配置 | [pypi.org/project/PyYAML](https://pypi.org/project/PyYAML/) |
| `tomli` | >=2.0.0 | TOML配置 | [pypi.org/project/tomli](https://pypi.org/project/tomli/) |

**推荐**：Pydantic Settings + python-dotenv。

```python
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # DeepSeek配置
    deepseek_api_key: str = Field(..., env="DEEPSEEK_API_KEY")
    deepseek_model: str = "deepseek-v4-flash"
    deepseek_base_url: str = "https://api.deepseek.com"
    
    # 语音配置
    tts_voice: str = "zh-CN-XiaoxiaoNeural"
    wake_word: str = "小爱"
    
    # 记忆配置
    memory_max_items: int = 1000
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# 使用
settings = Settings()
print(settings.deepseek_api_key)
```

---

## 4. 安全与加密

### 4.1 加密库

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `cryptography` | >=41.0.0 | 加密工具 | [github.com/pyca/cryptography](https://github.com/pyca/cryptography) |
| `pyjwt` | >=2.8.0 | JWT令牌 | [github.com/jpadilla/pyjwt](https://github.com/jpadilla/pyjwt) |
| `passlib` | >=1.7.4 | 密码哈希 | [github.com/roryc89/passlib](https://github.com/roryc89/passlib) |

```python
from cryptography.fernet import Fernet

# 生成密钥
key = Fernet.generate_key()
cipher_suite = Fernet(key)

# 加密
encrypted = cipher_suite.encrypt(b"sensitive data")

# 解密
decrypted = cipher_suite.decrypt(encrypted)
```

---

## 5. 多模态处理

### 5.1 图像处理

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `Pillow` | >=10.0.0 | 图像处理 | [github.com/python-pillow/Pillow](https://github.com/python-pillow/Pillow) |
| `opencv-python` | >=4.8.0 | 计算机视觉 | [github.com/opencv/opencv-python](https://github.com/opencv/opencv-python) |
| `pytesseract` | >=0.3.10 | OCR文字识别 | [github.com/madmaze/pytesseract](https://github.com/madmaze/pytesseract) |

### 5.2 文档处理

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `PyPDF2` | >=3.0.0 | PDF解析 | [github.com/py-pdf/PyPDF2](https://github.com/py-pdf/PyPDF2) |
| `python-docx` | >=0.8.11 | Word解析 | [github.com/python-openxml/python-docx](https://github.com/python-openxml/python-docx) |
| `openpyxl` | >=3.1.0 | Excel解析 | [github.com/openpyxl/openpyxl](https://github.com/openpyxl/openpyxl) |
| `pdfplumber` | >=0.10.0 | PDF高级解析 | [github.com/jsvine/pdfplumber](https://github.com/jsvine/pdfplumber) |

---

## 6. 智能家居集成

### 6.1 Home Assistant

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `homeassistant` | >=2024.0 | HA核心 | [github.com/home-assistant/core](https://github.com/home-assistant/core) |
| `ha-api` | - | HA REST API | [home-assistant.io/developers/rest_api](https://developers.home-assistant.io/docs/api/) |
| `mqtt` | >=1.6.0 | MQTT协议 | [github.com/eclipse-paho/paho.mqtt.python](https://github.com/eclipse-paho/paho.mqtt.python) |

```python
import aiohttp

class HomeAssistantClient:
    def __init__(self, url: str, token: str):
        self.url = url
        self.headers = {"Authorization": f"Bearer {token}"}
    
    async def get_states(self):
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.url}/api/states",
                headers=self.headers
            ) as resp:
                return await resp.json()
    
    async def call_service(self, domain: str, service: str, entity_id: str):
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.url}/api/services/{domain}/{service}",
                headers=self.headers,
                json={"entity_id": entity_id}
            ) as resp:
                return await resp.json()
```

---

## 7. 插件系统

### 7.1 插件架构模式

```python
from abc import ABC, abstractmethod
from typing import Dict, Any, List
import importlib
from pathlib import Path

class Plugin(ABC):
    """插件基类"""
    
    name: str
    version: str
    description: str
    
    @abstractmethod
    async def initialize(self, context: Dict[str, Any]):
        """初始化插件"""
        pass
    
    @abstractmethod
    async def shutdown(self):
        """关闭插件"""
        pass

class PluginManager:
    """插件管理器"""
    
    def __init__(self, plugin_dir: str):
        self.plugin_dir = Path(plugin_dir)
        self.plugins: Dict[str, Plugin] = {}
    
    async def load_plugins(self):
        """加载所有插件"""
        for plugin_file in self.plugin_dir.glob("*.py"):
            if plugin_file.name.startswith("_"):
                continue
            
            # 动态导入
            spec = importlib.util.spec_from_file_location(
                plugin_file.stem,
                plugin_file
            )
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            
            # 注册插件
            if hasattr(module, "plugin"):
                plugin = module.plugin
                await plugin.initialize({})
                self.plugins[plugin.name] = plugin
    
    async def call_hook(self, hook_name: str, *args, **kwargs):
        """调用钩子"""
        results = []
        for plugin in self.plugins.values():
            if hasattr(plugin, hook_name):
                result = await getattr(plugin, hook_name)(*args, **kwargs)
                results.append(result)
        return results
```

---

## 8. 异步编程最佳实践

### 8.1 异步模式

```python
import asyncio
from typing import List, Any

# 1. 并发执行
async def process_concurrently(items: List[Any]):
    tasks = [process_item(item) for item in items]
    return await asyncio.gather(*tasks)

# 2. 超时控制
async def with_timeout(coro, timeout: float):
    try:
        return await asyncio.wait_for(coro, timeout=timeout)
    except asyncio.TimeoutError:
        return None

# 3. 任务组
async def process_with_task_group():
    async with asyncio.TaskGroup() as tg:
        task1 = tg.create_task(fetch_data())
        task2 = tg.create_task(process_data())
    return task1.result(), task2.result()

# 4. 异步队列
async def producer_consumer():
    queue = asyncio.Queue()
    
    async def producer():
        for i in range(10):
            await queue.put(i)
        await queue.put(None)  # 结束信号
    
    async def consumer():
        while True:
            item = await queue.get()
            if item is None:
                break
            await process(item)
    
    await asyncio.gather(producer(), consumer())
```

### 8.2 错误处理

```python
import asyncio
from typing import Optional, TypeVar

T = TypeVar('T')

async def retry_with_backoff(
    coro,
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 30.0
) -> Optional[T]:
    """带指数退避的重试"""
    for attempt in range(max_retries):
        try:
            return await coro
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            
            delay = min(base_delay * (2 ** attempt), max_delay)
            await asyncio.sleep(delay)
    
    return None
```

---

## 9. 测试最佳实践

### 9.1 测试框架

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `pytest` | >=7.0.0 | 测试框架 | [github.com/pytest-dev/pytest](https://github.com/pytest-dev/pytest) |
| `pytest-asyncio` | >=0.21.0 | 异步测试 | [github.com/pytest-dev/pytest-asyncio](https://github.com/pytest-dev/pytest-asyncio) |
| `pytest-cov` | >=4.0.0 | 覆盖率 | [github.com/pytest-dev/pytest-cov](https://github.com/pytest-dev/pytest-cov) |
| `pytest-mock` | >=3.10.0 | Mock | [github.com/pytest-dev/pytest-mock](https://github.com/pytest-dev/pytest-mock) |

### 9.2 测试示例

```python
import pytest
from unittest.mock import AsyncMock, patch

@pytest.fixture
def mock_api():
    with patch("aemeath.core.engine.AsyncOpenAI") as mock:
        yield mock

@pytest.mark.asyncio
async def test_conversation(mock_api):
    # Arrange
    mock_api.return_value.chat.completions.create = AsyncMock(
        return_value=AsyncMock(
            choices=[AsyncMock(message=AsyncMock(content="你好！"))]
        )
    )
    
    # Act
    from aemeath.core.engine import AemeathEngine
    engine = AemeathEngine()
    response = await engine.chat("你好")
    
    # Assert
    assert response == "你好！"
```

---

## 10. 代码质量工具

### 10.1 工具配置

| 工具 | 用途 | 配置文件 |
|------|------|----------|
| `black` | 代码格式化 | `pyproject.toml` |
| `isort` | 导入排序 | `pyproject.toml` |
| `mypy` | 类型检查 | `pyproject.toml` |
| `flake8` | 代码检查 | `.flake8` |
| `ruff` | 快速Lint | `pyproject.toml` |
| `pre-commit` | Git钩子 | `.pre-commit-config.yaml` |

### 10.2 pyproject.toml 配置

```toml
[tool.black]
line-length = 88
target-version = ['py311']

[tool.isort]
profile = "black"
known_first_party = ["aemeath"]

[tool.mypy]
python_version = "3.11"
warn_return_any = true
disallow_untyped_defs = true

[tool.ruff]
line-length = 88
select = ["E", "F", "I", "N", "W"]
```

---

## 11. 相关开源项目

### 11.1 AI助手项目

| 项目 | 描述 | GitHub |
|------|------|--------|
| `open-interpreter` | 本地代码执行助手 | [github.com/OpenInterpreter/open-interpreter](https://github.com/OpenInterpreter/open-interpreter) |
| `khoj` | 个人AI助手 | [github.com/khoj-ai/khoj](https://github.com/khoj-ai/khoj) |
| `private-gpt` | 私有文档AI | [github.com/zylon-ai/private-gpt](https://github.com/zaron-ai/private-gpt) |
| `localai` | 本地AI API | [github.com/mudler/LocalAI](https://github.com/mudler/LocalAI) |

### 11.2 语音助手项目

| 项目 | 描述 | GitHub |
|------|------|--------|
| `speech-assistant-openai-realtime-api-python` | OpenAI实时语音助手 | [github.com/twilio-samples/speech-assistant-openai-realtime-api-python](https://github.com/twilio-samples/speech-assistant-openai-realtime-api-python) |
| `RealtimeSTT` | 实时语音转文字 | [github.com/KoljaB/RealtimeSTT](https://github.com/KoljaB/RealtimeSTT) |
| `voice-assistant` | Python语音助手 | [github.com/ElSaico/voice-assistant](https://github.com/ElSaico/voice-assistant) |

### 11.3 智能家居项目

| 项目 | 描述 | GitHub |
|------|------|--------|
| `home-assistant` | 智能家居平台 | [github.com/home-assistant/core](https://github.com/home-assistant/core) |
| `appdaemon` | HA Python自动化 | [github.com/appdaemon/appdaemon](https://github.com/appdaemon/appdaemon) |

### 11.4 Agent框架

| 项目 | 描述 | GitHub |
|------|------|--------|
| `crewAI` | 多Agent协作框架 | [github.com/crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| `autogen` | 多Agent对话 | [github.com/microsoft/autogen](https://github.com/microsoft/autogen) |
| `langchain` | LLM应用框架 | [github.com/langchain-ai/langchain](https://github.com/langchain-ai/langchain) |

---

## 12. 主动式AI技术参考

### 12.1 预测模型库

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `scikit-learn` | >=1.3.0 | 传统机器学习 | [github.com/scikit-learn/scikit-learn](https://github.com/scikit-learn/scikit-learn) |
| `prophet` | >=1.1.0 | 时间序列预测 | [github.com/facebook/prophet](https://github.com/facebook/prophet) |
| `statsmodels` | >=0.14.0 | 统计模型 | [github.com/statsmodels/statsmodels](https://github.com/statsmodels/statsmodels) |

### 12.2 情境感知库

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `numpy` | >=1.24.0 | 数值计算 | [github.com/numpy/numpy](https://github.com/numpy/numpy) |
| `pandas` | >=2.0.0 | 数据处理 | [github.com/pandas-dev/pandas](https://github.com/pandas-dev/pandas) |
| `datetime` | 内置 | 时间处理 | - |

### 12.3 推荐系统库

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `surprise` | >=1.1.3 | 推荐系统 | [github.com/NicolasHug/Surprise](https://github.com/NicolasHug/Surprise) |
| `lightfm` | >=1.17 | 混合推荐 | [github.com/lyst/lightfm](https://github.com/lyst/lightfm) |

### 12.4 主动式AI最佳实践

```python
# 预测模型示例
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

class UserNeedPredictor:
    """用户需求预测器"""
    
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100)
    
    async def train(self, features, labels):
        """训练模型"""
        X_train, X_test, y_train, y_test = train_test_split(
            features, labels, test_size=0.2
        )
        self.model.fit(X_train, y_train)
        accuracy = self.model.score(X_test, y_test)
        return accuracy
    
    async def predict(self, features):
        """预测"""
        return self.model.predict_proba(features)
```

---

## 13. Loop Engineering技术参考

### 13.1 反馈循环库

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `asyncio` | 内置 | 异步循环管理 | - |
| `schedule` | >=1.2.0 | 定时任务调度 | [github.com/dbader/schedule](https://github.com/dbader/schedule) |
| `apscheduler` | >=3.10.0 | 高级任务调度 | [github.com/agronholm/apscheduler](https://github.com/agronholm/apscheduler) |

### 13.2 监控与指标库

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `prometheus-client` | >=0.17.0 | 指标收集 | [github.com/prometheus/client_python](https://github.com/prometheus/client_python) |
| `statsd` | >=3.7.0 | 统计数据 | [github.com/jsocol/pystatsd](https://github.com/jsocol/pystatsd) |

### 13.3 A/B测试库

| 库 | 版本 | 用途 | GitHub |
|---|------|------|--------|
| `expvar` | 内置 | 实验变量 | - |
| `scipy` | >=1.10.0 | 统计分析 | [github.com/scipy/scipy](https://github.com/scipy/scipy) |

### 13.4 Loop Engineering最佳实践

```python
# 反馈循环示例
import asyncio
from datetime import datetime

class FeedbackLoop:
    """反馈循环"""
    
    def __init__(self, interval_seconds: int = 60):
        self.interval = interval_seconds
        self.running = False
        self.iteration_count = 0
    
    async def start(self):
        """启动循环"""
        self.running = True
        
        while self.running:
            try:
                await self.execute_iteration()
                self.iteration_count += 1
            except Exception as e:
                print(f"循环错误: {e}")
            
            await asyncio.sleep(self.interval)
    
    async def execute_iteration(self):
        """执行一次迭代"""
        # 观察
        data = await self.observe()
        
        # 分析
        analysis = await self.analyze(data)
        
        # 决策
        decision = await self.decide(analysis)
        
        # 执行
        result = await self.act(decision)
        
        # 反馈
        await self.feedback(result)
    
    async def observe(self):
        """观察"""
        return {"timestamp": datetime.now()}
    
    async def analyze(self, data):
        """分析"""
        return {"analysis": "complete"}
    
    async def decide(self, analysis):
        """决策"""
        return {"action": "optimize"}
    
    async def act(self, decision):
        """执行"""
        return {"result": "success"}
    
    async def feedback(self, result):
        """反馈"""
        pass
    
    def stop(self):
        """停止循环"""
        self.running = False
```

---

## 14. 最佳实践总结

### 14.1 项目结构

```
aemeath/
├── src/aemeath/          # 源代码（src布局）
│   ├── __init__.py
│   ├── proactive/        # 主动式AI系统
│   ├── loop/             # Loop Engineering系统
│   └── ...
├── tests/                # 测试
├── docs/                 # 文档
├── pyproject.toml        # 项目配置
├── .env.example          # 环境变量模板
└── README.md
```

### 14.2 依赖管理

- 使用 `pyproject.toml` 管理依赖
- 区分核心依赖和可选依赖
- 使用 `requirements.txt` 作为备选

### 14.3 代码规范

- 使用 `black` 格式化代码
- 使用 `isort` 排序导入
- 使用 `mypy` 进行类型检查
- 遵循 PEP 8 规范

### 14.4 异步优先

- 使用 `async/await` 处理I/O操作
- 使用 `asyncio.gather` 并发执行
- 添加适当的超时控制

### 14.5 安全实践

- 使用环境变量存储敏感信息
- 加密存储用户数据
- 实现权限管理
- 定期更新依赖

---

**最后更新**：2025-01-15
