# 常见问题

## 安装问题

### Q: 安装时提示 "Python version not supported"

A: Aemeath 需要 Python 3.11 或更高版本。请检查你的 Python 版本：

```bash
python --version
```

如果版本过低，请升级 Python。

### Q: pip install 失败

A: 尝试以下步骤：

```bash
# 升级 pip
pip install --upgrade pip

# 清除缓存
pip cache purge

# 重新安装
pip install -e .
```

### Q: 缺少系统依赖

A: 某些功能需要系统依赖：

**Windows:**
```bash
# 安装 Visual C++ Build Tools
```

**Linux:**
```bash
sudo apt-get install python3-dev portaudio19-dev
```

**Mac:**
```bash
brew install portaudio
```

## 配置问题

### Q: API 密钥无效

A: 检查以下几点：

1. 密钥是否正确复制，没有多余空格
2. 密钥是否过期
3. 账户是否有足够余额

### Q: 配置文件不生效

A: 配置文件位置和优先级：

1. 命令行参数（最高优先级）
2. 环境变量
3. 项目配置 `./aemeath.yaml`
4. 全局配置 `~/.aemeath/config.yaml`
5. 默认值（最低优先级）

### Q: 如何重置配置？

A: 使用命令：

```bash
aemeath --reset-config
```

或手动删除配置文件：

```bash
rm ~/.aemeath/config.yaml
```

## 使用问题

### Q: 语音不工作

A: 检查以下几点：

1. 麦克风权限是否开启
2. 音频设备是否正常
3. 语音功能是否启用

```bash
# 检查语音配置
❯ /voice config
```

### Q: 工具调用失败

A: 检查工具配置：

```bash
# 查看工具状态
❯ /tools

# 测试工具
❯ /tool calendar test
```

### Q: 记忆不保存

A: 检查记忆系统：

```bash
# 查看记忆状态
❯ /memory

# 手动保存记忆
❯ /remember 测试记忆
```

### Q: 响应速度慢

A: 可能的原因：

1. 网络延迟
2. API 服务繁忙
3. 上下文过长

建议：
- 使用更快的网络
- 清空对话历史：`/clear`
- 减少上下文长度

## 个性化问题

### Q: 如何切换人格？

A: 使用命令：

```bash
❯ /personality friendly    # 友好亲切
❯ /personality professional # 专业正式
❯ /personality casual      # 轻松随意
❯ /personality humorous    # 幽默风趣
❯ /personality tsundere    # 傲娇
❯ /personality genki       # 元气满满
```

### Q: 人格会进化吗？

A: 是的！Aemeath 会从交互中学习，逐渐形成独特的相处模式。

### Q: 如何查看关系状态？

A: 使用命令：

```bash
❯ /relationship
```

## 多设备问题

### Q: 如何同步数据？

A: 启用同步功能：

```yaml
# config.yaml
sync:
  enabled: true
  server:
    url: https://sync.aemeath.com
    token: your_token
```

然后使用命令：

```bash
❯ /sync
```

### Q: 如何添加新设备？

A: 在新设备上安装 Aemeath 并登录同一账户，数据会自动同步。

## 开发问题

### Q: 如何贡献代码？

A: 请查看 [CONTRIBUTING.md](../CONTRIBUTING.md)。

### Q: 如何运行测试？

A: 使用 pytest：

```bash
# 运行所有测试
pytest

# 运行特定测试
pytest tests/unit/test_conversation.py

# 查看覆盖率
pytest --cov=src/aemeath
```

### Q: 如何添加新工具？

A: 请查看 [开发指南](DEVELOPMENT.md#添加新工具)。

## 主动式AI问题

### Q: 什么是主动式AI？

A: 主动式AI是一种能够预测用户需求、主动提供帮助的智能系统。它通过分析用户行为模式、情境信息等，提前预判用户可能需要的帮助。

### Q: 主动式AI如何工作？

A: 主动式AI通过以下方式工作：

1. **感知** - 收集时间、行为、环境等情境信息
2. **分析** - 识别用户行为模式和趋势
3. **预测** - 预测用户未来可能的需求
4. **干预** - 在合适的时机提供帮助

### Q: 如何配置主动式AI？

A: 使用命令：

```bash
❯ /proactive config
```

可以调整干预级别、静默时段、专注保护等设置。

### Q: 主动式AI会打扰我吗？

A: 主动式AI设计时考虑了用户干扰最小化：

- 可调节干预级别（最小化/中等/积极）
- 支持静默时段设置
- 专注工作时自动减少干扰
- 用户可以随时关闭特定功能

### Q: 主动式AI如何学习？

A: 主动式AI通过以下方式学习：

- 分析用户对干预的反馈
- 记录预测准确率
- 根据用户偏好调整策略
- 持续优化预测模型

### Q: 主动式AI的隐私如何保护？

A: 主动式AI采用以下隐私保护措施：

- 所有数据本地处理（默认）
- 自动匿名化敏感数据
- 用户可以控制数据保留时间
- 支持随时清除学习数据

### Q: 如何查看主动式AI的学习效果？

A: 使用命令：

```bash
❯ /proactive status
❯ /proactive predictions
❯ /proactive interventions
```

可以查看预测准确率、干预成功率等统计信息。

## Loop Engineering问题

### Q: 什么是Loop Engineering？

A: Loop Engineering（循环工程）是一种基于反馈循环的系统设计方法论，强调通过持续的监测、分析、优化循环来实现系统的自我改进。

### Q: Loop Engineering如何工作？

A: Loop Engineering通过以下循环工作：

1. **观察** - 收集系统运行数据和用户反馈
2. **定位** - 分析数据，理解当前状态
3. **决策** - 基于分析结果制定优化策略
4. **执行** - 实施优化并验证效果
5. **反馈** - 评估效果，沉淀知识

### Q: Loop Engineering有哪些专用循环？

A: Aemeath包含以下专用循环：

- **对话质量循环** - 每5分钟评估和优化对话质量
- **用户体验循环** - 每10分钟评估和优化用户体验
- **系统性能循环** - 每2分钟评估和优化系统性能

### Q: 如何配置Loop Engineering？

A: 使用命令：

```bash
❯ /loop config
```

可以调整循环间隔、优化策略、知识保留等设置。

### Q: Loop Engineering会消耗很多资源吗？

A: Loop Engineering设计时考虑了资源效率：

- 循环间隔可配置（默认几分钟一次）
- 只在必要时执行优化
- 支持资源使用限制
- 可以暂停特定循环

### Q: Loop Engineering如何保证安全？

A: Loop Engineering采用以下安全措施：

- 所有优化可回滚
- 支持A/B测试验证效果
- 设置失败阈值自动暂停
- 用户可以随时停止循环

### Q: 如何查看Loop Engineering的学习效果？

A: 使用命令：

```bash
❯ /loop status
❯ /loop history
❯ /loop knowledge
```

可以查看循环成功率、知识沉淀数量等统计信息。

## 其他问题

### Q: 如何报告 Bug？

A: 在 [Issues](https://github.com/yourusername/aemeath/issues) 中提交，包含：

1. 清晰的标题和描述
2. 复现步骤
3. 期望行为和实际行为
4. 环境信息
5. 错误日志

### Q: 如何获取帮助？

A: 可以通过以下方式：

1. 查看本文档
2. 提交 Issue
3. 发送邮件：your.email@example.com
4. 加入 Discord 社区

### Q: Aemeath 是免费的吗？

A: 是的，Aemeath 是开源的。但使用 AI 模型需要 API 密钥，可能产生费用。

详见 [成本估算](../README.md#-成本估算)。
