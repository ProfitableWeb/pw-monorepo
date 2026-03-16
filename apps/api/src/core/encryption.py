"""PW-048 | Шифрование OAuth-токенов (Fernet, симметричное)."""

import threading

from cryptography.fernet import Fernet, InvalidToken

from src.core.config import settings

_lock = threading.Lock()
_fernet: Fernet | None = None


def _get_fernet() -> Fernet:
    """Возвращает кешированный Fernet-инстанс; бросает ValueError если ключ не задан."""
    global _fernet  # noqa: PLW0603
    if _fernet is not None:
        return _fernet
    with _lock:
        if _fernet is not None:
            return _fernet
        key = settings.encryption_key.strip()
        if not key:
            raise ValueError(
                "ENCRYPTION_KEY не задан в .env. "
                'Сгенерируйте: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"'
            )
        _fernet = Fernet(key.encode())
        return _fernet


def encrypt_token(token: str) -> str:
    """Шифрует OAuth-токен."""
    return _get_fernet().encrypt(token.encode()).decode()


def decrypt_token(encrypted: str) -> str:
    """Расшифровывает OAuth-токен. Бросает ValueError при невалидном токене."""
    try:
        return _get_fernet().decrypt(encrypted.encode()).decode()
    except InvalidToken as exc:
        raise ValueError("Не удалось расшифровать токен — ключ изменился?") from exc
