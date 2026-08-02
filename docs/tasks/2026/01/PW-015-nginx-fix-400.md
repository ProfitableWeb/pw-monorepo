# PW-015: Исправление 400 Bad Request на Cloud.ru

**Статус:** DONE (задеплоено)  
**Дата создания:** 19 января 2026  
**Приоритет:** 🔥 Критический  
**Тип:** Bug Fix

## 🚨 Проблема

На production сервере (cloud.ru / 213.171.25.187) не загружается список статей.

### Симптомы

- ❌ 400 Bad Request на webpack файлы (`/_next/static/...`)
- ❌ Статьи не загружаются на главной странице
- ❌ В DevTools куча красных 400 ошибок

### Причина

Упрощённый nginx конфиг не учитывает особенности Next.js в production:

1. Отсутствуют важные proxy headers (`X-Forwarded-For`, `X-Forwarded-Proto`)
2. Нет специальной обработки `/_next/static/` файлов
3. Нет кеширования статических файлов с хешами
4. Нет буферизации и правильных таймаутов
5. Нет обработки ошибок при перезапуске Next.js

## ✅ Решение

### Что сделано

- [x] Создан исправленный nginx конфиг → `infra/nginx/profitableweb.conf`
- [x] Написана подробная инструкция → `docs/nginx/DEPLOY_FIX.md`
- [x] Создан скрипт автоматического обновления → `infra/scripts/update-nginx.sh`
- [x] Обновлена документация → `docs/tasks/2026/01/PW-005.md`
- [x] Создана краткая инструкция → `docs/nginx/README.md`

### Что нужно сделать на сервере

```bash
# Вариант 1: Автоматический (рекомендуется)
ssh user@213.171.25.187
cd ~/profitableweb
git pull origin master
./scripts/update-nginx.sh

# Вариант 2: Ручной
ssh user@213.171.25.187
cd ~/profitableweb
git pull origin master
sudo cp infra/nginx/profitableweb.conf /etc/nginx/sites-available/profitableweb
sudo nginx -t
sudo systemctl reload nginx
```

## 🔧 Ключевые изменения в nginx конфиге

### 1. Добавлены важные headers для Next.js

```nginx
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_http_version 1.1;
```

### 2. Специальная обработка Next.js статики

```nginx
location /_next/static {
    proxy_pass http://127.0.0.1:3000;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### 3. Буферизация для производительности

```nginx
proxy_buffering on;
proxy_buffer_size 4k;
proxy_buffers 8 4k;
```

### 4. Обработка ошибок при перезапуске

```nginx
proxy_next_upstream error timeout http_502 http_503 http_504;
```

### 5. WebSocket поддержка

```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_cache_bypass $http_upgrade;
```

## 📊 Результаты

### До исправления

- ❌ 400 Bad Request на `/_next/static/chunks/*.js`
- ❌ Статьи не загружаются
- ❌ Нет кеширования статики

### После исправления

- ✅ 200 OK на все статические файлы
- ✅ Статьи загружаются корректно
- ✅ Статика кешируется на 1 год
- ✅ Правильные headers для SEO и производительности

## 🔍 Тестирование

### Чек-лист после деплоя

- [ ] Открыть http://213.171.25.187/ в браузере
- [ ] Проверить DevTools → Network - нет 400 ошибок
- [ ] Проверить что статьи загружаются на главной
- [ ] Проверить Response Headers на `/_next/static/*`:
  - [ ] `Cache-Control: public, max-age=31536000, immutable`
  - [ ] HTTP 200 OK
- [ ] Проверить что API работает: http://213.171.25.187/api/health
- [ ] Проверить мобильную версию
- [ ] Проверить разные страницы (категории, автор, статья)

### Команды для проверки

```bash
# На сервере
curl http://127.0.0.1:3000/
curl -I http://127.0.0.1/_next/static/
pm2 list
sudo systemctl status nginx
```

## 📚 Связанные документы

- **Nginx конфиг:** `infra/nginx/profitableweb.conf`
- **Инструкция:** `docs/nginx/DEPLOY_FIX.md`
- **Скрипт:** `infra/scripts/update-nginx.sh`
- **Быстрый старт:** `docs/nginx/README.md`
- **Начальная настройка:** `docs/tasks/2026/01/PW-005.md`

## 🚀 Автоматизация (будущее)

Можно добавить в CI/CD автоматическое обновление nginx при изменении конфига:

```yaml
# .gitverse/workflows/deploy.yaml
- name: Update nginx if changed
  run: |
    ssh ${SSH_USER}@${SSH_HOST} << 'EOF'
      cd ~/profitableweb
      if git diff --name-only HEAD@{1} HEAD | grep -q "infra/nginx/profitableweb.conf"; then
        ./infra/scripts/update-nginx.sh
      fi
    EOF
```

## 💡 Уроки на будущее

1. **Всегда тестировать production конфигурацию локально** - можно было поймать это раньше
2. **Мониторинг ошибок** - нужен автоматический алерт на 400/500 ошибки
3. **Документация** - nginx конфиг должен быть в репозитории с первого дня
4. **Staging окружение** - нужна промежуточная среда для тестирования

## ✅ Чек-лист деплоя

- [ ] Закоммитить изменения
- [ ] Запушить в master
- [ ] SSH на сервер
- [ ] Обновить репозиторий
- [ ] Запустить `./scripts/update-nginx.sh`
- [ ] Проверить в браузере
- [ ] Обновить статус задачи на ✅ Завершено

---

**Ответственный:** Николай + Biaohan  
**Время на исправление:** ~10 минут на сервере  
**Downtime:** ~0 секунд (reload nginx без перезапуска)
