"""
PW-027 | Сервис категорий. PW-051 | CRUD + reorder.
PW-054 | Категория по умолчанию: get_default_category, reassign при удалении.
"""

import uuid

import sqlalchemy as sa
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from src.models.article import Article, ArticleStatus, article_categories
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


def get_all_categories_with_counts(
    db: Session,
) -> list[tuple[Category, int]]:
    """Категории + число опубликованных статей через junction table."""
    # Подзапрос: опубликованные article_id
    published_ids = (
        select(Article.id)
        .where(Article.status == ArticleStatus.PUBLISHED)
        .scalar_subquery()
    )
    count_col = func.count(article_categories.c.article_id).label("article_count")
    stmt = (
        select(Category, count_col)
        .outerjoin(
            article_categories,
            (article_categories.c.category_id == Category.id)
            & (article_categories.c.article_id.in_(published_ids)),
        )
        .group_by(Category.id)
        .order_by(Category.order, Category.name)
    )
    return list(db.execute(stmt).all())


def get_category_by_slug(db: Session, slug: str) -> Category | None:
    stmt = select(Category).where(Category.slug == slug)
    return db.scalars(stmt).first()


def get_category_by_id(db: Session, category_id: uuid.UUID) -> Category | None:
    return db.get(Category, category_id)


def get_article_count(db: Session, category_id: uuid.UUID) -> int:
    """Опубликованные статьи через junction (primary + additional)."""
    stmt = (
        select(func.count())
        .select_from(article_categories)
        .join(Article, Article.id == article_categories.c.article_id)
        .where(
            article_categories.c.category_id == category_id,
            Article.status == ArticleStatus.PUBLISHED,
        )
    )
    return db.execute(stmt).scalar() or 0


def get_total_article_count(db: Session, category_id: uuid.UUID) -> int:
    """Все статьи (любой статус) через junction."""
    stmt = (
        select(func.count())
        .select_from(article_categories)
        .where(article_categories.c.category_id == category_id)
    )
    return db.execute(stmt).scalar() or 0


def get_default_category(db: Session) -> Category:
    """Системная категория по умолчанию (ровно одна, защищена partial unique index)."""
    stmt = select(Category).where(Category.is_default.is_(True))
    cat = db.scalars(stmt).first()
    if not cat:
        raise RuntimeError("Категория по умолчанию не найдена — запустите миграцию")
    return cat


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

    # is_default нельзя менять через API
    updates.pop("is_default", None)

    if "slug" in updates and updates["slug"]:
        updates["slug"] = ensure_unique_category_slug(
            db, updates["slug"], exclude_id=category_id
        )

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

    if category.is_default:
        raise ValueError("Нельзя удалить категорию по умолчанию")

    # Перекидываем primary на категорию по умолчанию
    default = get_default_category(db)
    db.execute(
        update(Article)
        .where(Article.primary_category_id == category_id)
        .values(primary_category_id=default.id)
    )
    # Junction-записи для удаляемой категории — CASCADE удалит автоматически.
    # Добавляем default в junction для переназначенных статей (если ещё нет).
    db.execute(sa.text("""
        INSERT INTO article_categories (article_id, category_id)
        SELECT id, :default_id FROM articles
        WHERE primary_category_id = :default_id
        ON CONFLICT DO NOTHING
    """), {"default_id": default.id})

    # Дочерние категории становятся корневыми
    db.execute(
        update(Category)
        .where(Category.parent_id == category_id)
        .values(parent_id=None)
    )

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

    # Валидация: parent_id должен ссылаться на существующую корневую категорию
    all_ids = set(ids)
    for item in items:
        if item.parent_id:
            if item.parent_id not in all_ids:
                raise ValueError(
                    f"parent_id {item.parent_id} не найден в списке"
                )
            # Проверка что parent сам не является дочерним
            parent_item = next(
                (i for i in items if i.id == item.parent_id), None
            )
            if parent_item and parent_item.parent_id is not None:
                raise ValueError("Вложенность более 1 уровня не поддерживается")

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
