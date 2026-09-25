"""PW-085: автопубликация запланированных статей."""

from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from src.models.article import Article, ArticleStatus
from src.models.audit_log import AuditLog
from src.services.articles.scheduling import publish_due_articles


def _make_scheduled(
    db, slug: str, published_at: datetime, content: str = "<p>Текст</p>"
) -> Article:
    template = db.scalars(select(Article)).first()
    article = Article(
        title=f"Запланированная {slug}",
        slug=slug,
        content=content,
        excerpt="Анонс",
        primary_category_id=template.primary_category_id,
        author_id=template.author_id,
        status=ArticleStatus.SCHEDULED,
        published_at=published_at,
    )
    db.add(article)
    db.commit()
    return article


def test_publishes_only_due_articles(db):
    now = datetime.now(timezone.utc)
    due = _make_scheduled(db, "sched-due", now - timedelta(minutes=1))
    future = _make_scheduled(db, "sched-future", now + timedelta(days=1))

    published = publish_due_articles(db, now=now)

    assert due.id in published
    assert future.id not in published
    db.expire_all()
    assert db.get(Article, due.id).status == ArticleStatus.PUBLISHED
    assert db.get(Article, future.id).status == ArticleStatus.SCHEDULED

    audit = db.scalars(
        select(AuditLog).where(
            AuditLog.action == "article.auto_publish",
            AuditLog.resource_id == due.id,
        )
    ).all()
    assert len(audit) == 1


def test_unpublishable_article_returns_to_draft(db, client):
    now = datetime.now(timezone.utc)
    article = _make_scheduled(db, "sched-empty", now - timedelta(minutes=1), content="")

    assert article.id not in publish_due_articles(db, now=now)

    db.expire_all()
    assert db.get(Article, article.id).status == ArticleStatus.DRAFT
    assert client.get("/api/articles/sched-empty").status_code == 404
    rejected = db.scalars(
        select(AuditLog).where(
            AuditLog.action == "article.auto_publish_rejected",
            AuditLog.resource_id == article.id,
        )
    ).all()
    assert len(rejected) == 1
    assert "content" in rejected[0].changes["reason"]


def test_publish_is_idempotent(db):
    now = datetime.now(timezone.utc)
    article = _make_scheduled(db, "sched-twice", now - timedelta(minutes=5))

    assert article.id in publish_due_articles(db, now=now)
    assert article.id not in publish_due_articles(db, now=now)


def test_published_article_visible_publicly(client, db):
    now = datetime.now(timezone.utc)
    _make_scheduled(db, "sched-public", now - timedelta(minutes=1))
    assert client.get("/api/articles/sched-public").status_code == 404

    publish_due_articles(db, now=now)

    assert client.get("/api/articles/sched-public").status_code == 200


def test_loop_survives_failing_tick(monkeypatch):
    import asyncio

    from src.services.articles import scheduling

    calls = 0

    def flaky_tick():
        nonlocal calls
        calls += 1
        if calls == 1:
            raise RuntimeError("БД недоступна")
        if calls >= 3:
            raise asyncio.CancelledError

    monkeypatch.setattr(scheduling, "_publish_tick", flaky_tick)

    async def run():
        try:
            await scheduling.run_publisher_loop(interval=0)
        except asyncio.CancelledError:
            pass

    asyncio.run(run())
    assert calls == 3
