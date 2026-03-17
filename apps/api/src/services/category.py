"""
PW-027 | Сервис категорий. PW-051 | CRUD + reorder.
"""

import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.models.article import Article, ArticleStatus
from src.models.category import Category
from src.schemas.admin_category import (
    CategoryCreateRequest,
    CategoryOrderItem,
    CategoryUpdateRequest,
)
from src.services.slug import ensure_unique_category_slug, generate_slug

# --- Чтение ---


def get_all_categories(db: Session) -> list[Category]:
    stmt = select(Category).order_by(Category.order, Category.name)
    return list(db.scalars(stmt).all())


def get_category_by_slug(db: Session, slug: str) -> Category | None:
    stmt = select(Category).where(Category.slug == slug)
    return db.scalars(stmt).first()


def get_category_by_id(db: Session, category_id: uuid.UUID) -> Category | None:
    stmt = select(Category).where(Category.id == category_id)
    return db.scalars(stmt).first()


def get_article_count(db: Session, category_id: object) -> int:
    stmt = (
        select(func.count())
        .select_from(Article)
        .where(
            Article.category_id == category_id,
            Article.status == ArticleStatus.PUBLISHED,
        )
    )
    return db.execute(stmt).scalar() or 0


def get_total_article_count(db: Session, category_id: object) -> int:
    """Все статьи (любой статус) — для проверки перед удалением."""
    stmt = (
        select(func.count())
        .select_from(Article)
        .where(Article.category_id == category_id)
    )
    return db.execute(stmt).scalar() or 0


# --- Создание ---


def create_category(db: Session, data: CategoryCreateRequest) -> Category:
    slug = data.slug or generate_slug(data.name)
    slug = ensure_unique_category_slug(db, slug)

    if data.parent_id:
        _validate_parent(db, data.parent_id)

    category = Category(
        name=data.name,
        slug=slug,
        subtitle=data.subtitle,
        description=data.description,
        icon=data.icon,
        color=data.color,
        parent_id=data.parent_id,
        order=data.order,
    )
    db.add(category)
    db.flush()
    return category


# --- Обновление ---


def update_category(
    db: Session, category_id: uuid.UUID, data: CategoryUpdateRequest
) -> Category:
    category = get_category_by_id(db, category_id)
    if not category:
        raise ValueError("Категория не найдена")

    updates = data.model_dump(exclude_unset=True)

    if "slug" in updates and updates["slug"]:
        updates["slug"] = ensure_unique_category_slug(
            db, updates["slug"], exclude_id=category_id
        )
    elif "name" in updates and "slug" not in updates:
        # Если slug не передан, но name изменился — не менять slug автоматически
        pass

    if "parent_id" in updates:
        parent_id = updates["parent_id"]
        if parent_id:
            if parent_id == category_id:
                raise ValueError("Категория не может быть своим родителем")
            _validate_parent(db, parent_id)

    for field, value in updates.items():
        setattr(category, field, value)

    db.flush()
    return category


# --- Удаление ---


def delete_category(db: Session, category_id: uuid.UUID) -> None:
    category = get_category_by_id(db, category_id)
    if not category:
        raise ValueError("Категория не найдена")

    total = get_total_article_count(db, category_id)
    if total > 0:
        raise ValueError(
            f"Нельзя удалить категорию: привязано статей: {total}"
        )

    # Дочерние категории становятся корневыми
    children_stmt = (
        select(Category).where(Category.parent_id == category_id)
    )
    for child in db.scalars(children_stmt).all():
        child.parent_id = None

    db.delete(category)
    db.flush()


# --- Массовая перестановка ---


def reorder_categories(db: Session, items: list[CategoryOrderItem]) -> None:
    """Массовое обновление order + parent_id (после DnD)."""
    ids = [item.id for item in items]
    categories = list(
        db.scalars(select(Category).where(Category.id.in_(ids))).all()
    )
    cat_map = {c.id: c for c in categories}

    for item in items:
        cat = cat_map.get(item.id)
        if not cat:
            continue
        cat.order = item.order
        cat.parent_id = item.parent_id

    db.flush()


# --- Валидация ---


def _validate_parent(db: Session, parent_id: uuid.UUID) -> None:
    """Проверяет что parent существует и сам не является дочерней категорией."""
    parent = get_category_by_id(db, parent_id)
    if not parent:
        raise ValueError("Родительская категория не найдена")
    if parent.parent_id is not None:
        raise ValueError("Вложенность более 1 уровня не поддерживается")
