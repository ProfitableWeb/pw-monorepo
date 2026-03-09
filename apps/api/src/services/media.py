"""
PW-041 | Сервис медиа-библиотеки: upload pipeline, ресайзы, EXIF, CRUD.
Все операции синхронные (psycopg2 + sync SQLAlchemy).
"""

import uuid
from io import BytesIO
from typing import Any

from PIL import Image
from PIL.ExifTags import TAGS
from slugify import slugify
from sqlalchemy import func, select, text
from sqlalchemy.orm import Session, selectinload

from src.core.config import settings
from src.models.media_file import FileType, MediaFile
from src.services.storage import StorageBackend

# --- Константы ---

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/tiff",
}
ALLOWED_MIME_TYPES = ALLOWED_IMAGE_TYPES | {
    "video/mp4",
    "video/webm",
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

WEBP_QUALITY = 85

RESIZE_SPECS = [
    {"suffix": "_thumb", "width": 150, "height": 150, "crop": True},
    {"suffix": "_sm", "width": 400, "height": None, "crop": False},
    {"suffix": "_md", "width": 800, "height": None, "crop": False},
    {"suffix": "_lg", "width": 1200, "height": None, "crop": False},
]


# --- Приватные хелперы ---


def _determine_file_type(mime_type: str) -> FileType:
    """Определяет тип файла по MIME."""
    if mime_type.startswith("image/"):
        return FileType.IMAGE
    if mime_type.startswith("video/"):
        return FileType.VIDEO
    if mime_type.startswith("audio/"):
        return FileType.AUDIO
    return FileType.DOCUMENT


def _generate_media_slug(filename: str) -> str:
    """Генерирует slug из имени файла (без расширения)."""
    name_without_ext = filename.rsplit(".", 1)[0] if "." in filename else filename
    return slugify(name_without_ext, max_length=200)


def _ensure_unique_media_slug(
    db: Session, slug: str, *, exclude_id: uuid.UUID | None = None
) -> str:
    """Гарантирует уникальность slug, добавляя -2, -3 и т.д."""
    candidate = slug
    counter = 2
    while True:
        stmt = select(MediaFile.id).where(MediaFile.slug == candidate)
        if exclude_id is not None:
            stmt = stmt.where(MediaFile.id != exclude_id)
        exists = db.execute(stmt).first()
        if not exists:
            return candidate
        candidate = f"{slug}-{counter}"
        counter += 1


def _extract_exif(img: Image.Image) -> dict[str, str] | None:
    """Извлекает EXIF-данные из изображения (Pillow)."""
    try:
        exif_raw = img._getexif()
    except Exception:
        return None
    if not exif_raw:
        return None

    tag_map = {
        "DateTimeOriginal": "date_taken",
        "Make": "camera_make",
        "Model": "camera",
        "LensModel": "lens",
        "ISOSpeedRatings": "iso",
        "FNumber": "aperture",
        "ExposureTime": "shutter_speed",
        "FocalLength": "focal_length",
    }

    exif: dict[str, str] = {}
    for tag_id, value in exif_raw.items():
        tag_name = TAGS.get(tag_id)
        if tag_name not in tag_map:
            continue

        key = tag_map[tag_name]
        if hasattr(value, "numerator"):
            if tag_name == "FNumber":
                exif[key] = f"f/{float(value):.1f}"
            elif tag_name == "ExposureTime":
                fval = float(value)
                if fval <= 0:
                    continue
                exif[key] = f"1/{int(1 / fval)}" if fval < 1 else f"{fval}s"
            elif tag_name == "FocalLength":
                exif[key] = f"{float(value):.0f}mm"
            else:
                exif[key] = str(value)
        else:
            exif[key] = str(value)

    return exif if exif else None


def _process_image(
    data: bytes, storage: StorageBackend, storage_key: str, file_uuid: str
) -> tuple[bytes, int, int, list[dict[str, Any]], dict[str, str] | None]:
    """
    Обрабатывает изображение: WebP-конвертация, ресайзы, EXIF.
    Returns: (webp_data, width, height, resizes_list, exif_data)
    """
    img = Image.open(BytesIO(data))
    original_width, original_height = img.size

    # EXIF до трансформаций
    exif_data = _extract_exif(img)

    # RGB/RGBA для WebP
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")

    # Оригинал → WebP
    output = BytesIO()
    img.save(output, format="WEBP", quality=WEBP_QUALITY)
    webp_data = output.getvalue()
    storage.save(storage_key, webp_data)

    # Ресайзы
    resizes: list[dict[str, Any]] = []
    for spec in RESIZE_SPECS:
        target_w = spec["width"]

        if spec["crop"]:
            # Center crop → квадрат → resize (паттерн avatar.py)
            min_dim = min(original_width, original_height)
            left = (original_width - min_dim) // 2
            top = (original_height - min_dim) // 2
            cropped = img.crop((left, top, left + min_dim, top + min_dim))
            resized = cropped.resize((target_w, target_w), Image.LANCZOS)
            result_w, result_h = target_w, target_w
        else:
            # Пропорциональный ресайз по ширине
            if original_width <= target_w:
                continue  # оригинал меньше — не увеличиваем
            ratio = target_w / original_width
            result_h = int(original_height * ratio)
            result_w = target_w
            resized = img.resize((result_w, result_h), Image.LANCZOS)

        resize_key = f"media/{file_uuid}{spec['suffix']}.webp"
        buf = BytesIO()
        resized.save(buf, format="WEBP", quality=WEBP_QUALITY)
        resize_data = buf.getvalue()
        storage.save(resize_key, resize_data)

        resizes.append(
            {
                "suffix": spec["suffix"],
                "width": result_w,
                "height": result_h,
                "size": len(resize_data),
                "key": resize_key,
            }
        )

    return webp_data, original_width, original_height, resizes, exif_data


# --- Публичные функции ---


def upload_media(
    db: Session,
    storage: StorageBackend,
    *,
    data: bytes,
    filename: str,
    content_type: str,
    user_id: uuid.UUID,
) -> MediaFile:
    """Загружает файл: валидация, обработка изображений, сохранение в storage + БД."""
    file_type = _determine_file_type(content_type)

    # Валидация размера
    max_size = (
        settings.max_upload_size_image
        if file_type == FileType.IMAGE
        else settings.max_upload_size_other
    )
    if len(data) > max_size:
        raise ValueError(
            f"Файл слишком большой. Максимум: {max_size // (1024 * 1024)} МБ"
        )

    # Валидация MIME
    if content_type not in ALLOWED_MIME_TYPES:
        raise ValueError(f"Недопустимый тип файла: {content_type}")

    file_uuid = str(uuid.uuid4())
    slug = _generate_media_slug(filename)
    slug = _ensure_unique_media_slug(db, slug)

    width = None
    height = None
    resizes = None
    exif_data = None

    if file_type == FileType.IMAGE:
        storage_key = f"media/{file_uuid}.webp"
        webp_data, width, height, resizes, exif_data = _process_image(
            data, storage, storage_key, file_uuid
        )
        final_size = len(webp_data)
        mime_type = "image/webp"
    else:
        # Не-изображения — сохраняем как есть
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "bin"
        storage_key = f"media/{file_uuid}.{ext}"
        storage.save(storage_key, data)
        final_size = len(data)
        mime_type = content_type

    media = MediaFile(
        filename=filename,
        storage_key=storage_key,
        mime_type=mime_type,
        file_type=file_type,
        size=final_size,
        width=width,
        height=height,
        slug=slug,
        exif_data=exif_data,
        purposes=[],
        resizes=resizes,
        uploaded_by_id=user_id,
    )
    db.add(media)
    db.flush()
    db.commit()
    db.refresh(media)
    return media


def get_media(db: Session, media_id: uuid.UUID) -> MediaFile | None:
    """Получает медиафайл по ID."""
    return db.get(MediaFile, media_id)


def list_media(
    db: Session,
    *,
    page: int = 1,
    limit: int = 20,
    file_type: str | None = None,
    purpose: str | None = None,
    search: str | None = None,
    sort_by: str = "created_at",
    order: str = "desc",
) -> tuple[list[MediaFile], int]:
    """Список медиафайлов с фильтрацией, пагинацией, сортировкой."""
    stmt = select(MediaFile).options(selectinload(MediaFile.articles))
    count_stmt = select(func.count()).select_from(MediaFile)

    # Фильтр по типу
    if file_type:
        stmt = stmt.where(MediaFile.file_type == file_type)
        count_stmt = count_stmt.where(MediaFile.file_type == file_type)

    # Фильтр по назначению (JSONB contains)
    if purpose:
        stmt = stmt.where(MediaFile.purposes.contains([purpose]))
        count_stmt = count_stmt.where(MediaFile.purposes.contains([purpose]))

    # Поиск по имени / slug / alt
    if search:
        escaped = search.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        pattern = f"%{escaped}%"
        search_filter = (
            MediaFile.filename.ilike(pattern)
            | MediaFile.slug.ilike(pattern)
            | MediaFile.alt.ilike(pattern)
        )
        stmt = stmt.where(search_filter)
        count_stmt = count_stmt.where(search_filter)

    total = db.execute(count_stmt).scalar() or 0

    # Сортировка
    sortable = {"created_at", "updated_at", "filename", "size", "file_type"}
    sort_col = (
        getattr(MediaFile, sort_by) if sort_by in sortable else MediaFile.created_at
    )
    stmt = stmt.order_by(sort_col.asc() if order == "asc" else sort_col.desc())
    stmt = stmt.offset((page - 1) * limit).limit(limit)

    items = list(db.scalars(stmt).all())
    return items, total


def update_media(db: Session, media: MediaFile, **fields: Any) -> MediaFile:
    """Обновляет slug, alt, caption, purposes (partial update)."""
    updatable = {"slug", "alt", "caption", "purposes"}

    # Валидация + уникальность slug при изменении
    if "slug" in fields and fields["slug"] is not None:
        if not fields["slug"].strip():
            raise ValueError("Slug не может быть пустым")
        if fields["slug"] != media.slug:
            fields["slug"] = _ensure_unique_media_slug(
                db, fields["slug"], exclude_id=media.id
            )

    for key, value in fields.items():
        if key in updatable:
            setattr(media, key, value)

    db.commit()
    db.refresh(media)
    return media


def delete_media(db: Session, storage: StorageBackend, media: MediaFile) -> None:
    """Удаляет файл(ы) из storage + запись из БД."""
    # Основной файл
    storage.delete(media.storage_key)

    # Ресайзы
    if media.resizes:
        for resize in media.resizes:
            key = resize.get("key")
            if key:
                storage.delete(key)

    db.delete(media)
    db.commit()


def replace_file(
    db: Session,
    storage: StorageBackend,
    media: MediaFile,
    *,
    data: bytes,
    filename: str,
    content_type: str,
) -> MediaFile:
    """Заменяет физический файл медиа-записи, сохраняя ID, slug, SEO и связи."""
    file_type = _determine_file_type(content_type)

    # Валидация размера
    max_size = (
        settings.max_upload_size_image
        if file_type == FileType.IMAGE
        else settings.max_upload_size_other
    )
    if len(data) > max_size:
        raise ValueError(
            f"Файл слишком большой. Максимум: {max_size // (1024 * 1024)} МБ"
        )

    # Валидация MIME
    if content_type not in ALLOWED_MIME_TYPES:
        raise ValueError(f"Недопустимый тип файла: {content_type}")

    # 1. Удалить старые файлы из storage
    storage.delete(media.storage_key)
    if media.resizes:
        for resize in media.resizes:
            key = resize.get("key")
            if key:
                storage.delete(key)

    # 2. Обработать новый файл (тот же pipeline, что upload_media)
    file_uuid = str(uuid.uuid4())
    width = None
    height = None
    resizes = None
    exif_data = None

    if file_type == FileType.IMAGE:
        storage_key = f"media/{file_uuid}.webp"
        webp_data, width, height, resizes, exif_data = _process_image(
            data, storage, storage_key, file_uuid
        )
        final_size = len(webp_data)
        mime_type = "image/webp"
    else:
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "bin"
        storage_key = f"media/{file_uuid}.{ext}"
        storage.save(storage_key, data)
        final_size = len(data)
        mime_type = content_type

    # 3. Обновить запись (СОХРАНЯЕМ: id, slug, alt, caption, purposes,
    #    uploaded_by_id, created_at, связи со статьями)
    media.filename = filename
    media.storage_key = storage_key
    media.mime_type = mime_type
    media.file_type = file_type
    media.size = final_size
    media.width = width
    media.height = height
    media.exif_data = exif_data
    media.resizes = resizes

    db.commit()
    db.refresh(media)
    return media


def get_media_stats(db: Session) -> dict[str, Any]:
    """Агрегированная статистика: количество, объём, по типам, все purposes."""
    total_count = (
        db.execute(select(func.count()).select_from(MediaFile)).scalar() or 0
    )
    total_size = (
        db.execute(select(func.coalesce(func.sum(MediaFile.size), 0))).scalar() or 0
    )

    # Количество по типам
    rows = db.execute(
        select(MediaFile.file_type, func.count()).group_by(MediaFile.file_type)
    ).all()
    by_type = {str(row[0]): row[1] for row in rows}

    # Все уникальные purposes (flatten JSONB-массивов)
    purposes_rows = db.execute(
        text(
            "SELECT DISTINCT jsonb_array_elements_text(purposes) AS p "
            "FROM media_files "
            "WHERE purposes IS NOT NULL AND purposes != '[]'::jsonb "
            "ORDER BY p"
        )
    ).all()
    all_purposes = [row[0] for row in purposes_rows]

    return {
        "total_count": total_count,
        "total_size": total_size,
        "by_type": by_type,
        "all_purposes": all_purposes,
    }
