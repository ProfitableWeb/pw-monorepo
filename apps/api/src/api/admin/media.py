"""
PW-041 | Admin CRUD эндпоинты для медиа-библиотеки.
Все защищены get_current_admin (admin/editor).
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.media_file import MediaFile
from src.models.user import User
from src.schemas.common import ApiMeta, ApiResponse
from src.schemas.media import MediaFileResponse, MediaFileUpdate, MediaStatsResponse
from src.services import media as media_service
from src.services.storage import storage

router = APIRouter(prefix="/media", tags=["admin-media"])


# --- Хелперы ---


def _parse_uuid(value: str, label: str = "UUID") -> uuid.UUID:
    """Валидация и парсинг UUID строки."""
    try:
        return uuid.UUID(value)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Невалидный {label}")


def _get_media_or_404(db: Session, media_id: str) -> MediaFile:
    """Получает медиафайл или 404."""
    uid = _parse_uuid(media_id, "UUID медиафайла")
    media = media_service.get_media(db, uid)
    if not media:
        raise HTTPException(status_code=404, detail="Медиафайл не найден")
    return media


def _to_response(media: MediaFile) -> MediaFileResponse:
    """Трансформация ORM → Pydantic (с computed-полями)."""
    url = storage.url(media.storage_key)

    # Thumbnail URL из ресайзов
    thumbnail_url = None
    if media.resizes:
        for r in media.resizes:
            if r.get("suffix") == "_thumb":
                thumbnail_url = storage.url(r["key"])
                break

    # Количество связанных статей
    used_in = len(media.articles) if media.articles else 0

    # Обогащаем ресайзы публичными URL
    resizes_with_urls = None
    if media.resizes:
        resizes_with_urls = [
            {**r, "url": storage.url(r["key"])} for r in media.resizes
        ]

    return MediaFileResponse(
        id=str(media.id),
        filename=media.filename,
        storage_key=media.storage_key,
        mime_type=media.mime_type,
        file_type=(
            media.file_type.value
            if hasattr(media.file_type, "value")
            else str(media.file_type)
        ),
        size=media.size,
        width=media.width,
        height=media.height,
        slug=media.slug,
        alt=media.alt,
        caption=media.caption,
        exif_data=media.exif_data,
        purposes=media.purposes or [],
        resizes=resizes_with_urls,
        url=url,
        thumbnail_url=thumbnail_url,
        uploaded_by_id=str(media.uploaded_by_id) if media.uploaded_by_id else None,
        used_in=used_in,
        created_at=media.created_at,
        updated_at=media.updated_at,
    )


# --- Эндпоинты ---


@router.post("/upload", response_model=ApiResponse[MediaFileResponse], status_code=201)
def upload_media(
    file: UploadFile,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_admin),
) -> ApiResponse[MediaFileResponse]:
    """Загрузка медиафайла (multipart/form-data)."""
    data = file.file.read()
    content_type = file.content_type or "application/octet-stream"
    filename = file.filename or "unnamed"

    try:
        media = media_service.upload_media(
            db,
            storage,
            data=data,
            filename=filename,
            content_type=content_type,
            user_id=user.id,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return ApiResponse(success=True, data=_to_response(media))


@router.get("", response_model=ApiResponse[list[MediaFileResponse]])
def list_media(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    file_type: str | None = None,
    purpose: str | None = None,
    search: str | None = None,
    sort_by: str = "created_at",
    order: str = "desc",
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[MediaFileResponse]]:
    """Список медиафайлов с фильтрацией и пагинацией."""
    items, total = media_service.list_media(
        db,
        page=page,
        limit=limit,
        file_type=file_type,
        purpose=purpose,
        search=search,
        sort_by=sort_by,
        order=order,
    )
    return ApiResponse(
        success=True,
        data=[_to_response(m) for m in items],
        meta=ApiMeta(
            page=page,
            limit=limit,
            total=total,
            has_more=(page * limit < total),
        ),
    )


@router.get("/stats", response_model=ApiResponse[MediaStatsResponse])
def get_stats(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[MediaStatsResponse]:
    """Агрегированная статистика медиа-библиотеки."""
    stats = media_service.get_media_stats(db)
    return ApiResponse(success=True, data=MediaStatsResponse(**stats))


@router.get("/{media_id}", response_model=ApiResponse[MediaFileResponse])
def get_media(
    media_id: str,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[MediaFileResponse]:
    """Получение одного медиафайла по ID."""
    media = _get_media_or_404(db, media_id)
    return ApiResponse(success=True, data=_to_response(media))


@router.patch("/{media_id}", response_model=ApiResponse[MediaFileResponse])
def update_media(
    media_id: str,
    body: MediaFileUpdate,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[MediaFileResponse]:
    """Обновление метаданных медиафайла (slug, alt, caption, purposes)."""
    media = _get_media_or_404(db, media_id)
    fields = body.model_dump(exclude_unset=True)
    try:
        media = media_service.update_media(db, media, **fields)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return ApiResponse(success=True, data=_to_response(media))


@router.put("/{media_id}/file", response_model=ApiResponse[MediaFileResponse])
def replace_media_file(
    media_id: str,
    file: UploadFile,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[MediaFileResponse]:
    """Замена физического файла медиа-записи (сохраняет ID, slug, SEO, связи)."""
    media = _get_media_or_404(db, media_id)
    data = file.file.read()
    content_type = file.content_type or "application/octet-stream"
    filename = file.filename or "unnamed"

    try:
        media = media_service.replace_file(
            db,
            storage,
            media,
            data=data,
            filename=filename,
            content_type=content_type,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return ApiResponse(success=True, data=_to_response(media))


@router.delete("/{media_id}", status_code=204)
def delete_media(
    media_id: str,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> None:
    """Удаление медиафайла (файлы из storage + запись из БД)."""
    media = _get_media_or_404(db, media_id)
    media_service.delete_media(db, storage, media)
