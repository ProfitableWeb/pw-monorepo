"""PW-048 | Yandex OAuth для SEO: получение токена, подключение/отключение."""

from datetime import datetime, timezone
from urllib.parse import urlencode

import httpx
from sqlalchemy.orm import Session

from src.core.config import settings
from src.core.encryption import decrypt_token, encrypt_token
from src.schemas.seo import YandexConnectionStatus
from src.services.system_settings import get_settings

AUTHORIZE_URL = "https://oauth.yandex.ru/authorize"
TOKEN_URL = "https://oauth.yandex.ru/token"
USERINFO_URL = "https://login.yandex.ru/info"


def get_auth_url() -> str:
    """Формирует URL авторизации Яндекс OAuth (verification_code flow)."""
    params = {
        "response_type": "code",
        "client_id": settings.yandex_seo_client_id,
    }
    return f"{AUTHORIZE_URL}?{urlencode(params)}"


def exchange_code(code: str) -> dict:
    """Обменивает authorization code на access_token + получает инфо о пользователе."""
    # 1. Обмен code → token
    with httpx.Client(timeout=10) as client:
        token_resp = client.post(
            TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "client_id": settings.yandex_seo_client_id,
                "client_secret": settings.yandex_seo_client_secret,
            },
        )
        token_resp.raise_for_status()
        token_data = token_resp.json()

        access_token = token_data["access_token"]

        # 2. Инфо о пользователе
        info_resp = client.get(
            USERINFO_URL,
            headers={"Authorization": f"OAuth {access_token}"},
            params={"format": "json"},
        )
        info_resp.raise_for_status()
        user_info = info_resp.json()

    return {
        "access_token": access_token,
        "account": user_info.get("default_email") or user_info.get("login", ""),
        "user_id": str(user_info.get("id", "")),
        "scopes": token_data.get("scope", "").split() if token_data.get("scope") else [],
    }


def connect(db: Session, code: str) -> YandexConnectionStatus:
    """Полный цикл: обмен code → шифрование → сохранение в SystemSettings."""
    data = exchange_code(code)
    ss = get_settings(db)

    ss.yandex_oauth_token = encrypt_token(data["access_token"])
    ss.yandex_oauth_account = data["account"]
    ss.yandex_oauth_scopes = data["scopes"]
    ss.yandex_oauth_user_id = data["user_id"]
    ss.yandex_oauth_connected_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(ss)

    return YandexConnectionStatus(
        connected=True,
        account=ss.yandex_oauth_account,
        permissions=ss.yandex_oauth_scopes,
        connected_at=ss.yandex_oauth_connected_at.isoformat() if ss.yandex_oauth_connected_at else None,
    )


def disconnect(db: Session) -> YandexConnectionStatus:
    """Удаляет OAuth-токен и метаданные из SystemSettings."""
    ss = get_settings(db)
    ss.yandex_oauth_token = None
    ss.yandex_oauth_account = None
    ss.yandex_oauth_scopes = None
    ss.yandex_oauth_user_id = None
    ss.yandex_oauth_connected_at = None
    db.commit()
    return YandexConnectionStatus(connected=False)


def get_status(db: Session) -> YandexConnectionStatus:
    """Возвращает текущий статус подключения Yandex OAuth."""
    ss = get_settings(db)
    if not ss.yandex_oauth_token:
        return YandexConnectionStatus(connected=False)
    return YandexConnectionStatus(
        connected=True,
        account=ss.yandex_oauth_account,
        permissions=ss.yandex_oauth_scopes,
        connected_at=ss.yandex_oauth_connected_at.isoformat() if ss.yandex_oauth_connected_at else None,
    )


def get_decrypted_token(db: Session) -> str | None:
    """Расшифровывает и возвращает OAuth-токен (или None если не подключён)."""
    ss = get_settings(db)
    if not ss.yandex_oauth_token:
        return None
    return decrypt_token(ss.yandex_oauth_token)
