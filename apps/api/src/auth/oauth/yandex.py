"""
PW-030 | Yandex ID OAuth: авторизация, обмен кода на токен, получение профиля.
Эндпоинты: authorize → token → userinfo.
"""

from urllib.parse import urlencode

import httpx

from src.core.config import settings

AUTHORIZE_URL = "https://oauth.yandex.ru/authorize"
TOKEN_URL = "https://oauth.yandex.ru/token"
USERINFO_URL = "https://login.yandex.ru/info"


def _callback_url() -> str:
    """redirect_uri указывает на бэкенд (API сервер)."""
    # Yandex требует redirect_uri зарегистрированный в приложении
    # В dev: http://localhost:8000/api/auth/yandex/callback
    return "http://localhost:8000/api/auth/yandex/callback"


def get_authorization_url(state: str) -> str:
    params = {
        "response_type": "code",
        "client_id": settings.yandex_client_id,
        "redirect_uri": _callback_url(),
        "state": state,
    }
    return f"{AUTHORIZE_URL}?{urlencode(params)}"


def exchange_code(code: str) -> dict:
    """Обменивает code на access_token, затем получает профиль пользователя."""
    token_resp = httpx.post(
        TOKEN_URL,
        data={
            "grant_type": "authorization_code",
            "code": code,
            "client_id": settings.yandex_client_id,
            "client_secret": settings.yandex_client_secret,
            "redirect_uri": _callback_url(),
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token_resp.raise_for_status()
    access_token = token_resp.json()["access_token"]

    info_resp = httpx.get(
        USERINFO_URL,
        params={"format": "json"},
        headers={"Authorization": f"OAuth {access_token}"},
    )
    info_resp.raise_for_status()
    data = info_resp.json()

    avatar = None
    if data.get("default_avatar_id"):
        avatar = f"https://avatars.yandex.net/get-yapic/{data['default_avatar_id']}/islands-200"

    return {
        "id": str(data["id"]),
        "name": data.get("display_name") or data.get("real_name", ""),
        "email": data.get("default_email", ""),
        "avatar": avatar,
    }
