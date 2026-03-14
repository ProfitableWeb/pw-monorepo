"""
PW-030 | Конфигурация через .env (Pydantic Settings).
cors_origins включает оба фронтенда: web (:3000) и admin (:3001).
JWT + OAuth настройки для аутентификации.
"""

import json

from pydantic_settings import BaseSettings

_DEFAULT_ORIGINS = ["http://localhost:3000", "http://localhost:3001"]


class Settings(BaseSettings):
    app_name: str = "ProfitableWeb API"
    debug: bool = False
    database_url: str = "postgresql://postgres:postgres@localhost:5432/profitableweb"

    # str чтобы DotEnvSettingsSource не пытался json.loads() на пустой строке
    cors_origins: str = ""

    def get_cors_origins(self) -> list[str]:
        """Парсит CORS_ORIGINS: JSON-массив, запятые или пустая строка → дефолты."""
        raw = self.cors_origins.strip()
        if not raw:
            return _DEFAULT_ORIGINS
        if raw.startswith("["):
            return json.loads(raw)
        return [s.strip() for s in raw.split(",") if s.strip()]

    # JWT
    jwt_secret: str = "change-me-in-production"
    jwt_access_expire_minutes: int = 15
    jwt_refresh_expire_days: int = 7

    # OAuth — Yandex
    yandex_client_id: str = ""
    yandex_client_secret: str = ""

    # OAuth — Google
    google_client_id: str = ""
    google_client_secret: str = ""

    # Telegram Login Widget
    telegram_bot_token: str = ""

    # Frontend URLs (для OAuth callback редиректов)
    frontend_url: str = "http://localhost:3000"
    admin_url: str = "http://localhost:3001"

    # Файловое хранилище (ADR-003)
    upload_dir: str = "~/profitableweb/uploads"
    upload_base_url: str = "/uploads"
    storage_backend: str = "local"  # "local" | "s3"

    # S3 (Cloud.ru Evolution Object Storage) — PW-041-C
    s3_endpoint: str = ""
    s3_bucket: str = ""
    s3_access_key: str = ""
    s3_secret_key: str = ""
    s3_region: str = ""
    s3_public_endpoint: str = ""  # для публичных URL (Cloud.ru: global.s3.cloud.ru)

    # Лимиты загрузки (PW-041)
    max_upload_size_image: int = 20 * 1024 * 1024  # 20 MB
    max_upload_size_other: int = 50 * 1024 * 1024  # 50 MB

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
