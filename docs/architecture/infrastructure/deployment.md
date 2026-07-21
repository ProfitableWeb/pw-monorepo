# Деплой

> Оперативные команды и полный список секретов — в runbook [deploy.md](../runbooks/deploy.md).

## Обзор

Все сервисы работают в **Docker Compose** на одной Cloud.ru VM (PM2 заменён в PW-043, `ecosystem.config.js` удалён в
PW-070). На VM три compose-стека:

| Стек  | Файл                       | Контейнеры                                                | Порты (127.0.0.1)      |
| ----- | -------------------------- | --------------------------------------------------------- | ---------------------- |
| prod  | `docker-compose.prod.yml`  | pw-prod-web, pw-prod-api, pw-prod-admin, pw-prod-postgres | 3000, 8000, 3001, 5432 |
| dev   | `docker-compose.dev.yml`   | pw-dev-web, pw-dev-api, pw-dev-admin, pw-dev-postgres     | 3100, 8100, 3101, 5433 |
| infra | `docker-compose.infra.yml` | pw-gitea, pw-gitea-db — **не развёрнут** (PW-043-F)       | 3300 (не слушается)    |

> Контур **infra** (Gitea для self-hosted git-зеркала) описан, но не поднят: контейнеров Gitea на VM нет. При будущем
> запуске требует `GITEA_DB_PASSWORD` (fail-fast `:?`, задать в env перед
> `docker compose -f docker-compose.infra.yml up`).

## CI/CD Pipeline

GitHub Actions, два workflow:

- **`deploy.yml`** — push в `master` (paths: `apps/**`, `packages/**`, `docker-compose.prod.yml`, Dockerfile,
  `infra/nginx/**`) → прод
- **`deploy-dev.yml`** — push в `develop` → dev-контур

### Последовательность (prod)

1. CI формирует `.env.prod` из GitHub Secrets и копирует на VM через `scp`
2. SSH на VM (`webresearcher@213.171.25.187`)
3. `git fetch origin && git reset --hard origin/master` (origin = GitHub)
4. Обновление nginx-конфига: `infra/nginx/profitableweb.conf` → `/etc/nginx/sites-available/profitableweb`,
   `nginx -t && systemctl reload nginx`
5. `docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build --remove-orphans`
6. Health check: `curl http://<IP>/api/health`

### Миграции

Alembic-миграции применяются **при старте api-контейнера** — CMD в `apps/api/Dockerfile`:

```dockerfile
CMD ["sh", "-c", "uv run alembic upgrade head && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000"]
```

Отдельного шага миграций в CI нет. Подробности — [migrations.md](../database/migrations.md).

## Nginx

Работает на хосте VM (не в контейнере), слушает только **:80** — HTTPS пока не настроен (домен `profitableweb.ru` ещё не
переключён на VM). Конфиг в репозитории: `infra/nginx/profitableweb.conf`, три server-блока:

| server_name           | Контур | Проксирует на                                |
| --------------------- | ------ | -------------------------------------------- |
| profitableweb.ru / IP | prod   | 3000 (web), 3001 (admin), 8000 (api)         |
| dev.profitableweb.ru  | dev    | 3100 (web), 3101 (admin), 8100 (api)         |
| git.profitableweb.ru  | infra  | 3300 (Gitea) — апстрим не поднят, отдаёт 502 |

Конфиг обновляется автоматически при каждом прод-деплое (шаг 4 pipeline) или вручную скриптом
`infra/scripts/update-nginx.sh`.

## Полезные команды

```bash
docker compose -f docker-compose.prod.yml ps           # Статус контейнеров
docker compose -f docker-compose.prod.yml logs -f api  # Логи сервиса
docker compose -f docker-compose.prod.yml restart web  # Перезапуск сервиса
```
