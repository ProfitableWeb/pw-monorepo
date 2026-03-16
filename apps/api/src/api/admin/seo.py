"""PW-047 | Admin эндпоинты SEO-настроек. Только admin."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.user import User
from src.schemas.common import ApiResponse
from src.schemas.seo import SeoSettingsResponse, SeoSettingsUpdateRequest
from src.services import system_settings as settings_service

router = APIRouter(prefix="/seo", tags=["admin-seo"])


@router.get("/settings", response_model=ApiResponse[SeoSettingsResponse])
def get_seo_settings(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[SeoSettingsResponse]:
    data = settings_service.get_seo_settings(db)
    return ApiResponse(success=True, data=data)


@router.patch("/settings", response_model=ApiResponse[SeoSettingsResponse])
def update_seo_settings(
    body: SeoSettingsUpdateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_admin),
) -> ApiResponse[SeoSettingsResponse]:
    data = settings_service.update_seo_settings(
        db,
        updated_by=user.id,
        sitemap_config=body.sitemap_config,
        robots_txt=body.robots_txt,
        rss_config=body.rss_config,
        default_meta_directives=body.default_meta_directives,
        metrika_config=body.metrika_config,
    )
    return ApiResponse(success=True, data=data)
