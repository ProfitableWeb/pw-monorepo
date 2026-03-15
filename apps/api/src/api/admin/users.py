"""
PW-045 | Admin-эндпоинты управления пользователями.
GET список с пагинацией/фильтрами, GET детали, PATCH обновление, DELETE деактивация.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.auth.passwords import hash_password
from src.core.database import get_db
from src.models.user import User, UserRole
from src.schemas.common import ApiMeta, ApiResponse
from src.schemas.users.admin import (
    AdminSetPasswordRequest,
    UserAdminBriefResponse,
    UserAdminDetailResponse,
    UserAdminUpdateRequest,
    UserListStatsResponse,
)
from src.services import user as user_service
from src.services.avatar import avatar_path, process_avatar, validate_avatar
from src.services.storage import storage

router = APIRouter(prefix="/users", tags=["admin-users"])


# --- Helpers ---


def _parse_uuid(value: str, label: str = "UUID") -> uuid.UUID:
    try:
        return uuid.UUID(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Невалидный {label}") from exc


def _get_user_or_404(db: Session, user_id: str) -> User:
    uid = _parse_uuid(user_id, "UUID пользователя")
    user = user_service.get_by_id(db, str(uid))
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user


def _to_brief(user: User, articles_count: int = 0) -> UserAdminBriefResponse:
    return UserAdminBriefResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        avatar=user.avatar,
        role=user.role.value if hasattr(user.role, "value") else str(user.role),
        is_active=user.is_active,
        created_at=user.created_at,
        last_login_at=user.last_login_at,
        articles_count=articles_count,
    )


def _to_detail(user: User, db: Session) -> UserAdminDetailResponse:
    providers = user_service.get_oauth_providers(db, user)
    articles_count = len(user.articles) if user.articles else 0
    return UserAdminDetailResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        avatar=user.avatar,
        role=user.role.value if hasattr(user.role, "value") else str(user.role),
        is_active=user.is_active,
        created_at=user.created_at,
        updated_at=user.updated_at,
        last_login_at=user.last_login_at,
        articles_count=articles_count,
        oauth_providers=providers,
        has_password=user.password_hash is not None,
    )


# --- Endpoints ---


@router.get("", response_model=ApiResponse[list[UserAdminBriefResponse]])
def list_users(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = None,
    role: str | None = None,
    is_active: bool | None = None,
    sort: str = "created_at",
    order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> ApiResponse[list[UserAdminBriefResponse]]:
    users, total = user_service.list_users(
        db,
        page=page,
        limit=limit,
        search=search,
        role=role,
        is_active=is_active,
        sort=sort,
        order=order,
    )
    data = [_to_brief(u, len(u.articles) if u.articles else 0) for u in users]
    return ApiResponse(
        success=True,
        data=data,
        meta=ApiMeta(
            page=page,
            limit=limit,
            total=total,
            has_more=(page * limit < total),
        ),
    )


@router.get("/stats", response_model=ApiResponse[UserListStatsResponse])
def get_user_stats(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[UserListStatsResponse]:
    stats = user_service.get_user_stats(db)
    return ApiResponse(
        success=True,
        data=UserListStatsResponse(**stats),
    )


@router.get("/{user_id}", response_model=ApiResponse[UserAdminDetailResponse])
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[UserAdminDetailResponse]:
    user = _get_user_or_404(db, user_id)
    return ApiResponse(success=True, data=_to_detail(user, db))


@router.patch("/{user_id}", response_model=ApiResponse[UserAdminDetailResponse])
def update_user(
    user_id: str,
    body: UserAdminUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> ApiResponse[UserAdminDetailResponse]:
    user = _get_user_or_404(db, user_id)

    # Только admin может менять роли
    if body.role is not None and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Только администратор может менять роли",
        )

    # Нельзя понизить роль последнего admin
    if (
        body.role is not None
        and body.role != "admin"
        and user.role == UserRole.ADMIN
    ):
        admin_count = db.query(User).filter(
            User.role == UserRole.ADMIN, User.is_active.is_(True)
        ).count()
        if admin_count <= 1:
            raise HTTPException(
                status_code=400,
                detail="Нельзя понизить роль последнего администратора",
            )

    # Нельзя деактивировать себя
    if body.is_active is False and user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Нельзя деактивировать свой аккаунт",
        )

    try:
        fields = body.model_dump(exclude_unset=True)
        user = user_service.update_user_admin(db, user, **fields)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e

    return ApiResponse(success=True, data=_to_detail(user, db))


@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> None:
    """Мягкое удаление — деактивация пользователя."""
    user = _get_user_or_404(db, user_id)

    # Только admin может деактивировать
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Только администратор может деактивировать пользователей",
        )

    # Нельзя деактивировать себя
    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Нельзя деактивировать свой аккаунт",
        )

    # Нельзя деактивировать последнего admin
    if user.role == UserRole.ADMIN:
        admin_count = db.query(User).filter(
            User.role == UserRole.ADMIN, User.is_active.is_(True)
        ).count()
        if admin_count <= 1:
            raise HTTPException(
                status_code=400,
                detail="Нельзя деактивировать последнего администратора",
            )

    user.is_active = False
    db.commit()


@router.post(
    "/{user_id}/avatar", response_model=ApiResponse[UserAdminDetailResponse]
)
def upload_user_avatar(
    user_id: str,
    file: UploadFile,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_admin),
) -> ApiResponse[UserAdminDetailResponse]:
    """Загрузка/замена аватара пользователя администратором."""
    user = _get_user_or_404(db, user_id)

    data = file.file.read()
    error = validate_avatar(file.content_type or "", len(data))
    if error:
        raise HTTPException(status_code=400, detail=error)

    processed = process_avatar(data)
    path = avatar_path(str(user.id))
    url = storage.save(path, processed)

    user = user_service.update_avatar(db, user, url)
    return ApiResponse(success=True, data=_to_detail(user, db))


@router.delete(
    "/{user_id}/avatar", response_model=ApiResponse[UserAdminDetailResponse]
)
def delete_user_avatar(
    user_id: str,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_admin),
) -> ApiResponse[UserAdminDetailResponse]:
    """Удаление аватара пользователя администратором."""
    user = _get_user_or_404(db, user_id)

    if user.avatar and user.avatar.startswith("/uploads/"):
        path = avatar_path(str(user.id))
        storage.delete(path)

    user = user_service.update_avatar(db, user, None)
    return ApiResponse(success=True, data=_to_detail(user, db))


@router.post(
    "/{user_id}/password", response_model=ApiResponse[UserAdminDetailResponse]
)
def set_user_password(
    user_id: str,
    body: AdminSetPasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
) -> ApiResponse[UserAdminDetailResponse]:
    """Установка/сброс пароля пользователя администратором."""
    user = _get_user_or_404(db, user_id)
    user = user_service.set_password(db, user, hash_password(body.new_password))
    return ApiResponse(success=True, data=_to_detail(user, db))
