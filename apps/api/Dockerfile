# apps/api/Dockerfile — FastAPI backend
# Build context: repo root (docker-compose context: .)

FROM python:3.12-slim AS base

# Установка uv из PyPI с закреплённой версией (PW-081).
# Раньше: COPY --from=ghcr.io/astral-sh/uv:latest — плавающий тег и реестр ghcr.io,
# скачивание с которого на VM (Cloud.ru) зависло и сорвало деплой 2026-09-25.
# PyPI с VM доступен (из него же ставятся зависимости через uv sync).
RUN pip install --no-cache-dir uv==0.8.17

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
