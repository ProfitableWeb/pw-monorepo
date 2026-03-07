# Медиатека (`media/`)

Управление медиафайлами — загрузка, фильтрация, превью, SEO и EXIF редактирование.

## Структура

```
media/
├── MediaSection.tsx              # Оркестратор: sidebar, контролы, grid/list, диалоги
├── MediaSidebar.tsx              # Боковая панель фильтров
├── MediaControls.tsx             # Панель управления (поиск, вид, сортировка)
├── MediaGrid.tsx                 # Отображение сеткой
├── MediaList.tsx                 # Отображение списком
├── MediaImageWithLoader.tsx      # Изображение с loader-ом
├── useCalendarState.ts           # (не используется — legacy?)
├── media.constants.ts            # Константы (фильтры, сортировка)
├── media.types.ts                # MediaFile, FileType, ViewMode, Backup
├── media.utils.ts                # formatBytes, getFileIcon, handleCopyUrl
├── media.mock.ts                 # Моковые данные
├── index.ts                      # Barrel-экспорт
│
├── preview/                      # Диалог превью и редактирования файла
│   ├── MediaPreviewDialog.tsx    # Оркестратор: превью + SEO + EXIF формы
│   ├── useMediaPreviewDialog.ts  # Хук: редактирование, сохранение, замена файла
│   ├── assets/
│   │   ├── MediaPreviewPanel.tsx # Левая колонка: превью, URL, размеры, инфо
│   │   ├── MediaSeoForm.tsx      # Форма SEO параметров (filename, alt, caption)
│   │   └── MediaExifForm.tsx     # Форма EXIF метаданных (камера, ISO, выдержка)
│   └── index.ts
```

## Архитектура

### Потоки данных

- **Стейт**: MediaSection управляет выбранным файлом, видом (grid/list), фильтрами
- **Превью**: MediaPreviewDialog — модальный диалог с двухколоночным layout
- **Формы**: SEO и EXIF данные редактируются через `useMediaPreviewDialog` хук
