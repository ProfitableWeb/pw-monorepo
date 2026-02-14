"""
PW-027 | Корневой роутер /api — точка монтирования всех суб-роутеров.
Порядок include_router влияет на приоритет маршрутов в Swagger.
"""

from fastapi import APIRouter

from src.api.articles import router as articles_router
from src.api.categories import router as categories_router
from src.api.comments import router as comments_router

api_router = APIRouter(prefix="/api")

api_router.include_router(categories_router)
api_router.include_router(articles_router)
api_router.include_router(comments_router)
