"""
PW-027 | Синхронный SQLAlchemy engine + FastAPI-зависимость get_db().
Осознанный выбор sync psycopg2 — проще для старта.
TODO: миграция на async (asyncpg) при оптимизации производительности.
"""

from collections.abc import Generator
from typing import Any

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from src.core.config import settings

engine = create_engine(settings.database_url, echo=settings.debug)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db() -> Generator[Session, Any, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
