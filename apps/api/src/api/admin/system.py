"""
PW-042-C | Эндпоинт системного статуса (health check).
PW-074 | Ручной прогон ретенции журналов (error_logs, audit_logs).
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.user import User, UserRole
from src.schemas.common import ApiResponse
from src.schemas.monitoring import LogRetentionResponse, SystemHealthResponse
from src.services import audit_log as audit_service
from src.services import health as health_service
from src.services import retention as retention_service

router = APIRouter(prefix="/system", tags=["admin-system"])


@router.get("/health", response_model=ApiResponse[SystemHealthResponse])
def get_health(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[SystemHealthResponse]:
    data = health_service.get_system_health(db)
    return ApiResponse(success=True, data=data)


@router.post("/logs/purge", response_model=ApiResponse[LogRetentionResponse])
def purge_logs(
    days: int = Query(
        default=retention_service.DEFAULT_RETENTION_DAYS,
        ge=retention_service.MIN_RETENTION_DAYS,
        le=3650,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> ApiResponse[LogRetentionResponse]:
    """
    PW-074 | Удаляет записи журналов старше `days` (по умолчанию 90 —
    срок, заявленный в Политике обработки ПДн). Операция необратима.
    Планировщика нет: прогон запускается явно отсюда либо из CLI-скрипта
    `scripts/purge_logs.py`.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Только администратор может запускать очистку журналов",
        )

    try:
        stats = retention_service.purge_logs(db, days=days)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    audit_service.log_action(
        db,
        user_id=current_user.id,
        action="logs.purged",
        resource_type="personal_data",
        changes=stats,
    )
    db.commit()

    return ApiResponse(success=True, data=LogRetentionResponse(**stats))
