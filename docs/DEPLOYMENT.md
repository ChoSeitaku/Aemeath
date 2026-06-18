# 部署指南

> Aemeath（爱弥斯）的部署与运维指南

## 1. 部署方式

### 1.1 本地部署（推荐）

最简单的部署方式，适合个人使用。

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/aemeath.git
cd aemeath

# 2. 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows

# 3. 安装依赖
pip install -e .

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 添加 API 密钥

# 5. 运行
aemeath
```

### 1.2 Docker 部署

使用 Docker 容器化部署。

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码
COPY . .

# 安装包
RUN pip install -e .

# 运行
CMD ["aemeath"]
```

```bash
# 构建镜像
docker build -t aemeath .

# 运行容器
docker run -it \
  --name aemeath \
  -v ~/.aemeath:/root/.aemeath \
  -e DEEPSEEK_API_KEY=your_key \
  aemeath
```

### 1.3 服务端部署

部署同步服务器，支持多设备同步。

```bash
# 安装服务器依赖
pip install -e ".[server]"

# 运行服务器
aemeath-server --host 0.0.0.0 --port 8000
```

### 1.4 Systemd 服务（Linux）

将 Aemeath 部署为系统服务。

```ini
# /etc/systemd/system/aemeath.service
[Unit]
Description=Aemeath AI Assistant
After=network.target

[Service]
Type=simple
User=your_user
WorkingDirectory=/path/to/aemeath
Environment=PATH=/path/to/venv/bin
ExecStart=/path/to/venv/bin/aemeath --daemon
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# 启用服务
sudo systemctl enable aemeath

# 启动服务
sudo systemctl start aemeath

# 查看状态
sudo systemctl status aemeath
```

---

## 2. 环境配置

### 2.1 生产环境配置

```yaml
# config.production.yaml

# 环境
environment: production

# 日志
logging:
  level: WARNING
  file: /var/log/aemeath/aemeath.log
  max_size: 100MB
  backup_count: 5

# 数据库
database:
  path: /var/lib/aemeath/data.db
  backup_enabled: true
  backup_interval: 24h

# 安全
security:
  encryption_enabled: true
  ssl_enabled: true
  cert_path: /etc/ssl/certs/aemeath.pem
  key_path: /etc/ssl/private/aemeath.key

# 性能
performance:
  max_connections: 100
  timeout: 30s
  cache_enabled: true
  cache_ttl: 3600

# 监控
monitoring:
  enabled: true
  port: 9090
  metrics_path: /metrics
```

### 2.2 开发环境配置

```yaml
# config.development.yaml

# 环境
environment: development

# 日志
logging:
  level: DEBUG
  file: logs/aemeath.log

# 数据库
database:
  path: ./data/dev.db

# 安全
security:
  encryption_enabled: false
  ssl_enabled: false

# 性能
performance:
  max_connections: 10
  timeout: 60s
  cache_enabled: false
```

---

## 3. 数据备份

### 3.1 备份策略

```python
import shutil
import gzip
from datetime import datetime
from pathlib import Path

class BackupManager:
    """备份管理器"""
    
    def __init__(self, data_dir: str, backup_dir: str):
        self.data_dir = Path(data_dir)
        self.backup_dir = Path(backup_dir)
        self.backup_dir.mkdir(parents=True, exist_ok=True)
    
    def create_backup(self, name: str = None) -> str:
        """创建备份"""
        if name is None:
            name = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        backup_path = self.backup_dir / f"backup_{name}"
        backup_path.mkdir(exist_ok=True)
        
        # 备份数据库
        if (self.data_dir / "data.db").exists():
            shutil.copy2(
                self.data_dir / "data.db",
                backup_path / "data.db"
            )
        
        # 备份配置
        if (self.data_dir / "config.yaml").exists():
            shutil.copy2(
                self.data_dir / "config.yaml",
                backup_path / "config.yaml"
            )
        
        # 备份记忆数据
        if (self.data_dir / "memories").exists():
            shutil.copytree(
                self.data_dir / "memories",
                backup_path / "memories"
            )
        
        # 压缩备份
        backup_file = self.backup_dir / f"backup_{name}.tar.gz"
        shutil.make_archive(
            str(backup_file.with_suffix('')),
            'gztar',
            backup_path
        )
        
        # 删除临时目录
        shutil.rmtree(backup_path)
        
        return str(backup_file)
    
    def restore_backup(self, backup_file: str):
        """恢复备份"""
        backup_path = Path(backup_file)
        
        # 解压备份
        shutil.unpack_archive(
            str(backup_path),
            str(self.backup_dir / "temp")
        )
        
        # 恢复数据
        temp_dir = self.backup_dir / "temp"
        
        if (temp_dir / "data.db").exists():
            shutil.copy2(
                temp_dir / "data.db",
                self.data_dir / "data.db"
            )
        
        # 清理临时目录
        shutil.rmtree(temp_dir)
    
    def list_backups(self) -> list:
        """列出所有备份"""
        backups = []
        for file in self.backup_dir.glob("backup_*.tar.gz"):
            backups.append({
                "name": file.stem,
                "path": str(file),
                "size": file.stat().st_size,
                "created": datetime.fromtimestamp(file.stat().st_ctime)
            })
        return sorted(backups, key=lambda x: x["created"], reverse=True)
```

### 3.2 自动备份脚本

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/aemeath"
DATA_DIR="/var/lib/aemeath"
RETENTION_DAYS=30

# 创建备份目录
mkdir -p $BACKUP_DIR

# 创建备份
python -c "
from aemeath.utils.backup import BackupManager
manager = BackupManager('$DATA_DIR', '$BACKUP_DIR')
backup = manager.create_backup()
print(f'Backup created: {backup}')
"

# 删除旧备份
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete
```

### 3.3 定时备份（Cron）

```bash
# 每天凌晨2点执行备份
0 2 * * * /path/to/backup.sh >> /var/log/aemeath/backup.log 2>&1
```

---

## 4. 监控与告警

### 4.1 健康检查

```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/health")
async def health_check():
    """健康检查"""
    checks = {
        "status": "healthy",
        "version": "1.0.0",
        "uptime": get_uptime(),
        "checks": {
            "database": await check_database(),
            "api": await check_api(),
            "disk": await check_disk(),
            "memory": await check_memory()
        }
    }
    
    # 检查所有组件
    all_healthy = all(checks["checks"].values())
    checks["status"] = "healthy" if all_healthy else "unhealthy"
    
    status_code = 200 if all_healthy else 503
    return JSONResponse(content=checks, status_code=status_code)

async def check_database() -> bool:
    """检查数据库"""
    try:
        # 测试数据库连接
        return True
    except:
        return False

async def check_api() -> bool:
    """检查API"""
    try:
        # 测试API连接
        return True
    except:
        return False

async def check_disk() -> bool:
    """检查磁盘空间"""
    import shutil
    usage = shutil.disk_usage("/")
    return usage.free > 1024 * 1024 * 1024  # 至少1GB空闲

async def check_memory() -> bool:
    """检查内存"""
    import psutil
    return psutil.virtual_memory().percent < 90

def get_uptime() -> float:
    """获取运行时间"""
    import time
    return time.time() - START_TIME
```

### 4.2 指标收集

```python
from prometheus_client import Counter, Histogram, Gauge
import time

# 指标定义
REQUEST_COUNT = Counter(
    'aemeath_requests_total',
    'Total requests',
    ['method', 'endpoint']
)

REQUEST_LATENCY = Histogram(
    'aemeath_request_latency_seconds',
    'Request latency',
    ['endpoint']
)

ACTIVE_CONNECTIONS = Gauge(
    'aemeath_active_connections',
    'Number of active connections'
)

SYNC_OPERATIONS = Counter(
    'aemeath_sync_operations_total',
    'Total sync operations',
    ['status']
)

# 中间件
@app.middleware("http")
async def metrics_middleware(request, call_next):
    """指标中间件"""
    start_time = time.time()
    
    # 记录请求
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path
    ).inc()
    
    # 处理请求
    response = await call_next(request)
    
    # 记录延迟
    latency = time.time() - start_time
    REQUEST_LATENCY.labels(
        endpoint=request.url.path
    ).observe(latency)
    
    return response
```

### 4.3 告警配置

```python
from typing import List, Callable
from dataclasses import dataclass
from enum import Enum

class AlertLevel(Enum):
    """告警级别"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

@dataclass
class Alert:
    """告警"""
    title: str
    message: str
    level: AlertLevel
    timestamp: datetime
    metadata: dict = None

class AlertManager:
    """告警管理器"""
    
    def __init__(self):
        self.alerts: List[Alert] = []
        self.handlers: List[Callable] = []
    
    def register_handler(self, handler: Callable):
        """注册告警处理器"""
        self.handlers.append(handler)
    
    async def send_alert(self, title: str, message: str, level: AlertLevel, metadata: dict = None):
        """发送告警"""
        alert = Alert(
            title=title,
            message=message,
            level=level,
            timestamp=datetime.now(),
            metadata=metadata or {}
        )
        
        self.alerts.append(alert)
        
        # 调用所有处理器
        for handler in self.handlers:
            try:
                await handler(alert)
            except Exception as e:
                print(f"告警处理器错误: {e}")
    
    async def check_metrics(self, metrics: dict):
        """检查指标"""
        # 检查磁盘空间
        if metrics.get("disk_usage", 0) > 90:
            await self.send_alert(
                "磁盘空间不足",
                f"磁盘使用率: {metrics['disk_usage']}%",
                AlertLevel.WARNING
            )
        
        # 检查内存使用
        if metrics.get("memory_usage", 0) > 90:
            await self.send_alert(
                "内存使用过高",
                f"内存使用率: {metrics['memory_usage']}%",
                AlertLevel.WARNING
            )
        
        # 检查错误率
        if metrics.get("error_rate", 0) > 0.1:
            await self.send_alert(
                "错误率过高",
                f"错误率: {metrics['error_rate'] * 100}%",
                AlertLevel.ERROR
            )

# 告警处理器示例
async def email_alert_handler(alert: Alert):
    """邮件告警处理器"""
    # 发送邮件
    print(f"发送告警邮件: {alert.title}")

async def slack_alert_handler(alert: Alert):
    """Slack告警处理器"""
    # 发送Slack消息
    print(f"发送Slack告警: {alert.title}")
```

---

## 5. 性能优化

### 5.1 缓存策略

```python
from typing import Any, Optional
import json
import hashlib
from datetime import datetime, timedelta

class CacheManager:
    """缓存管理器"""
    
    def __init__(self, default_ttl: int = 3600):
        self.cache = {}
        self.default_ttl = default_ttl
    
    def get(self, key: str) -> Optional[Any]:
        """获取缓存"""
        if key in self.cache:
            entry = self.cache[key]
            if datetime.now() < entry["expires"]:
                return entry["value"]
            else:
                del self.cache[key]
        return None
    
    def set(self, key: str, value: Any, ttl: int = None):
        """设置缓存"""
        ttl = ttl or self.default_ttl
        self.cache[key] = {
            "value": value,
            "expires": datetime.now() + timedelta(seconds=ttl)
        }
    
    def delete(self, key: str):
        """删除缓存"""
        if key in self.cache:
            del self.cache[key]
    
    def clear(self):
        """清空缓存"""
        self.cache.clear()
    
    def generate_key(self, *args) -> str:
        """生成缓存键"""
        key_str = json.dumps(args, sort_keys=True)
        return hashlib.md5(key_str.encode()).hexdigest()

# 使用装饰器
def cache(ttl: int = 3600):
    """缓存装饰器"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            cache_manager = CacheManager()
            key = cache_manager.generate_key(func.__name__, args, kwargs)
            
            # 尝试获取缓存
            cached = cache_manager.get(key)
            if cached is not None:
                return cached
            
            # 执行函数
            result = await func(*args, **kwargs)
            
            # 缓存结果
            cache_manager.set(key, result, ttl)
            
            return result
        return wrapper
    return decorator
```

### 5.2 连接池

```python
import asyncio
from typing import Optional
from contextlib import asynccontextmanager

class ConnectionPool:
    """连接池"""
    
    def __init__(self, max_connections: int = 10):
        self.max_connections = max_connections
        self.semaphore = asyncio.Semaphore(max_connections)
        self.connections = []
    
    @asynccontextmanager
    async def get_connection(self):
        """获取连接"""
        async with self.semaphore:
            connection = await self.create_connection()
            try:
                yield connection
            finally:
                await self.close_connection(connection)
    
    async def create_connection(self):
        """创建连接"""
        # 创建新连接
        connection = await self._create_connection()
        self.connections.append(connection)
        return connection
    
    async def close_connection(self, connection):
        """关闭连接"""
        if connection in self.connections:
            self.connections.remove(connection)
        await connection.close()
    
    async def _create_connection(self):
        """实际创建连接"""
        # 根据需要实现
        pass
```

### 5.3 异步优化

```python
import asyncio
from typing import List, Any
from concurrent.futures import ThreadPoolExecutor

class AsyncOptimizer:
    """异步优化器"""
    
    def __init__(self, max_workers: int = 4):
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
    
    async def run_in_thread(self, func, *args):
        """在线程中运行"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, func, *args)
    
    async def parallel_execute(self, tasks: List[Any]) -> List[Any]:
        """并行执行"""
        return await asyncio.gather(*tasks)
    
    async def batch_process(self, items: List[Any], batch_size: int = 10):
        """批量处理"""
        results = []
        for i in range(0, len(items), batch_size):
            batch = items[i:i + batch_size]
            batch_results = await self.parallel_execute(batch)
            results.extend(batch_results)
        return results
```

---

## 6. 安全加固

### 6.1 SSL/TLS 配置

```python
import ssl
import certifi

def create_ssl_context():
    """创建SSL上下文"""
    context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
    context.load_verify_locations(certifi.where())
    return context
```

### 6.2 速率限制

```python
from collections import defaultdict
from datetime import datetime, timedelta

class RateLimiter:
    """速率限制器"""
    
    def __init__(self, max_requests: int = 60, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
    
    def is_allowed(self, client_id: str) -> bool:
        """检查是否允许"""
        now = datetime.now()
        window_start = now - timedelta(seconds=self.window_seconds)
        
        # 清理过期请求
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if req_time > window_start
        ]
        
        # 检查请求数量
        if len(self.requests[client_id]) >= self.max_requests:
            return False
        
        # 记录请求
        self.requests[client_id].append(now)
        return True
```

### 6.3 输入验证

```python
from pydantic import BaseModel, validator, Field
from typing import Optional, List

class UserInput(BaseModel):
    """用户输入验证"""
    
    message: str = Field(..., min_length=1, max_length=10000)
    session_id: Optional[str] = Field(None, max_length=100)
    
    @validator('message')
    def validate_message(cls, v):
        # 过滤危险字符
        dangerous_chars = ['<', '>', '{', '}', '[', ']']
        for char in dangerous_chars:
            if char in v:
                raise ValueError(f'消息包含危险字符: {char}')
        return v
    
    @validator('session_id')
    def validate_session_id(cls, v):
        if v and not v.isalnum():
            raise ValueError('会话ID只能包含字母和数字')
        return v
```

---

## 7. 日志管理

### 7.1 结构化日志

```python
import logging
import json
from datetime import datetime

class StructuredLogger:
    """结构化日志"""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
    
    def log(self, level: str, message: str, **kwargs):
        """记录日志"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "level": level,
            "message": message,
            **kwargs
        }
        
        if level == "DEBUG":
            self.logger.debug(json.dumps(log_entry))
        elif level == "INFO":
            self.logger.info(json.dumps(log_entry))
        elif level == "WARNING":
            self.logger.warning(json.dumps(log_entry))
        elif level == "ERROR":
            self.logger.error(json.dumps(log_entry))
        elif level == "CRITICAL":
            self.logger.critical(json.dumps(log_entry))
    
    def info(self, message: str, **kwargs):
        self.log("INFO", message, **kwargs)
    
    def error(self, message: str, **kwargs):
        self.log("ERROR", message, **kwargs)
    
    def warning(self, message: str, **kwargs):
        self.log("WARNING", message, **kwargs)
```

### 7.2 日志轮转

```python
from logging.handlers import RotatingFileHandler
import logging

def setup_logging():
    """设置日志"""
    logger = logging.getLogger("aemeath")
    logger.setLevel(logging.DEBUG)
    
    # 文件处理器（轮转）
    file_handler = RotatingFileHandler(
        "aemeath.log",
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(logging.DEBUG)
    
    # 格式化器
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(formatter)
    
    logger.addHandler(file_handler)
    
    return logger
```

---

## 8. 故障排除

### 8.1 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 启动失败 | 端口被占用 | 更换端口或停止占用进程 |
| API调用失败 | 网络问题或密钥错误 | 检查网络和API密钥 |
| 同步失败 | 服务器连接问题 | 检查服务器状态 |
| 内存不足 | 数据量过大 | 增加内存或清理数据 |
| 磁盘空间不足 | 日志/数据过多 | 清理旧数据或增加磁盘 |

### 8.2 调试命令

```bash
# 检查配置
aemeath config show

# 测试API连接
aemeath test api

# 检查数据库
aemeath db check

# 查看日志
aemeath logs --tail 100

# 清理缓存
aemeath cache clear

# 重置配置
aemeath config reset
```

### 8.3 性能分析

```python
import cProfile
import pstats
from io import StringIO

def profile_function(func):
    """性能分析装饰器"""
    def wrapper(*args, **kwargs):
        profiler = cProfile.Profile()
        profiler.enable()
        
        result = func(*args, **kwargs)
        
        profiler.disable()
        
        # 打印分析结果
        s = StringIO()
        ps = pstats.Stats(profiler, stream=s).sort_stats('cumulative')
        ps.print_stats(10)
        print(s.getvalue())
        
        return result
    return wrapper
```

---

## 9. 部署检查清单

### 9.1 部署前检查

- [ ] 环境变量已配置
- [ ] API密钥有效
- [ ] 数据库已初始化
- [ ] SSL证书已配置
- [ ] 防火墙规则已设置
- [ ] 日志目录已创建
- [ ] 备份策略已配置
- [ ] 监控已配置
- [ ] 告警已配置

### 9.2 部署后验证

- [ ] 服务正常启动
- [ ] 健康检查通过
- [ ] API可访问
- [ ] 同步功能正常
- [ ] 日志正常记录
- [ ] 监控数据正常
- [ ] 备份正常执行

---

**最后更新**：2025-01-15
