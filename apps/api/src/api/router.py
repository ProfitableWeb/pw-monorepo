"""
PW-030/PW-038/PW-047 | Корневой роутер /api — точка монтирования всех суб-роутеров.
Порядок include_router влияет на приоритет маршрутов в Swagger.
"""

from fastapi import APIRouter

from src.api.admin.router import admin_router
from src.api.articles import router as articles_router
from src.api.authors import router as authors_router
from src.api.pages import router as pages_router
from src.api.auth import router as auth_router
from src.api.categories import router as categories_router
from src.api.comments import router as comments_router
from src.api.seo import router as seo_router
from src.api.users import router as users_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(admin_router)
api_router.include_router(seo_router)
api_router.include_router(categories_router)
api_router.include_router(articles_router)
api_router.include_router(authors_router)
api_router.include_router(pages_router)
api_router.include_router(comments_router)
api_router.include_router(users_router)
