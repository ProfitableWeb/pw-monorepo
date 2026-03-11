"""
PW-041-D2 | Pydantic-схемы для эндпоинтов хранилища (info + test).
Секреты (access_key, secret_key) НИКОГДА не включаются в ответ.
"""

from pydantic import BaseModel


class StorageConfigInfo(BaseModel):
    max_upload_image_mb: int
    max_upload_other_mb: int
    upload_dir: str | None = None
    bucket: str | None = None
    region: str | None = None
    endpoint: str | None = None
    public_endpoint: str | None = None


class StorageHealthInfo(BaseModel):
    connected: bool
    latency_ms: int | None = None
    error: str | None = None


class StorageStatsInfo(BaseModel):
    media_files: int
    media_size: int
    avatars_count: int
    by_type: dict[str, int]


class StorageSyncInfo(BaseModel):
    local_only: int = 0
    s3_only: int = 0
    synced: int = 0
    last_sync_at: str | None = None


class StorageInfoResponse(BaseModel):
    backend: str
    config: StorageConfigInfo
    health: StorageHealthInfo
    stats: StorageStatsInfo
    sync: StorageSyncInfo


class StorageTestStep(BaseModel):
    name: str
    success: bool
    latency_ms: int
    error: str | None = None


class StorageTestResponse(BaseModel):
    success: bool
    steps: list[StorageTestStep]
    total_ms: int
