"""
PW-064 | Сервис AI-провайдеров: CRUD, шифрование ключей, проверка подключения.
Паттерн — функции (не класс), по аналогии с services/mcp_key.py.
"""

import time
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.core.encryption import decrypt_token, encrypt_token
from src.models.ai_provider import AiProvider, ApiType
from src.schemas.ai_provider import AiProviderTestResult


def _make_prefix(api_key: str) -> str:
    """Маскирует ключ: первые 4 + '...' + последние 4 символа."""
    if len(api_key) <= 8:
        return api_key[:2] + "..." + api_key[-2:]
    return api_key[:4] + "..." + api_key[-4:]


# --- Create ---


def create_provider(
    db: Session,
    *,
    name: str,
    api_type: str,
    api_key: str,
    model_name: str,
    base_url: str | None = None,
    max_context_tokens: int | None = None,
    description: str | None = None,
    is_default: bool = False,
) -> AiProvider:
    """Создаёт AI-провайдер с зашифрованным ключом."""
    if is_default:
        _clear_default(db)

    provider = AiProvider(
        name=name,
        api_type=ApiType(api_type),
        api_key_encrypted=encrypt_token(api_key),
        api_key_prefix=_make_prefix(api_key),
        base_url=base_url,
        model_name=model_name,
        is_default=is_default,
        is_active=True,
        max_context_tokens=max_context_tokens,
        description=description,
    )
    db.add(provider)
    db.flush()

    # Если это первый провайдер — сделать его default
    if not is_default and _count_providers(db) == 1:
        provider.is_default = True

    return provider


# --- Read ---


def list_providers(db: Session) -> list[AiProvider]:
    """Все провайдеры (для admin UI)."""
    stmt = select(AiProvider).order_by(AiProvider.created_at.desc())
    return list(db.scalars(stmt).all())


def get_provider(db: Session, provider_id: uuid.UUID) -> AiProvider | None:
    return db.get(AiProvider, provider_id)


def get_default_provider(db: Session) -> AiProvider | None:
    """Возвращает активный провайдер по умолчанию (для агента)."""
    stmt = select(AiProvider).where(
        AiProvider.is_default.is_(True),
        AiProvider.is_active.is_(True),
    )
    return db.scalars(stmt).first()


def get_decrypted_key(db: Session, provider_id: uuid.UUID) -> str:
    """Расшифровывает и возвращает API-ключ. Для использования при вызове LLM."""
    provider = get_provider(db, provider_id)
    if not provider:
        raise ValueError("Провайдер не найден")
    return decrypt_token(provider.api_key_encrypted)


# --- Update ---


def update_provider(
    db: Session,
    provider_id: uuid.UUID,
    *,
    name: str | None = None,
    api_key: str | None = None,
    base_url: str | None = ...,  # type: ignore[assignment]
    model_name: str | None = None,
    max_context_tokens: int | None = ...,  # type: ignore[assignment]
    description: str | None = ...,  # type: ignore[assignment]
    is_active: bool | None = None,
) -> AiProvider:
    """Обновляет провайдер. Если передан api_key — перешифровывает."""
    provider = get_provider(db, provider_id)
    if not provider:
        raise ValueError("Провайдер не найден")

    if name is not None:
        provider.name = name
    if api_key is not None:
        provider.api_key_encrypted = encrypt_token(api_key)
        provider.api_key_prefix = _make_prefix(api_key)
    if base_url is not ...:
        provider.base_url = base_url
    if model_name is not None:
        provider.model_name = model_name
    if max_context_tokens is not ...:
        provider.max_context_tokens = max_context_tokens
    if description is not ...:
        provider.description = description
    if is_active is not None:
        provider.is_active = is_active

    return provider


def set_default(db: Session, provider_id: uuid.UUID) -> AiProvider:
    """Устанавливает провайдер по умолчанию."""
    provider = get_provider(db, provider_id)
    if not provider:
        raise ValueError("Провайдер не найден")
    if not provider.is_active:
        raise ValueError("Нельзя сделать неактивный провайдер основным")

    _clear_default(db)
    provider.is_default = True
    return provider


def toggle_provider(db: Session, provider_id: uuid.UUID) -> AiProvider:
    """Переключает is_active."""
    provider = get_provider(db, provider_id)
    if not provider:
        raise ValueError("Провайдер не найден")

    # Нельзя выключить default-провайдер
    if provider.is_active and provider.is_default:
        raise ValueError("Нельзя деактивировать провайдер по умолчанию. Сначала назначьте другой.")

    provider.is_active = not provider.is_active
    return provider


# --- Delete ---


def delete_provider(db: Session, provider_id: uuid.UUID) -> None:
    """Удаляет провайдер. Нельзя удалить провайдер по умолчанию."""
    provider = get_provider(db, provider_id)
    if not provider:
        raise ValueError("Провайдер не найден")

    if provider.is_default:
        raise ValueError("Нельзя удалить провайдер по умолчанию. Сначала назначьте другой.")

    db.delete(provider)


# --- Test connection ---


def test_connection(db: Session, provider_id: uuid.UUID) -> AiProviderTestResult:
    """Проверяет подключение к LLM: отправляет простой запрос, измеряет latency."""
    provider = get_provider(db, provider_id)
    if not provider:
        return AiProviderTestResult(success=False, error="Провайдер не найден")

    api_key = decrypt_token(provider.api_key_encrypted)
    api_type = provider.api_type
    if isinstance(api_type, ApiType):
        api_type = api_type.value

    return test_connection_raw(
        api_type=api_type,
        api_key=api_key,
        base_url=provider.base_url,
        model_name=provider.model_name,
    )


def test_connection_raw(
    *,
    api_type: str,
    api_key: str,
    base_url: str | None,
    model_name: str,
) -> AiProviderTestResult:
    """Проверяет подключение по сырым данным (без сохранения в БД)."""
    start = time.monotonic()

    try:
        if api_type == "openai_compatible":
            return _test_openai(api_key, base_url, model_name, start)
        elif api_type == "anthropic":
            return _test_anthropic(api_key, model_name, start)
        else:
            return AiProviderTestResult(success=False, error=f"Неизвестный тип API: {api_type}")
    except Exception as exc:
        elapsed = int((time.monotonic() - start) * 1000)
        return AiProviderTestResult(success=False, latency_ms=elapsed, error=str(exc))


def _test_openai(api_key: str, base_url: str | None, model: str, start: float) -> AiProviderTestResult:
    """Проверка OpenAI-compatible провайдера."""
    from openai import OpenAI

    client = OpenAI(api_key=api_key, base_url=base_url, timeout=15.0)
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": "Say 'ok' in one word."}],
        max_tokens=5,
    )
    elapsed = int((time.monotonic() - start) * 1000)
    content = response.choices[0].message.content if response.choices else ""
    return AiProviderTestResult(success=True, latency_ms=elapsed, model_response=content)


def _test_anthropic(api_key: str, model: str, start: float) -> AiProviderTestResult:
    """Проверка Anthropic провайдера."""
    from anthropic import Anthropic

    client = Anthropic(api_key=api_key, timeout=15.0)
    response = client.messages.create(
        model=model,
        max_tokens=5,
        messages=[{"role": "user", "content": "Say 'ok' in one word."}],
    )
    elapsed = int((time.monotonic() - start) * 1000)
    content = response.content[0].text if response.content else ""
    return AiProviderTestResult(success=True, latency_ms=elapsed, model_response=content)


# --- Helpers ---


def _clear_default(db: Session) -> None:
    """Снимает флаг is_default со всех провайдеров."""
    stmt = select(AiProvider).where(AiProvider.is_default.is_(True))
    for p in db.scalars(stmt):
        p.is_default = False


def _count_providers(db: Session) -> int:
    """Количество провайдеров."""
    from sqlalchemy import func

    return db.scalar(select(func.count()).select_from(AiProvider)) or 0
