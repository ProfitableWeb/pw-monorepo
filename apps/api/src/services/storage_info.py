"""
PW-041-D2 | Сервис информации о хранилище: состояние, конфигурация, статистика, тест.
"""

import os
import time
import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.core.config import settings
from src.models.media_file import MediaFile
from src.models.user import User
from src.services.storage import LocalStorage, S3Storage, storage


def get_storage_info(db: Session) -> dict:
    """Сбор полной информации о хранилище: бэкенд, конфиг, health, статистика."""
    backend = settings.storage_backend

    # --- config (безопасные поля, без секретов) ---
    config: dict = {
        "max_upload_image_mb": settings.max_upload_size_image // (1024 * 1024),
        "max_upload_other_mb": settings.max_upload_size_other // (1024 * 1024),
        "upload_dir": None,
        "bucket": None,
        "region": None,
        "endpoint": None,
        "public_endpoint": None,
    }
    if backend == "local":
        config["upload_dir"] = settings.upload_dir
    else:
        config["bucket"] = settings.s3_bucket
        config["region"] = settings.s3_region
        config["endpoint"] = settings.s3_endpoint
        config["public_endpoint"] = settings.s3_public_endpoint or None

    return {
        "backend": backend,
        "config": config,
        "health": _check_health(),
        "stats": _get_stats(db),
        "sync": {
            "local_only": 0,
            "s3_only": 0,
            "synced": 0,
            "last_sync_at": None,
        },
    }


def test_storage() -> dict:
    """Тест write/read/delete с замером latency каждого шага."""
    test_key = f"_test/{uuid.uuid4()}.txt"
    test_data = b"storage-test-pw041"
    steps: list[dict] = []

    # write
    t0 = time.monotonic()
    try:
        storage.save(test_key, test_data)
        ms = int((time.monotonic() - t0) * 1000)
        steps.append({"name": "write", "success": True, "latency_ms": ms, "error": None})
    except Exception as e:
        ms = int((time.monotonic() - t0) * 1000)
        steps.append({"name": "write", "success": False, "latency_ms": ms, "error": str(e)})

    # read (exists)
    t0 = time.monotonic()
    try:
        storage.exists(test_key)
        ms = int((time.monotonic() - t0) * 1000)
        steps.append({"name": "read", "success": True, "latency_ms": ms, "error": None})
    except Exception as e:
        ms = int((time.monotonic() - t0) * 1000)
        steps.append({"name": "read", "success": False, "latency_ms": ms, "error": str(e)})

    # delete
    t0 = time.monotonic()
    try:
        storage.delete(test_key)
        ms = int((time.monotonic() - t0) * 1000)
        steps.append({"name": "delete", "success": True, "latency_ms": ms, "error": None})
    except Exception as e:
        ms = int((time.monotonic() - t0) * 1000)
        steps.append({"name": "delete", "success": False, "latency_ms": ms, "error": str(e)})

    total_ms = sum(s["latency_ms"] for s in steps)
    success = all(s["success"] for s in steps)

    return {"success": success, "steps": steps, "total_ms": total_ms}


# ── Приватные хелперы ─────────────────────────────────────────────────────────


def _check_health() -> dict:
    """Проверка доступности хранилища с замером latency."""
    t0 = time.monotonic()
    try:
        if isinstance(storage, LocalStorage):
            root = storage._root
            connected = root.is_dir() and os.access(str(root), os.W_OK)
            latency_ms = int((time.monotonic() - t0) * 1000)
            error = None if connected else f"Директория {root} недоступна для записи"
        elif isinstance(storage, S3Storage):
            storage._client.head_bucket(Bucket=storage._bucket)
            latency_ms = int((time.monotonic() - t0) * 1000)
            connected = True
            error = None
        else:
            latency_ms = int((time.monotonic() - t0) * 1000)
            connected = False
            error = f"Неизвестный бэкенд: {type(storage).__name__}"
    except Exception as e:
        latency_ms = int((time.monotonic() - t0) * 1000)
        connected = False
        error = str(e)

    return {"connected": connected, "latency_ms": latency_ms, "error": error}


def _get_stats(db: Session) -> dict:
    """Статистика из БД: кол-во медиафайлов, размер, по типам, аватары."""
    media_files = db.execute(
        select(func.count()).select_from(MediaFile)
    ).scalar() or 0

    media_size = db.execute(
        select(func.coalesce(func.sum(MediaFile.size), 0))
    ).scalar() or 0

    # По типам (паттерн из services/media.py:451)
    rows = db.execute(
        select(MediaFile.file_type, func.count()).group_by(MediaFile.file_type)
    ).all()
    by_type = {str(row[0]): row[1] for row in rows}

    avatars_count = db.execute(
        select(func.count()).select_from(User).where(User.avatar.isnot(None))
    ).scalar() or 0

    return {
        "media_files": media_files,
        "media_size": media_size,
        "avatars_count": avatars_count,
        "by_type": by_type,
    }
