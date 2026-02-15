"""
PW-030 | Конфигурация через .env (Pydantic Settings).
cors_origins включает оба фронтенда: web (:3000) и admin (:3001).
JWT + OAuth настройки для аутентификации.
"""

import json

from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "ProfitableWeb API"
    debug: bool = False
    database_url: str = "postgresql://postgres:postgres@localhost:5432/profitableweb"
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: object) -> list[str]:
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return []
            if v.startswith("["):
                return json.loads(v)
            return [s.strip() for s in v.split(",") if s.strip()]
        return []

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
