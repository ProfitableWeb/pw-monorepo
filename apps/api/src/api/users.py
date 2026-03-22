"""
PW-034 | Управление профилем пользователя: данные, пароль, аватар, OAuth-привязки.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user
from src.auth.passwords import hash_password, verify_password
from src.core.database import get_db
from src.models.user import User
from src.schemas.common import ApiResponse
from src.schemas.user import (
    ChangePasswordRequest,
    ProfileResponse,
    SetPasswordRequest,
    UpdateProfileRequest,
)
from src.services import user as user_service
from src.services.avatar import avatar_path, process_avatar, validate_avatar
from src.services.storage import storage

router = APIRouter(prefix="/users", tags=["users"])


def _profile_response(user: User, db: Session) -> ProfileResponse:
    providers = user_service.get_oauth_providers(db, user)
    return ProfileResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        avatar=user.avatar,
        bio=user.bio,
        social_links=user.social_links,
        role=user.role.value,
        has_password=user.password_hash is not None,
        oauth_provider=user.oauth_provider,
        oauth_providers=providers,
    )


@router.get("/me", response_model=ApiResponse[ProfileResponse])
def get_profile(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApiResponse[ProfileResponse]:
    return ApiResponse(success=True, data=_profile_response(user, db))


@router.patch("/me", response_model=ApiResponse[ProfileResponse])
def update_profile(
    body: UpdateProfileRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApiResponse[ProfileResponse]:
    try:
        fields = body.model_dump(exclude_unset=True)
        user = user_service.update_profile(db, user, **fields)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=str(e)
        ) from e
    return ApiResponse(success=True, data=_profile_response(user, db))


@router.post("/me/password", response_model=ApiResponse[ProfileResponse])
def set_password_endpoint(
    body: SetPasswordRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApiResponse[ProfileResponse]:
    """Установить пароль (OAuth-пользователь без пароля)."""
    if user.password_hash is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пароль уже установлен. Используйте смену пароля.",
        )
    user = user_service.set_password(db, user, hash_password(body.new_password))
    return ApiResponse(success=True, data=_profile_response(user, db))


@router.post(
    "/me/password/change", response_model=ApiResponse[ProfileResponse]
)
def change_password(
    body: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApiResponse[ProfileResponse]:
    """Сменить пароль (требуется старый пароль)."""
    if not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пароль не установлен. Используйте установку пароля.",
        )
    if not verify_password(body.old_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неверный текущий пароль",
        )
    user = user_service.set_password(db, user, hash_password(body.new_password))
    return ApiResponse(success=True, data=_profile_response(user, db))


@router.post("/me/avatar", response_model=ApiResponse[ProfileResponse])
def upload_avatar(
    file: UploadFile,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApiResponse[ProfileResponse]:
    data = file.file.read()

    error = validate_avatar(file.content_type or "", len(data))
    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=error
        )

    processed = process_avatar(data)
    path = avatar_path(str(user.id))
    url = storage.save(path, processed)

    user = user_service.update_avatar(db, user, url)
    return ApiResponse(success=True, data=_profile_response(user, db))


@router.delete("/me/avatar", response_model=ApiResponse[ProfileResponse])
def delete_avatar(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApiResponse[ProfileResponse]:
    if user.avatar and user.avatar.startswith("/uploads/"):
        path = avatar_path(str(user.id))
        storage.delete(path)
    user = user_service.update_avatar(db, user, None)
    return ApiResponse(success=True, data=_profile_response(user, db))


# -----------------------------------------------------------------------
# OAuth-привязки (мультипровайдер)
# -----------------------------------------------------------------------


@router.delete(
    "/me/oauth/{provider}", response_model=ApiResponse[ProfileResponse]
)
def unlink_oauth_provider(
    provider: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApiResponse[ProfileResponse]:
    """Отвязать OAuth-провайдер от пользователя."""
    try:
        user_service.unlink_oauth(db, user, provider)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e
    return ApiResponse(success=True, data=_profile_response(user, db))
