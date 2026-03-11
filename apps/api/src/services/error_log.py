"""
PW-042-B | Сервис ошибок: запись, чтение, resolve, статистика.
"""

import traceback as tb_module
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from src.models.error_log import ErrorLog
from src.models.user import User
from src.schemas.monitoring import ErrorLogResponse, ErrorStatsResponse

# Маппинг date_range → timedelta
_DATE_RANGE_MAP: dict[str, timedelta] = {
    "24h": timedelta(hours=24),
    "7d": timedelta(days=7),
    "30d": timedelta(days=30),
}


def log_error(
    db: Session,
    *,
    level: str,
    event: str,
    message: str,
    traceback: str | None = None,
    request_method: str | None = None,
    request_path: str | None = None,
    request_id: str | None = None,
    user_id: uuid.UUID | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
    status_code: int | None = None,
    context: dict | None = None,
) -> ErrorLog:
    """Записывает ошибку в БД."""
    entry = ErrorLog(
        level=level,
        event=event,
        message=message,
        traceback=traceback,
        request_method=request_method,
        request_path=request_path,
        request_id=request_id,
        user_id=user_id,
        ip_address=ip_address,
        user_agent=user_agent,
        status_code=status_code,
        context=context,
    )
    db.add(entry)
    return entry


def get_errors(
    db: Session,
    *,
    limit: int = 20,
    offset: int = 0,
    level: str | None = None,
    resolved: bool | None = None,
    date_range: str | None = None,
) -> tuple[list[ErrorLogResponse], int]:
    """Список ошибок с пагинацией, фильтрами и LEFT JOIN users."""
    query = db.query(ErrorLog, User.name, User.email).outerjoin(
        User, ErrorLog.user_id == User.id
    )

    # Фильтры
    if level:
        query = query.filter(ErrorLog.level == level)
    if resolved is not None:
        query = query.filter(ErrorLog.resolved == resolved)
    if date_range and date_range in _DATE_RANGE_MAP:
        cutoff = datetime.now(timezone.utc) - _DATE_RANGE_MAP[date_range]
        query = query.filter(ErrorLog.timestamp >= cutoff)

    total = query.count()
    rows = query.order_by(ErrorLog.timestamp.desc()).offset(offset).limit(limit).all()

    items = [_row_to_response(row, user_name, user_email) for row, user_name, user_email in rows]
    return items, total


def get_error_by_id(db: Session, error_id: uuid.UUID) -> ErrorLogResponse | None:
    """Одна запись по ID."""
    result = (
        db.query(ErrorLog, User.name, User.email)
        .outerjoin(User, ErrorLog.user_id == User.id)
        .filter(ErrorLog.id == error_id)
        .first()
    )
    if not result:
        return None
    row, user_name, user_email = result
    return _row_to_response(row, user_name, user_email)


def resolve_error(db: Session, error_id: uuid.UUID) -> bool:
    """Помечает ошибку как resolved. Возвращает False если не найдена."""
    entry = db.query(ErrorLog).filter(ErrorLog.id == error_id).first()
    if not entry:
        return False
    entry.resolved = True
    db.commit()
    return True


def get_error_stats(db: Session) -> ErrorStatsResponse:
    """Статистика ошибок по периодам."""
    now = datetime.now(timezone.utc)
    return ErrorStatsResponse(
        last_24h=_count_since(db, now - timedelta(hours=24)),
        last_7d=_count_since(db, now - timedelta(days=7)),
        last_30d=_count_since(db, now - timedelta(days=30)),
    )


def count_errors_24h(db: Session) -> int:
    """Подсчёт ошибок за 24 часа для health endpoint."""
    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
    return _count_since(db, cutoff)


def format_exception(exc: Exception) -> str:
    """Форматирует traceback исключения в строку."""
    return "".join(tb_module.format_exception(type(exc), exc, exc.__traceback__))


# ---------------------------------------------------------------------------
# Internal
# ---------------------------------------------------------------------------


def _count_since(db: Session, since: datetime) -> int:
    result = db.query(func.count(ErrorLog.id)).filter(ErrorLog.timestamp >= since).scalar()
    return result or 0


def _row_to_response(
    row: ErrorLog, user_name: str | None, user_email: str | None
) -> ErrorLogResponse:
    return ErrorLogResponse(
        id=str(row.id),
        timestamp=row.timestamp.isoformat() if row.timestamp else "",
        level=row.level,
        event=row.event,
        message=row.message,
        traceback=row.traceback,
        request_method=row.request_method,
        request_path=row.request_path,
        request_id=row.request_id,
        user_id=str(row.user_id) if row.user_id else None,
        user_name=user_name,
        user_email=user_email,
        ip_address=row.ip_address,
        user_agent=row.user_agent,
        status_code=row.status_code,
        context=row.context,
        resolved=row.resolved,
    )
