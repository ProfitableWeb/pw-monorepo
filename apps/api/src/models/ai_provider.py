"""
PW-064 | Модель AI-провайдеров для подключения к LLM.
Поддерживает OpenAI-совместимые API (OpenAI, vLLM, Ollama, Groq, etc.)
и Anthropic API (Claude). API-ключи хранятся зашифрованно (Fernet).
"""

import enum

from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base, TimestampMixin, UUIDMixin


class ApiType(str, enum.Enum):
    OPENAI_COMPATIBLE = "openai_compatible"
    ANTHROPIC = "anthropic"


class AiProvider(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "ai_providers"

    name: Mapped[str] = mapped_column(String(200))
    api_type: Mapped[ApiType] = mapped_column(String(50))
    api_key_encrypted: Mapped[str] = mapped_column(Text)
    api_key_prefix: Mapped[str] = mapped_column(String(20))
    base_url: Mapped[str | None] = mapped_column(String(500), default=None)
    model_name: Mapped[str] = mapped_column(String(200))
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    max_context_tokens: Mapped[int | None] = mapped_column(Integer, default=None)
    description: Mapped[str | None] = mapped_column(Text, default=None)
