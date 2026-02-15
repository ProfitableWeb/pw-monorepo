"""
PW-030 | Google OAuth: авторизация, обмен кода на токен, получение профиля.
Эндпоинты: authorize → token → userinfo.
"""

from urllib.parse import urlencode

import httpx

from src.core.config import settings

AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


def _callback_url() -> str:
    """redirect_uri указывает на бэкенд (API сервер)."""
    return "http://localhost:8000/api/auth/google/callback"


def get_authorization_url(state: str) -> str:
    params = {
        "response_type": "code",
        "client_id": settings.google_client_id,
        "redirect_uri": _callback_url(),
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "consent",
    }
    return f"{AUTHORIZE_URL}?{urlencode(params)}"


def exchange_code(code: str) -> dict:
    """Обменивает code на access_token, затем получает профиль пользователя."""
    token_resp = httpx.post(
        TOKEN_URL,
        data={
            "grant_type": "authorization_code",
            "code": code,
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "redirect_uri": _callback_url(),
        },
    )
    token_resp.raise_for_status()
    access_token = token_resp.json()["access_token"]

    info_resp = httpx.get(
        USERINFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    info_resp.raise_for_status()
    data = info_resp.json()

    return {
        "id": str(data["id"]),
        "name": data.get("name", ""),
        "email": data.get("email", ""),
        "avatar": data.get("picture"),
    }
