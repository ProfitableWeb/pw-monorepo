# Nginx конфигурация для Cloud.ru

> ⚠️ Написано в PM2-эпоху (январь 2026). Nginx-часть актуальна; команды управления приложениями обновлены на Docker
> Compose в PW-070. Полный процесс деплоя — [runbooks/deploy.md](../architecture/runbooks/deploy.md).

## 🚨 Быстрое исправление 400 Bad Request

### Вариант 1: Автоматический (рекомендуется)

```bash
# SSH на сервер
ssh user@213.171.25.187

# Перейти в папку проекта
cd ~/profitableweb

# Обновить репозиторий
git pull origin master

# Запустить скрипт обновления
./infra/scripts/update-nginx.sh
```

### Вариант 2: Ручной

```bash
# SSH на сервер
ssh user@213.171.25.187

# Резервная копия старого конфига
sudo cp /etc/nginx/sites-available/profitableweb \
     /etc/nginx/sites-available/profitableweb.backup

# Скопировать новый конфиг
cd ~/profitableweb
sudo cp infra/nginx/profitableweb.conf /etc/nginx/sites-available/profitableweb

# Проверить синтаксис
sudo nginx -t

# Перезапустить nginx
sudo systemctl reload nginx

# Проверить статус
sudo systemctl status nginx
```

## 📋 Что было исправлено

| Проблема                            | Решение                                       |
| ----------------------------------- | --------------------------------------------- |
| ❌ 400 Bad Request на webpack файлы | ✅ Добавлена обработка `/_next/static/`       |
| ❌ Нет кеширования статики          | ✅ Добавлен `Cache-Control: max-age=31536000` |
| ❌ Отсутствуют важные headers       | ✅ Добавлены `X-Forwarded-*` headers          |
| ❌ Нет буферизации                  | ✅ Настроена оптимальная буферизация          |
| ❌ Нет обработки ошибок             | ✅ Добавлен `proxy_next_upstream`             |

## 🔍 Проверка результата

После обновления конфига:

```bash
# Проверить что Next.js работает
curl http://127.0.0.1:3000/

# Проверить через nginx
curl http://127.0.0.1/

# Проверить статику
curl -I http://127.0.0.1/_next/static/
```

В браузере:

1. Открыть DevTools → Network
2. Перезагрузить страницу (Ctrl+Shift+R)
3. Файлы `_next/static/*` должны возвращать 200 OK
4. В Response Headers должен быть `Cache-Control: public, max-age=31536000, immutable`

## 📚 Документация

- **Полная инструкция:** [DEPLOY_FIX.md](./DEPLOY_FIX.md)
- **Исправленный конфиг:** [profitableweb.conf](../../infra/nginx/profitableweb.conf)
- **Скрипт обновления:** [update-nginx.sh](../../infra/scripts/update-nginx.sh)

## 🆘 Если не помогло

### 1. Проверить логи nginx

```bash
sudo tail -f /var/log/nginx/profitableweb_error.log
```

### 2. Проверить логи Next.js

```bash
cd ~/profitableweb
docker compose -f docker-compose.prod.yml logs --tail 50 web
```

### 3. Перезапустить Next.js

```bash
docker compose -f docker-compose.prod.yml restart web
```

### 4. Пересобрать Next.js

```bash
cd ~/profitableweb
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build web
```

## 🔄 Автоматизация (опционально)

Можно добавить автоматическое обновление nginx конфига при деплое:

```yaml
# В .gitverse/workflows/deploy.yaml
- name: Update nginx config
  run: |
    ssh ${SSH_USER}@${SSH_HOST} << 'EOF'
      cd ~/profitableweb
      ./infra/scripts/update-nginx.sh
    EOF
```

## 💡 Полезные команды

```bash
# Проверить Docker-контейнеры
docker compose -f docker-compose.prod.yml ps

# Проверить что слушает на портах
ss -tlnp | grep -E '3000|8000|80'

# Проверить синтаксис nginx
sudo nginx -t

# Перезапустить nginx
sudo systemctl reload nginx

# Посмотреть логи nginx
sudo tail -100 /var/log/nginx/error.log
```
