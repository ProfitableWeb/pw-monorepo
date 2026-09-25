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

logger = get_logger(__name__)

PUBLISH_INTERVAL_SECONDS = 60


def publish_due_articles(db: Session, now: datetime | None = None) -> list[uuid.UUID]:
    """Публикует статьи, у которых наступило время. Возвращает id опубликованных."""
    now = now or datetime.now(timezone.utc)
    due_ids = db.scalars(
        select(Article.id).where(
            Article.status == ArticleStatus.SCHEDULED,
            Article.published_at <= now,
        )
    ).all()

    published: list[uuid.UUID] = []
    for article_id in due_ids:
        result = db.execute(
            update(Article)
            .where(
                Article.id == article_id,
                Article.status == ArticleStatus.SCHEDULED,
            )
            .values(status=ArticleStatus.PUBLISHED)
        )
        if result.rowcount != 1:  # type: ignore[attr-defined]  # CursorResult
            continue  # уже опубликовал другой воркер или статус изменили вручную
        audit_service.log_action(
            db,
            action="article.auto_publish",
            resource_type="article",
            resource_id=article_id,
            changes={"status": {"old": "scheduled", "new": "published"}},
        )
        published.append(article_id)

    db.commit()
    for article_id in published:
        logger.info("article_auto_published", article_id=str(article_id))
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
