"""
PW-027 | Категории статей (6 шт. в seed). article_count вычисляется при запросе,
не хранится — избегаем рассинхрона при добавлении/удалении статей.
PW-051 | Добавлены parent_id (1 уровень вложенности) и order (сортировка).
PW-054 | is_default — системная категория (нельзя удалить, seed при миграции).
"""

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from src.models.article import Article


class Category(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "categories"

    name: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    subtitle: Mapped[str | None] = mapped_column(String(500))
    description: Mapped[str | None] = mapped_column(Text)
    icon: Mapped[str | None] = mapped_column(String(100))
    color: Mapped[str | None] = mapped_column(String(7))
    is_default: Mapped[bool] = mapped_column(
        Boolean, default=False, server_default="false"
    )

    # PW-051: иерархия (макс. 1 уровень) + порядок сортировки
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("categories.id", ondelete="SET NULL"), nullable=True
    )
    order: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    parent: Mapped["Category | None"] = relationship(
        back_populates="children",
        remote_side="Category.id",
    )
    children: Mapped[list["Category"]] = relationship(back_populates="parent")

    articles: Mapped[list["Article"]] = relationship(back_populates="category")

    def __repr__(self) -> str:
        return f"<Category {self.slug}>"
