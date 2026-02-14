"""
PW-027 | Обёртка ответов API. Зеркалит packages/types/api.ts → ApiResponse<T>.
Все эндпоинты возвращают {success, data, error?, meta?} — единый контракт с фронтом.
"""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiMeta(BaseModel):
    page: int | None = None
    limit: int | None = None
    total: int | None = None
    has_more: bool | None = None


class ApiError(BaseModel):
    code: str
    message: str
    details: dict[str, Any] | None = None


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T | None = None
    error: ApiError | None = None
    meta: ApiMeta | None = None
