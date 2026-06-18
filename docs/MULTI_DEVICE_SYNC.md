# 多设备多平台同步系统设计

> Aemeath（爱弥斯）跨设备数据同步完整设计方案

## 1. 设计目标

### 1.1 核心原则

1. **本地优先（Local-First）**：所有数据优先存储在本地，同步是可选的增强功能
2. **离线可用**：无网络时所有功能正常工作，联网后自动同步
3. **冲突友好**：冲突不是错误，而是需要解决的状态
4. **隐私安全**：同步数据端到端加密，用户完全控制
5. **无缝体验**：切换设备时对话上下文自然延续

### 1.2 同步范围

| 数据类型 | 同步策略 | 冲突策略 | 优先级 |
|----------|----------|----------|--------|
| 对话历史 | 实时同步 | 合并（保留双方） | P0 |
| 长期记忆 | 实时同步 | 合并（向量去重） | P0 |
| 用户档案 | 实时同步 | 远程优先 | P0 |
| 人格配置 | 定时同步 | 远程优先 | P1 |
| 工具配置 | 定时同步 | 远程优先 | P1 |
| 对话上下文 | 不同步 | N/A | - |
| 系统状态 | 不同步 | N/A | - |

---

## 2. 系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户设备层                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 💻 Windows│  │ 🍎 macOS │  │ 📱 iOS   │  │ 🤖 Android│       │
│  │   CLI    │  │   CLI    │  │   App    │  │   App    │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │              │              │              │              │
│       └──────────────┴──────────────┴──────────────┘              │
│                              │                                    │
│                              ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  本地存储层                                │   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│   │
│  │  │ SQLite   │  │ ChromaDB │  │ 文件系统  │  │ 加密存储  ││   │
│  │  │ 对话历史 │  │ 向量记忆 │  │ 配置文件  │  │ 敏感数据  ││   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘│   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      同步网络层                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    同步服务器                             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│   │
│  │  │ 设备注册 │  │ 变更日志 │  │ 冲突解决 │  │ 加密传输  ││   │
│  │  │ Device   │  │ Change   │  │ Conflict │  │ E2E      ││   │
│  │  │ Registry │  │ Log      │  │ Resolver │  │ Encrypt  ││   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  备选方案：                                                     │
│  - 自建服务器（推荐）                                          │
│  - 云存储（S3/OneDrive/iCloud）                               │
│  - P2P直连（局域网）                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 数据流

```
设备A操作 → 本地保存 → 生成变更事件 → 推送到同步服务器
                                            │
                                            ▼
                                    服务器存储变更日志
                                            │
                                            ▼
                                    推送到设备B/C/D
                                            │
                                            ▼
                              设备B/C/D拉取变更 → 合并到本地
```

---

## 3. 数据模型

### 3.1 设备注册

```python
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
import uuid

@dataclass
class Device:
    """设备信息"""
    
    device_id: str                    # 唯一设备ID
    device_name: str                  # 设备名称（如 "我的电脑"）
    device_type: DeviceType           # 设备类型
    platform: str                     # 操作系统
    app_version: str                  # 应用版本
    last_online: datetime             # 最后在线时间
    last_sync: datetime               # 最后同步时间
    is_primary: bool = False          # 是否为主设备
    sync_enabled: bool = True         # 是否启用同步
    encryption_key: Optional[str] = None  # 设备加密密钥

class DeviceType(Enum):
    """设备类型"""
    DESKTOP = "desktop"      # 桌面电脑
    LAPTOP = "laptop"        # 笔记本
    TABLET = "tablet"        # 平板
    PHONE = "phone"          # 手机
    SERVER = "server"        # 服务器
```

### 3.2 变更日志

```python
@dataclass
class ChangeLog:
    """变更日志"""
    
    change_id: str                   # 变更唯一ID
    device_id: str                   # 产生变更的设备
    table_name: str                  # 变更的表/集合
    record_id: str                   # 变更的记录ID
    operation: ChangeOperation       # 操作类型
    data: dict                       # 变更前的数据（用于回滚）
    new_data: dict                   # 变更后的数据
    timestamp: datetime              # 变更时间
    version: int                     # 版本号（递增）
    checksum: str                    # 数据校验和

class ChangeOperation(Enum):
    """变更操作类型"""
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    MERGE = "merge"  # 合并操作
```

### 3.3 同步状态

```python
@dataclass
class SyncState:
    """同步状态"""
    
    device_id: str                   # 设备ID
    last_sync_time: datetime         # 最后同步时间
    last_sync_version: int           # 最后同步的版本号
    pending_changes: int             # 待同步的变更数
    sync_status: SyncStatus          # 同步状态
    
class SyncStatus(Enum):
    """同步状态"""
    IDLE = "idle"                    # 空闲
    SYNCING = "syncing"              # 同步中
    ERROR = "error"                  # 同步错误
    OFFLINE = "offline"              # 离线
```

---

## 4. 同步策略

### 4.1 三级同步策略

```python
class SyncStrategy:
    """三级同步策略"""
    
    # P0: 实时同步（核心数据）
    REALTIME = {
        "interval": 0,              # 实时
        "retry_count": 3,           # 重试3次
        "timeout": 5,               # 5秒超时
        "conflict_resolution": "merge",
        "data_types": ["conversations", "memories", "user_profile"]
    }
    
    # P1: 定时同步（配置数据）
    PERIODIC = {
        "interval": 300,            # 5分钟
        "retry_count": 2,
        "timeout": 10,
        "conflict_resolution": "remote_priority",
        "data_types": ["settings", "tool_configs", "personality"]
    }
    
    # P2: 手动同步（可选数据）
    MANUAL = {
        "interval": None,           # 手动触发
        "retry_count": 1,
        "timeout": 30,
        "conflict_resolution": "manual",
        "data_types": ["tasks", "calendar", "reminders"]
    }
```

### 4.2 冲突检测

```python
class ConflictDetector:
    """冲突检测器"""
    
    def detect(self, local_change: ChangeLog, remote_change: ChangeLog) -> Optional[Conflict]:
        """检测冲突"""
        
        # 同一记录的同一字段被修改
        if (local_change.record_id == remote_change.record_id and
            local_change.table_name == remote_change.table_name):
            
            # 检查是否有字段重叠
            local_fields = set(local_change.new_data.keys())
            remote_fields = set(remote_change.new_data.keys())
            overlap = local_fields & remote_fields
            
            if overlap:
                return Conflict(
                    conflict_id=str(uuid.uuid4()),
                    local_change=local_change,
                    remote_change=remote_change,
                    conflicting_fields=list(overlap),
                    detected_at=datetime.now()
                )
        
        return None
```

### 4.3 冲突解决策略

```python
class ConflictResolver:
    """冲突解决器"""
    
    def __init__(self):
        self.strategies = {
            "last_write_wins": self.last_write_wins,
            "remote_priority": self.remote_priority,
            "local_priority": self.local_priority,
            "merge": self.merge,
            "manual": self.manual_resolve,
        }
    
    def resolve(self, conflict: Conflict, strategy: str = "merge") -> Resolution:
        """解决冲突"""
        
        resolver = self.strategies.get(strategy)
        if not resolver:
            raise ValueError(f"Unknown strategy: {strategy}")
        
        return resolver(conflict)
    
    def last_write_wins(self, conflict: Conflict) -> Resolution:
        """最后修改时间优先"""
        
        if conflict.local_change.timestamp > conflict.remote_change.timestamp:
            return Resolution(
                chosen="local",
                data=conflict.local_change.new_data,
                reason="local_newer"
            )
        else:
            return Resolution(
                chosen="remote",
                data=conflict.remote_change.new_data,
                reason="remote_newer"
            )
    
    def remote_priority(self, conflict: Conflict) -> Resolution:
        """远程优先"""
        
        return Resolution(
            chosen="remote",
            data=conflict.remote_change.new_data,
            reason="remote_priority_policy"
        )
    
    def local_priority(self, conflict: Conflict) -> Resolution:
        """本地优先"""
        
        return Resolution(
            chosen="local",
            data=conflict.local_change.new_data,
            reason="local_priority_policy"
        )
    
    def merge(self, conflict: Conflict) -> Resolution:
        """智能合并"""
        
        merged = {}
        
        for field in conflict.conflicting_fields:
            local_val = conflict.local_change.new_data.get(field)
            remote_val = conflict.remote_change.new_data.get(field)
            
            # 根据字段类型选择合并策略
            if isinstance(local_val, list) and isinstance(remote_val, list):
                # 列表类型：合并去重
                merged[field] = list(set(local_val + remote_val))
            elif isinstance(local_val, dict) and isinstance(remote_val, dict):
                # 字典类型：深度合并
                merged[field] = self._deep_merge(local_val, remote_val)
            elif isinstance(local_val, (int, float)) and isinstance(remote_val, (int, float)):
                # 数值类型：取较大值
                merged[field] = max(local_val, remote_val)
            else:
                # 其他类型：最后修改时间优先
                if conflict.local_change.timestamp > conflict.remote_change.timestamp:
                    merged[field] = local_val
                else:
                    merged[field] = remote_val
        
        # 保留非冲突字段
        non_conflict_local = {
            k: v for k, v in conflict.local_change.new_data.items()
            if k not in conflict.conflicting_fields
        }
        non_conflict_remote = {
            k: v for k, v in conflict.remote_change.new_data.items()
            if k not in conflict.conflicting_fields
        }
        
        final_data = {**non_conflict_remote, **non_conflict_local, **merged}
        
        return Resolution(
            chosen="merged",
            data=final_data,
            reason="intelligent_merge"
        )
    
    def _deep_merge(self, dict1: dict, dict2: dict) -> dict:
        """深度合并字典"""
        
        result = dict1.copy()
        
        for key, value in dict2.items():
            if key in result:
                if isinstance(result[key], dict) and isinstance(value, dict):
                    result[key] = self._deep_merge(result[key], value)
                else:
                    # 冲突：取后者
                    result[key] = value
            else:
                result[key] = value
        
        return result
```

---

## 5. 同步协议

### 5.1 WebSocket 实时同步

```python
import asyncio
import json
import websockets
from typing import Callable, Dict, List

class SyncProtocol:
    """同步协议"""
    
    def __init__(self, server_url: str, device_id: str):
        self.server_url = server_url
        self.device_id = device_id
        self.websocket = None
        self.handlers: Dict[str, Callable] = {}
        self.outgoing_queue: List[dict] = []
    
    async def connect(self):
        """连接到同步服务器"""
        
        uri = f"{self.server_url}/ws?device_id={self.device_id}"
        self.websocket = await websockets.connect(uri)
        
        # 启动接收和发送任务
        asyncio.create_task(self._receive_loop())
        asyncio.create_task(self._send_loop())
    
    async def _receive_loop(self):
        """接收循环"""
        
        async for message in self.websocket:
            data = json.loads(message)
            
            # 处理不同类型的消息
            msg_type = data.get("type")
            
            if msg_type == "change":
                # 远程变更
                await self._handle_remote_change(data)
            elif msg_type == "sync_request":
                # 同步请求
                await self._handle_sync_request(data)
            elif msg_type == "conflict":
                # 冲突通知
                await self._handle_conflict(data)
            elif msg_type == "heartbeat":
                # 心跳
                await self._send_pong()
    
    async def _send_loop(self):
        """发送循环"""
        
        while True:
            if self.outgoing_queue:
                message = self.outgoing_queue.pop(0)
                await self.websocket.send(json.dumps(message))
            
            await asyncio.sleep(0.1)
    
    async def send_change(self, change: ChangeLog):
        """发送变更"""
        
        message = {
            "type": "change",
            "device_id": self.device_id,
            "change": {
                "change_id": change.change_id,
                "table_name": change.table_name,
                "record_id": change.record_id,
                "operation": change.operation.value,
                "new_data": change.new_data,
                "timestamp": change.timestamp.isoformat(),
                "version": change.version
            }
        }
        
        self.outgoing_queue.append(message)
    
    async def request_full_sync(self):
        """请求全量同步"""
        
        message = {
            "type": "sync_request",
            "device_id": self.device_id,
            "last_sync_version": await self.get_last_sync_version()
        }
        
        self.outgoing_queue.append(message)
```

### 5.2 HTTP REST API

```python
from fastapi import FastAPI, HTTPException, Depends
from typing import List, Optional
from datetime import datetime

app = FastAPI()

# 设备管理
@app.post("/api/devices/register")
async def register_device(device: Device):
    """注册新设备"""
    # 存储设备信息
    # 生成设备加密密钥
    pass

@app.get("/api/devices")
async def list_devices(user_id: str):
    """列出用户的所有设备"""
    pass

@app.put("/api/devices/{device_id}/status")
async def update_device_status(device_id: str, status: SyncStatus):
    """更新设备状态"""
    pass

# 变更同步
@app.post("/api/sync/changes")
async def push_changes(changes: List[ChangeLog], device_id: str):
    """推送变更到服务器"""
    
    # 验证设备
    # 存储变更日志
    # 检测冲突
    # 广播到其他设备
    pass

@app.get("/api/sync/changes")
async def pull_changes(
    device_id: str,
    last_version: int,
    table_filter: Optional[str] = None
):
    """拉取变更"""
    
    # 获取指定版本之后的变更
    # 根据表名过滤
    # 返回变更列表
    pass

@app.post("/api/sync/full")
async def full_sync(device_id: str, data: SyncData):
    """全量同步"""
    
    # 接收设备的完整数据
    # 合并到服务器存储
    # 返回合并后的完整数据
    pass

# 冲突管理
@app.get("/api/conflicts")
async def list_conflicts(device_id: str):
    """列出待解决的冲突"""
    pass

@app.post("/api/conflicts/{conflict_id}/resolve")
async def resolve_conflict(
    conflict_id: str,
    resolution: Resolution
):
    """解决冲突"""
    pass
```

---

## 6. 平台适配

### 6.1 平台检测

```python
import platform
import sys
from typing import Optional

class PlatformDetector:
    """平台检测器"""
    
    @staticmethod
    def detect() -> PlatformInfo:
        """检测当前平台"""
        
        system = platform.system().lower()
        
        if system == "windows":
            return PlatformInfo(
                os="windows",
                version=platform.version(),
                arch=platform.machine(),
                package_manager="winget",
                shell="powershell"
            )
        elif system == "darwin":
            mac_version = platform.mac_ver()[0]
            return PlatformInfo(
                os="macos",
                version=mac_version,
                arch=platform.machine(),
                package_manager="brew",
                shell="zsh"
            )
        elif system == "linux":
            return PlatformInfo(
                os="linux",
                version=platform.release(),
                arch=platform.machine(),
                package_manager="apt",
                shell="bash"
            )
        
        raise UnsupportedPlatformError(f"Unsupported platform: {system}")

@dataclass
class PlatformInfo:
    """平台信息"""
    
    os: str
    version: str
    arch: str
    package_manager: str
    shell: str
```

### 6.2 跨平台存储路径

```python
from pathlib import Path

class StoragePath:
    """跨平台存储路径"""
    
    @staticmethod
    def get_data_dir() -> Path:
        """获取数据目录"""
        
        system = platform.system().lower()
        
        if system == "windows":
            base = Path(os.environ.get("APPDATA", "~"))
        elif system == "darwin":
            base = Path("~/Library/Application Support")
        else:
            base = Path(os.environ.get("XDG_DATA_HOME", "~/.local/share"))
        
        data_dir = base / "aemeath"
        data_dir.mkdir(parents=True, exist_ok=True)
        
        return data_dir
    
    @staticmethod
    def get_config_dir() -> Path:
        """获取配置目录"""
        
        system = platform.system().lower()
        
        if system == "windows":
            base = Path(os.environ.get("APPDATA", "~"))
        elif system == "darwin":
            base = Path("~/Library/Application Support")
        else:
            base = Path(os.environ.get("XDG_CONFIG_HOME", "~/.config"))
        
        config_dir = base / "aemeath"
        config_dir.mkdir(parents=True, exist_ok=True)
        
        return config_dir
    
    @staticmethod
    def get_cache_dir() -> Path:
        """获取缓存目录"""
        
        system = platform.system().lower()
        
        if system == "windows":
            base = Path(os.environ.get("LOCALAPPDATA", "~"))
        elif system == "darwin":
            base = Path("~/Library/Caches")
        else:
            base = Path(os.environ.get("XDG_CACHE_HOME", "~/.cache"))
        
        cache_dir = base / "aemeath"
        cache_dir.mkdir(parents=True, exist_ok=True)
        
        return cache_dir
```

### 6.3 平台特定优化

```python
class PlatformOptimizer:
    """平台特定优化"""
    
    @staticmethod
    async def optimize_for_platform(platform_info: PlatformInfo):
        """根据平台优化"""
        
        if platform_info.os == "windows":
            # Windows特定优化
            await PlatformOptimizer._optimize_windows()
        elif platform_info.os == "macos":
            # macOS特定优化
            await PlatformOptimizer._optimize_macos()
        elif platform_info.os == "linux":
            # Linux特定优化
            await PlatformOptimizer._optimize_linux()
    
    @staticmethod
    async def _optimize_windows():
        """Windows优化"""
        
        # 使用WinRT进行通知
        # 使用Windows Terminal渲染
        # 集成Windows搜索
        pass
    
    @staticmethod
    async def _optimize_macos():
        """macOS优化"""
        
        # 使用原生通知中心
        # 集成Spotlight搜索
        # 支持Touch Bar
        pass
    
    @staticmethod
    async def _optimize_linux():
        """Linux优化"""
        
        # 使用D-Bus通知
        # 集成系统托盘
        # 支持Wayland/X11
        pass
```

---

## 7. 安全设计

### 7.1 端到端加密

```python
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

class E2EEncryption:
    """端到端加密"""
    
    def __init__(self, master_key: str):
        self.master_key = master_key
        self.fernet = self._derive_key(master_key)
    
    def _derive_key(self, master_key: str) -> Fernet:
        """从主密钥派生加密密钥"""
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b'aemeath-salt',  # 实际应使用随机盐
            iterations=100000,
        )
        
        key = base64.urlsafe_b64encode(
            kdf.derive(master_key.encode())
        )
        
        return Fernet(key)
    
    def encrypt(self, data: str) -> str:
        """加密数据"""
        
        return self.fernet.encrypt(data.encode()).decode()
    
    def decrypt(self, encrypted: str) -> str:
        """解密数据"""
        
        return self.fernet.decrypt(encrypted.encode()).decode()
```

### 7.2 设备认证

```python
import jwt
import hashlib
from datetime import datetime, timedelta

class DeviceAuth:
    """设备认证"""
    
    def __init__(self, secret_key: str):
        self.secret_key = secret_key
    
    def generate_token(self, device_id: str, user_id: str) -> str:
        """生成设备认证令牌"""
        
        payload = {
            "device_id": device_id,
            "user_id": user_id,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(days=30)
        }
        
        return jwt.encode(payload, self.secret_key, algorithm="HS256")
    
    def verify_token(self, token: str) -> dict:
        """验证令牌"""
        
        try:
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=["HS256"]
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise AuthenticationError("Token expired")
        except jwt.InvalidTokenError:
            raise AuthenticationError("Invalid token")
```

### 7.3 数据完整性

```python
import hashlib
import json

class DataIntegrity:
    """数据完整性校验"""
    
    @staticmethod
    def compute_checksum(data: dict) -> str:
        """计算数据校验和"""
        
        # 序列化为确定性JSON
        json_str = json.dumps(data, sort_keys=True, ensure_ascii=False)
        
        # 计算SHA256
        checksum = hashlib.sha256(json_str.encode()).hexdigest()
        
        return checksum
    
    @staticmethod
    def verify_checksum(data: dict, expected_checksum: str) -> bool:
        """验证数据校验和"""
        
        actual_checksum = DataIntegrity.compute_checksum(data)
        return actual_checksum == expected_checksum
```

---

## 8. 同步场景

### 8.1 场景1：手机-电脑对话延续

```
1. 用户在电脑上与小爱对话
   → 对话历史存储在本地SQLite
   → 变更事件推送到同步服务器

2. 用户切换到手机
   → 手机拉取最新的对话历史
   → 显示"上次对话"提示

3. 用户在手机上继续对话
   → 新对话历史存储在本地
   → 变更事件推送到同步服务器

4. 电脑自动同步
   → 拉取手机上的新对话
   → 更新本地数据库
```

### 8.2 场景2：离线-在线同步

```
1. 用户进入无网络环境
   → 同步状态变为"离线"
   → 所有操作正常进行，本地存储

2. 用户恢复网络
   → 同步状态变为"同步中"
   → 拉取离线期间的远程变更
   → 推送本地离线期间的变更

3. 冲突检测
   → 检测到对话历史冲突
   → 使用"合并"策略解决
   → 两个设备的对话都保留
```

### 8.3 场景3：多设备配置同步

```
1. 用户在电脑上修改人格配置
   → 配置变更推送到同步服务器

2. 手机自动同步
   → 拉取新配置
   → 应用到本地

3. 用户在手机上修改工具配置
   → 工具配置变更推送到同步服务器

4. 电脑自动同步
   → 拉取新配置
   → 应用到本地
```

---

## 9. CLI命令设计

### 9.1 同步管理命令

```
❯ /devices

╭─────────────────────────────────────────────────────────────╮
│ 已连接设备                                                  │
├─────────────────────────────────────────────────────────────┤
│ 💻 DESKTOP-WIN  - Windows 11      ✅ 在线    最后同步: 刚刚  │
│ 📱 iPhone-15    - iOS 17.2        ✅ 在线    最后同步: 5分钟前│
│ 🖥️ home-server - Ubuntu 22.04    ⚠️ 离线    最后同步: 2小时前│
│                                                              │
│ 同步状态：                                                   │
│   - 对话历史: 127条 (全部同步)                               │
│   - 记忆数据: 89条 (全部同步)                                │
│   - 配置文件: 已同步                                         │
│                                                              │
│ 输入 /sync 立即同步 · /device add 添加设备                   │
╰─────────────────────────────────────────────────────────────╯

❯ /sync

╭─────────────────────────────────────────────────────────────╮
│ 🔄 正在同步...                                               │
│                                                              │
│ [████████████████████░░░░░] 80%                             │
│                                                              │
│ 正在同步: 对话历史 (127/158)                                 │
╰─────────────────────────────────────────────────────────────╯

╭─────────────────────────────────────────────────────────────╮
│ ✅ 同步完成                                                  │
│                                                              │
│ 同步详情：                                                   │
│   - 推送: 31条对话历史                                       │
│   - 拉取: 5条对话历史                                        │
│   - 冲突: 0条                                                │
│   - 耗时: 2.3秒                                              │
╰─────────────────────────────────────────────────────────────╯

❯ /device add

╭─────────────────────────────────────────────────────────────╮
│ 📱 添加新设备                                                │
│                                                              │
│ 请在新设备上运行以下命令：                                   │
│                                                              │
│   aemeath device pair --code ABCD1234                       │
│                                                              │
│ 或扫描二维码：                                               │
│                                                              │
│   [QR Code]                                                 │
│                                                              │
│ 配对码有效期: 5分钟                                          │
╰─────────────────────────────────────────────────────────────╯
```

### 9.2 同步配置命令

```
❯ /sync config

╭─────────────────────────────────────────────────────────────╮
│ 同步配置                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ 同步模式: 自动同步                                          │
│ 同步频率: 实时                                              │
│ 冲突策略: 智能合并                                          │
│                                                              │
│ 同步内容:                                                   │
│   ✅ 对话历史                                               │
│   ✅ 长期记忆                                               │
│   ✅ 用户档案                                               │
│   ✅ 人格配置                                               │
│   ✅ 工具配置                                               │
│   ❌ 任务队列                                               │
│   ❌ 日历事件                                               │
│                                                              │
│ 输入 /sync set <option> <value> 修改配置                    │
╰─────────────────────────────────────────────────────────────╯

❯ /sync set strategy merge

✅ 同步策略已更新为: 智能合并
```

---

## 10. 备选同步方案

### 10.1 方案A：自建同步服务器

```
优点：
- 完全控制数据
- 可定制同步逻辑
- 支持离线队列

缺点：
- 需要服务器运维
- 需要域名和SSL证书
- 成本较高

技术栈：
- FastAPI (Python)
- PostgreSQL (存储)
- Redis (缓存)
- WebSocket (实时通信)
```

### 10.2 方案B：云存储同步

```
优点：
- 无需自建服务器
- 利用现有基础设施
- 成本较低

缺点：
- 依赖第三方服务
- 同步延迟较高
- 定制性有限

支持的云存储：
- OneDrive (Windows/Mac/iOS/Android)
- iCloud (Apple生态)
- Google Drive (跨平台)
- S3 (高度定制)
```

### 10.3 方案C：P2P直连

```
优点：
- 无需服务器
- 隐私性最好
- 延迟最低

缺点：
- 需要设备同时在线
- NAT穿透复杂
- 不支持离线队列

技术：
- mDNS (局域网发现)
- WebRTC (P2P连接)
- libp2p (去中心化网络)
```

### 10.4 推荐方案

**混合方案**：

1. **局域网内**：P2P直连（最快）
2. **跨网络**：自建服务器中转（最可靠）
3. **备份**：云存储同步（最安全）

```python
class HybridSyncStrategy:
    """混合同步策略"""
    
    async def sync(self, data: SyncData):
        """智能选择同步方式"""
        
        # 检测局域网内的其他设备
        local_devices = await self._discover_local_devices()
        
        if local_devices:
            # 局域网内使用P2P
            await self._p2p_sync(data, local_devices)
        else:
            # 跨网络使用服务器
            await self._server_sync(data)
        
        # 异步备份到云存储
        asyncio.create_task(self._cloud_backup(data))
```

---

## 11. 实现路线图

### Phase 7.1: 基础同步（第12周前半）

- [ ] 设备注册与管理
- [ ] 变更日志系统
- [ ] 基础同步协议
- [ ] 冲突检测

### Phase 7.2: 冲突解决（第12周后半）

- [ ] 冲突解决策略
- [ ] 智能合并算法
- [ ] 手动冲突解决
- [ ] 冲突历史记录

### Phase 7.3: 平台适配（第13周前半）

- [ ] Windows适配
- [ ] macOS适配
- [ ] Linux适配
- [ ] 移动端适配

### Phase 7.4: 安全与优化（第13周后半）

- [ ] 端到端加密
- [ ] 设备认证
- [ ] 数据完整性校验
- [ ] 性能优化

---

## 12. 总结

多设备同步系统是Aemeath成为真正个人助手的关键能力。通过：

1. **本地优先**：确保离线可用，数据安全
2. **智能同步**：三级策略，按需同步
3. **冲突友好**：多种解决策略，用户可控
4. **安全可靠**：端到端加密，设备认证
5. **无缝体验**：切换设备时对话自然延续

最终目标：**让用户感觉不到设备的存在，只有一个无处不在的小爱**。
