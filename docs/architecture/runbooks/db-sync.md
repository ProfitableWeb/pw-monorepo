# Runbook: Синхронизация БД

## Seed-данные

```bash
# Локально
cd apps/api && PYTHONPATH=. uv run python -m src.seed

# На сервере
ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187 \
  "cd ~/profitableweb/apps/api && PYTHONPATH=. uv run python -m src.seed"
```

Скрипт идемпотентный — повторный запуск не создаёт дубликаты.

## Дамп базы данных

```bash
pg_dump -U profitableweb profitableweb > dump.sql                  # Полный (схема + данные)
pg_dump -U profitableweb --data-only profitableweb > data_dump.sql # Только данные
pg_dump -U profitableweb -t articles profitableweb > articles.sql  # Конкретная таблица
```

## Восстановление

### Из полного дампа

```bash
# Пересоздать БД
sudo -u postgres dropdb profitableweb
sudo -u postgres createdb profitableweb -O profitableweb
psql -U profitableweb profitableweb < dump.sql
```

### Только данные (в существующую схему)

```bash
# Сначала применить миграции
cd apps/api && uv run alembic upgrade head
# Затем загрузить данные
psql -U profitableweb profitableweb < data_dump.sql
```

## Копирование между серверами

### Сервер → Локальная машина

```bash
# На сервере
ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187 \
  "pg_dump -U profitableweb --data-only profitableweb" > data_dump.sql

# Локально
cd apps/api && uv run alembic upgrade head
psql -U profitableweb profitableweb < data_dump.sql
```

### Локальная машина → Сервер

```bash
pg_dump -U profitableweb profitableweb > dump.sql
scp -i ~/.ssh/cloudru_deploy dump.sql webresearcher@213.171.25.187:~/
ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187 \
  "psql -U profitableweb profitableweb < ~/dump.sql"
```

## Перед синхронизацией

- **Всегда** делать бэкап целевой БД перед загрузкой
- Убедиться, что миграции на одной версии: `uv run alembic current`
