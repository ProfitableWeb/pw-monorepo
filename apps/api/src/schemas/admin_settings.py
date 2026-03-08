"""PW-038 | Admin-схемы системных настроек."""

import re
from datetime import datetime

from pydantic import BaseModel, field_validator

_TZ_RE = re.compile(r"^[+-]\d{2}:\d{2}$")


class SystemSettingsResponse(BaseModel):
    timezone: str
    updated_at: datetime

    model_config = {"from_attributes": True}


class SystemSettingsUpdateRequest(BaseModel):
    timezone: str | None = None

    @field_validator("timezone")
    @classmethod
    def validate_timezone(cls, v: str | None) -> str | None:
        if v is None:
            return v
        if not _TZ_RE.match(v):
            raise ValueError("Формат часового пояса: ±HH:MM")
        sign = v[0]
        hours = int(v[1:3])
        minutes = int(v[4:6])
        max_hours = 14 if sign == "+" else 12
        if hours > max_hours or minutes > 59 or (hours == max_hours and minutes > 0):
            raise ValueError("Некорректное смещение часового пояса")
        return v
