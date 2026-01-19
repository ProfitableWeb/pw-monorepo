# Исправление 400 Bad Request на Cloud.ru

## Проблема

На cloud.ru не грузится список статей, возникают 400 Bad Request ошибки на webpack файлы Next.js.

## Причина

Упрощённый nginx конфиг не учитывает особенности Next.js в production:

1. ❌ Отсутствуют важные proxy headers (`X-Forwarded-For`, `X-Forwarded-Proto`)
2. ❌ Нет специальной обработки `/_next/static/` файлов
3. ❌ Нет кеширования статических файлов
4. ❌ Нет буферизации и правильных таймаутов
5. ❌ Нет обработки ошибок при перезапуске Next.js

## Решение

### Шаг 1: Обновить nginx конфиг на сервере

```bash
# Подключиться к серверу cloud.ru
ssh user@213.171.25.187

# Создать резервную копию текущего конфига
sudo cp /etc/nginx/sites-available/profitableweb /etc/nginx/sites-available/profitableweb.backup

# Открыть конфиг на редактирование
sudo nano /etc/nginx/sites-available/profitableweb
```

### Шаг 2: Заменить содержимое файла

Скопировать содержимое из `docs/nginx/profitableweb.conf` в файл на сервере.

### Шаг 3: Проверить и перезапустить nginx

```bash
# Проверить синтаксис конфига
sudo nginx -t

# Если всё ок - перезапустить nginx
sudo systemctl reload nginx

# Проверить статус
sudo systemctl status nginx
```

### Шаг 4: Проверить, что Next.js запущен

```bash
# Проверить PM2 процессы
pm2 list

# Если web не запущен или в error - перезапустить
cd ~/profitableweb
pm2 restart web

# Посмотреть логи
pm2 logs web --lines 50
```

### Шаг 5: Проверить сборку Next.js

Возможно, при деплое не прошла сборка. Проверить:

```bash
cd ~/profitableweb/apps/web

# Проверить наличие .next папки
ls -la .next/

# Если её нет или она старая - пересобрать
bun install
bun run build

# Перезапустить через PM2
cd ~/profitableweb
pm2 restart web
```

### Шаг 6: Проверить доступность

```bash
# Локально на сервере
curl http://127.0.0.1:3000/
curl http://127.0.0.1:3000/_next/static/

# Через nginx
curl http://213.171.25.187/
curl -I http://213.171.25.187/_next/static/
```

## Что изменилось в новом конфиге

### ✅ Добавлены важные headers

```nginx
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

Теперь Next.js понимает реальный IP клиента и протокол (http/https).

### ✅ Специальная обработка статики

```nginx
location /_next/static {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

Webpack файлы с хешами кешируются на 1 год.

### ✅ Буферизация

```nginx
proxy_buffering on;
proxy_buffer_size 4k;
proxy_buffers 8 4k;
```

Улучшает производительность при отдаче больших файлов.

### ✅ Обработка ошибок

```nginx
proxy_next_upstream error timeout http_502 http_503 http_504;
```

Nginx не падает если Next.js временно не отвечает.

### ✅ Увеличенные таймауты

```nginx
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```

Не обрывает длинные запросы.

## Проверка результата

После применения изменений:

1. Откройте DevTools → Network
2. Перезагрузите страницу
3. Статика `/_next/static/*` должна отдаваться с кодом 200
4. В Response Headers должны быть `Cache-Control: public, max-age=31536000, immutable`
5. Статьи должны загружаться

## Автоматизация (опционально)

Добавить конфиг в репозиторий и обновить deploy workflow:

```yaml
# В .gitverse/workflows/deploy.yaml после шага deploy
- name: Update nginx config
  run: |
    ssh -i ~/.ssh/deploy_key ${SSH_USER}@${SSH_HOST} << 'EOF'
      # Обновить nginx конфиг если изменился
      if [ -f ~/profitableweb/docs/nginx/profitableweb.conf ]; then
        sudo cp ~/profitableweb/docs/nginx/profitableweb.conf /etc/nginx/sites-available/profitableweb
        sudo nginx -t && sudo systemctl reload nginx
      fi
    EOF
```

## Дополнительная диагностика

Если проблема не решается:

### Проверить логи nginx

```bash
sudo tail -f /var/log/nginx/profitableweb_error.log
```

### Проверить логи Next.js

```bash
pm2 logs web
```

### Проверить, слушает ли Next.js на порту 3000

```bash
netstat -tlnp | grep 3000
# или
ss -tlnp | grep 3000
```

### Проверить процессы PM2

```bash
pm2 describe web
```

### Тестовый запрос напрямую к Next.js

```bash
curl -v http://127.0.0.1:3000/
```

Если Next.js отвечает напрямую, но не работает через nginx - проблема в nginx конфиге.

## Возможные проблемы

### 1. PM2 не запускает Next.js в production режиме

Убедитесь что в `ecosystem.config.js` установлен `NODE_ENV: "production"`.

### 2. Не прошла сборка при деплое

Проверьте логи деплоя, возможно были ошибки TypeScript или ESLint.

### 3. Порт занят

```bash
# Проверить что слушает на порту 3000
sudo lsof -i :3000

# Если это не Next.js - убить процесс
sudo kill -9 <PID>
```

### 4. Недостаточно памяти для сборки

Next.js требует достаточно RAM для сборки. Если VM имеет мало памяти:

```bash
# Создать swap файл
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Контакты

Если проблема не решается, проверьте:

- PM2 статус: `pm2 list`
- PM2 логи: `pm2 logs`
- Nginx статус: `sudo systemctl status nginx`
- Nginx логи: `sudo tail -100 /var/log/nginx/error.log`
