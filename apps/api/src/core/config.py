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

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
