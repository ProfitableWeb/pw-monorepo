"""
PW-030 | Telegram Login Widget: HMAC-SHA256 верификация hash с Bot Token.
НЕ OAuth — фронт отправляет подписанные данные, бэкенд верифицирует подпись.
"""

import hashlib
import hmac

from src.core.config import settings


def verify_telegram_auth(data: dict) -> bool:
    """Верифицирует данные Telegram Login Widget через HMAC-SHA256."""
    if not settings.telegram_bot_token:
        return False

    check_hash = data.pop("hash", None)
    if not check_hash:
        return False

    # Фильтруем None значения и сортируем
    filtered = {k: v for k, v in data.items() if v is not None}
    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(filtered.items())
    )

    secret_key = hashlib.sha256(
        settings.telegram_bot_token.encode()
    ).digest()
    computed_hash = hmac.new(
        secret_key, data_check_string.encode(), hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(computed_hash, check_hash)
