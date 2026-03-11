"""PW-042-D | Admin-эндпоинты для аудит-лога."""

from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.user import User
from src.schemas.common import ApiMeta, ApiResponse
from src.schemas.monitoring import AuditLogResponse
from src.services import audit_log as audit_log_service

router = APIRouter(prefix="/audit", tags=["admin-audit"])


@router.get("", response_model=ApiResponse[list[AuditLogResponse]])
def get_audit_entries(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    action: str | None = Query(None),
    user_id: str | None = Query(None, alias="userId"),
    date_range: Literal["24h", "7d", "30d"] | None = Query(None, alias="dateRange"),
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[AuditLogResponse]]:
    items, total = audit_log_service.get_entries(
        db, limit=limit, offset=offset, action=action, user_id=user_id, date_range=date_range
    )
    return ApiResponse(
        success=True,
        data=items,
        meta=ApiMeta(limit=limit, total=total, has_more=offset + limit < total),
    )


@router.get("/actions", response_model=ApiResponse[list[str]])
def get_audit_actions(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[str]]:
    actions = audit_log_service.get_unique_actions(db)
    return ApiResponse(success=True, data=actions)


@router.get("/users", response_model=ApiResponse[list[list[str]]])
def get_audit_users(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[list[str]]]:
    users = audit_log_service.get_unique_users(db)
    return ApiResponse(success=True, data=[list(u) for u in users])
