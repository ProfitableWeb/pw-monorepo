"""
PW-030 | Auth router: register, login, refresh, logout, me, OAuth.
Токены хранятся в httpOnly cookies (access_token: 15min, refresh_token: 7d).
"""

import logging
from urllib.parse import urlencode

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from jose import JWTError
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user
from src.auth.jwt import (
    clear_auth_cookies,
    create_access_token,
    create_refresh_token,
    set_auth_cookies,
    verify_token,
)
from src.auth.passwords import hash_password, verify_password
from src.core.config import settings
from src.core.database import get_db
from src.models.user import User
from src.schemas.auth import (
    AuthUserResponse,
    LoginRequest,
    OAuthUrlResponse,
    RegisterRequest,
    TelegramAuthRequest,
)
from src.services import user as user_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


def _user_response(user: User) -> AuthUserResponse:
    return AuthUserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        avatar=user.avatar,
        role=user.role.value,
    )


def _issue_tokens(response: Response, user: User) -> None:
    access = create_access_token(str(user.id), user.role.value)
    refresh = create_refresh_token(str(user.id))
    set_auth_cookies(response, access, refresh)


# -----------------------------------------------------------------------
# Email/password
# -----------------------------------------------------------------------


@router.post("/register", response_model=AuthUserResponse)
def register(
    body: RegisterRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthUserResponse:
    if user_service.get_by_email(db, body.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким email уже существует",
        )

    user = user_service.create_user(
        db,
        name=body.name,
        email=body.email,
        password_hash=hash_password(body.password),
    )
    _issue_tokens(response, user)
    return _user_response(user)


@router.post("/login", response_model=AuthUserResponse)
def login(
    body: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthUserResponse:
    user = user_service.get_by_email(db, body.email)
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
        )
    if not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Аккаунт заблокирован",
        )

    _issue_tokens(response, user)
    return _user_response(user)


# -----------------------------------------------------------------------
# Token refresh / logout / me
# -----------------------------------------------------------------------


@router.post("/refresh", response_model=AuthUserResponse)
def refresh(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthUserResponse:
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token отсутствует",
        )

    try:
        payload = verify_token(token)
    except JWTError:
        clear_auth_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный refresh token",
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный тип токена",
        )

    user = user_service.get_by_id(db, payload["sub"])
    if not user or not user.is_active:
        clear_auth_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден",
        )

    _issue_tokens(response, user)
    return _user_response(user)


@router.post("/logout")
def logout(response: Response) -> dict[str, bool]:
    clear_auth_cookies(response)
    return {"success": True}


@router.get("/me", response_model=AuthUserResponse)
def me(user: User = Depends(get_current_user)) -> AuthUserResponse:
    return _user_response(user)


# -----------------------------------------------------------------------
# OAuth — URL generation
# -----------------------------------------------------------------------


def _build_callback_url(request: Request, provider: str) -> str:
    """Формирует OAuth callback URL из текущего запроса."""
    base = str(request.base_url).rstrip("/")
    return f"{base}/api/auth/{provider}/callback"


@router.get("/{provider}/url", response_model=OAuthUrlResponse)
def get_oauth_url(
    provider: str,
    request: Request,
) -> OAuthUrlResponse:
    # state содержит origin для определения, куда редиректить после OAuth
    origin = request.query_params.get("origin", settings.frontend_url)
    mode = request.query_params.get("mode", "")
    # Режим привязки: state = "link:{origin}"
    state = f"link:{origin}" if mode == "link" else origin
    callback_url = _build_callback_url(request, provider)

    if provider == "yandex":
        from src.auth.oauth.yandex import get_authorization_url

        return OAuthUrlResponse(url=get_authorization_url(state=state, callback_url=callback_url))

    if provider == "google":
        from src.auth.oauth.google import get_authorization_url

        return OAuthUrlResponse(url=get_authorization_url(state=state, callback_url=callback_url))

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Неизвестный провайдер: {provider}",
    )


# -----------------------------------------------------------------------
# OAuth — callbacks
# -----------------------------------------------------------------------


def _extract_oauth_profile(provider: str, code: str, callback_url: str) -> dict:
    """Обмен кода на профиль OAuth-пользователя."""
    if provider == "yandex":
        from src.auth.oauth.yandex import exchange_code

        return exchange_code(code, callback_url=callback_url)
    if provider == "google":
        from src.auth.oauth.google import exchange_code

        return exchange_code(code, callback_url=callback_url)

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Неизвестный провайдер: {provider}",
    )


@router.get("/{provider}/callback")
def oauth_callback(
    provider: str,
    code: str,
    request: Request,
    state: str = "",
    response: Response = Response(),  # noqa: B008
    db: Session = Depends(get_db),
) -> Response:
    # Определяем режим: привязка или логин
    is_link_mode = state.startswith("link:")
    redirect_base = state[5:] if is_link_mode else (state or settings.frontend_url)
    callback_url = _build_callback_url(request, provider)

    try:
        profile = _extract_oauth_profile(provider, code, callback_url)

        if is_link_mode:
            # Режим привязки: берём текущего пользователя из JWT cookie
            from src.auth.dependencies import get_optional_user

            current_user = get_optional_user(request, db)
            if not current_user:
                params = urlencode({"error": "not_authenticated"})
                redirect_url = f"{redirect_base}/auth/callback?{params}"
                return Response(
                    status_code=status.HTTP_302_FOUND,
                    headers={"Location": redirect_url},
                )
            try:
                user_service.link_oauth(
                    db, current_user, provider, profile["id"]
                )
            except ValueError:
                params = urlencode({"error": "oauth_already_linked"})
                redirect_url = f"{redirect_base}/auth/callback?{params}"
                return Response(
                    status_code=status.HTTP_302_FOUND,
                    headers={"Location": redirect_url},
                )
            redirect_url = f"{redirect_base}/auth/callback?linked={provider}"
            return Response(
                status_code=status.HTTP_302_FOUND,
                headers={"Location": redirect_url},
            )

        # Обычный режим: логин/регистрация
        user = user_service.get_or_create_oauth_user(
            db,
            provider=provider,
            oauth_id=profile["id"],
            name=profile["name"],
            email=profile["email"],
            avatar=profile.get("avatar"),
        )

        redirect_url = f"{redirect_base}/auth/callback?success=true"
        redirect_response = Response(
            status_code=status.HTTP_302_FOUND,
            headers={"Location": redirect_url},
        )
        _issue_tokens(redirect_response, user)
        return redirect_response

    except Exception:
        logger.exception("OAuth callback error for provider=%s", provider)
        params = urlencode({"error": "oauth_failed"})
        redirect_url = f"{redirect_base}/auth/callback?{params}"
        return Response(
            status_code=status.HTTP_302_FOUND,
            headers={"Location": redirect_url},
        )


# -----------------------------------------------------------------------
# Telegram Login Widget
# -----------------------------------------------------------------------


@router.post("/telegram/verify", response_model=AuthUserResponse)
def telegram_verify(
    body: TelegramAuthRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthUserResponse:
    from src.auth.oauth.telegram import verify_telegram_auth

    auth_data = {
        "id": body.id,
        "first_name": body.first_name,
        "username": body.username,
        "photo_url": body.photo_url,
        "auth_date": body.auth_date,
        "hash": body.hash,
    }

    if not verify_telegram_auth(auth_data):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невалидные данные Telegram",
        )

    email = f"{body.id}@telegram.user"
    name = body.first_name
    if body.username:
        name = body.username

    user = user_service.get_or_create_oauth_user(
        db,
        provider="telegram",
        oauth_id=str(body.id),
        name=name,
        email=email,
        avatar=body.photo_url,
    )

    _issue_tokens(response, user)
    return _user_response(user)
