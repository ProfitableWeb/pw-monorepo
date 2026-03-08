"""
PW-038 | Ревизии контента статей. Иммутабельные снимки content при каждом
обновлении через PATCH. Только content + content_format, не все поля.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base, UUIDMixin

if TYPE_CHECKING:
    from src.models.article import Article


class ArticleRevision(UUIDMixin, Base):
    __tablename__ = "article_revisions"

    article_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("articles.id", ondelete="CASCADE"), index=True
    )
    content: Mapped[str] = mapped_column(Text)
    content_format: Mapped[str] = mapped_column(String(20), default="html")
    summary: Mapped[str | None] = mapped_column(String(500))
    author_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(
        default=func.now(), server_default=func.now()
    )

    article: Mapped["Article"] = relationship(back_populates="revisions")

    def __repr__(self) -> str:
        return f"<ArticleRevision {self.id} for {self.article_id}>"
