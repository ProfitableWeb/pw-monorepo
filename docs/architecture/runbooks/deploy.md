# Runbook: Деплой

## Автоматический деплой

Push в `master` → GitVerse Workflow автоматически деплоит на test-сервер.

```bash
git push origin master  # → автоматический деплой на dev.profitableweb.ru
```

Проверить статус: GitVerse → Actions → последний workflow run.

## Ручной деплой

При проблемах с CI/CD или необходимости быстрого обновления.

### 1. Подключиться к серверу

```bash
ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187
```

### 2. Обновить код

```bash
cd ~/profitableweb
git pull origin master
```

### 3. Backend

```bash
cd apps/api
uv sync
uv run alembic upgrade head
cd ..
```

### 4. Frontend

```bash
bun install
cd apps/web && bun run build && cd ..
cd apps/admin && bun run build && cd ..
```

### 5. Перезапустить процессы

```bash
pm2 restart ecosystem.config.js
```

### 6. Проверить

```bash
pm2 status                    # Все процессы online
curl -s http://localhost:3000  # web отвечает
curl -s http://localhost:3001  # admin отвечает
curl -s http://localhost:8000/api/health  # api отвечает
```

## Откат

```bash
cd ~/profitableweb
git log --oneline -5           # Найти предыдущий коммит
git checkout <commit_hash>     # Переключиться
bun install && cd apps/web && bun run build && cd ../admin && bun run build && cd ..
cd apps/api && uv sync && uv run alembic upgrade head && cd ../..
pm2 restart ecosystem.config.js
```

## Логи

```bash
pm2 logs web --lines 50                    # Next.js web
pm2 logs api --lines 50                    # FastAPI
sudo tail -50 /var/log/nginx/error.log     # nginx
```
