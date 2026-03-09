"""
PW-038/PW-041 | Корневой admin-роутер. Собирает все admin-суб-роутеры
под prefix="/admin".
"""

from fastapi import APIRouter

from src.api.admin.articles import router as articles_router
from src.api.admin.categories import router as categories_router
from src.api.admin.media import router as media_router
from src.api.admin.settings import router as settings_router
from src.api.admin.tags import router as tags_router

admin_router = APIRouter(prefix="/admin", tags=["admin"])

admin_router.include_router(articles_router)
admin_router.include_router(tags_router)
admin_router.include_router(categories_router)
admin_router.include_router(settings_router)
admin_router.include_router(media_router)
