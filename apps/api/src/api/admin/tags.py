"""PW-052 | Admin эндпоинты меток: CRUD."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api.admin.utils import parse_uuid
from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.tag import Tag
from src.models.user import User
from src.schemas.admin_tag import TagAdminResponse, TagCreateRequest, TagUpdateRequest
from src.schemas.common import ApiResponse
from src.services import tag as tag_service

router = APIRouter(prefix="/tags", tags=["admin-tags"])


def _to_response(tag: Tag, article_count: int = 0) -> TagAdminResponse:
    return TagAdminResponse(
        id=str(tag.id),
        name=tag.name,
        slug=tag.slug,
        color=tag.color,
        group=tag.group,
        article_count=article_count,
        created_at=tag.created_at,
    )


@router.get("", response_model=ApiResponse[list[TagAdminResponse]])
def list_tags(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[TagAdminResponse]]:
    rows = tag_service.get_all_tags_with_counts(db)
    data = [_to_response(tag, count) for tag, count in rows]
    return ApiResponse(success=True, data=data)


@router.post("", response_model=ApiResponse[TagAdminResponse], status_code=201)
def create_tag(
    body: TagCreateRequest,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[TagAdminResponse]:
    try:
        tag = tag_service.create_tag(db, body)
    except ValueError as exc:
        raise HTTPException(409, str(exc))
    db.commit()
    return ApiResponse(success=True, data=_to_response(tag))


@router.put("/{tag_id}", response_model=ApiResponse[TagAdminResponse])
def update_tag(
    tag_id: str,
    body: TagUpdateRequest,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[TagAdminResponse]:
    uid = parse_uuid(tag_id)
    try:
        tag = tag_service.update_tag(db, uid, body)
    except ValueError as exc:
        raise HTTPException(400, str(exc))
    db.commit()

    count = tag_service.get_article_count_for_tag(db, uid)
    return ApiResponse(success=True, data=_to_response(tag, count))


@router.delete("/{tag_id}", status_code=204)
def delete_tag(
    tag_id: str,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> None:
    uid = parse_uuid(tag_id)
    try:
        tag_service.delete_tag(db, uid)
    except ValueError as exc:
        raise HTTPException(404, str(exc))
    db.commit()
