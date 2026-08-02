"""
PW-074 | Тесты конфигурации: отказ подниматься с публично известным ключом
подписи JWT вне режима разработки.
"""

import secrets

import pytest
from pydantic import ValidationError

from src.core.config import _INSECURE_JWT_SECRET, Settings


def _generated_secret() -> str:
    """Секрет генерируется в рантайме — литералов в репозитории не остаётся."""
    return secrets.token_urlsafe(48)


def test_debug_allows_default_secret():
    """В разработке дефолтный секрет допустим — иначе не поднять локально."""
    settings = Settings(_env_file=None, debug=True)

    assert settings.jwt_secret == _INSECURE_JWT_SECRET


def test_production_accepts_real_secret():
    """Заданный секрет вне режима разработки проходит валидацию."""
    value = _generated_secret()

    settings = Settings(_env_file=None, debug=False, jwt_secret=value)  # secret-scan:allow

    assert settings.jwt_secret == value


def test_production_rejects_default_secret():
    """Публичный дефолт вне разработки роняет запуск, а не уходит в прод молча."""
    with pytest.raises(ValidationError, match="JWT_SECRET"):
        Settings(_env_file=None, debug=False, jwt_secret=_INSECURE_JWT_SECRET)  # secret-scan:allow


def test_production_rejects_empty_secret():
    """Пустое значение эквивалентно отсутствию переменной — тоже отказ."""
    with pytest.raises(ValidationError, match="JWT_SECRET"):
        Settings(_env_file=None, debug=False, jwt_secret="")  # secret-scan:allow
