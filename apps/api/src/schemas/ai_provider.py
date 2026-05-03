"""
PW-064 | Pydantic-схемы для AI-провайдеров.
"""

from datetime import datetime

from pydantic import BaseModel, Field


class AiProviderCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    api_type: str = Field(pattern="^(openai_compatible|anthropic)$")
    api_key: str = Field(min_length=1, description="API-ключ (шифруется при сохранении)")
    base_url: str | None = Field(
        default=None, max_length=500,
        description="URL эндпоинта (обязателен для openai_compatible, не нужен для anthropic)",
    )
    model_name: str = Field(min_length=1, max_length=200)
    max_context_tokens: int | None = Field(default=None, ge=1024, le=2_000_000)
    description: str | None = Field(default=None, max_length=1000)
    is_default: bool = False


class AiProviderUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    api_key: str | None = Field(
        default=None, min_length=1,
        description="Новый API-ключ (если передан — перешифровывается)",
    )
    base_url: str | None = Field(default=None, max_length=500)
    model_name: str | None = Field(default=None, min_length=1, max_length=200)
    max_context_tokens: int | None = Field(default=None, ge=1024, le=2_000_000)
    description: str | None = None
    is_active: bool | None = None


class AiProviderResponse(BaseModel):
    id: str
    name: str
    api_type: str
    api_key_prefix: str
    base_url: str | None = None
    model_name: str
    is_default: bool
    is_active: bool
    max_context_tokens: int | None = None
    description: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}


class AiProviderTestRawRequest(BaseModel):
    api_type: str = Field(pattern="^(openai_compatible|anthropic)$")
    api_key: str = Field(min_length=1)
    base_url: str | None = None
    model_name: str = Field(min_length=1)


class AiProviderTestResult(BaseModel):
    success: bool
    latency_ms: int = 0
    model_response: str | None = None
    error: str | None = None
