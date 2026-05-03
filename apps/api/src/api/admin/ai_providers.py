"""
PW-064 | Admin API для управления AI-провайдерами.
GET    /api/admin/ai-providers              — список (ключи маскированы)
POST   /api/admin/ai-providers              — создать
PATCH  /api/admin/ai-providers/{id}         — обновить
DELETE /api/admin/ai-providers/{id}         — удалить
POST   /api/admin/ai-providers/{id}/default — установить по умолчанию
POST   /api/admin/ai-providers/{id}/toggle  — вкл/выкл
POST   /api/admin/ai-providers/{id}/test    — проверить подключение
"""

from typing import TYPE_CHECKING

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api.admin.utils import parse_uuid
from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.user import User
from src.schemas.ai_provider import (
    AiProviderCreateRequest,
    AiProviderResponse,
    AiProviderTestRawRequest,
    AiProviderTestResult,
    AiProviderUpdateRequest,
)
from src.schemas.common import ApiResponse
from src.services import ai_provider as provider_service
from src.services import audit_log as audit_service

if TYPE_CHECKING:
    from src.models.ai_provider import AiProvider

router = APIRouter(prefix="/ai-providers", tags=["admin-ai-providers"])


def _to_response(provider: "AiProvider") -> AiProviderResponse:
    return AiProviderResponse(
        id=str(provider.id),
        name=provider.name,
        api_type=getattr(provider.api_type, "value", provider.api_type),
        api_key_prefix=provider.api_key_prefix,
        base_url=provider.base_url,
        model_name=provider.model_name,
        is_default=provider.is_default,
        is_active=provider.is_active,
        max_context_tokens=provider.max_context_tokens,
        description=provider.description,
        created_at=provider.created_at,
        updated_at=provider.updated_at,
    )


@router.post("/test-raw", response_model=ApiResponse[AiProviderTestResult])
def test_provider_raw(
    body: AiProviderTestRawRequest,
    _user: User = Depends(get_current_admin),
) -> ApiResponse[AiProviderTestResult]:
    """Проверка подключения по сырым данным (до сохранения провайдера)."""
    result = provider_service.test_connection_raw(
        api_type=body.api_type,
        api_key=body.api_key,
        base_url=body.base_url,
        model_name=body.model_name,
    )
    return ApiResponse(success=True, data=result)


@router.get("", response_model=ApiResponse[list[AiProviderResponse]])
def list_providers(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[AiProviderResponse]]:
    providers = provider_service.list_providers(db)
    return ApiResponse(success=True, data=[_to_response(p) for p in providers])


@router.post("", response_model=ApiResponse[AiProviderResponse], status_code=201)
def create_provider(
    body: AiProviderCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> ApiResponse[AiProviderResponse]:
    provider = provider_service.create_provider(
        db,
        name=body.name,
        api_type=body.api_type,
        api_key=body.api_key,
        base_url=body.base_url,
        model_name=body.model_name,
        max_context_tokens=body.max_context_tokens,
        description=body.description,
        is_default=body.is_default,
    )

    audit_service.log_action(
        db,
        user_id=current_user.id,
        action="ai_provider.created",
        resource_type="ai_provider",
        resource_id=provider.id,
        changes={"name": body.name, "api_type": body.api_type, "model": body.model_name},
    )

    db.commit()
    return ApiResponse(success=True, data=_to_response(provider))


@router.patch("/{provider_id}", response_model=ApiResponse[AiProviderResponse])
def update_provider(
    provider_id: str,
    body: AiProviderUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> ApiResponse[AiProviderResponse]:
    uid = parse_uuid(provider_id)

    update_kwargs: dict = {}
    if body.name is not None:
        update_kwargs["name"] = body.name
    if body.api_key is not None:
        update_kwargs["api_key"] = body.api_key
    if body.base_url is not None:
        update_kwargs["base_url"] = body.base_url
    if body.model_name is not None:
        update_kwargs["model_name"] = body.model_name
    if body.max_context_tokens is not None:
        update_kwargs["max_context_tokens"] = body.max_context_tokens
    if body.description is not None:
        update_kwargs["description"] = body.description
    if body.is_active is not None:
        update_kwargs["is_active"] = body.is_active

    try:
        provider = provider_service.update_provider(db, uid, **update_kwargs)
    except ValueError as exc:
        raise HTTPException(404, str(exc))

    audit_service.log_action(
        db,
        user_id=current_user.id,
        action="ai_provider.updated",
        resource_type="ai_provider",
        resource_id=uid,
        changes={k: v for k, v in update_kwargs.items() if k != "api_key"},
    )

    db.commit()
    return ApiResponse(success=True, data=_to_response(provider))


@router.delete("/{provider_id}", status_code=204)
def delete_provider(
    provider_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> None:
    uid = parse_uuid(provider_id)
    try:
        provider = provider_service.get_provider(db, uid)
        if not provider:
            raise ValueError("Провайдер не найден")
        provider_name = provider.name
        provider_service.delete_provider(db, uid)
    except ValueError as exc:
        raise HTTPException(400, str(exc))

    audit_service.log_action(
        db,
        user_id=current_user.id,
        action="ai_provider.deleted",
        resource_type="ai_provider",
        resource_id=uid,
        changes={"name": provider_name},
    )

    db.commit()


@router.get("/{provider_id}/key")
def get_provider_key(
    provider_id: str,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[dict]:
    """Возвращает расшифрованный API-ключ (admin-only)."""
    uid = parse_uuid(provider_id)
    try:
        key = provider_service.get_decrypted_key(db, uid)
    except ValueError as exc:
        raise HTTPException(404, str(exc))
    return ApiResponse(success=True, data={"api_key": key})


@router.post("/{provider_id}/default", response_model=ApiResponse[AiProviderResponse])
def set_default_provider(
    provider_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> ApiResponse[AiProviderResponse]:
    uid = parse_uuid(provider_id)
    try:
        provider = provider_service.set_default(db, uid)
    except ValueError as exc:
        raise HTTPException(400, str(exc))

    audit_service.log_action(
        db,
        user_id=current_user.id,
        action="ai_provider.set_default",
        resource_type="ai_provider",
        resource_id=uid,
        changes={"name": provider.name},
    )

    db.commit()
    return ApiResponse(success=True, data=_to_response(provider))


@router.post("/{provider_id}/toggle", response_model=ApiResponse[AiProviderResponse])
def toggle_provider(
    provider_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> ApiResponse[AiProviderResponse]:
    uid = parse_uuid(provider_id)
    try:
        provider = provider_service.toggle_provider(db, uid)
    except ValueError as exc:
        raise HTTPException(400, str(exc))

    action = "ai_provider.activated" if provider.is_active else "ai_provider.deactivated"
    audit_service.log_action(
        db,
        user_id=current_user.id,
        action=action,
        resource_type="ai_provider",
        resource_id=uid,
        changes={"name": provider.name, "is_active": provider.is_active},
    )

    db.commit()
    return ApiResponse(success=True, data=_to_response(provider))


@router.post("/{provider_id}/test", response_model=ApiResponse[AiProviderTestResult])
def test_provider_connection(
    provider_id: str,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[AiProviderTestResult]:
    uid = parse_uuid(provider_id)
    result = provider_service.test_connection(db, uid)
    return ApiResponse(success=True, data=result)


