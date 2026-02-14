"""
PW-027 | Точка входа FastAPI. CORS настроен на web+admin фронтенды.
Эндпоинты монтируются через api_router (/api/*), / и /health — служебные.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.router import api_router
from src.core.config import settings

app = FastAPI(
    title=settings.app_name,
    description="Backend API for ProfitableWeb Research Lab",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
async def root() -> dict[str, str]:
    return {
        "message": settings.app_name,
        "version": "0.1.0",
        "status": "operational",
    }


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy"}
