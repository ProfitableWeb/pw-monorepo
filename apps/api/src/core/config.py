"""
PW-027 | Конфигурация через .env (Pydantic Settings).
cors_origins включает оба фронтенда: web (:3000) и admin (:3001).
TODO: миграция на async (asyncpg) при оптимизации производительности.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "ProfitableWeb API"
    debug: bool = False
    database_url: str = "postgresql://postgres:postgres@localhost:5432/profitableweb"
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
