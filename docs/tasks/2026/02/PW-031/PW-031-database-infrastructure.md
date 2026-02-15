# PW-031: Инфраструктура БД на тестовом контуре

> **Статус**: IN PROGRESS **Приоритет**: Критический (блокирует деплой PW-030) **Компонент**: 🔧 DevOps + 🐍 Backend
> **Дата**: 2026-02-15 **Связанные**: PW-027 (API), PW-030 (Auth), ADR-001

## Проблема

Тестовый контур Cloud.ru (VM 213.171.25.187) не имеет PostgreSQL. API работает на устаревшей версии кода. При деплое
PW-030 API упадёт из-за отсутствия БД.

## Задачи

### Фаза 1: Установка PostgreSQL на VM

- [x] Установить PostgreSQL 14 через `apt install` (Ubuntu 22.04)
- [x] Создать пользователя `profitableweb`
- [x] Создать базу данных `profitableweb`
- [x] localhost-подключение работает (pg_hba.conf по умолчанию)
- [x] Проверить подключение из Python (SQLAlchemy)
- [x] Alembic миграция 001 применена
- [x] Seed-данные загружены (6 категорий, 38 статей, 13 комментариев)
- [x] API перезапущен с новой БД — отдаёт реальные данные

**DATABASE_URL**: `postgresql://profitableweb:profitableweb_2026@localhost:5432/profitableweb`

### Фаза 2: Seed-скрипт для начальных данных

- [x] Seed-скрипт уже существовал: `apps/api/src/seed.py` (PW-027)
- [x] Запуск: `cd apps/api && uv run python -m src.seed`
- [x] Загружены на VM: 6 категорий, 38 статей, 13 комментариев

### Фаза 3: CI/CD интеграция

- [x] Обновить workflows: запись `.env` из secrets
- [x] Обновить workflows: `alembic upgrade head` при деплое
- [ ] Добавить DATABASE_URL в GitVerse secrets:
      `postgresql://profitableweb:profitableweb_2026@localhost:5432/profitableweb`
- [ ] Первый деплой через CI/CD + проверка

### Фаза 4: Роль-гард в админке

- [ ] `isAdmin` в auth-store (сделано)
- [ ] Экран «Доступ запрещён» в App.tsx (сделано)
- [ ] Скрипт `promote_admin.py` (сделано)

### Фаза 5: Проверка на VM

- [ ] Деплой через push в master
- [ ] Миграции применились
- [ ] API отвечает `/api/articles`
- [ ] OAuth вход работает
- [ ] Seed-данные загружены
- [ ] Админка доступна с ролью admin
- [ ] Админка блокирует viewer

## Принятые решения

См. [ADR-001: Инфраструктура базы данных](../../../decisions/ADR-001-database-infrastructure.md)
