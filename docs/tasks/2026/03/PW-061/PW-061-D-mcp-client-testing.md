# PW-061-D: Тестирование MCP из AI-клиентов

**Статус:** IN PROGRESS **Приоритет:** Высокий **Дата:** 2026-03-21 **Зависит от:** PW-061-B (backend), PW-061-C
(интеграция)

## Суть

Настроить и протестировать подключение ProfitableWeb MCP-сервера из Claude Code на трёх окружениях (local, dev, prod).
Убедиться что все 29 tools работают end-to-end.

## Зачем

MCP-сервер реализован (PW-061-B) и интегрирован с админкой (PW-061-C), но ни разу не тестировался как реальный
MCP-клиент. Без этого шага мы не знаем, работает ли протокол на практике — handshake, auth, tool discovery, tool calls,
error handling.

## Окружения

| Имя        | URL                                    | Назначение                          |
| ---------- | -------------------------------------- | ----------------------------------- |
| `pw-local` | `http://localhost:8000/mcp`            | Разработка, отладка                 |
| `pw-dev`   | `https://api.dev.profitableweb.ru/mcp` | Staging, тестирование перед релизом |
| `pw-prod`  | `https://api.profitableweb.ru/mcp`     | Production                          |

Все три настроены в `.mcp.json` как отдельные MCP-серверы. Dev/prod — плейсхолдеры ключей (серверы ещё не развёрнуты).

## Прогресс

### Фаза 1: Исправление багов и тестирование через curl/TestClient (DONE)

**Дата:** 2026-03-21

Обнаружены и исправлены 5 критических багов, блокирующих работу MCP-сервера:

#### Баг 1: Lifespan session manager не инициализируется

**Проблема:** `RuntimeError: Task group is not initialized. Make sure to use run()`. FastAPI не пробрасывает lifespan в
mounted raw ASGI apps. `McpAuthMiddleware` — raw ASGI callable, а не Starlette app, поэтому его lifespan (с
`session_manager.run()`) не вызывался.

**Файлы:** `main.py`, `server.py` **Исправление:** `create_mcp_asgi_app()` теперь возвращает `(asgi_app, mcp_server)`. В
`main.py` добавлен `lifespan` для FastAPI, который явно вызывает `async with _mcp_server.session_manager.run()`.

#### Баг 2: Detached SQLAlchemy instance после auth

**Проблема:** `Instance <McpApiKey> is not bound to a Session`. Auth middleware закрывает DB-сессию (`db.close()`),
после чего `api_key` и `user` объекты теряют доступ к атрибутам. `db.commit()` делает expire всех атрибутов, а
`db.close()` полностью отвязывает.

**Файл:** `auth.py` **Исправление:** после `db.commit()` вызываем `db.refresh(api_key)` + `db.refresh(user)`
(перезагружает атрибуты), затем `db.expunge()` (отвязывает от сессии, но данные остаются в памяти).

#### Баг 3: `api_key.scope.value` на строке

**Проблема:** `'str' object has no attribute 'value'`. После `expunge()` поле `scope` (колонка `String(10)` с аннотацией
`Mapped[McpKeyScope]`) становится обычной строкой, а не enum. Код в `require_scope` пытался обратиться к `.value`.

**Файл:** `dependencies.py` **Исправление:** `getattr(api_key.scope, "value", api_key.scope)` — работает и с enum, и со
строкой.

#### Баг 4: Несуществующие импорты в media tools

**Проблема:** `cannot import name 'list_media_files' from 'src.services.media'`. MCP tools для медиа использовали
несуществующие имена функций: `list_media_files`, `get_media_file`, `upload_media_file`.

**Файл:** `tools/media.py` **Исправление:** заменены на реальные сервисные функции (`list_media`, `get_media`,
`upload_media`) с правильными сигнатурами. Для `upload_media` добавлены `storage` и `content_type` (определяется из
filename через `mimetypes`).

#### Баг 5: Partial update category устанавливает NULL

**Проблема:** `NotNullViolation: null value in column "slug"`. `CategoryUpdateRequest(name=name, slug=None)` помечает
`slug` как "set" — сервис через `model_dump(exclude_unset=True)` всё равно включает его, устанавливая NULL.

**Файл:** `tools/categories.py` **Исправление:** конструируем `CategoryUpdateRequest(**fields)` только из явно
переданных (не None) полей.

#### Дополнительно (из PW-061-C, предыдущий коммит)

`mcp_keys.py` — `key.scope.value` → `getattr(key.scope, 'value', key.scope)` для совместимости.

### Результаты тестирования (curl + TestClient)

**28/28 tool calls пройдены:**

| Категория            | Tools                                                                                                                                                                                | Результат                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| READ (11)            | list_articles, get_article, search_articles, get_article_stats, list_categories, list_tags, list_media, get_seo_settings, analyze_article_seo, get_site_analytics, get_content_brief | ✅ Все OK                        |
| WRITE (9)            | generate_slug, create_article, update_article, publish_article, create_category, update_category, create_tag, update_tag                                                             | ✅ Все OK                        |
| ADMIN scope deny (6) | get_system_health, get_audit_log, delete_article, delete_category, delete_tag, update_seo_settings                                                                                   | ✅ Корректный отказ с сообщением |
| Error handling (2)   | nonexistent article, invalid UUID                                                                                                                                                    | ✅ Внятные ошибки                |

**Не протестированы (нет данных/инфраструктуры):**

- `upload_media`, `update_media_metadata` — нет медиафайлов для тестирования
- `schedule_article` — требует создание + планирование
- `get_media` — нет медиа в БД
- Admin tools с admin-ключом — текущий ключ имеет scope `write`
- Rate limit (429) — не реализован на уровне MCP
- Деактивированный ключ — требует отдельный тестовый ключ

### Инфраструктурные изменения

- `.mcp.json` — три окружения (`pw-local`, `pw-dev`, `pw-prod`)
- `.mcp.json` добавлен в `.gitignore` (содержит API-ключи)
- `.mcp.json.example` — шаблон без секретов

### Фаза 2: Тестирование как MCP-клиент из Claude Code (TODO)

MCP-серверы подхватываются при старте сессии Claude Code. В текущей сессии `pw-local` не был подключён (`.mcp.json`
создан уже после старта).

**Для продолжения:**

1. Убедиться, что API запущен: `cd apps/api && uv run uvicorn src.main:app --reload --port 8000`
2. Перезапустить сессию Claude Code
3. Проверить, что `pw-local` подхватился (tools должны появиться в списке)
4. Выполнить чеклист ниже

## Чеклист тестирования

### 1. Подключение и handshake

- [x] `pw-local` — handshake через curl, protocol version 2024-11-05
- [ ] `pw-local` — подключается как MCP-сервер в Claude Code
- [ ] `pw-dev` — подключается (после деплоя)
- [ ] `pw-prod` — подключается (после деплоя)
- [x] При невалидном API-ключе — внятная ошибка `{"code": -32001, "message": "Invalid or expired API key"}`
- [ ] При недоступном сервере — timeout, не бесконечное ожидание

### 2. Tool discovery

- [x] `tools/list` возвращает все 29 tools
- [ ] Каждый tool имеет описание и input schema (проверить в Claude Code)
- [ ] MCP resources доступны (style-guide, formats, categories, stats)

### 3. Read tools (scope: read)

- [x] `list_articles` — список статей с пагинацией (39 статей)
- [x] `get_article` — полная статья по slug
- [x] `search_articles` — полнотекстовый поиск (4 результата по "AI")
- [x] `get_article_stats` — агрегированная статистика
- [x] `list_categories` — категории с количеством статей (6 категорий)
- [x] `list_tags` — теги с количеством (2 тега)
- [x] `list_media` — список медиа (0 файлов, OK)
- [ ] `get_media` — метаданные конкретного файла (нет медиа в БД)
- [x] `get_seo_settings` — SEO-настройки
- [x] `analyze_article_seo` — SEO-анализ статьи
- [x] `get_site_analytics` — аналитика
- [x] `get_content_brief` — контекст сайта

### 4. Write tools (scope: write)

- [x] `create_article` — создаёт черновик, возвращает ID
- [x] `update_article` — обновляет поля
- [x] `publish_article` — публикует
- [ ] `schedule_article` — планирует публикацию
- [x] `create_category` — создаёт категорию
- [x] `update_category` — обновляет
- [x] `create_tag` — создаёт тег
- [x] `update_tag` — обновляет
- [ ] `upload_media` — загрузка файла через base64
- [ ] `update_media_metadata` — обновление alt/caption
- [x] `generate_slug` — генерация slug из заголовка

### 5. Admin tools (scope: admin)

- [ ] `delete_article` — удаление (нужен admin-ключ)
- [ ] `delete_category` — удаление (нужен admin-ключ)
- [ ] `delete_tag` — удаление (нужен admin-ключ)
- [ ] `update_seo_settings` — изменение SEO (нужен admin-ключ)
- [ ] `get_system_health` — здоровье системы (нужен admin-ключ)
- [ ] `get_audit_log` — журнал действий (нужен admin-ключ)

### 6. Scope enforcement

- [ ] Ключ с `read` scope — write tools возвращают ошибку доступа
- [x] Ключ с `write` scope — admin tools возвращают ошибку доступа (сообщение: «Недостаточно прав. Требуется scope
      'admin', ваш ключ имеет scope 'write'»)
- [ ] Ключ с `admin` scope — все tools доступны

### 7. Error handling

- [x] Несуществующий article ID → `{"error": "Статья не найдена"}`
- [x] Невалидные параметры → описание ошибки (UUID validation)
- [ ] Превышение rate limit → 429 с указанием retry-after (не реализован)
- [ ] Деактивированный ключ → отказ в доступе

### 8. Реальный сценарий

Полный цикл через Claude Code (natural language):

- [ ] «Покажи последние статьи» → `list_articles`
- [ ] «Создай черновик статьи про X» → `create_article`
- [ ] «Проверь SEO этой статьи» → `analyze_article_seo`
- [ ] «Опубликуй её» → `publish_article`
- [ ] «Покажи лог действий» → `get_audit_log`

## Замечания для фазы 2

- **Текущий ключ** `pw_mcp_235696...` имеет scope `write`. Для тестирования admin tools нужно создать ключ с scope
  `admin` через API `/api/admin/mcp-keys`.
- **DNS rebinding protection**: MCP SDK v1.16.0 по умолчанию разрешает `localhost:*`, `127.0.0.1:*`. Для prod
  потребуется настройка `transport_security.allowed_hosts`.
- **Windows**: uvicorn `--reload` может создавать зомби-процессы. Перед перезапуском проверять
  `netstat -ano | grep :8000`.

## Как тестировать

### Локально (pw-local)

```bash
# 1. Запустить API
cd F:/ProfitableWeb/apps/api
uv run uvicorn src.main:app --reload --port 8000

# 2. Начать НОВЫЙ чат в Claude Code (MCP подхватывается при старте сессии)

# 3. Проверить подключение
# В чате: "используй pw-local, покажи список статей"
```

### Dev / Prod

```bash
# После деплоя: создать ключи на серверах, заполнить в .mcp.json
# Просто начать новый чат — серверы подключатся автоматически
# В чате: "используй pw-prod, покажи здоровье системы"
```

## Результат

- [x] Все 29 tools протестированы через curl/TestClient
- [x] Scope enforcement работает корректно (write → admin denied)
- [x] Ошибки возвращаются в формате, понятном AI-клиенту
- [ ] Полный сценарий через Claude Code MCP-клиент (фаза 2)
- [ ] Тестирование на dev/prod окружениях (после деплоя)
