"""
PW-030 | Назначение роли admin пользователю по email.

Запуск:
  cd apps/api && uv run python scripts/promote_admin.py user@example.com
"""

import sys

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from src.core.config import settings
from src.models.user import User, UserRole


def promote(email: str) -> None:
    engine = create_engine(settings.database_url)
    with Session(engine) as session:
        user = session.query(User).filter(User.email == email).first()
        if not user:
            print(f"Пользователь с email '{email}' не найден")
            sys.exit(1)
        old_role = user.role.value
        user.role = UserRole.ADMIN
        session.commit()
        print(f"{user.name} ({user.email}): {old_role} -> admin")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Использование: uv run python scripts/promote_admin.py <email>")
        sys.exit(1)
    promote(sys.argv[1])
