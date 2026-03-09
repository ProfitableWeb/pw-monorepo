# PW-041-B: Backlog

Пункты, выявленные при UX/UI ревью мокового интерфейса медиатеки.

## ✅ Выполнено

- **Drag & drop зона загрузки** — нативные HTML5 drag events, хук `useFileDropZone`, overlay при перетаскивании. Без
  новых зависимостей.
- **Keyboard navigation / a11y** — карточки в MediaGrid и MediaList получили `role="button"`, `tabIndex={0}`,
  `aria-label`, `onKeyDown` (Enter/Space), focus-visible ring.
- **«Заменить файл» в превью** — backend `PUT /admin/media/{id}/file` + `replace_file()` в MediaService. Frontend:
  `replaceMediaFile()`, `useReplaceMedia()`, file picker в MediaPreviewDialog.

## 🔲 Открыто

- **Backup функционал** — требует ADR (архитектурное решение): механизм снапшотов БД, хранилище бэкапов, background jobs
  (Celery?). UI заглушка «Скоро» в MediaSidebar.
