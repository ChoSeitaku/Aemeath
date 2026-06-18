# 配置指南

## 配置文件位置

Aemeath 的配置文件位于：

- 全局配置：`~/.aemeath/config.yaml`
- 项目配置：`./aemeath.yaml`
- 环境变量：`.env`

## 环境变量

在 `.env` 文件中配置：

```env
# API密钥
DEEPSEEK_API_KEY=your_deepseek_api_key
WHISPER_API_KEY=your_whisper_api_key

# 模型配置
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_BASE_URL=https://api.deepseek.com

# 语音配置
TTS_VOICE=zh-CN-XiaoxiaoNeural
WAKE_WORD=小爱

# 日志配置
LOG_LEVEL=INFO
LOG_FILE=~/.aemeath/logs/aemeath.log

# 数据目录
DATA_DIR=~/.aemeath/data
CACHE_DIR=~/.aemeath/cache
```

## 配置文件

### 基础配置

```yaml
# config.yaml

# 模型配置
model:
  provider: deepseek
  name: deepseek-v4-flash
  temperature: 0.7
  max_tokens: 4096
  top_p: 0.9

# 对话配置
conversation:
  max_history: 100
  context_window: 8000
  system_prompt: |
    你是Aemeath，一个友好、乐于助人的AI助手。
    你的昵称是小爱。
    你会尽力帮助用户，并记住他们的偏好。
```

### 语音配置

```yaml
voice:
  enabled: true
  
  # 语音识别
  stt:
    provider: whisper
    model: whisper-1
    language: zh-CN
  
  # 语音合成
  tts:
    provider: edge-tts
    voice: zh-CN-XiaoxiaoNeural
    rate: 1.0
    volume: 0.8
  
  # 唤醒词
  wake_word:
    enabled: true
    words:
      - 小爱
      - 爱弥斯
      - Aemeath
    threshold: 0.7
```

### 记忆配置

```yaml
memory:
  enabled: true
  
  # 短期记忆
  short_term:
    max_items: 100
    ttl: 3600  # 1小时
  
  # 长期记忆
  long_term:
    provider: chromadb
    dimension: 1536
    similarity_threshold: 0.7
  
  # 自动记忆
  auto_memory:
    enabled: true
    keywords:
      - 喜欢
      - 讨厌
      - 习惯
      - 偏好
```

### 人格配置

```yaml
personality:
  type: aemeath  # aemeath(爱弥斯), friendly, professional, casual, humorous, tsundere, genki
  
  # 爱弥斯特有配置（基于鸣潮角色）
  aemeath:
    # 角色背景
    background: "星炬学院隧者适格者"
    current_status: "电子幽灵"
    ability: "长航的星辉"
    
    # 性格特点
    traits:
      playful: 0.95      # 俏皮活泼
      cheerful: 0.9      # 开朗乐观
      loyal: 0.95        # 忠诚守护
      caring: 0.9        # 关心他人
      determined: 0.9    # 坚定执着
    
    # 称呼设置
    call_user: "漂泊者"
    call_self: "爱弥斯"
  
  # 人格特征
  traits:
    friendly: 0.9
    humorous: 0.7
    caring: 0.95
    curious: 0.8
    patient: 0.85
    playful: 0.6
  
  # 语言风格
  speech_style:
    greeting:
      - 嘿~漂泊者！今天也要一起努力哦！
      - 你好呀~爱弥斯在这里等你呢！
      - 漂泊者！今天有什么计划吗？
    farewell:
      - 下次见啦~漂泊者要小心哦！
      - 拜拜~爱弥斯会一直在这里的！
      - 要记得想我哦~
    thinking:
      - 嗯...让爱弥斯想想~
      - 这个嘛...漂泊者等等哦！
      - 我看看...有了！
  
  # 经典台词
  catchphrases:
    - 但愿我会让你感到骄傲，但愿我没有让你失望。
    - 漂泊者，爱弥斯会一直在这里。
    - 星辉会指引我们的。
    - 鸣潮往复，文明不屈。
  
  # 进化设置
  evolve:
    enabled: true
    learning_rate: 0.1
```

### 工具配置

```yaml
tools:
  # 启用的工具
  enabled:
    - calendar
    - email
    - files
    - search
    - home
  
  # 日历配置
  calendar:
    provider: google
    credentials: ~/.aemeath/credentials/google.json
  
  # 邮件配置
  email:
    provider: gmail
    credentials: ~/.aemeath/credentials/gmail.json
  
  # 搜索配置
  search:
    provider: duckduckgo
    max_results: 5
  
  # 智能家居配置
  home:
    provider: home-assistant
    url: http://localhost:8123
    token: your_token
```

### 同步配置

```yaml
sync:
  enabled: false
  
  # 同步服务器
  server:
    url: https://sync.aemeath.com
    token: your_token
  
  # 同步策略
  strategy:
    conversations: real_time
    memories: hourly
    settings: daily
  
  # 冲突解决
  conflict:
    strategy: last_modified
    auto_resolve: true
```

### 主动式AI配置

```yaml
proactive:
  enabled: true
  
  # 预测引擎配置
  prediction:
    confidence_threshold: 0.7  # 预测置信度阈值
    max_predictions_per_hour: 10
    learning_rate: 0.1
  
  # 情境感知配置
  context:
    sensitivity:
      temporal: 0.8      # 时间感知灵敏度
      spatial: 0.6       # 空间感知灵敏度
      behavioral: 0.9    # 行为感知灵敏度
      emotional: 0.7     # 情感感知灵敏度
  
  # 干预配置
  intervention:
    level: moderate      # minimal, moderate, aggressive
    quiet_hours:
      start: 22
      end: 8
    max_per_hour: 3
    suppress_during_focus: true
  
  # 智能提醒配置
  smart_reminder:
    enabled: true
    advance_notice: 30   # 提前提醒时间（分钟）
    reminder_types:
      - deadline
      - meeting
      - break
  
  # 工作流自动化配置
  workflow_automation:
    enabled: true
    min_repetitions: 3   # 最小重复次数
    auto_suggest: true
  
  # 上下文帮助配置
  contextual_help:
    enabled: true
    difficulty_threshold: 0.6
    help_types:
      - documentation
      - suggestion
      - tutorial
  
  # 隐私配置
  privacy:
    local_processing: true
    anonymize_data: true
    data_retention_days: 30
```

### Loop Engineering配置

```yaml
loop_engineering:
  enabled: true
  
  # 主循环配置
  main_loop:
    max_iterations_per_hour: 10
    min_interval_seconds: 60
    auto_restart: true
    failure_threshold: 3
  
  # 专用循环配置
  specialized_loops:
    conversation_quality:
      enabled: true
      interval_seconds: 300  # 5分钟
    user_experience:
      enabled: true
      interval_seconds: 600  # 10分钟
    system_performance:
      enabled: true
      interval_seconds: 120  # 2分钟
  
  # 优化配置
  optimization:
    auto_optimize: true
    ab_testing: true
    rollback_mechanism: true
    max_optimizations_per_hour: 5
  
  # 知识沉淀配置
  knowledge:
    auto_capture: true
    retention_days: 30
    max_knowledge_items: 1000
    knowledge_types:
      - pattern
      - rule
      - strategy
  
  # 隐私配置
  privacy:
    local_processing: true
    anonymize_data: true
    data_retention_days: 30
```

### 安全配置

```yaml
security:
  # 数据加密
  encryption:
    enabled: true
    algorithm: aes-256
  
  # 权限管理
  permissions:
    require_approval:
      - execute_code
      - send_email
      - access_camera
      - access_microphone
  
  # 隐私设置
  privacy:
    encrypt_storage: true
    anonymous_usage: false
    data_retention_days: 30
```

### 国际化配置

```yaml
i18n:
  locale: zh-CN
  fallback: en-US
  
  # 支持的语言
  supported:
    - zh-CN
    - zh-TW
    - en-US
    - ja-JP
    - ko-KR
```

### 插件配置

```yaml
plugins:
  enabled: true
  directory: ~/.aemeath/plugins
  
  # 已安装插件
  installed:
    - name: weather
      version: 1.2.0
      enabled: true
    - name: translator
      version: 1.0.0
      enabled: true
```

## 配置命令

### 查看当前配置

```
❯ /config
```

### 修改配置

```
❯ /set model.temperature 0.8
❯ /set voice.enabled false
❯ /set personality.type humorous
```

### 重置配置

```
❯ /config reset
```

### 导出配置

```
❯ /config export config_backup.yaml
```

### 导入配置

```
❯ /config import config_backup.yaml
```

## 配置优先级

1. 命令行参数
2. 环境变量
3. 项目配置文件 (`./aemeath.yaml`)
4. 全局配置文件 (`~/.aemeath/config.yaml`)
5. 默认值

## 故障排除

### 配置不生效

1. 检查配置文件语法
2. 确认配置项名称正确
3. 重启 Aemeath

### API密钥错误

1. 确认密钥格式正确
2. 检查密钥是否过期
3. 验证密钥权限

### 配置文件损坏

```bash
# 重置配置
aemeath --reset-config

# 或手动删除配置文件
rm ~/.aemeath/config.yaml
```
