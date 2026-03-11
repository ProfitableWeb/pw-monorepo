"""
PW-041 | Модель медиафайла + junction table article_media.
Хранит метаданные загруженных файлов: изображения, видео, аудио, документы.
"""

import enum
import uuid
from typing import TYPE_CHECKING, Any

from sqlalchemy import Column, ForeignKey, Integer, String, Table, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from src.models.article import Article
    from src.models.user import User


class FileType(str, enum.Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    DOCUMENT = "document"


article_media = Table(
    "article_media",
    Base.metadata,
    Column(
        "article_id",
        ForeignKey("articles.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "media_id",
        ForeignKey("media_files.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column("role", String(50), nullable=True),  # "cover", "inline", "attachment"
)


class MediaFile(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "media_files"

    filename: Mapped[str] = mapped_column(String(500))
    storage_key: Mapped[str] = mapped_column(String(500), unique=True)
    mime_type: Mapped[str] = mapped_column(String(100))
    file_type: Mapped[FileType] = mapped_column(String(20))
    size: Mapped[int] = mapped_column(Integer)

    # Изображения
    width: Mapped[int | None] = mapped_column(Integer, default=None)
    height: Mapped[int | None] = mapped_column(Integer, default=None)

    # SEO / метаданные
    slug: Mapped[str] = mapped_column(String(500), unique=True, index=True)
    alt: Mapped[str | None] = mapped_column(String(500), default=None)
    caption: Mapped[str | None] = mapped_column(Text, default=None)

    # EXIF (только изображения)
    exif_data: Mapped[Any | None] = mapped_column(JSONB, default=None)

    # Организация (свободный ввод, не enum)
    purposes: Mapped[Any] = mapped_column(JSONB, default=list)

    # Сгенерированные ресайзы
    resizes: Mapped[Any | None] = mapped_column(JSONB, default=None)

    # Связи
    uploaded_by_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    uploaded_by: Mapped["User | None"] = relationship(
        back_populates="media_files"
    )
    articles: Mapped[list["Article"]] = relationship(
        secondary=article_media, back_populates="media_files"
    )

    def __repr__(self) -> str:
        return f"<MediaFile {self.slug}>"
