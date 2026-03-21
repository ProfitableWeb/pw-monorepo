"""
PW-038/PW-041/PW-042/PW-047 | Корневой admin-роутер. Собирает все admin-суб-роутеры
под prefix="/admin".
"""

from fastapi import APIRouter

from src.api.admin.articles import router as articles_router
from src.api.admin.audit_logs import router as audit_logs_router
from src.api.admin.categories import router as categories_router
from src.api.admin.errors import router as errors_router
from src.api.admin.mcp_keys import router as mcp_keys_router
from src.api.admin.media import router as media_router
from src.api.admin.seo import router as seo_router
from src.api.admin.settings import router as settings_router
from src.api.admin.storage import router as storage_router
from src.api.admin.system import router as system_router
from src.api.admin.tags import router as tags_router
from src.api.admin.users import router as users_router

admin_router = APIRouter(prefix="/admin", tags=["admin"])

admin_router.include_router(articles_router)
admin_router.include_router(audit_logs_router)
admin_router.include_router(errors_router)
admin_router.include_router(tags_router)
admin_router.include_router(categories_router)
admin_router.include_router(seo_router)
admin_router.include_router(settings_router)
admin_router.include_router(mcp_keys_router)
admin_router.include_router(media_router)
admin_router.include_router(storage_router)
admin_router.include_router(system_router)
admin_router.include_router(users_router)
