"""
PW-038 | CRUD системных настроек. Синглтон — одна строка в таблице,
создаётся с дефолтами при первом обращении.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.system_settings import SystemSettings


def get_settings(db: Session) -> SystemSettings:
    stmt = select(SystemSettings)
    settings = db.scalars(stmt).first()
    if settings is None:
        settings = SystemSettings(timezone="+03:00")
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def update_settings(
    db: Session,
    *,
    timezone: str | None = None,
    updated_by: uuid.UUID | None = None,
) -> SystemSettings:
    settings = get_settings(db)
    if timezone is not None:
        settings.timezone = timezone
    if updated_by is not None:
        settings.updated_by = updated_by
    db.commit()
    db.refresh(settings)
    return settings
