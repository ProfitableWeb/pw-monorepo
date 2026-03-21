"""
PW-061-B | Admin API для управления MCP API-ключами.
POST /api/admin/mcp-keys — создать ключ (возвращает raw key один раз).
GET  /api/admin/mcp-keys — список всех ключей.
DELETE /api/admin/mcp-keys/{key_id} — отозвать ключ.
"""

from typing import TYPE_CHECKING

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api.admin.utils import parse_uuid
from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.user import User
from src.schemas.common import ApiResponse
from src.schemas.mcp import McpKeyCreateRequest, McpKeyCreateResponse, McpKeyResponse
from src.services import audit_log as audit_service
from src.services import mcp_key as mcp_key_service

if TYPE_CHECKING:
    from src.models.mcp_api_key import McpApiKey

router = APIRouter(prefix="/mcp-keys", tags=["admin-mcp-keys"])


def _to_response(key: "McpApiKey") -> McpKeyResponse:
    return McpKeyResponse(
        id=str(key.id),
        name=key.name,
        key_prefix=key.key_prefix,
        scope=key.scope.value,
        is_active=key.is_active,
        last_used_at=key.last_used_at,
        expires_at=key.expires_at,
        created_at=key.created_at,
        user_name=key.user.name if key.user else None,
    )


def _to_create_response(key: "McpApiKey", raw_key: str) -> McpKeyCreateResponse:
    return McpKeyCreateResponse(
        id=str(key.id),
        name=key.name,
        raw_key=raw_key,
        key_prefix=key.key_prefix,
        scope=key.scope.value,
        is_active=key.is_active,
        expires_at=key.expires_at,
        created_at=key.created_at,
    )


@router.get("", response_model=ApiResponse[list[McpKeyResponse]])
def list_mcp_keys(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[McpKeyResponse]]:
    keys = mcp_key_service.list_keys(db)
    data = [_to_response(k) for k in keys]
    return ApiResponse(success=True, data=data)


@router.post("", response_model=ApiResponse[McpKeyCreateResponse], status_code=201)
def create_mcp_key(
    body: McpKeyCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> ApiResponse[McpKeyCreateResponse]:
    api_key, raw_key = mcp_key_service.create_key(
        db,
        user_id=current_user.id,
        name=body.name,
        scope=body.scope,
        expires_in_days=body.expires_in_days,
    )

    audit_service.log_action(
        db,
        user_id=current_user.id,
        action="mcp_key.created",
        resource_type="mcp_api_key",
        resource_id=api_key.id,
        changes={"name": body.name, "scope": body.scope},
    )

    db.commit()
    return ApiResponse(success=True, data=_to_create_response(api_key, raw_key))


@router.delete("/{key_id}", status_code=204)
def revoke_mcp_key(
    key_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> None:
    uid = parse_uuid(key_id)
    try:
        api_key = mcp_key_service.revoke_key(db, uid)
    except ValueError as exc:
        raise HTTPException(404, str(exc))

    audit_service.log_action(
        db,
        user_id=current_user.id,
        action="mcp_key.revoked",
        resource_type="mcp_api_key",
        resource_id=uid,
        changes={"name": api_key.name},
    )

    db.commit()
