# Окружения

## Обзор

Prod и dev — два изолированных Docker Compose-контура на **одной** Cloud.ru VM (`213.171.25.187`), разделённые портами и
отдельными PostgreSQL.

| Параметр | Local                  | Dev                               | Prod                                                |
| -------- | ---------------------- | --------------------------------- | --------------------------------------------------- |
| Домен    | localhost              | dev.profitableweb.ru              | profitableweb.ru (DNS ещё не переключён на VM) / IP |
| Хостинг  | машина разработчика    | VM, dev-контур Docker             | VM, prod-контур Docker                              |
| Порты    | 3000 / 3001 / 8000     | 3100 / 3101 / 8100                | 3000 / 3001 / 8000                                  |
| БД       | PostgreSQL (локальный) | PostgreSQL :5433 (контейнер)      | PostgreSQL :5432 (контейнер)                        |
| Файлы    | uploads/ (локально)    | uploads/ на VM (nginx)            | S3 Cloud.ru (`STORAGE_BACKEND=s3`)                  |
| Данные   | Mock / Seed            | Seed                              | Реальные                                            |
| CI/CD    | —                      | `deploy-dev.yml` (push в develop) | `deploy.yml` (push в master)                        |
| SSL      | —                      | нет (:80)                         | нет (:80); Let's Encrypt — после переключения DNS   |

## Local

Локальная разработка на машине разработчика.

```bash
bun turbo dev  # Запуск всех приложений
```

- **web**: http://localhost:3000
- **admin**: http://localhost:3001
- **api**: http://localhost:8000
- **БД**: локальный PostgreSQL (`postgresql://postgres:postgres@localhost:5432/profitableweb` по умолчанию, см.
  `apps/api/src/core/config.py`)
- **Данные**: mock-данные фронтенда или seed-скрипт (`apps/api/src/seed.py` — только `create_all` + guard, безопасен)

Для работы без БД фронтенд использует mock-данные. API можно не запускать.

## Dev (VM, dev-контур)

Стейджинг на Cloud.ru VM. Автодеплой при push в `develop`.

- **VM**: `213.171.25.187`, пользователь `webresearcher`
- **SSH**: `ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187`
- **web**: http://dev.profitableweb.ru
- **admin**: http://dev.profitableweb.ru/admin
- **api**: http://dev.profitableweb.ru/api
- **Контейнеры**: pw-dev-web :3100, pw-dev-api :8100, pw-dev-admin :3101, pw-dev-postgres :5433

### Nginx routing (dev)

```
dev.profitableweb.ru/           → 127.0.0.1:3100 (web)
dev.profitableweb.ru/admin/     → 127.0.0.1:3101 (admin)
dev.profitableweb.ru/api/       → 127.0.0.1:8100 (api)
```

## Prod (VM, prod-контур)

Тот же сервер, отдельный контур. Автодеплой при push в `master`.

- **Доступ**: http://213.171.25.187/ (домен `profitableweb.ru` пока указывает на стороннюю площадку, не на VM)
- **Контейнеры**: pw-prod-web :3000, pw-prod-api :8000, pw-prod-admin :3001, pw-prod-postgres :5432
- **Файлы**: Cloud.ru Object Storage (S3), бакет `pw-media`

### Открытые пункты

- Переключить A-запись `profitableweb.ru` на VM
- После переключения DNS — Let's Encrypt + `listen 443 ssl` в nginx + открыть порт 443 в security group
- Бэкапы БД по расписанию, мониторинг (TBD)
