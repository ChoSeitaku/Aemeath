# 开发指南

## 环境设置

### 前置要求

- Python 3.11+
- Poetry 或 pip
- Git

### 开发环境安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/aemeath.git
cd aemeath

# 创建虚拟环境
python -m venv venv
source venv/bin/activate

# 安装开发依赖
pip install -e ".[dev]"

# 安装pre-commit钩子
pre-commit install
```

## 代码规范

### 代码风格

- 使用 Black 格式化代码
- 使用 isort 排序导入
- 使用 mypy 进行类型检查
- 遵循 PEP 8 规范

```bash
# 格式化代码
black src/ tests/

# 排序导入
isort src/ tests/

# 类型检查
mypy src/

# 代码检查
flake8 src/ tests/
```

### 提交规范

使用 Conventional Commits：

```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
test: 添加测试
chore: 构建/工具变更
```

## 项目结构

```
src/aemeath/
├── __init__.py
├── main.py              # 入口
├── cli/                 # CLI界面
├── core/                # 核心引擎
├── tools/               # 工具系统
├── voice/               # 语音系统
├── multimodal/          # 多模态
├── sync/                # 同步系统
├── plugin/              # 插件系统
├── security/            # 安全系统
├── i18n/                # 国际化
├── network/             # 网络系统
└── utils/               # 工具函数
```

## 添加新功能

### 1. 添加新工具

在 `src/aemeath/tools/` 目录下创建新文件：

```python
# src/aemeath/tools/my_tool.py

from aemeath.tools.base import BaseTool

class MyTool(BaseTool):
    name = "my_tool"
    description = "我的自定义工具"
    
    async def execute(self, **kwargs) -> str:
        # 实现工具逻辑
        return "执行结果"
```

注册工具：

```python
# src/aemeath/tools/registry.py

from aemeath.tools.my_tool import MyTool

def register_tools():
    registry.register(MyTool())
```

### 2. 添加新命令

在 `src/aemeath/cli/` 目录下：

```python
# src/aemeath/cli/commands/my_command.py

from aemeath.cli.base import BaseCommand

class MyCommand(BaseCommand):
    name = "my_command"
    description = "我的自定义命令"
    
    async def execute(self, args: list) -> str:
        # 实现命令逻辑
        return "命令结果"
```

### 3. 添加新人格

在 `src/aemeath/core/personality.py` 中：

```python
PERSONALITIES["my_personality"] = {
    "description": "我的人格",
    "greeting_style": "打招呼风格",
    "response_style": "回应风格",
    "emoji_usage": "表情使用",
    "example": "示例对话"
}
```

## 测试

### 运行测试

```bash
# 运行所有测试
pytest

# 运行单元测试
pytest tests/unit/

# 运行集成测试
pytest tests/integration/

# 运行端到端测试
pytest tests/e2e/

# 生成覆盖率报告
pytest --cov=src/aemeath --cov-report=html
```

### 编写测试

```python
# tests/unit/test_my_feature.py

import pytest
from aemeath.core.my_feature import MyFeature

class TestMyFeature:
    @pytest.fixture
    def feature(self):
        return MyFeature()
    
    async def test_basic_functionality(self, feature):
        result = await feature.do_something()
        assert result is not None
    
    async def test_edge_case(self, feature):
        with pytest.raises(ValueError):
            await feature.do_something_invalid()
```

## 文档

### 生成文档

```bash
# 安装文档依赖
pip install -e ".[docs]"

# 生成API文档
mkdocs build

# 本地预览
mkdocs serve
```

### 文档结构

```
docs/
├── index.md           # 首页
├── install/           # 安装指南
├── user/              # 用户指南
├── dev/               # 开发指南
├── api/               # API文档
└── changelog/         # 更新日志
```

## 发布

### 版本号

使用语义化版本号：`MAJOR.MINOR.PATCH`

- MAJOR: 不兼容的API变更
- MINOR: 向后兼容的功能添加
- PATCH: 向后兼容的bug修复

### 发布流程

```bash
# 更新版本号
bump2version major/minor/patch

# 创建发布标签
git tag -a v1.0.0 -m "Release v1.0.0"

# 推送标签
git push origin v1.0.0

# 构建发布包
python -m build

# 发布到PyPI
twine upload dist/*
```

## 贡献流程

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/my-feature`
3. 提交更改：`git commit -m 'feat: add my feature'`
4. 推送分支：`git push origin feature/my-feature`
5. 创建 Pull Request

### PR 检查清单

- [ ] 代码符合项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 所有测试通过
- [ ] 没有引入新的警告

## 性能优化

### 缓存策略

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_function():
    pass
```

### 异步优化

```python
import asyncio

async def process_items(items):
    tasks = [process_item(item) for item in items]
    return await asyncio.gather(*tasks)
```

## 调试

### 启用调试模式

```bash
aemeath --debug
```

### 日志配置

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### 使用 debugger

```python
import pdb; pdb.set_trace()  # Python debugger

# 或使用 breakpoint() (Python 3.7+)
breakpoint()
```

## 常见问题

### Q: 如何添加新的AI模型？

A: 在 `src/aemeath/core/models/` 目录下创建新的模型适配器。

### Q: 如何自定义UI？

A: 修改 `src/aemeath/cli/` 目录下的渲染器。

### Q: 如何调试API调用？

A: 启用调试模式并查看日志输出。

## 资源

- [Python 文档](https://docs.python.org/)
- [Rich 库文档](https://rich.readthedocs.io/)
- [Click 库文档](https://click.palletsprojects.com/)
- [OpenAI API 文档](https://platform.openai.com/docs)
