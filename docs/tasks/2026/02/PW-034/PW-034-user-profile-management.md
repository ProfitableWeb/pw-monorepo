# PW-034: Управление профилем пользователя

> **Статус**: TODO **Приоритет**: Normal **Компонент**: ⚛️ Frontend + 🐍 Backend **Дата**: 2026-02-16 **Связанные**:
> PW-030 (Auth)

## Цель

Пользователи (OAuth) могут управлять своим профилем: установить пароль, изменить имя, загрузить аватар. Подготовить
файловое хранилище для загрузки изображений.

## Текущее состояние

- Регистрация только через OAuth (Yandex, Google, Telegram)
- У OAuth-пользователей `password_hash = NULL` — войти по email/паролю не могут
- Профиль в web/ показывает имя, email, аватар — но всё read-only (mock)
- Нет эндпоинтов для обновления профиля
- Нет файлового хранилища для аватарок

## Фаза 1: Файловое хранилище (локальное)

### Backend

- [ ] Создать `apps/api/src/services/storage.py` — `StorageBackend` абстракция + `LocalStorage` реализация (см.
      [ADR-003](../../../architecture/decisions/ADR-003-file-storage.md) — задел на замену LocalStorage → S3Storage при
      появлении prod VM)
- [ ] Эндпоинт `POST /api/users/me/avatar` — загрузка аватара (multipart/form-data)
  - Валидация: только изображения, макс 2MB
  - Конвертация в WebP, ресайз до 256x256
  - Сохранение: `uploads/avatars/{user_id}.webp`
- [ ] Эндпоинт `DELETE /api/users/me/avatar` — удаление аватара
- [ ] Nginx: location `/uploads/` → статические файлы из `~/profitableweb/uploads/`

### Структура на диске

```
~/profitableweb/uploads/
├── avatars/{user_id}.webp
└── articles/{article_id}/   # на будущее
```

## Фаза 2: API управления профилем

### Backend

- [ ] `PATCH /api/users/me` — обновление профиля (name, email)
- [ ] `POST /api/users/me/password` — установка пароля для OAuth-пользователя
  - Если `password_hash` is NULL: принимает `new_password` (без старого)
  - Если `password_hash` задан: требует `old_password` + `new_password`
- [ ] `POST /api/users/me/password/change` — смена пароля (old + new)
- [ ] Pydantic-схемы: `UpdateProfileRequest`, `SetPasswordRequest`, `ChangePasswordRequest`

## Фаза 3: Frontend web — настройки профиля

### Модальное окно «Настройки» (уже есть каркас)

- [ ] Вкладка «Профиль»: имя, email — редактируемые поля + сохранение через PATCH
- [ ] Загрузка аватара: клик → file input → crop → upload
- [ ] Вкладка «Безопасность» (новая):
  - Если пароль не установлен: форма «Установить пароль» (password + confirm)
  - Если пароль есть: форма «Сменить пароль» (old + new + confirm)
  - Показывать привязанные OAuth-провайдеры (Yandex, Google, Telegram)

## Фаза 4: Frontend admin — профиль администратора

Каркас настроек уже есть: `apps/admin/src/app/components/settings-page.tsx` (7 категорий, всё на mock).

- [ ] Добавить категорию «Профиль» первой в `settingsCategories` сайдбара
  - Вкладка «Данные»: имя, email, аватар — из `useAuthStore` + PATCH /api/users/me
  - Вкладка «Безопасность»: установить/сменить пароль
  - Вкладка «OAuth»: привязанные провайдеры
- [ ] Управление пользователями: просмотр, смена ролей (admin only) — `users-page.tsx` уже есть как каркас

## Решения

| Вопрос           | Решение              | Причина                                                         |
| ---------------- | -------------------- | --------------------------------------------------------------- |
| Хранилище файлов | Локальное (uploads/) | Одна VM, простота, нет расходов                                 |
| Формат аватарок  | WebP 256x256         | Лёгкий, современный формат                                      |
| Отдача статики   | Nginx location       | Быстро, без нагрузки на Python                                  |
| Миграция на S3   | Позже (prod)         | Абстракция StorageBackend — замена в 1 строку конфига (ADR-003) |

## Затронутые файлы

### Новые:

1. `apps/api/src/services/storage.py` — StorageBackend + LocalStorage (ADR-003)
2. `apps/api/src/api/users.py` — эндпоинты профиля
3. `apps/api/src/schemas/user.py` — схемы запросов/ответов

### Изменяемые:

1. `apps/api/src/api/router.py` — подключение users router
2. `apps/api/src/services/user.py` — методы update_profile, set_password
3. `apps/api/src/models/user.py` — поле avatar_url (если нет)
4. `apps/web/src/components/common/auth-modal/AuthModal.tsx` — настройки профиля
5. `apps/web/src/contexts/auth/AuthContext.tsx` — updateProfile, uploadAvatar
6. `apps/web/src/lib/api-client.ts` — новые API-функции
7. Nginx конфиг на VM — location /uploads/

### Зависимости Python (новые):

- `Pillow` — ресайз и конвертация изображений в WebP
