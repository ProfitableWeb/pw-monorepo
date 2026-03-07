# SEO (`seo/`)

Настройки SEO — sidebar-навигация по 8 категориям + база знаний.

## Структура

```
seo/
├── SeoPage.tsx              # Оркестратор: sidebar, роутинг по категориям, save-панель
├── seo.constants.ts         # Список категорий sidebar
├── seo.types.ts             # Типы модуля
├── index.ts                 # Barrel-экспорт
│
├── assets/                  # Вкладки настроек (внутренние, не экспортируются)
│   ├── GeneralSeoSettings.tsx      # Общие настройки
│   ├── MetaTagsSettings.tsx        # Мета-теги
│   ├── SitemapSettings.tsx         # Sitemap
│   ├── SchemaSettings.tsx          # Schema.org
│   ├── MonitoringSettings.tsx      # Мониторинг
│   ├── PerformanceSettings.tsx     # Производительность
│   ├── UrlSettings.tsx             # URL-настройки
│   └── ContentAnalysisSettings.tsx # Анализ контента
│
├── knowledge-base/          # База знаний SEO (подсекция)
│   ├── knowledge-base.tsx   # Оркестратор
│   ├── kb-tree.tsx          # Дерево навигации
│   ├── kb-article-editor.tsx # Редактор статьи
│   ├── kb-types.ts          # Типы
│   └── index.ts
```

## Архитектура

### Потоки данных

- **Стейт**: SeoPage управляет activeCategory, searchQuery, hasUnsavedChanges
- **Навигация**: sidebar с 9 категориями, переключение через useState
- **База знаний**: отдельный режим без sidebar, навигация через navigation-store
