# Runbook: Деплой

## Инфраструктура

- **VM**: Cloud.ru, 2 vCPU / 4 GB RAM, IP `213.171.25.187`
- **Контуры**: prod (`profitableweb.ru`) + dev (`dev.profitableweb.ru`)
- **Оркестрация**: Docker Compose (заменил PM2 в PW-043)
- **CI/CD**: GitHub Actions
- **Git-зеркала**: GitVerse (`origin`) + GitHub (`github`)

## GitHub Secrets

Все секреты хранятся в GitHub → Settings → Secrets. Полный список — в `apps/api/.env.example`.

| Секрет                  | Где используется        | Описание                                                             |
| ----------------------- | ----------------------- | -------------------------------------------------------------------- |
| `SSH_PRIVATE_KEY`       | CI/CD                   | Приватный ключ для подключения к VM (содержимое `~/.ssh/id_ed25519`) |
| `SSH_USER`              | CI/CD                   | Пользователь VM (`webresearcher`)                                    |
| `SSH_HOST`              | CI/CD                   | IP сервера (`213.171.25.187`)                                        |
| `SSH_PORT`              | CI/CD                   | Порт SSH (`22`)                                                      |
| `POSTGRES_DB`           | docker-compose.prod.yml | Имя БД prod (`profitableweb`)                                        |
| `POSTGRES_USER`         | docker-compose.prod.yml | Пользователь БД prod (`pw`)                                          |
| `POSTGRES_PASSWORD`     | docker-compose.prod.yml | Пароль БД prod (надёжный, сгенерированный)                           |
| `DEV_POSTGRES_PASSWORD` | docker-compose.dev.yml  | Пароль БД dev (отдельный от prod)                                    |
| `JWT_SECRET`            | FastAPI prod            | Секрет для JWT-токенов prod                                          |
| `DEV_JWT_SECRET`        | FastAPI dev             | Секрет для JWT-токенов dev                                           |
| `FRONTEND_URL`          | FastAPI prod            | `https://profitableweb.ru`                                           |
| `ADMIN_URL`             | FastAPI prod            | `https://profitableweb.ru/admin`                                     |
| `CORS_ORIGINS`          | FastAPI prod            | `["https://profitableweb.ru"]`                                       |
| `YANDEX_CLIENT_ID`      | FastAPI                 | OAuth Yandex ID                                                      |
| `YANDEX_CLIENT_SECRET`  | FastAPI                 | OAuth Yandex Secret                                                  |
| `GOOGLE_CLIENT_ID`      | FastAPI                 | OAuth Google ID                                                      |
| `GOOGLE_CLIENT_SECRET`  | FastAPI                 | OAuth Google Secret                                                  |
| `TELEGRAM_BOT_TOKEN`    | FastAPI                 | Telegram Login Widget                                                |
| `STORAGE_BACKEND`       | FastAPI                 | `s3`                                                                 |
| `S3_ENDPOINT`           | FastAPI                 | `https://s3.cloud.ru`                                                |
| `S3_BUCKET`             | FastAPI                 | `pw-media`                                                           |
| `S3_ACCESS_KEY`         | FastAPI                 | Ключ Cloud.ru S3 (формат `tenant_id:key_id`)                         |
| `S3_SECRET_KEY`         | FastAPI                 | Секрет Cloud.ru S3                                                   |
| `S3_REGION`             | FastAPI                 | `ru-central-1`                                                       |
| `S3_PUBLIC_ENDPOINT`    | FastAPI                 | `https://global.s3.cloud.ru`                                         |

### Как заполнить SSH_PRIVATE_KEY

1. Локально: `cat ~/.ssh/id_ed25519` (или `id_rsa`)
2. Скопировать **всё** содержимое, включая `-----BEGIN/END-----`
3. Вставить в GitHub → Settings → Secrets → `SSH_PRIVATE_KEY`

### Как сгенерировать пароли

```bash
# Надёжный пароль (44 символа)
openssl rand -base64 32

# JWT-секрет (64 символа)
openssl rand -base64 48
```

## Автоматический деплой

### Prod

Push в `master` → GitHub Actions (`deploy.yml`) автоматически деплоит.

```bash
git push github master  # → автодеплой на profitableweb.ru
```

Что происходит:

1. CI записывает `.env.prod` из GitHub Secrets на VM
2. `git reset --hard origin/master` на VM
3. `docker compose -f docker-compose.prod.yml up -d --build`
4. Nginx-конфиг обновляется
5. Health check: `curl http://<IP>/api/health`

### Dev

Push в `develop` → GitHub Actions (`deploy-dev.yml`) автоматически деплоит.

```bash
git push github develop  # → автодеплой на dev.profitableweb.ru
```

## Ручной деплой

При проблемах с CI/CD или необходимости быстрого обновления.

### 1. Подключиться к серверу

```bash
ssh webresearcher@213.171.25.187
```

### 2. Обновить код и запустить

```bash
cd ~/profitableweb
git fetch origin
git reset --hard origin/master

# Prod
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build --remove-orphans

# Dev
docker compose -f docker-compose.dev.yml --env-file .env.dev up -d --build --remove-orphans
```

### 3. Проверить

```bash
docker compose -f docker-compose.prod.yml ps     # Все контейнеры running
curl -s http://localhost:8000/api/health           # API отвечает
curl -s http://localhost:3000                      # Web отвечает
curl -s http://localhost:3001                      # Admin отвечает
```

## Откат

```bash
cd ~/profitableweb
git log --oneline -5                               # Найти предыдущий коммит
git checkout <commit_hash>

# Пересобрать контейнеры
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build --remove-orphans
```

## Логи

```bash
# Все контейнеры
docker compose -f docker-compose.prod.yml logs -f

# Конкретный сервис
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f web
docker compose -f docker-compose.prod.yml logs -f admin
docker compose -f docker-compose.prod.yml logs -f db

# Nginx (хост)
sudo tail -50 /var/log/nginx/error.log
sudo tail -50 /var/log/nginx/access.log
```

## Порты

| Сервис        | Prod           | Dev            |
| ------------- | -------------- | -------------- |
| PostgreSQL    | 127.0.0.1:5432 | 127.0.0.1:5433 |
| API (FastAPI) | 127.0.0.1:8000 | 127.0.0.1:8100 |
| Web (Next.js) | 127.0.0.1:3000 | 127.0.0.1:3100 |
| Admin (Vite)  | 127.0.0.1:3001 | 127.0.0.1:3101 |
| Gitea         | —              | 127.0.0.1:3300 |
