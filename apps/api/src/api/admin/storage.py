"""
PW-041-D2 | Admin-эндпоинты информации о хранилище.
GET /info — конфиг, health, статистика. POST /test — write/read/delete тест.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.user import User
from src.schemas.common import ApiResponse
from src.schemas.storage import StorageInfoResponse, StorageTestResponse
from src.services import storage_info

router = APIRouter(prefix="/storage", tags=["admin-storage"])


@router.get("/info", response_model=ApiResponse[StorageInfoResponse])
def get_info(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[StorageInfoResponse]:
    """Информация о хранилище: бэкенд, конфигурация, health, статистика."""
    data = storage_info.get_storage_info(db)
    return ApiResponse(success=True, data=StorageInfoResponse(**data))


@router.post("/test", response_model=ApiResponse[StorageTestResponse])
def run_test(
    _user: User = Depends(get_current_admin),
) -> ApiResponse[StorageTestResponse]:
    """Тест подключения: write/read/delete тестового файла с замером latency."""
    data = storage_info.test_storage()
    return ApiResponse(success=True, data=StorageTestResponse(**data))
