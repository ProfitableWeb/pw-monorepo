"""PW-038 | Admin эндпоинты категорий. PW-051 | CRUD + reorder."""

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.article import Article, ArticleStatus
from src.models.category import Category
from src.models.user import User
from src.schemas.admin_category import (
    CategoryAdminResponse,
    CategoryCreateRequest,
    CategoryReorderRequest,
    CategoryUpdateRequest,
)
from src.schemas.common import ApiResponse
from src.services import category as category_service

router = APIRouter(prefix="/categories", tags=["admin-categories"])


# --- Helpers ---


def _parse_uuid(value: str, label: str = "id") -> uuid.UUID:
    try:
        return uuid.UUID(value)
    except ValueError:
        raise HTTPException(400, f"Некорректный {label}: {value}")


def _to_response(cat: Category, article_count: int = 0) -> CategoryAdminResponse:
    return CategoryAdminResponse(
        id=str(cat.id),
        name=cat.name,
        slug=cat.slug,
        subtitle=cat.subtitle,
        description=cat.description,
        icon=cat.icon,
        color=cat.color,
        parent_id=str(cat.parent_id) if cat.parent_id else None,
        order=cat.order,
        article_count=article_count,
    )


# --- Endpoints ---


@router.get("", response_model=ApiResponse[list[CategoryAdminResponse]])
def list_categories(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[CategoryAdminResponse]]:
    count_col = func.count(Article.id).label("article_count")
    stmt = (
        select(Category, count_col)
        .outerjoin(
            Article,
            (Article.category_id == Category.id)
            & (Article.status == ArticleStatus.PUBLISHED),
        )
        .group_by(Category.id)
        .order_by(Category.order, Category.name)
    )
    rows = db.execute(stmt).all()
    data = [_to_response(c, count) for c, count in rows]
    return ApiResponse(success=True, data=data)


@router.post("", response_model=ApiResponse[CategoryAdminResponse], status_code=201)
def create_category(
    body: CategoryCreateRequest,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[CategoryAdminResponse]:
    try:
        cat = category_service.create_category(db, body)
    except ValueError as exc:
        raise HTTPException(400, str(exc))
    db.commit()
    return ApiResponse(success=True, data=_to_response(cat))


# ВАЖНО: /order ДО /{id}, иначе FastAPI перехватит "order" как UUID
@router.put("/order", response_model=ApiResponse[None])
def reorder_categories(
    body: CategoryReorderRequest,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[None]:
    category_service.reorder_categories(db, body.items)
    db.commit()
    return ApiResponse(success=True, data=None)


@router.put("/{category_id}", response_model=ApiResponse[CategoryAdminResponse])
def update_category(
    category_id: str,
    body: CategoryUpdateRequest,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[CategoryAdminResponse]:
    uid = _parse_uuid(category_id)
    try:
        cat = category_service.update_category(db, uid, body)
    except ValueError as exc:
        raise HTTPException(400, str(exc))
    db.commit()
    count = category_service.get_article_count(db, cat.id)
    return ApiResponse(success=True, data=_to_response(cat, count))


@router.delete("/{category_id}", status_code=204)
def delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> None:
    uid = _parse_uuid(category_id)
    try:
        category_service.delete_category(db, uid)
    except ValueError as exc:
        raise HTTPException(409, str(exc))
    db.commit()
