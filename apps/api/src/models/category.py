"""
PW-027 | Категории статей (6 шт. в seed). article_count вычисляется при запросе,
не хранится — избегаем рассинхрона при добавлении/удалении статей.
"""

from typing import TYPE_CHECKING

from sqlalchemy import String, Text
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

    articles: Mapped[list["Article"]] = relationship(back_populates="category")

    def __repr__(self) -> str:
        return f"<Category {self.slug}>"
