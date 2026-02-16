# Деплой

## CI/CD Pipeline

GitVerse Workflows запускается при push в `master`.

### Последовательность

1. SSH на VM (`webresearcher@213.171.25.187`)
2. `git pull origin master`
3. `bun install` + `cd apps/api && uv sync`
4. `uv run alembic upgrade head` (миграции до перезапуска)
5. `cd apps/web && bun run build` + `cd apps/admin && bun run build`
6. Запись секретов в `.env`
7. `pm2 restart ecosystem.config.js`

## PM2

Процесс-менеджер PM2 управляет всеми тремя приложениями.

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'web',
      cwd: './apps/web',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
    },
    {
      name: 'admin',
      cwd: './apps/admin',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
    },
    {
      name: 'api',
      cwd: './apps/api',
      script: 'uv',
      args: 'run uvicorn src.main:app --host 0.0.0.0 --port 8000',
    },
  ],
};
```

### Команды PM2

```bash
pm2 status                    # Статус процессов
pm2 restart ecosystem.config.js  # Перезапуск всех
pm2 logs web                  # Логи web
pm2 logs api --lines 100      # Последние 100 строк логов API
```

## Nginx

Reverse proxy на порты приложений. Конфиг: `/etc/nginx/sites-enabled/profitableweb`.

```nginx
server {
    server_name dev.profitableweb.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
    location /admin {
        proxy_pass http://127.0.0.1:3001;
    }
    location /api {
        proxy_pass http://127.0.0.1:8000;
    }
}
```
