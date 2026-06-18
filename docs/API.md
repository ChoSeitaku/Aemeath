# API 文档

## 概述

Aemeath 提供 REST API 和 WebSocket API，允许外部应用与助手交互。

## 认证

所有 API 请求需要在 Header 中携带 API 密钥：

```
Authorization: Bearer YOUR_API_KEY
```

## REST API

### 对话 API

#### 发送消息

```
POST /api/v1/chat
```

**请求体：**

```json
{
  "message": "你好",
  "context": {
    "session_id": "abc123"
  }
}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "response": "你好！我是Aemeath，你的个人AI助手。",
    "message_id": "msg_123",
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

#### 获取对话历史

```
GET /api/v1/chat/history?session_id=abc123&limit=50
```

**响应：**

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123",
        "role": "user",
        "content": "你好",
        "timestamp": "2025-01-15T10:30:00Z"
      },
      {
        "id": "msg_124",
        "role": "assistant",
        "content": "你好！我是Aemeath。",
        "timestamp": "2025-01-15T10:30:01Z"
      }
    ],
    "total": 2
  }
}
```

#### 清空对话

```
DELETE /api/v1/chat/clear?session_id=abc123
```

### 记忆 API

#### 获取记忆列表

```
GET /api/v1/memory?limit=100
```

**响应：**

```json
{
  "success": true,
  "data": {
    "memories": [
      {
        "id": "mem_123",
        "content": "用户喜欢喝咖啡",
        "tags": ["preference", "drink"],
        "created_at": "2025-01-15T10:30:00Z"
      }
    ],
    "total": 1
  }
}
```

#### 添加记忆

```
POST /api/v1/memory
```

**请求体：**

```json
{
  "content": "用户喜欢喝咖啡",
  "tags": ["preference", "drink"]
}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "id": "mem_124",
    "content": "用户喜欢喝咖啡",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

#### 删除记忆

```
DELETE /api/v1/memory/{id}
```

### 工具 API

#### 获取工具列表

```
GET /api/v1/tools
```

**响应：**

```json
{
  "success": true,
  "data": {
    "tools": [
      {
        "name": "calendar",
        "description": "日历管理",
        "enabled": true
      },
      {
        "name": "email",
        "description": "邮件管理",
        "enabled": true
      }
    ]
  }
}
```

#### 执行工具

```
POST /api/v1/tools/{name}/execute
```

**请求体：**

```json
{
  "params": {
    "date": "2025-01-16",
    "days": 1
  }
}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "result": [
      {
        "time": "09:00-10:00",
        "title": "产品评审会议",
        "location": "会议室A"
      }
    ]
  }
}
```

### 任务 API

#### 获取任务列表

```
GET /api/v1/tasks?status=running
```

**响应：**

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "T-001",
        "description": "重构用户模块",
        "status": "running",
        "progress": 80
      }
    ]
  }
}
```

#### 创建任务

```
POST /api/v1/tasks
```

**请求体：**

```json
{
  "description": "重构用户模块",
  "prompt": "提取公共方法到utils.py"
}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "id": "T-002",
    "description": "重构用户模块",
    "status": "pending"
  }
}
```

### 配置 API

#### 获取配置

```
GET /api/v1/config
```

**响应：**

```json
{
  "success": true,
  "data": {
    "model": {
      "provider": "deepseek",
      "name": "deepseek-v4-flash"
    },
    "voice": {
      "enabled": true,
      "voice_name": "zh-CN-XiaoxiaoNeural"
    }
  }
}
```

#### 更新配置

```
PUT /api/v1/config
```

**请求体：**

```json
{
  "voice": {
    "enabled": false
  }
}
```

## WebSocket API

### 连接

```
ws://localhost:8000/ws?token=YOUR_API_KEY
```

### 实时对话

**发送消息：**

```json
{
  "type": "chat",
  "data": {
    "message": "你好"
  }
}
```

**接收响应：**

```json
{
  "type": "chat",
  "data": {
    "response": "你好！我是Aemeath。",
    "streaming": false
  }
}
```

### 任务状态更新

**订阅任务：**

```json
{
  "type": "subscribe",
  "data": {
    "channel": "task:T-001"
  }
}
```

**接收更新：**

```json
{
  "type": "task_update",
  "data": {
    "task_id": "T-001",
    "status": "running",
    "progress": 85
  }
}
```

### 语音流

**发送音频：**

```json
{
  "type": "voice",
  "data": {
    "audio": "base64_encoded_audio",
    "format": "wav"
  }
}
```

**接收音频：**

```json
{
  "type": "voice",
  "data": {
    "audio": "base64_encoded_audio",
    "text": "你好！"
  }
}
```

## 错误处理

### 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "请求参数错误",
    "details": {
      "field": "message",
      "reason": "不能为空"
    }
  }
}
```

### 错误代码

| 代码 | 说明 |
|------|------|
| `INVALID_REQUEST` | 请求参数错误 |
| `UNAUTHORIZED` | 未授权 |
| `FORBIDDEN` | 禁止访问 |
| `NOT_FOUND` | 资源不存在 |
| `RATE_LIMITED` | 请求过于频繁 |
| `INTERNAL_ERROR` | 服务器内部错误 |

## 速率限制

- 普通请求：60次/分钟
- 对话请求：30次/分钟
- 工具调用：20次/分钟

## SDK

### Python SDK

```python
from aemeath import AemeathClient

client = AemeathClient(api_key="your_api_key")

# 发送消息
response = client.chat("你好")
print(response)

# 获取记忆
memories = client.memory.list()

# 执行工具
result = client.tools.execute("weather", city="上海")
```

### JavaScript SDK

```javascript
import { AemeathClient } from 'aemeath-js';

const client = new AemeathClient({ apiKey: 'your_api_key' });

// 发送消息
const response = await client.chat('你好');
console.log(response);

// 获取记忆
const memories = await client.memory.list();
```
