"""PW-052 | Сервисный слой для CRUD меток."""

import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.models.article import Article, ArticleStatus
from src.models.tag import Tag, article_tags
from src.schemas.admin_tag import TagCreateRequest, TagUpdateRequest
from src.services.slug import ensure_unique_tag_slug, generate_slug

# --- Чтение ---


def get_all_tags_with_counts(db: Session) -> list[tuple[Tag, int]]:
    """Все метки + число не-архивных статей (один JOIN-запрос)."""
    count_col = func.count(Article.id).label("article_count")
    stmt = (
        select(Tag, count_col)
        .outerjoin(article_tags, Tag.id == article_tags.c.tag_id)
        .outerjoin(
            Article,
            (Article.id == article_tags.c.article_id)
            & (Article.status != ArticleStatus.ARCHIVED),
        )
        .group_by(Tag.id)
        .order_by(Tag.name)
    )
    return db.execute(stmt).all()  # type: ignore[return-value]


def get_tag_by_id(db: Session, tag_id: uuid.UUID) -> Tag | None:
    return db.get(Tag, tag_id)


def get_article_count_for_tag(db: Session, tag_id: uuid.UUID) -> int:
    """Число не-архивных статей для конкретной метки."""
    stmt = (
        select(func.count())
        .select_from(article_tags)
        .join(Article, Article.id == article_tags.c.article_id)
        .where(
            article_tags.c.tag_id == tag_id,
            Article.status != ArticleStatus.ARCHIVED,
        )
    )
    return db.scalar(stmt) or 0


# --- Создание ---


def create_tag(db: Session, data: TagCreateRequest) -> Tag:
    """Создание метки с авто-slug и проверкой уникальности имени."""
    existing = db.scalars(select(Tag).where(Tag.name == data.name)).first()
    if existing:
        raise ValueError("Метка с таким именем уже существует")

    slug = data.slug or generate_slug(data.name)
    slug = ensure_unique_tag_slug(db, slug)

    tag = Tag(
        name=data.name,
        slug=slug,
        color=data.color,
        group=data.group,
    )
    db.add(tag)
    db.flush()
    return tag


# --- Обновление ---


def update_tag(db: Session, tag_id: uuid.UUID, data: TagUpdateRequest) -> Tag:
    """Частичное обновление метки."""
    tag = get_tag_by_id(db, tag_id)
    if not tag:
        raise ValueError("Метка не найдена")

    updates = data.model_dump(exclude_unset=True)

    # Поля с валидацией — обрабатываем отдельно, удаляя из updates
    new_name = updates.pop("name", None)
    if new_name is not None and new_name != tag.name:
        dup = db.scalars(
            select(Tag).where(Tag.name == new_name, Tag.id != tag_id)
        ).first()
        if dup:
            raise ValueError("Метка с таким именем уже существует")
        tag.name = new_name

    new_slug = updates.pop("slug", None)
    if new_slug is not None:
        slug = new_slug or generate_slug(tag.name)
        tag.slug = ensure_unique_tag_slug(db, slug, exclude_id=tag_id)

    # Простые поля (color, group, ...) — generic setattr
    for field, value in updates.items():
        setattr(tag, field, value)

    db.flush()
    return tag


# --- Удаление ---


def delete_tag(db: Session, tag_id: uuid.UUID) -> None:
    """Удаление метки. CASCADE отвязывает от статей автоматически."""
    tag = get_tag_by_id(db, tag_id)
    if not tag:
        raise ValueError("Метка не найдена")

    db.delete(tag)
    db.flush()
