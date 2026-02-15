# PW-032: Обработка ошибок и UX в админ-панели

> **Статус**: TODO **Приоритет**: Высокий **Компонент**: ⚙️ Admin + 🐍 Backend **Дата**: 2026-02-16 **Связанные**:
> PW-030 (Auth), PW-031 (Infra)

## Проблема

Админка на тестовом контуре (dev.profitableweb.ru/admin) не обрабатывает ошибки API и не показывает пользователю
понятные сообщения. Обнаруженные проблемы:

### Критическое: API_BASE_URL → localhost

Оба фронтенда используют `http://localhost:8000/api` как fallback для API URL:

- `apps/admin/src/lib/api-client.ts` → `import.meta.env.VITE_API_URL || 'http://localhost:8000/api'`
- `apps/web/src/lib/api-client.ts` → `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'`

На тестовом контуре `VITE_API_URL` / `NEXT_PUBLIC_API_URL` не задан → запросы идут на `localhost:8000`, который
недоступен в браузере пользователя → `ERR_CONNECTION_REFUSED`.

### Ошибки без деталей

- При неудачном логине — toast "Ошибка входа" без причины (неверный пароль? сервер недоступен? сеть?)
- При сбое OAuth — ничего не показывается, `isLoading` сбрасывается молча
- При сбое `checkAuth()` — молчаливый переход к странице входа без объяснения
- Нет индикации загрузки при OAuth redirect

### Нет глобальной обработки сетевых ошибок

- `ERR_CONNECTION_REFUSED` не перехватывается — пользователь видит только пустой экран
- Нет retry-логики и offline-индикации
- 500-ые ошибки API не показываются

## Задачи

### Фаза 1: Исправить API URL (блокер)

- [ ] Admin: поменять fallback с `http://localhost:8000/api` на `/api` (relative URL)
- [ ] Web: аналогично — `NEXT_PUBLIC_API_URL || '/api'`
- [ ] Убедиться что nginx проксирует `/api` на backend корректно (уже работает)
- [ ] Проверить что credentials: 'include' работает с relative URL

### Фаза 2: Информативные ошибки авторизации

- [ ] Login form: показывать конкретную ошибку под полями (неверный email/пароль, сервер недоступен, аккаунт
      заблокирован)
- [ ] OAuth: показывать ошибку если провайдер недоступен или вернул ошибку
- [ ] OAuth callback: обрабатывать `?error=...` параметр и показывать пользователю причину
- [ ] checkAuth: при ошибке сети показывать banner "Нет связи с сервером" с кнопкой повтора

### Фаза 3: Глобальная обработка ошибок в API client

- [ ] Обёртка fetch с обработкой типичных ошибок (network error, 401, 403, 500)
- [ ] При 401 — автоматический refresh token, при повторной 401 — logout с сообщением "Сессия истекла"
- [ ] При network error — toast "Нет связи с сервером"
- [ ] При 500 — toast "Внутренняя ошибка сервера"
- [ ] При 403 — toast "Недостаточно прав"

### Фаза 4: UX улучшения

- [ ] Loading states на кнопках OAuth (спиннер + disabled)
- [ ] Disabled состояние формы во время запроса
- [ ] Автофокус на поле email при загрузке
- [ ] Enter для отправки формы (проверить работает ли)

## Затронутые файлы

### Изменяемые:

1. `apps/admin/src/lib/api-client.ts` — API_BASE → relative, обработка ошибок
2. `apps/admin/src/app/store/auth-store.ts` — информативные ошибки
3. `apps/admin/src/app/components/login-page.tsx` — UI ошибок, loading states
4. `apps/web/src/lib/api-client.ts` — API_BASE → relative
5. `apps/web/src/contexts/auth/AuthContext.tsx` — API_BASE → relative
