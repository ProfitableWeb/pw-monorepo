"""PW-047 | Публичный эндпоинт SEO-конфигурации (без авторизации).
Web (Next.js) использует для генерации sitemap.xml, robots.txt, RSS, подключения Метрики.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.schemas.common import ApiResponse
from src.schemas.seo import SeoPublicConfigResponse
from src.services import system_settings as settings_service

router = APIRouter(prefix="/seo", tags=["seo"])


@router.get("/config", response_model=ApiResponse[SeoPublicConfigResponse])
def get_seo_config(
    db: Session = Depends(get_db),
) -> ApiResponse[SeoPublicConfigResponse]:
    seo = settings_service.get_seo_settings(db)
    data = SeoPublicConfigResponse(
        sitemap_config=seo.sitemap_config,
        robots_txt=seo.robots_txt,
        rss_config=seo.rss_config,
        metrika_config=seo.metrika_config,
    )
    return ApiResponse(success=True, data=data)
