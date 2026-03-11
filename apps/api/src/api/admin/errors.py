"""PW-042-B | Admin-эндпоинты для error tracking."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.user import User
from src.schemas.common import ApiMeta, ApiResponse
from src.schemas.monitoring import ErrorLogResponse, ErrorStatsResponse
from src.services import error_log as error_log_service

router = APIRouter(prefix="/errors", tags=["admin-errors"])


@router.get("", response_model=ApiResponse[list[ErrorLogResponse]])
def get_errors(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    level: str | None = Query(None),
    resolved: bool | None = Query(None),
    date_range: str | None = Query(None, alias="dateRange"),
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[ErrorLogResponse]]:
    items, total = error_log_service.get_errors(
        db, limit=limit, offset=offset, level=level, resolved=resolved, date_range=date_range
    )
    return ApiResponse(
        success=True,
        data=items,
        meta=ApiMeta(limit=limit, total=total, has_more=offset + limit < total),
    )


@router.get("/stats", response_model=ApiResponse[ErrorStatsResponse])
def get_error_stats(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[ErrorStatsResponse]:
    stats = error_log_service.get_error_stats(db)
    return ApiResponse(success=True, data=stats)


@router.get("/{error_id}", response_model=ApiResponse[ErrorLogResponse])
def get_error(
    error_id: uuid.UUID,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[ErrorLogResponse]:
    entry = error_log_service.get_error_by_id(db, error_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Ошибка не найдена")
    return ApiResponse(success=True, data=entry)


@router.post("/{error_id}/resolve", response_model=ApiResponse[None])
def resolve_error(
    error_id: uuid.UUID,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[None]:
    ok = error_log_service.resolve_error(db, error_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Ошибка не найдена")
    return ApiResponse(success=True)
