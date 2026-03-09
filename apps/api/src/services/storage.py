"""
PW-034/PW-041 | Абстракция файлового хранилища (ADR-003).
LocalStorage — запись на диск VM, nginx отдаёт как статику.
"""

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


# Синглтон — используется всем приложением
storage = LocalStorage()
