"""PW-047/PW-048 | Admin эндпоинты SEO-настроек + Yandex OAuth/Stats. Только admin."""

import logging
from collections.abc import Generator
from contextlib import contextmanager

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.core.encryption import decrypt_token
from src.models.system_settings import SystemSettings
from src.models.user import User
from src.schemas.common import ApiResponse
from src.schemas.seo import (
    MetrikaStatsResponse,
    SeoSettingsResponse,
    SeoSettingsUpdateRequest,
    WebmasterIndexingResponse,
    WebmasterQueriesResponse,
    WebmasterSummaryResponse,
    YandexAuthUrlResponse,
    YandexConnectionStatus,
    YandexConnectRequest,
)
from src.services import system_settings as settings_service
from src.services.seo import yandex_metrika, yandex_oauth, yandex_webmaster
from src.services.seo._common import TokenExpiredError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/seo", tags=["admin-seo"])


# --- PW-047: SEO-настройки ---


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


# --- PW-048: Yandex OAuth ---


@router.get("/yandex/auth-url", response_model=ApiResponse[YandexAuthUrlResponse])
def get_yandex_auth_url(
    _user: User = Depends(get_current_admin),
) -> ApiResponse[YandexAuthUrlResponse]:
    url = yandex_oauth.get_auth_url()
    return ApiResponse(success=True, data=YandexAuthUrlResponse(url=url))


@router.post("/yandex/connect", response_model=ApiResponse[YandexConnectionStatus])
def connect_yandex(
    body: YandexConnectRequest,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[YandexConnectionStatus]:
    try:
        status = yandex_oauth.connect(db, body.code)
    except Exception as exc:
        logger.exception("Ошибка подключения Yandex OAuth")
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return ApiResponse(success=True, data=status)


@router.post("/yandex/disconnect", response_model=ApiResponse[YandexConnectionStatus])
def disconnect_yandex(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[YandexConnectionStatus]:
    status = yandex_oauth.disconnect(db)
    return ApiResponse(success=True, data=status)


@router.get("/yandex/status", response_model=ApiResponse[YandexConnectionStatus])
def get_yandex_status(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[YandexConnectionStatus]:
    status = yandex_oauth.get_status(db)
    return ApiResponse(success=True, data=status)


# --- PW-048: Yandex API proxy helpers ---


def _get_token_and_settings(db: Session) -> tuple[str, SystemSettings]:
    """Расшифровывает токен и возвращает SystemSettings (одна загрузка из БД)."""
    ss = settings_service.get_settings(db)
    if not ss.yandex_oauth_token:
        raise HTTPException(status_code=403, detail="Яндекс API не подключён")
    token = decrypt_token(ss.yandex_oauth_token)
    return token, ss


def _get_webmaster_ids(db: Session, ss: SystemSettings, token: str) -> tuple[str, str]:
    """Получает user_id и host_id для Вебмастера (без повторного чтения БД)."""
    user_id = ss.yandex_oauth_user_id
    if not user_id:
        user_id = yandex_webmaster.get_user_id(token)
        ss.yandex_oauth_user_id = user_id
        db.commit()

    host_id = yandex_webmaster.get_host_id(token, user_id)
    if not host_id:
        raise HTTPException(
            status_code=404,
            detail="Сайт не найден в Яндекс Вебмастере. Добавьте profitableweb.ru в Вебмастер.",
        )
    return user_id, host_id


@contextmanager
def _handle_yandex_errors(operation: str) -> Generator[None]:
    """Единая обработка ошибок Yandex API для proxy-эндпоинтов."""
    try:
        yield
    except TokenExpiredError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc
    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Ошибка %s", operation)
        raise HTTPException(status_code=502, detail=f"Ошибка Yandex API: {exc}") from exc


# --- PW-048: Yandex Metrika Stats (proxy) ---


@router.get("/metrika/stats", response_model=ApiResponse[MetrikaStatsResponse])
def get_metrika_stats(
    period: str = "7d",
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[MetrikaStatsResponse]:
    token, ss = _get_token_and_settings(db)

    seo = settings_service.get_seo_settings(db)
    counter_id = seo.metrika_config.counter_id
    if not counter_id:
        raise HTTPException(status_code=400, detail="Номер счётчика Метрики не указан")

    with _handle_yandex_errors("получения статистики Метрики"):
        stats = yandex_metrika.get_stats(token, counter_id, period)

    return ApiResponse(success=True, data=stats)


# --- PW-048: Yandex Webmaster (proxy) ---


@router.get("/webmaster/summary", response_model=ApiResponse[WebmasterSummaryResponse])
def get_webmaster_summary(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[WebmasterSummaryResponse]:
    token, ss = _get_token_and_settings(db)
    with _handle_yandex_errors("получения данных Вебмастера"):
        user_id, host_id = _get_webmaster_ids(db, ss, token)
        data = yandex_webmaster.get_summary(token, user_id, host_id)
    return ApiResponse(success=True, data=data)


@router.get("/webmaster/indexing", response_model=ApiResponse[WebmasterIndexingResponse])
def get_webmaster_indexing(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[WebmasterIndexingResponse]:
    token, ss = _get_token_and_settings(db)
    with _handle_yandex_errors("получения индексации"):
        user_id, host_id = _get_webmaster_ids(db, ss, token)
        data = yandex_webmaster.get_indexing(token, user_id, host_id)
    return ApiResponse(success=True, data=data)


@router.get("/webmaster/queries", response_model=ApiResponse[WebmasterQueriesResponse])
def get_webmaster_queries(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[WebmasterQueriesResponse]:
    token, ss = _get_token_and_settings(db)
    with _handle_yandex_errors("получения запросов"):
        user_id, host_id = _get_webmaster_ids(db, ss, token)
        data = yandex_webmaster.get_top_queries(token, user_id, host_id)
    return ApiResponse(success=True, data=data)
