# Синхронизация базы данных

## Стратегия по окружениям

```
Local ←──seed──→ Test ←──future──→ Prod
        pg_dump
```

| Направление   | Метод                  | Когда использовать                    |
| ------------- | ---------------------- | ------------------------------------- |
| Пустая → Seed | seed-скрипт            | Первичное наполнение                  |
| Local → Test  | pg_dump + psql         | Перенос тестовых данных на сервер     |
| Test → Local  | pg_dump --data-only    | Получить данные с сервера для отладки |
| Prod → Test   | pg_dump + анонимизация | Будущее (после запуска prod)          |

## Seed-скрипт

Наполняет БД начальными данными: категории, тестовые статьи, admin-пользователь.

```bash
cd apps/api
PYTHONPATH=. uv run python -m src.seed
```

Скрипт идемпотентный — проверяет существование записей перед вставкой.

## Local → Test

Полный дамп локальной БД и загрузка на сервер:

```bash
# На локальной машине
pg_dump -U profitableweb profitableweb > dump.sql
scp -i ~/.ssh/cloudru_deploy dump.sql webresearcher@213.171.25.187:~/

# На сервере
ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187
psql -U profitableweb profitableweb < ~/dump.sql
```

## Test → Local

Только данные (без схемы — схема из миграций):

```bash
# На сервере
ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187
pg_dump -U profitableweb --data-only profitableweb > data_dump.sql

# На локальной машине
scp -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187:~/data_dump.sql .

# Применить миграции, затем данные
cd apps/api
uv run alembic upgrade head
psql -U profitableweb profitableweb < data_dump.sql
```

## Prod → Test (планируется)

При запуске production:

1. `pg_dump` с prod-сервера
2. Анонимизация: замена email, имён пользователей
3. Загрузка на test-сервер

Скрипт анонимизации будет в `apps/api/scripts/anonymize_dump.py`.

## Важно

- Перед синхронизацией **всегда** делать бэкап целевой БД
- Миграции применяются отдельно от данных (`alembic upgrade head`)
- Seed-скрипт не удаляет существующие данные
