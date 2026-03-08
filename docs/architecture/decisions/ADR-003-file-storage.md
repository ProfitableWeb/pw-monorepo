# ADR-003: Файловое хранилище и медиа-библиотека

**Дата**: 2026-02-16 **Обновлено**: 2026-03-08

## Статус

Обновлено — расширено медиа-центричной архитектурой.

## Контекст

Проекту нужно хранить пользовательские файлы: аватарки, изображения статей. Варианты: S3-совместимое облачное хранилище
(Cloud.ru Object Storage), локальное хранилище на VM.

Текущий масштаб: одна VM, один разработчик, десятки пользователей, ~40 статей.

**Обновление 2026-03-08**: появилась галерея медиафайлов в админке (MediaSection). Исходная entity-центричная структура
(`articles/{article_id}/img-001.webp`) не подходит для галереи — файлы привязаны к конкретной статье, их нельзя
переиспользовать, листинг всех файлов требует обхода всех директорий. Переход на медиа-центричную модель: файл — это
самостоятельная сущность со своей записью в БД, которая связывается со статьями через junction table.

## Решение

### Хранилище

Абстракция `StorageBackend` с двумя реализациями:

- **`LocalStorage`** — dev/staging: запись на диск VM, раздача через nginx
- **`S3Storage`** — prod: Cloud.ru Object Storage (OBS, S3-совместимый API)

Переключение — одна переменная в `.env`:

```env
# Dev (по умолчанию)
STORAGE_BACKEND=local

# Prod
STORAGE_BACKEND=s3
S3_ENDPOINT=https://obs.ru-moscow-1.hc.sbercloud.ru
S3_BUCKET=pw-media
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_REGION=ru-moscow-1
```

### Структура файлов

```
uploads/                               # local: ~/profitableweb/uploads/
│                                      # s3:    s3://pw-media/
├── avatars/{user_id}.webp             # аватарки (1:1 с пользователями)
└── media/{uuid}.webp                  # медиафайлы (самостоятельные сущности)
    ├── media/{uuid}_thumb.webp        # 150×150, crop
    ├── media/{uuid}_sm.webp           # 400px по ширине
    ├── media/{uuid}_md.webp           # 800px по ширине
    └── media/{uuid}_lg.webp           # 1200px по ширине
```

**Почему UUID, а не slug**: slug может меняться (SEO-переименование), UUID — стабильный ключ хранилища. Slug хранится в
БД и используется в публичных URL через rewrite, а не в путях на диске.

**Почему плоская структура**: один `media/` каталог вместо вложенности. При масштабе проекта (~1K файлов) ext4 HTree
справляется без проблем. При миграции на S3 — плоская структура работает нативно (S3 не имеет реальных директорий).

### Медиа-модель (БД)

Каждый загруженный файл — запись в таблице `media_files`:

```python
class MediaFile(Base, TimestampMixin):
    id: Mapped[UUID]                          # PK
    filename: Mapped[str]                     # оригинальное имя при загрузке
    storage_key: Mapped[str]                  # путь в хранилище: "media/{uuid}.webp"
    mime_type: Mapped[str]                    # image/webp, audio/mpeg, application/pdf
    file_type: Mapped[FileTypeEnum]           # image | video | audio | document
    size: Mapped[int]                         # байты (оригинал)

    # Изображения
    width: Mapped[int | None]
    height: Mapped[int | None]

    # SEO
    slug: Mapped[str]                         # SEO-friendly имя (уникальное, редактируемое)
    alt: Mapped[str | None]                   # alt text, ≤125 символов
    caption: Mapped[str | None]               # подпись, ≤250 символов

    # EXIF (только изображения, парсится автоматически при загрузке)
    exif_data: Mapped[dict | None]            # JSONB

    # Организация (свободный ввод, не enum — список расширяется)
    purposes: Mapped[list[str]]               # JSONB: ["covers", "articles", "logos", ...]

    # Ресайзы (генерируются при загрузке изображений)
    resizes: Mapped[list[dict] | None]        # JSONB: [{name, width, height, size, storage_key}]

    # Связи
    uploaded_by_id: Mapped[UUID]              # FK → users
    articles: Mapped[list[Article]]           # M:M через article_media
```

Junction table для связи со статьями:

```python
article_media = Table(
    "article_media",
    Column("article_id", ForeignKey("articles.id"), primary_key=True),
    Column("media_id", ForeignKey("media_files.id"), primary_key=True),
    Column("role", String),                   # "cover", "inline", "attachment"
)
```

### Обработка при загрузке

```
POST /admin/media/upload (multipart/form-data)
  → валидация MIME + размер (≤20 MB для изображений)
  → сохранение во временный файл /tmp/pw-{uuid}
  → определение типа:
    image → Pillow: EXIF extraction, resize pipeline, WebP conversion
    audio/video/document → сохранение как есть
  → запись файла(ов) в storage: media/{uuid}.webp + ресайзы
  → создание записи MediaFile в БД
  → удаление /tmp файла
  → ответ: полный MediaFile с URL и ресайзами
```

Resize pipeline для изображений:

| Суффикс  | Размер               | Назначение                        |
| -------- | -------------------- | --------------------------------- |
| (без)    | оригинал             | хранение, скачивание              |
| `_thumb` | 150×150, crop center | сетка в админке, превью           |
| `_sm`    | 400px по ширине      | мобильная вёрстка                 |
| `_md`    | 800px по ширине      | планшет, `<picture>` fallback     |
| `_lg`    | 1200px по ширине     | десктоп, основной размер в статье |

Все ресайзы — WebP, quality 85. Если оригинал меньше целевого размера — ресайз не создаётся.

### API

```
POST   /admin/media/upload        multipart, ≤20 MB, → MediaFile
GET    /admin/media               ?page, per_page, type, purpose, search → список
GET    /admin/media/{id}          → MediaFile с ресайзами
PATCH  /admin/media/{id}          обновление slug, alt, caption, purposes
DELETE /admin/media/{id}          удалить файл + все ресайзы из storage и БД
GET    /admin/media/stats         общий объём, по типам, количество, все purposes (для фильтра)
```

### Раздача файлов

**LocalStorage** — nginx отдаёт статику:

```nginx
location /uploads/ {
    alias /home/webresearcher/profitableweb/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

**S3Storage** — прямые URL на OBS с 30-дневным кешем:

```
https://pw-media.obs.ru-moscow-1.hc.sbercloud.ru/media/{uuid}.webp
```

Или через nginx reverse proxy (если нужен единый домен):

```nginx
location /uploads/ {
    proxy_pass https://pw-media.obs.ru-moscow-1.hc.sbercloud.ru/;
    proxy_cache media_cache;
    proxy_cache_valid 200 30d;
}
```

### Абстракция StorageBackend

```python
class StorageBackend(ABC):
    """4 метода — весь интерфейс работы с файлами."""
    async def save(self, path: str, data: bytes) -> str: ...   # → публичный URL
    async def delete(self, path: str) -> None: ...
    def url(self, path: str) -> str: ...                       # storage_key → URL
    async def exists(self, path: str) -> bool: ...             # проверка наличия

class LocalStorage(StorageBackend):
    """Dev/staging: ~/profitableweb/uploads/, nginx раздаёт."""

class S3Storage(StorageBackend):
    """Prod: Cloud.ru OBS (S3-совместимый). boto3, forcePathStyle."""
```

## Почему медиа-центричная модель, а не entity-центричная

| Аспект                        | Entity-центричная (было) | Медиа-центричная (стало)        |
| ----------------------------- | ------------------------ | ------------------------------- |
| Структура                     | `articles/{id}/img.webp` | `media/{uuid}.webp`             |
| Переиспользование             | дублирование файла       | одна запись, M:M связи          |
| Галерея (листинг всех файлов) | обход всех директорий    | SELECT из одной таблицы         |
| Удаление файла                | удалить из папки статьи  | DELETE MediaFile, каскад связей |
| SEO-метаданные                | нигде (или в статье)     | в записи MediaFile              |
| Отслеживание использования    | невозможно               | `usedIn` через COUNT связей     |

Аватарки остаются entity-центричными (`avatars/{user_id}.webp`) — это 1:1 связь, галерея не нужна.

## Почему не иерархия по датам

- Хронология (`/YYYY/MM/`) затрудняет очистку: непонятно какие файлы связаны с каким контентом
- UUID в имени файла уже содержит уникальность без риска коллизий

## Почему не шардинг по хешу

- ext4 с dir_index: O(1) lookup по имени файла через HTree
- Деградация листинга (`ls`) начинается при 100K+ файлов — недостижимо для этого проекта
- На S3 шардинг не нужен (partition prefix давно не влияет на производительность)

## Альтернативы

| Альтернатива                | Плюсы               | Минусы                               | Почему отклонена           |
| --------------------------- | ------------------- | ------------------------------------ | -------------------------- |
| БД (BLOB)                   | Всё в одном месте   | Раздувает БД, медленная отдача       | Антипаттерн для файлов     |
| Иерархия /YYYY/MM/          | Привычная структура | Сложно чистить при удалении контента | Нет связи файл → сущность  |
| On-demand resize (imgproxy) | Не хранить ресайзы  | Доп. сервис, CPU при каждом запросе  | Overkill, ресайзов 4 штуки |

## Синхронизация Local ↔ S3

Оба хранилища поддерживаются в актуальном состоянии через `rclone sync`. Это позволяет мгновенно переключаться между
бекендами без миграции файлов.

### Настройка rclone

```ini
# /etc/rclone.conf
[obs]
type = s3
provider = Other
endpoint = obs.ru-moscow-1.hc.sbercloud.ru
access_key_id = ...
secret_access_key = ...
force_path_style = true
```

### Cron (каждые 5 минут)

```bash
# Local → S3 (primary = local)
*/5 * * * * rclone sync ~/profitableweb/uploads/media/ obs:pw-media/media/ --log-file /var/log/rclone-media.log

# Или S3 → Local (primary = s3)
*/5 * * * * rclone sync obs:pw-media/media/ ~/profitableweb/uploads/media/ --log-file /var/log/rclone-media.log
```

Направление sync определяется тем, какой бекенд primary (указан в `STORAGE_BACKEND`). Primary → secondary.

### Переключение бекенда

```bash
# 1. Убедиться что sync завершён
rclone sync ~/profitableweb/uploads/media/ obs:pw-media/media/

# 2. Переключить
sed -i 's/STORAGE_BACKEND=local/STORAGE_BACKEND=s3/' .env

# 3. Перезапустить
systemctl restart pw-api

# 4. Изменить направление sync в cron (S3 → Local)
```

Обратное переключение — та же процедура в другую сторону.

### Почему rclone, а не dual-write

- Ноль изменений в коде приложения
- rclone сравнивает по size/mtime — перекачивает только изменённое
- При масштабе ~25K файлов sync занимает секунды
- Двусторонний sync в одну команду
- Dual-write усложняет код и создаёт проблемы консистентности при сбоях

Максимальное окно рассинхронизации — 5 минут (интервал cron). При необходимости можно уменьшить до 1 минуты без ощутимой
нагрузки.

## Последствия

### Положительные

- Медиафайлы — полноценные сущности с метаданными и SEO
- Единая галерея в админке с поиском, фильтрами, превью
- Переиспользование файлов между статьями без дублирования
- S3-ready: переключение одной переменной `STORAGE_BACKEND`
- Постоянная синхронизация local ↔ S3 через rclone — мгновенный failover

### Отрицательные

- Нужна миграция существующих файлов из `articles/{id}/` в `media/{uuid}`
- Дополнительная таблица и junction table в БД
- rclone cron — дополнительный процесс на сервере

## Связанные задачи

- PW-034: Управление профилем пользователя (аватарки)
- PW-XXX: Media API (модель, эндпоинты, загрузка, ресайзы)
- PW-XXX: Подключение админской галереи к Media API
- PW-XXX: S3Storage реализация (Cloud.ru OBS)
- PW-XXX: Настройка rclone sync (local ↔ Cloud.ru OBS)
