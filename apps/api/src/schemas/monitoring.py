"""
PW-042-D1 | Pydantic-схемы для эндпоинтов мониторинга (health, errors, audit).
"""

from pydantic import BaseModel

# ---------------------------------------------------------------------------
# System Health
# ---------------------------------------------------------------------------


class DiskInfo(BaseModel):
    total_gb: float
    used_gb: float
    percent: float


class MemoryInfo(BaseModel):
    total_gb: float
    used_gb: float
    percent: float


class ServiceStatusInfo(BaseModel):
    name: str
    connected: bool
    latency_ms: int | None = None
    error: str | None = None


class SystemHealthResponse(BaseModel):
    status: str  # 'ok' | 'degraded' | 'down'
    uptime_seconds: int
    version: str
    python_version: str
    cpu_percent: float
    disk: DiskInfo
    memory: MemoryInfo
    services: list[ServiceStatusInfo]
    errors_24h: int


# ---------------------------------------------------------------------------
# Error Log
# ---------------------------------------------------------------------------


class ErrorLogResponse(BaseModel):
    id: str
    timestamp: str
    level: str  # 'warning' | 'error' | 'critical'
    event: str
    message: str
    traceback: str | None = None
    request_method: str | None = None
    request_path: str | None = None
    request_id: str | None = None
    user_id: str | None = None
    user_name: str | None = None
    user_email: str | None = None
    ip_address: str | None = None
    user_agent: str | None = None
    status_code: int | None = None
    context: dict | None = None
    resolved: bool


class ErrorStatsResponse(BaseModel):
    last_24h: int
    last_7d: int
    last_30d: int


# ---------------------------------------------------------------------------
# Audit Log
# ---------------------------------------------------------------------------


class AuditLogResponse(BaseModel):
    id: str
    timestamp: str
    user_id: str | None = None
    user_name: str | None = None
    user_email: str | None = None
    action: str
    resource_type: str
    resource_id: str | None = None
    changes: dict | None = None
    request_id: str | None = None
    ip_address: str | None = None
    user_agent: str | None = None
