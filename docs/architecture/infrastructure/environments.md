# Окружения

## Обзор

| Параметр | Local               | Test                      | Prod                          |
| -------- | ------------------- | ------------------------- | ----------------------------- |
| Домен    | localhost           | dev.profitableweb.ru      | TBD                           |
| VM       | —                   | 213.171.25.187            | отдельная VM                  |
| БД       | SQLite / PostgreSQL | PostgreSQL                | PostgreSQL                    |
| Данные   | Mock / Seed         | Seed                      | Реальные                      |
| CI/CD    | —                   | GitVerse → push to master | GitVerse → отдельный workflow |
| SSL      | —                   | Let's Encrypt             | Let's Encrypt                 |

## Local

Локальная разработка на машине разработчика.

```bash
bun turbo dev  # Запуск всех приложений
```

- **web**: http://localhost:3000
- **admin**: http://localhost:3001
- **api**: http://localhost:8000
- **БД**: SQLite (по умолчанию) или локальный PostgreSQL
- **Данные**: mock-данные из `src/lib/mock-api.ts` или seed-скрипт

Для работы без БД фронтенд использует mock-данные. API можно не запускать.

## Test

Тестовый сервер на Cloud.ru VM. Автоматический деплой при push в master.

- **VM**: `213.171.25.187`, пользователь `webresearcher`
- **SSH**: `ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187`
- **web**: http://dev.profitableweb.ru
- **admin**: http://dev.profitableweb.ru/admin
- **api**: http://dev.profitableweb.ru/api
- **БД**: PostgreSQL 14 на той же VM
- **Данные**: seed-скрипт для начального наполнения
- **Процессы**: PM2 (`ecosystem.config.js`)
- **Reverse proxy**: nginx

### Nginx routing

```
dev.profitableweb.ru/           → localhost:3000 (web)
dev.profitableweb.ru/admin/     → localhost:3001 (admin)
dev.profitableweb.ru/api/       → localhost:8000 (api)
```

## Prod

Планируется. Будет отдельная VM с аналогичной конфигурацией.

- Домен: profitableweb.ru
- Отдельный GitVerse workflow для деплоя
- Бэкапы БД по расписанию
- Мониторинг (TBD)
