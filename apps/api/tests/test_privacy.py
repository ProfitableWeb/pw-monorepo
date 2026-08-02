"""
PW-074 | Тесты приватности: закрытые списки комментариев, удаление собственного
комментария и учётной записи, санитизация журнала ошибок, ретенция журналов.
"""

import uuid
from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from src.models.audit_log import AuditLog
from src.models.comment import Comment
from src.models.error_log import ErrorLog
from src.models.user import User, UserRole
from src.services import error_log as error_log_service
from src.services import retention as retention_service

ARTICLE_SLUG = "one-column-article"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _register(client: TestClient, email: str, name: str = "Privacy User") -> dict:
    r = client.post(
        "/api/auth/register",
        json={"email": email, "password": "secret123", "name": name},
    )
    assert r.status_code == 200, r.text
    return r.json()


def _login_as(client: TestClient, email: str, name: str = "Privacy User") -> dict:
    """Регистрирует пользователя и оставляет его cookies на клиенте."""
    client.cookies.clear()
    user = _register(client, email, name)
    return user


def _create_comment(client: TestClient, content: str) -> str:
    r = client.post(
        f"/api/articles/{ARTICLE_SLUG}/comments", json={"content": content}
    )
    assert r.status_code == 201, r.text
    return r.json()["data"]["id"]


# ---------------------------------------------------------------------------
# Закрытый эндпоинт списка комментариев пользователя
# ---------------------------------------------------------------------------


def test_user_comments_requires_auth(client: TestClient):
    """Раньше эндпоинт был открытым: комментарии любого UUID забирались без входа."""
    r = client.get(f"/api/users/{uuid.uuid4()}/comments")
    assert r.status_code == 401


def test_user_comments_forbidden_for_others(client: TestClient):
    other = _login_as(client, "victim@example.com", "Victim")
    _login_as(client, "curious@example.com", "Curious")

    r = client.get(f"/api/users/{other['id']}/comments")
    assert r.status_code == 403


def test_user_comments_allowed_for_self(client: TestClient):
    user = _login_as(client, "self-comments@example.com", "Self")
    _create_comment(client, "Свой комментарий по UUID")

    r = client.get(f"/api/users/{user['id']}/comments")
    assert r.status_code == 200
    data = r.json()["data"]
    assert any(c["content"] == "Свой комментарий по UUID" for c in data)


def test_user_comments_allowed_for_admin(client: TestClient, db: Session):
    victim = _login_as(client, "admin-target@example.com", "Target")
    _create_comment(client, "Комментарий для модерации")

    admin = _login_as(client, "moderator@example.com", "Moderator")
    db_admin = db.query(User).filter(User.id == uuid.UUID(admin["id"])).one()
    db_admin.role = UserRole.ADMIN
    db.commit()

    r = client.get(f"/api/users/{victim['id']}/comments")
    assert r.status_code == 200
    assert any(
        c["content"] == "Комментарий для модерации" for c in r.json()["data"]
    )

    db_admin.role = UserRole.VIEWER
    db.commit()


def test_own_comments_route(client: TestClient):
    """/users/me/comments — маршрут для страницы «Мои комментарии»."""
    _login_as(client, "me-comments@example.com", "Me")
    _create_comment(client, "Мой комментарий через /me")

    r = client.get("/api/users/me/comments")
    assert r.status_code == 200
    data = r.json()["data"]
    assert len(data) == 1
    assert data[0]["content"] == "Мой комментарий через /me"


def test_own_comments_route_requires_auth(client: TestClient):
    r = client.get("/api/users/me/comments")
    assert r.status_code == 401


# ---------------------------------------------------------------------------
# Удаление собственного комментария
# ---------------------------------------------------------------------------


def test_delete_own_comment(client: TestClient, db: Session):
    _login_as(client, "comment-owner@example.com", "Owner")
    comment_id = _create_comment(client, "Комментарий на удаление")

    r = client.delete(f"/api/comments/{comment_id}")
    assert r.status_code == 200
    assert r.json()["success"] is True

    db.expire_all()
    assert db.query(Comment).filter(Comment.id == uuid.UUID(comment_id)).first() is None

    entry = (
        db.query(AuditLog)
        .filter(
            AuditLog.action == "comment.deleted",
            AuditLog.resource_id == uuid.UUID(comment_id),
        )
        .first()
    )
    assert entry is not None
    assert entry.resource_type == "personal_data"


def test_delete_foreign_comment_forbidden(client: TestClient):
    _login_as(client, "author-a@example.com", "Author A")
    comment_id = _create_comment(client, "Чужой комментарий")

    _login_as(client, "author-b@example.com", "Author B")
    r = client.delete(f"/api/comments/{comment_id}")
    assert r.status_code == 403


def test_delete_comment_requires_auth(client: TestClient):
    r = client.delete(f"/api/comments/{uuid.uuid4()}")
    assert r.status_code == 401


def test_delete_missing_comment(client: TestClient):
    _login_as(client, "ghost-comment@example.com", "Ghost")
    r = client.delete(f"/api/comments/{uuid.uuid4()}")
    assert r.status_code == 404


# ---------------------------------------------------------------------------
# Удаление учётной записи
# ---------------------------------------------------------------------------


def test_delete_own_account(client: TestClient, db: Session):
    user = _login_as(client, "erase-me@example.com", "Erase Me")
    user_uuid = uuid.UUID(user["id"])
    _create_comment(client, "Комментарий уходит вместе с аккаунтом")

    # Журналы содержат ПДн: связку user_id + IP + User-Agent
    db.add(
        ErrorLog(
            level="error",
            event="unhandled_exception",
            message="ValueError: тест",
            user_id=user_uuid,
            ip_address="203.0.113.7",
            user_agent="pytest",
        )
    )
    db.add(
        AuditLog(
            user_id=user_uuid,
            action="article.published",
            resource_type="article",
            ip_address="203.0.113.7",
            user_agent="pytest",
        )
    )
    db.commit()

    r = client.delete("/api/users/me")
    assert r.status_code == 200
    assert r.json()["success"] is True

    db.expire_all()

    # 1. Запись пользователя уничтожена, а не деактивирована
    assert db.query(User).filter(User.id == user_uuid).first() is None

    # 2. Комментарии ушли каскадом
    assert db.query(Comment).filter(Comment.user_id == user_uuid).count() == 0

    # 3. Журналы обезличены: ни user_id, ни сетевых идентификаторов
    assert db.query(ErrorLog).filter(ErrorLog.user_id == user_uuid).count() == 0
    assert db.query(AuditLog).filter(AuditLog.user_id == user_uuid).count() == 0
    orphan = (
        db.query(ErrorLog)
        .filter(ErrorLog.message == "ValueError: тест")
        .one()
    )
    assert orphan.user_id is None
    assert orphan.ip_address is None
    assert orphan.user_agent is None

    # 4. Факт уничтожения зафиксирован — материал для акта (Приказ РКН № 179)
    entry = (
        db.query(AuditLog)
        .filter(
            AuditLog.action == "user.account_deleted",
            AuditLog.resource_id == user_uuid,
        )
        .one()
    )
    assert entry.resource_type == "personal_data"
    assert entry.user_id is None
    assert entry.changes["comments_deleted"] == 1

    # 5. Сессия закрыта: куки сброшены, повторный запрос неавторизован
    assert "access_token" not in client.cookies
    assert client.get("/api/auth/me").status_code == 401


def test_delete_account_requires_auth(client: TestClient):
    r = client.delete("/api/users/me")
    assert r.status_code == 401


def test_delete_last_admin_account_blocked(client: TestClient, db: Session):
    admin = _login_as(client, "last-admin@example.com", "Last Admin")

    # Пользователь должен остаться единственным активным администратором
    for existing in db.query(User).filter(User.role == UserRole.ADMIN).all():
        existing.role = UserRole.VIEWER
    db_admin = db.query(User).filter(User.id == uuid.UUID(admin["id"])).one()
    db_admin.role = UserRole.ADMIN
    db.commit()

    r = client.delete("/api/users/me")
    assert r.status_code == 400

    db.expire_all()
    assert db.query(User).filter(User.id == uuid.UUID(admin["id"])).first() is not None

    # Убираем роль, чтобы не влиять на остальные тесты
    db_admin = db.query(User).filter(User.id == uuid.UUID(admin["id"])).one()
    db_admin.role = UserRole.VIEWER
    db.commit()


# ---------------------------------------------------------------------------
# Санитизация журнала ошибок
# ---------------------------------------------------------------------------


_INTEGRITY_ERROR = (
    '(psycopg2.errors.UniqueViolation) duplicate key value violates unique '
    'constraint "users_email_key"\n'
    "DETAIL:  Key (email)=(subject@example.com) already exists.\n"
    "\n"
    "[SQL: INSERT INTO users (name, email) VALUES (%(name)s, %(email)s)]\n"
    "[parameters: {'name': 'Иван', 'email': 'subject@example.com'}]\n"
)


def test_sanitize_message_drops_field_values():
    cleaned = error_log_service.sanitize_message(_INTEGRITY_ERROR)
    assert "subject@example.com" not in cleaned
    assert "DETAIL" not in cleaned
    assert "duplicate key value violates unique constraint" in cleaned


def test_sanitize_message_is_idempotent():
    once = error_log_service.sanitize_message(_INTEGRITY_ERROR)
    assert error_log_service.sanitize_message(once) == once


def test_sanitize_message_cuts_inline_detail():
    cleaned = error_log_service.sanitize_message(
        "IntegrityError: сбой DETAIL:  Key (email)=(inline@example.com)"
    )
    assert "inline@example.com" not in cleaned
    assert cleaned.startswith("IntegrityError: сбой")


def test_sanitize_traceback_redacts_values():
    traceback = (
        "Traceback (most recent call last):\n"
        '  File "src/services/user.py", line 42, in create_user\n'
        "    db.commit()\n"
        "sqlalchemy.exc.IntegrityError: duplicate key\n"
        "DETAIL:  Key (email)=(subject@example.com) already exists.\n"
        "[parameters: {'email': 'subject@example.com'}]\n"
    )
    cleaned = error_log_service.sanitize_traceback(traceback)
    assert cleaned is not None
    assert "subject@example.com" not in cleaned
    # Структура трейсбека сохраняется
    assert "src/services/user.py" in cleaned
    assert "sqlalchemy.exc.IntegrityError: duplicate key" in cleaned


def test_log_error_sanitizes_on_write(db: Session):
    entry = error_log_service.log_error(
        db,
        level="error",
        event="unhandled_exception",
        message=_INTEGRITY_ERROR,
        traceback=_INTEGRITY_ERROR,
    )
    db.commit()
    assert "subject@example.com" not in entry.message
    assert entry.traceback is not None
    assert "subject@example.com" not in entry.traceback
    db.delete(entry)
    db.commit()


# ---------------------------------------------------------------------------
# Ретенция журналов
# ---------------------------------------------------------------------------


def test_purge_logs_removes_only_expired(db: Session):
    old = datetime.now(timezone.utc) - timedelta(days=120)
    fresh = datetime.now(timezone.utc) - timedelta(days=1)

    stale_error = ErrorLog(
        level="error", event="retention", message="старая ошибка", timestamp=old
    )
    fresh_error = ErrorLog(
        level="error", event="retention", message="свежая ошибка", timestamp=fresh
    )
    stale_audit = AuditLog(
        action="retention.test", resource_type="article", timestamp=old
    )
    fresh_audit = AuditLog(
        action="retention.test", resource_type="article", timestamp=fresh
    )
    db.add_all([stale_error, fresh_error, stale_audit, fresh_audit])
    db.commit()

    stats = retention_service.purge_logs(db, days=90)
    db.commit()

    assert stats["retention_days"] == 90
    assert stats["error_logs_deleted"] >= 1
    assert stats["audit_logs_deleted"] >= 1

    remaining_events = {
        e.message
        for e in db.query(ErrorLog).filter(ErrorLog.event == "retention").all()
    }
    assert remaining_events == {"свежая ошибка"}
    assert (
        db.query(AuditLog).filter(AuditLog.action == "retention.test").count() == 1
    )

    db.query(ErrorLog).filter(ErrorLog.event == "retention").delete()
    db.query(AuditLog).filter(AuditLog.action == "retention.test").delete()
    db.commit()


def test_purge_logs_rejects_zero_days(db: Session):
    try:
        retention_service.purge_logs(db, days=0)
    except ValueError:
        return
    raise AssertionError("ожидалась ValueError при days=0")


def test_purge_endpoint_requires_auth(client: TestClient):
    r = client.post("/api/admin/system/logs/purge")
    assert r.status_code == 401


def test_purge_endpoint_forbidden_for_viewer(client: TestClient):
    _login_as(client, "viewer-purge@example.com", "Viewer")
    r = client.post("/api/admin/system/logs/purge")
    assert r.status_code == 403


def test_purge_endpoint_for_admin(client: TestClient, db: Session):
    admin = _login_as(client, "purge-admin@example.com", "Purge Admin")
    db_admin = db.query(User).filter(User.id == uuid.UUID(admin["id"])).one()
    db_admin.role = UserRole.ADMIN
    db.commit()

    stale = ErrorLog(
        level="error",
        event="retention-endpoint",
        message="просроченная запись",
        timestamp=datetime.now(timezone.utc) - timedelta(days=200),
    )
    db.add(stale)
    db.commit()

    r = client.post("/api/admin/system/logs/purge?days=90")
    assert r.status_code == 200
    data = r.json()["data"]
    assert data["retention_days"] == 90
    assert data["error_logs_deleted"] >= 1

    db.expire_all()
    assert (
        db.query(ErrorLog).filter(ErrorLog.event == "retention-endpoint").count() == 0
    )
    assert (
        db.query(AuditLog).filter(AuditLog.action == "logs.purged").count() == 1
    )

    db_admin = db.query(User).filter(User.id == uuid.UUID(admin["id"])).one()
    db_admin.role = UserRole.VIEWER
    db.commit()
