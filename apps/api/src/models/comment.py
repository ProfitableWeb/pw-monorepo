"""
PW-027 | Self-referential комментарии: parent_id → comments.id для тредов.
Сборка дерева (root + replies) происходит в роутере, не в БД — один плоский запрос.
"""

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from src.models.article import Article
    from src.models.user import User


class Comment(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "comments"

    content: Mapped[str] = mapped_column(Text)
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("comments.id", ondelete="CASCADE")
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    article_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("articles.id", ondelete="CASCADE")
    )

    user: Mapped["User"] = relationship(back_populates="comments")
    article: Mapped["Article"] = relationship(back_populates="comments")
    parent: Mapped["Comment | None"] = relationship(
        remote_side="Comment.id", back_populates="replies"
    )
    replies: Mapped[list["Comment"]] = relationship(back_populates="parent")

    def __repr__(self) -> str:
        return f"<Comment {self.id}>"
