"""PW-048 | Общие утилиты для Yandex SEO-сервисов."""

import httpx


class TokenExpiredError(Exception):
    """Токен Яндекс API отозван или истёк."""


def oauth_headers(token: str) -> dict[str, str]:
    """Заголовок авторизации для Yandex OAuth API."""
    return {"Authorization": f"OAuth {token}"}


def check_response(resp: httpx.Response) -> None:
    """Проверяет HTTP-ответ, бросает TokenExpiredError при 401."""
    if resp.status_code == 401:
        raise TokenExpiredError("Токен Яндекс API отозван или истёк")
    resp.raise_for_status()
