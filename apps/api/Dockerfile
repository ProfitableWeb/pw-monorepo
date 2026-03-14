# apps/api/Dockerfile — FastAPI backend
# Build context: repo root (docker-compose context: .)

FROM python:3.12-slim AS base

# Установка uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

WORKDIR /app

# Копируем файлы зависимостей (кэширование слоёв)
COPY apps/api/pyproject.toml apps/api/uv.lock ./

# Установка зависимостей (без dev)
RUN uv sync --frozen --no-dev --no-install-project

# Копируем исходный код и alembic
COPY apps/api/src ./src
COPY apps/api/alembic ./alembic
COPY apps/api/alembic.ini ./

EXPOSE 8000

# Миграции + запуск сервера
CMD ["sh", "-c", "uv run alembic upgrade head && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000"]
