"""PW-053 | Общие утилиты admin-роутеров."""

import uuid

from fastapi import HTTPException


def parse_uuid(value: str, label: str = "UUID") -> uuid.UUID:
    """Валидация и парсинг UUID-строки. Бросает HTTP 400 при невалидном формате."""
    try:
        return uuid.UUID(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Невалидный {label}") from exc
