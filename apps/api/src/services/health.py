"""
PW-042-C | Сервис системного статуса: CPU, память, диск, БД, хранилище.
"""

import platform
import time

import psutil
from sqlalchemy import text
from sqlalchemy.orm import Session

from src.schemas.monitoring import (
    DiskInfo,
    MemoryInfo,
    ServiceStatusInfo,
    SystemHealthResponse,
)
from src.services.error_log import count_errors_24h
from src.services.storage_info import _check_health as _check_storage_health

APP_VERSION = "0.1.0"


def get_system_health(db: Session) -> SystemHealthResponse:
    """Собирает системный статус: CPU, RAM, диск, БД, хранилище."""
    cpu = psutil.cpu_percent(interval=0.1)
    mem = psutil.virtual_memory()

    # На Linux корень /, на Windows — диск C:
    disk_path = "/" if platform.system() != "Windows" else "C:\\"
    disk = psutil.disk_usage(disk_path)

    # Uptime через время создания текущего процесса
    proc = psutil.Process()
    uptime = int(time.time() - proc.create_time())

    # Проверка сервисов
    services = [
        _check_api(),
        _check_db(db),
        _check_storage(),
    ]

    # Общий статус
    db_service = next((s for s in services if s.name == "db"), None)
    if db_service and not db_service.connected:
        status = "down"
    elif all(s.connected for s in services):
        status = "ok"
    else:
        status = "degraded"

    return SystemHealthResponse(
        status=status,
        uptime_seconds=uptime,
        version=APP_VERSION,
        python_version=platform.python_version(),
        cpu_percent=cpu,
        disk=DiskInfo(
            total_gb=round(disk.total / (1024**3), 1),
            used_gb=round(disk.used / (1024**3), 1),
            percent=disk.percent,
        ),
        memory=MemoryInfo(
            total_gb=round(mem.total / (1024**3), 1),
            used_gb=round(mem.used / (1024**3), 1),
            percent=mem.percent,
        ),
        services=services,
        errors_24h=count_errors_24h(db),
    )


def _check_api() -> ServiceStatusInfo:
    """API (self-check) — раз мы дошли сюда, значит работает."""
    return ServiceStatusInfo(name="api", connected=True)


def _check_db(db: Session) -> ServiceStatusInfo:
    """Проверка БД: SELECT 1 с замером latency."""
    t0 = time.monotonic()
    try:
        db.execute(text("SELECT 1"))
        latency = int((time.monotonic() - t0) * 1000)
        return ServiceStatusInfo(name="db", connected=True, latency_ms=latency)
    except Exception as e:
        latency = int((time.monotonic() - t0) * 1000)
        return ServiceStatusInfo(
            name="db", connected=False, latency_ms=latency, error=str(e)
        )


def _check_storage() -> ServiceStatusInfo:
    """Проверка хранилища через существующий хелпер из storage_info."""
    health = _check_storage_health()
    return ServiceStatusInfo(
        name="storage",
        connected=health["connected"],
        latency_ms=health["latency_ms"],
        error=health["error"],
    )
