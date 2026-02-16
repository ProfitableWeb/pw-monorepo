# Миграции (Alembic)

## Обзор

Alembic управляет схемой БД. Миграции хранятся в `apps/api/alembic/versions/`. Автоматически применяются при CI/CD
деплое.

## Команды

Все команды выполняются из `apps/api/`:

```bash
cd apps/api

# Создать миграцию (autogenerate из моделей)
uv run alembic revision --autogenerate -m "описание изменения"

# Применить все миграции
uv run alembic upgrade head

# Откатить последнюю миграцию
uv run alembic downgrade -1

# Откатить до конкретной ревизии
uv run alembic downgrade <revision_id>

# Текущая версия БД
uv run alembic current

# История миграций
uv run alembic history --verbose
```

## Workflow разработки

1. Изменить модель в `src/models/`
2. Создать миграцию:
   ```bash
   uv run alembic revision --autogenerate -m "add status field to articles"
   ```
3. Проверить сгенерированный файл в `alembic/versions/`
4. Применить локально:
   ```bash
   uv run alembic upgrade head
   ```
5. Закоммитить файл миграции вместе с изменением модели
6. При push в master — CI/CD автоматически выполнит `alembic upgrade head` на сервере

## CI/CD интеграция

В GitVerse workflow миграции применяются **до** перезапуска приложений:

```bash
cd apps/api
uv sync
uv run alembic upgrade head  # ← сначала миграции
# ... затем build и pm2 restart
```

## Соглашения

- Описание миграции на английском (Alembic convention): `"add role column to users"`
- Одна миграция = одно логическое изменение
- **Всегда** проверять autogenerate — может пропустить индексы или constraints
- Не редактировать уже применённые миграции на сервере
- Для данных (INSERT/UPDATE) использовать отдельные data-миграции

## Откат на сервере

В случае проблем с миграцией на сервере:

```bash
ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187
cd ~/profitableweb/apps/api
uv run alembic downgrade -1
```
