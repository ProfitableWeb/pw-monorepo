"""
PW-068 | Автопубликация запланированных статей.

publish_due_articles() переводит scheduled → published для статей, у которых
наступил published_at. Каждая статья обновляется условным UPDATE
(WHERE status = 'scheduled'), поэтому параллельный запуск в нескольких
воркерах безопасен: статью публикует и логирует ровно один из них.

run_publisher_loop() — фоновая задача, запускается из lifespan (src/main.py).
Решение и альтернативы — docs/architecture/decisions/ (ADR автопубликации).
"""

import asyncio
import uuid
from datetime import datetime, timezone

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from src.core.database import SessionLocal
from src.core.logging import get_logger
from src.models.article import Article, ArticleStatus
from src.services import audit_log as audit_service
from src.services.articles.admin import _validate_publishable

logger = get_logger(__name__)

PUBLISH_INTERVAL_SECONDS = 60


def publish_due_articles(db: Session, now: datetime | None = None) -> list[uuid.UUID]:
    """Публикует статьи, у которых наступило время. Возвращает id опубликованных.

    Статья, не проходящая проверку публикуемости (нет контента/анонса и т.п.),
    не публикуется, а возвращается в черновики с записью причины в аудит —
    иначе она висела бы в scheduled и повторяла ошибку каждую минуту.
    """
    now = now or datetime.now(timezone.utc)
    due = db.scalars(
        select(Article).where(
            Article.status == ArticleStatus.SCHEDULED,
            Article.published_at <= now,
        )
    ).all()

    published: list[uuid.UUID] = []
    rejected: list[tuple[uuid.UUID, str]] = []
    for article in due:
        try:
            _validate_publishable(article)
        except ValueError as e:
            new_status, reason = ArticleStatus.DRAFT, str(e)
        else:
            new_status, reason = ArticleStatus.PUBLISHED, None

        result = db.execute(
            update(Article)
            .where(
                Article.id == article.id,
                Article.status == ArticleStatus.SCHEDULED,
            )
            .values(status=new_status)
            .execution_options(synchronize_session=False)
        )
        if result.rowcount != 1:  # type: ignore[attr-defined]  # CursorResult
            continue  # уже обработал другой воркер или статус изменили вручную

        if reason is None:
            audit_service.log_action(
                db,
                action="article.auto_publish",
                resource_type="article",
                resource_id=article.id,
                changes={"status": {"old": "scheduled", "new": "published"}},
            )
            published.append(article.id)
        else:
            audit_service.log_action(
                db,
                action="article.auto_publish_rejected",
                resource_type="article",
                resource_id=article.id,
                changes={
                    "status": {"old": "scheduled", "new": "draft"},
                    "reason": reason,
                },
            )
            rejected.append((article.id, reason))

    db.commit()
    for article_id in published:
        logger.info("article_auto_published", article_id=str(article_id))
    for article_id, reason in rejected:
        logger.warning(
            "article_auto_publish_rejected", article_id=str(article_id), reason=reason
        )
    return published


def _publish_tick() -> None:
    db = SessionLocal()
    try:
        publish_due_articles(db)
    finally:
        db.close()


async def run_publisher_loop(interval: float = PUBLISH_INTERVAL_SECONDS) -> None:
    """Бесконечный цикл автопубликации. Ошибка одного тика не останавливает цикл."""
    while True:
        try:
            await asyncio.to_thread(_publish_tick)
        except Exception:
            logger.exception("article_auto_publish_failed")
        await asyncio.sleep(interval)
