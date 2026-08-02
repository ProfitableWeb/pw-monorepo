"""
PW-072 | Ретенция журналов: удаление записей error_logs и audit_logs старше
срока хранения.

Оба журнала хранят персональные данные (user_id, IP-адрес, User-Agent), поэтому
бессрочное хранение противоречит ч. 7 ст. 5 ФЗ-152 и заявленному в политике
сроку 90 дней.

Фонового планировщика намеренно нет — вызов явный:
  * админ-эндпоинт `POST /api/admin/system/logs/purge`;
  * CLI: `uv run python scripts/purge_logs.py --days 90`.
"""

from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from src.models.audit_log import AuditLog
from src.models.error_log import ErrorLog

# Срок хранения журналов, заявленный в Политике обработки ПДн (раздел 10).
DEFAULT_RETENTION_DAYS = 90
# Нижняя граница — защита от опечатки вроде `--days 0`, стирающей журнал целиком.
MIN_RETENTION_DAYS = 1


def cutoff_date(days: int) -> datetime:
    """Граница удаления: записи старше неё подлежат уничтожению."""
    if days < MIN_RETENTION_DAYS:
        msg = f"Срок хранения не может быть меньше {MIN_RETENTION_DAYS} дн."
        raise ValueError(msg)
    return datetime.now(timezone.utc) - timedelta(days=days)


def purge_error_logs(db: Session, *, days: int = DEFAULT_RETENTION_DAYS) -> int:
    """Удаляет записи error_logs старше `days`. Не коммитит."""
    cutoff = cutoff_date(days)
    return (
        db.query(ErrorLog)
        .filter(ErrorLog.timestamp < cutoff)
        .delete(synchronize_session=False)
    )


def purge_audit_logs(db: Session, *, days: int = DEFAULT_RETENTION_DAYS) -> int:
    """Удаляет записи audit_logs старше `days`. Не коммитит."""
    cutoff = cutoff_date(days)
    return (
        db.query(AuditLog)
        .filter(AuditLog.timestamp < cutoff)
        .delete(synchronize_session=False)
    )


def purge_logs(db: Session, *, days: int = DEFAULT_RETENTION_DAYS) -> dict[str, int]:
    """
    Прогон ретенции по обоим журналам. Не коммитит — вызывающий пишет
    аудит-запись о прогоне и коммитит одной транзакцией.
    """
    return {
        "error_logs_deleted": purge_error_logs(db, days=days),
        "audit_logs_deleted": purge_audit_logs(db, days=days),
        "retention_days": days,
    }
