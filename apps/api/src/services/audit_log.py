"""
PW-042-D | Сервис аудит-лога: запись, чтение, фильтры для UI.
"""

import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from src.models.audit_log import AuditLog
from src.models.user import User
from src.schemas.monitoring import AuditLogResponse

# Маппинг date_range → timedelta
_DATE_RANGE_MAP: dict[str, timedelta] = {
    "24h": timedelta(hours=24),
    "7d": timedelta(days=7),
    "30d": timedelta(days=30),
}


def log_action(
    db: Session,
    *,
    user_id: uuid.UUID | None = None,
    action: str,
    resource_type: str,
    resource_id: uuid.UUID | None = None,
    changes: dict | None = None,
    request_id: str | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> AuditLog:
    """Записывает действие в аудит-лог. Не коммитит — вызывающий коммитит."""
    entry = AuditLog(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        changes=changes,
        request_id=request_id,
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(entry)
    return entry


def get_entries(
    db: Session,
    *,
    limit: int = 20,
    offset: int = 0,
    action: str | None = None,
    user_id: str | None = None,
    date_range: str | None = None,
) -> tuple[list[AuditLogResponse], int]:
    """Список аудит-записей с пагинацией, фильтрами и LEFT JOIN users."""
    query = db.query(AuditLog, User.name, User.email).outerjoin(
        User, AuditLog.user_id == User.id
    )

    if action:
        query = query.filter(AuditLog.action == action)
    if user_id:
        query = query.filter(AuditLog.user_id == uuid.UUID(user_id))
    if date_range and date_range in _DATE_RANGE_MAP:
        cutoff = datetime.now(timezone.utc) - _DATE_RANGE_MAP[date_range]
        query = query.filter(AuditLog.timestamp >= cutoff)

    total = query.count()
    rows = query.order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit).all()

    items = [_row_to_response(row, user_name, user_email) for row, user_name, user_email in rows]
    return items, total


def get_unique_actions(db: Session) -> list[str]:
    """DISTINCT actions для фильтра в UI."""
    rows = db.query(AuditLog.action).distinct().order_by(AuditLog.action).all()
    return [r[0] for r in rows]


def get_unique_users(db: Session) -> list[tuple[str, str]]:
    """DISTINCT user_id+name для фильтра в UI."""
    rows = (
        db.query(AuditLog.user_id, User.name)
        .outerjoin(User, AuditLog.user_id == User.id)
        .filter(AuditLog.user_id.is_not(None))
        .distinct()
        .order_by(User.name)
        .all()
    )
    return [(str(uid), name or "Unknown") for uid, name in rows]


# ---------------------------------------------------------------------------
# Internal
# ---------------------------------------------------------------------------


def _row_to_response(
    row: AuditLog, user_name: str | None, user_email: str | None
) -> AuditLogResponse:
    return AuditLogResponse(
        id=str(row.id),
        timestamp=row.timestamp.isoformat() if row.timestamp else "",
        user_id=str(row.user_id) if row.user_id else None,
        user_name=user_name,
        user_email=user_email,
        action=row.action,
        resource_type=row.resource_type,
        resource_id=str(row.resource_id) if row.resource_id else None,
        changes=row.changes,
        request_id=row.request_id,
        ip_address=row.ip_address,
        user_agent=row.user_agent,
    )
