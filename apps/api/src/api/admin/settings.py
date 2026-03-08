"""PW-038 | Admin эндпоинты системных настроек. Только admin."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.user import User
from src.schemas.admin_settings import (
    SystemSettingsResponse,
    SystemSettingsUpdateRequest,
)
from src.schemas.common import ApiResponse
from src.services import system_settings as settings_service

router = APIRouter(prefix="/settings", tags=["admin-settings"])


@router.get("", response_model=ApiResponse[SystemSettingsResponse])
def get_settings(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[SystemSettingsResponse]:
    settings = settings_service.get_settings(db)
    return ApiResponse(
        success=True,
        data=SystemSettingsResponse(
            timezone=settings.timezone, updated_at=settings.updated_at
        ),
    )


@router.patch("", response_model=ApiResponse[SystemSettingsResponse])
def update_settings(
    body: SystemSettingsUpdateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_admin),
) -> ApiResponse[SystemSettingsResponse]:
    settings = settings_service.update_settings(
        db, timezone=body.timezone, updated_by=user.id
    )
    return ApiResponse(
        success=True,
        data=SystemSettingsResponse(
            timezone=settings.timezone, updated_at=settings.updated_at
        ),
    )
