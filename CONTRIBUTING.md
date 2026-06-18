# 贡献指南

感谢你对 Aemeath 的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 报告 Bug

1. 在 [Issues](https://github.com/yourusername/aemeath/issues) 中搜索是否已有相同问题
2. 如果没有，创建新 Issue，包含：
   - 清晰的标题和描述
   - 复现步骤
   - 期望行为和实际行为
   - 环境信息（Python版本、操作系统等）
   - 错误日志（如有）

### 提交功能建议

1. 在 Issues 中创建新 Issue
2. 使用 `enhancement` 标签
3. 描述功能的用途和实现思路

### 提交代码

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'feat: add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 创建 Pull Request

## 开发规范

### 代码风格

- 使用 Black 格式化代码
- 使用 isort 排序导入
- 遵循 PEP 8 规范
- 添加类型注解

```bash
# 格式化代码
black src/ tests/

# 排序导入
isort src/ tests/

# 类型检查
mypy src/
```

### 提交信息

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构代码
- `test`: 添加测试
- `chore`: 构建/工具变更

示例：
```
feat(tools): add weather tool

Add a new tool for querying weather information.
Uses OpenWeatherMap API.

Closes #123
```

### 测试要求

- 新功能必须包含测试
- Bug 修复必须包含回归测试
- 测试覆盖率不低于 80%

```bash
# 运行测试
pytest

# 查看覆盖率
pytest --cov=src/aemeath --cov-report=html
```

## 项目结构

```
aemeath/
├── src/aemeath/         # 源代码
│   ├── cli/            # CLI界面
│   ├── core/           # 核心引擎
│   ├── tools/          # 工具系统
│   ├── voice/          # 语音系统
│   ├── proactive/      # 主动式AI系统
│   ├── loop/           # Loop Engineering系统
│   └── utils/          # 工具函数
├── tests/              # 测试
├── docs/               # 文档
└── scripts/            # 脚本
```

## 添加新工具

1. 在 `src/aemeath/tools/` 创建新文件
2. 继承 `BaseTool` 类
3. 实现 `execute` 方法
4. 在 `registry.py` 中注册
5. 添加测试
6. 更新文档

```python
from aemeath.tools.base import BaseTool

class WeatherTool(BaseTool):
    name = "weather"
    description = "查询天气信息"
    
    async def execute(self, city: str) -> str:
        # 实现查询逻辑
        return f"{city}的天气：晴，25°C"
```

## 添加新命令

1. 在 `src/aemeath/cli/commands/` 创建新文件
2. 继承 `BaseCommand` 类
3. 实现 `execute` 方法
4. 在 `commands/__init__.py` 中注册

```python
from aemeath.cli.base import BaseCommand

class MyCommand(BaseCommand):
    name = "my-command"
    description = "我的自定义命令"
    
    async def execute(self, args: list) -> str:
        return "命令执行结果"
```

## 文档贡献

- 修复错别字
- 改进说明
- 添加示例
- 翻译文档

## 行为准则

- 尊重每一位贡献者
- 接受建设性批评
- 专注于对社区最有利的事情
- 对其他社区成员表示同理心

## 获取帮助

- 提交 Issue
- 发送邮件至：your.email@example.com
- 加入 Discord 社区

## 许可证

贡献即表示你同意你的代码将在 MIT 许可证下发布。
