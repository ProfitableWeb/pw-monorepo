"""PW-042-C | Эндпоинт системного статуса (health check)."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.user import User
from src.schemas.common import ApiResponse
from src.schemas.monitoring import SystemHealthResponse
from src.services import health as health_service

router = APIRouter(prefix="/system", tags=["admin-system"])


@router.get("/health", response_model=ApiResponse[SystemHealthResponse])
def get_health(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[SystemHealthResponse]:
    data = health_service.get_system_health(db)
    return ApiResponse(success=True, data=data)
