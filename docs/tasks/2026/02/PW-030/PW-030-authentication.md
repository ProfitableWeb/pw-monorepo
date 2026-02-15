# PW-030: Аутентификация (JWT + OAuth)

## 📋 Информация о задаче

- **ID**: PW-030
- **Статус**: DONE
- **Создано**: 2026-02-15
- **Приоритет**: High ⚡
- **Компонент**: 🐍 Backend + ⚛️ Frontend + ⚙️ Admin
- **Теги**: #auth #jwt #oauth #security

## 🎯 Постановка задачи

### Описание

Реализация полноценной аутентификации: JWT-токены на бэкенде, OAuth-провайдеры (Yandex, Telegram, Google), защита
эндпоинтов, интеграция с фронтом и админкой.

Сейчас на фронте mock-авторизация (AuthContext с захардкоженным пользователем), на бэкенде — модель User без
password_hash и OAuth-полей, зависимости JWT уже установлены.

### Цель

Пользователи могут войти через OAuth-провайдера, получить JWT-токен и оставлять комментарии. Админы входят через
email/пароль или OAuth и получают доступ к админке.

### Критерии приёмки

- [x] User model расширена: `password_hash`, `oauth_provider`, `oauth_id`
- [x] JWT утилиты: `create_access_token()`, `create_refresh_token()`, `verify_token()`
- [x] Auth middleware: `get_current_user` dependency для FastAPI
- [x] Эндпоинты бэкенда:
  - [x] POST `/api/auth/register` — регистрация email/пароль
  - [x] POST `/api/auth/login` — вход email/пароль → access + refresh токены
  - [x] POST `/api/auth/refresh` — обновление access-токена
  - [x] POST `/api/auth/logout` — инвалидация refresh-токена
  - [x] GET `/api/auth/me` — текущий пользователь по токену
  - [x] GET `/api/auth/{provider}/url` — URL для OAuth-редиректа
  - [x] GET `/api/auth/{provider}/callback` — обработка OAuth callback
- [x] OAuth-провайдеры:
  - [x] Yandex ID
  - [x] Telegram Login Widget
  - [x] Google (для админки)
- [x] POST `/api/articles/{slug}/comments` — защищённый эндпоинт создания комментария
- [x] Фронт (apps/web):
  - [x] AuthContext переписан на реальный API (JWT в httpOnly cookie)
  - [x] AuthModal подключён к OAuth-флоу
  - [x] Форма комментариев разблокирована для авторизованных
  - [x] Автоматический refresh токена
- [x] Админка (apps/admin):
  - [x] auth-store подключён к реальному API
  - [x] Защита роутов (redirect на login если нет токена)
  - [x] Проверка роли (admin/editor)
- [x] Alembic миграция для новых полей User
- [x] Переменные окружения для секретов (`JWT_SECRET`, `OAUTH_*`)
- [x] Тесты auth эндпоинтов

### Зависимости

- [x] PW-027: Backend Content API ✅
- [x] PW-028: Web API интеграция ✅
- [ ] OAuth credentials от провайдеров (см. `oauth-providers-setup.md`)

### Что НЕ входит

- **RBAC / система ролей** — базовая проверка admin/viewer, тонкие права позже
- **Email-верификация** — регистрация без подтверждения email
- **Двухфакторная аутентификация** — отдельная задача
- **Rate limiting** — отдельная задача
- **Забыл пароль / сброс пароля** — отдельная задача

## 🔧 Технические детали

### Архитектура

```
Browser → OAuth Provider → Backend callback → JWT → Browser cookie/header
Browser → email/password → Backend /auth/login → JWT → Browser cookie/header
Browser → JWT in Authorization header → Backend protected endpoint
```

### Стек

- **Backend**: python-jose (JWT), passlib[bcrypt] (хэши), httpx (OAuth HTTP)
- **Frontend**: httpOnly cookies или Authorization header
- **Хранение токенов**: access в памяти/localStorage, refresh в httpOnly cookie

### JWT-схема

```
Access Token:  { sub: user_id, role: "viewer"|"admin", exp: 15min }
Refresh Token: { sub: user_id, exp: 7d, jti: unique_id }
```

### Расширение модели User

```python
# apps/api/src/models/user.py — новые поля
password_hash: Mapped[str | None]         # bcrypt, null для OAuth-only
oauth_provider: Mapped[str | None]        # "yandex" | "telegram" | "google"
oauth_id: Mapped[str | None]              # ID у провайдера
```

### OAuth-флоу

```
1. Фронт → GET /api/auth/{provider}/url → redirect_url
2. Фронт перенаправляет пользователя на redirect_url
3. Провайдер → GET /api/auth/{provider}/callback?code=xxx
4. Бэкенд обменивает code → access_token провайдера → получает профиль
5. Бэкенд создаёт/находит User, генерирует JWT
6. Редирект на фронт с JWT (через query param или Set-Cookie)
```

### Структура файлов

```
apps/api/src/
├── auth/
│   ├── jwt.py              # create/verify токены
│   ├── dependencies.py     # get_current_user, get_current_admin
│   ├── oauth/
│   │   ├── yandex.py       # Yandex ID OAuth
│   │   ├── telegram.py     # Telegram Login Widget
│   │   └── google.py       # Google OAuth
│   └── passwords.py        # hash/verify password
├── api/
│   └── auth.py             # Auth router (login, register, callback)
└── core/
    └── config.py           # + JWT_SECRET, OAUTH_* settings

apps/web/src/
├── contexts/auth/
│   └── AuthContext.tsx      # Переписать на реальный API
├── lib/
│   └── api-client.ts       # + auth endpoints
└── hooks/api/
    └── useAuth.ts           # React Query mutations (login, register, logout)

apps/admin/src/
└── app/store/
    └── auth-store.ts        # Подключить к реальному API
```

### Переменные окружения

```env
# apps/api/.env
JWT_SECRET=<random-64-chars>
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# Yandex ID
YANDEX_CLIENT_ID=
YANDEX_CLIENT_SECRET=

# Telegram
TELEGRAM_BOT_TOKEN=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Эндпоинты

| Метод | Эндпоинт                        | Описание                 | Auth          |
| ----- | ------------------------------- | ------------------------ | ------------- |
| POST  | `/api/auth/register`            | Регистрация email/пароль | —             |
| POST  | `/api/auth/login`               | Вход email/пароль        | —             |
| POST  | `/api/auth/refresh`             | Обновить access token    | refresh token |
| POST  | `/api/auth/logout`              | Выход (инвалидация)      | refresh token |
| GET   | `/api/auth/me`                  | Текущий пользователь     | access token  |
| GET   | `/api/auth/{provider}/url`      | OAuth redirect URL       | —             |
| GET   | `/api/auth/{provider}/callback` | OAuth callback           | —             |
| POST  | `/api/articles/{slug}/comments` | Создать комментарий      | access token  |

## ✅ Чеклист выполнения

### Подготовка

- [x] OAuth credentials получены (см. `oauth-providers-setup.md`)
- [x] Задача проанализирована и план согласован

### Фаза 1: Backend JWT

- [x] Расширить модель User + Alembic миграция
- [x] JWT утилиты (create/verify tokens)
- [x] Password утилиты (hash/verify)
- [x] Auth dependencies (get_current_user, get_current_admin)
- [x] POST /auth/register, /auth/login, /auth/refresh, /auth/logout, GET /auth/me
- [x] Тесты auth эндпоинтов

### Фаза 2: Backend OAuth

- [x] OAuth модуль Yandex ID
- [x] Telegram Login Widget verification
- [x] OAuth модуль Google
- [x] GET /auth/{provider}/url, GET /auth/{provider}/callback

### Фаза 3: Backend — защита эндпоинтов

- [x] POST /api/articles/{slug}/comments (создание комментария)
- [x] Проверка is_active пользователя
- [x] CORS: credentials: true

### Фаза 4: Frontend (apps/web)

- [x] AuthContext → реальный API
- [x] AuthModal → OAuth redirect flow
- [x] Форма комментариев разблокирована
- [x] Auto-refresh access token
- [x] Logout

### Фаза 5: Admin (apps/admin)

- [x] auth-store → реальный API
- [x] Route guards (redirect на /login)
- [x] Проверка роли admin/editor

### Финал

- [x] Все тесты проходят (27/27)
- [x] bun turbo build проходит (web)
- [x] .env.example обновлён

## 🔗 Связанные задачи

- **Зависит от**: PW-027 ✅, PW-028 ✅
- **Блокирует**: Admin CRUD (POST/PUT/DELETE), защищённые действия на фронте
- **Связана с**: PW-029 (Admin API интеграция)

## 📝 Заметки

### Текущее состояние

- **Backend**: модель User есть, JWT-зависимости установлены, auth-кода нет
- **Web frontend**: mock AuthContext (захардкоженный «Николай»), AuthModal с VK/Telegram
- **Admin**: Zustand auth-store с mock логином, провайдеры Google/Yandex/Telegram

### История изменений

- 2026-02-15: Задача создана
- 2026-02-15: Реализация завершена — все 6 фаз выполнены

---

**Статусы**: ~~TODO~~ → ~~DOING~~ → ~~TESTING~~ → ~~CODEREVIEW & DOCS~~ → **DONE**
