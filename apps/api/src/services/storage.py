"""
PW-034/PW-041 | Абстракция файлового хранилища (ADR-003).
LocalStorage — диск VM + nginx. S3Storage — Cloud.ru Object Storage (boto3).
Переключение: STORAGE_BACKEND=local|s3 в .env.
"""

import mimetypes
import os
from abc import ABC, abstractmethod
from pathlib import Path

from src.core.config import settings


class StorageBackend(ABC):
    """4 метода — весь интерфейс работы с файлами в проекте."""

    @abstractmethod
    def save(self, path: str, data: bytes) -> str:
        """Сохраняет data по указанному path. Возвращает публичный URL."""
        ...

    @abstractmethod
    def delete(self, path: str) -> None:
        """Удаляет файл по path."""
        ...

    @abstractmethod
    def url(self, path: str) -> str:
        """Возвращает публичный URL для path."""
        ...

    @abstractmethod
    def exists(self, path: str) -> bool:
        """Проверяет наличие файла по path."""
        ...


class LocalStorage(StorageBackend):
    """Сохраняет в uploads/ на диске, nginx отдаёт как статику."""

    def __init__(self) -> None:
        self._root = Path(os.path.expanduser(settings.upload_dir))
        self._base_url = settings.upload_base_url.rstrip("/")

    def save(self, path: str, data: bytes) -> str:
        full_path = self._root / path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_bytes(data)
        return self.url(path)

    def delete(self, path: str) -> None:
        full_path = self._root / path
        if full_path.exists():
            full_path.unlink()

    def url(self, path: str) -> str:
        return f"{self._base_url}/{path}"

    def exists(self, path: str) -> bool:
        return (self._root / path).exists()


class S3Storage(StorageBackend):
    """Cloud.ru Evolution Object Storage (S3-совместимый). boto3."""

    def __init__(self) -> None:
        import boto3

        self._bucket = settings.s3_bucket
        self._endpoint = settings.s3_endpoint.rstrip("/")
        self._public_endpoint = (
            settings.s3_public_endpoint or settings.s3_endpoint
        ).rstrip("/")
        self._client = boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint,
            aws_access_key_id=settings.s3_access_key,
            aws_secret_access_key=settings.s3_secret_key,
            region_name=settings.s3_region,
        )

    def save(self, path: str, data: bytes) -> str:
        self._client.put_object(
            Bucket=self._bucket,
            Key=path,
            Body=data,
            ContentType=self._guess_content_type(path),
        )
        return self.url(path)

    def delete(self, path: str) -> None:
        self._client.delete_object(Bucket=self._bucket, Key=path)

    def url(self, path: str) -> str:
        return f"{self._public_endpoint}/{self._bucket}/{path}"

    def exists(self, path: str) -> bool:
        from botocore.exceptions import ClientError

        try:
            self._client.head_object(Bucket=self._bucket, Key=path)
            return True
        except ClientError as e:
            if e.response["Error"]["Code"] == "404":
                return False
            raise

    @staticmethod
    def _guess_content_type(path: str) -> str:
        content_type, _ = mimetypes.guess_type(path)
        return content_type or "application/octet-stream"


def _get_storage() -> StorageBackend:
    """Factory: выбор бэкенда по STORAGE_BACKEND в .env."""
    if settings.storage_backend == "s3":
        return S3Storage()
    return LocalStorage()


# Синглтон — используется всем приложением
storage = _get_storage()
