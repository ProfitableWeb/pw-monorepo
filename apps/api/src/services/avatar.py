"""
PW-034 | Обработка аватарок: валидация, ресайз, конвертация в WebP.
"""

from io import BytesIO

from PIL import Image

AVATAR_MAX_SIZE = 2 * 1024 * 1024  # 2 MB
AVATAR_DIMENSION = 256
AVATAR_FORMAT = "WEBP"
AVATAR_QUALITY = 85
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}


def validate_avatar(content_type: str, size: int) -> str | None:
    """Возвращает текст ошибки или None если валидно."""
    if content_type not in ALLOWED_CONTENT_TYPES:
        return "Недопустимый формат. Разрешены: JPEG, PNG, GIF, WebP"
    if size > AVATAR_MAX_SIZE:
        return f"Файл слишком большой. Максимум: {AVATAR_MAX_SIZE // (1024 * 1024)} МБ"
    return None


def process_avatar(data: bytes) -> bytes:
    """Ресайз + конвертация в WebP 256×256."""
    img = Image.open(BytesIO(data))
    img = img.convert("RGB")

    # Center crop до квадрата
    width, height = img.size
    min_dim = min(width, height)
    left = (width - min_dim) // 2
    top = (height - min_dim) // 2
    img = img.crop((left, top, left + min_dim, top + min_dim))

    # Ресайз
    img = img.resize((AVATAR_DIMENSION, AVATAR_DIMENSION), Image.LANCZOS)

    # Экспорт в WebP
    output = BytesIO()
    img.save(output, format=AVATAR_FORMAT, quality=AVATAR_QUALITY)
    return output.getvalue()


def avatar_path(user_id: str) -> str:
    """Стандартный путь: avatars/{user_id}.webp"""
    return f"avatars/{user_id}.webp"
