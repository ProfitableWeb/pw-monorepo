"""
PW-072 | Ретенция журналов: удаление error_logs и audit_logs старше срока хранения.

Запуск:
  cd apps/api && uv run python scripts/purge_logs.py
  cd apps/api && uv run python scripts/purge_logs.py --days 90
  cd apps/api && uv run python scripts/purge_logs.py --dry-run

Планировщика в приложении намеренно нет — прогон запускается вручную либо
внешним cron/systemd-таймером на VM.
"""

import argparse
import sys
from pathlib import Path

# Скрипт запускается напрямую (python scripts/purge_logs.py), поэтому корень
# apps/api добавляем в sys.path вручную — иначе пакет src не находится.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402

from src.core.config import settings  # noqa: E402
from src.services import audit_log as audit_service  # noqa: E402
from src.services import retention as retention_service  # noqa: E402


def main() -> None:
    # Windows-консоль по умолчанию в cp866/cp1251 — русский вывод падает.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    parser = argparse.ArgumentParser(
        description="Удаление журналов старше срока хранения"
    )
    parser.add_argument(
        "--days",
        type=int,
        default=retention_service.DEFAULT_RETENTION_DAYS,
        help=f"срок хранения в днях (по умолчанию {retention_service.DEFAULT_RETENTION_DAYS})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="показать, сколько записей будет удалено, но не удалять",
    )
    args = parser.parse_args()

    try:
        cutoff = retention_service.cutoff_date(args.days)
    except ValueError as exc:
        print(f"Ошибка: {exc}")
        sys.exit(1)

    engine = create_engine(settings.database_url)
    with Session(engine) as session:
        if args.dry_run:
            from src.models.audit_log import AuditLog
            from src.models.error_log import ErrorLog

            errors = (
                session.query(ErrorLog).filter(ErrorLog.timestamp < cutoff).count()
            )
            audits = (
                session.query(AuditLog).filter(AuditLog.timestamp < cutoff).count()
            )
            print(f"Граница: {cutoff.isoformat()}")
            print(f"Будет удалено: error_logs={errors}, audit_logs={audits}")
            return

        stats = retention_service.purge_logs(session, days=args.days)
        audit_service.log_action(
            session,
            user_id=None,
            action="logs.purged",
            resource_type="personal_data",
            changes={**stats, "source": "cli"},
        )
        session.commit()
        print(
            f"Удалено: error_logs={stats['error_logs_deleted']}, "
            f"audit_logs={stats['audit_logs_deleted']} "
            f"(старше {args.days} дн., граница {cutoff.isoformat()})"
        )


if __name__ == "__main__":
    main()
