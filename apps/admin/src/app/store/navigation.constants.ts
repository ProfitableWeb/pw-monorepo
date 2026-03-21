/**
 * Типы и константы навигации — единый source of truth для маршрутов.
 *
 * Вынесены из navigation-store.ts чтобы избежать циклической зависимости:
 * routes.ts и navigation-store.ts оба используют эти данные.
 */

export type PageId =
  | 'dashboard'
  | 'ai-center'
  | 'articles'
  | 'pages'
  | 'calendar'
  | 'categories'
  | 'tags'
  | 'media'
  | 'content-hub'
  | 'editorial-hub'
  | 'manifest'
  | 'style'
  | 'formats'
  | 'socials'
  | 'settings'
  | 'users'
  | 'promotion'
  | 'analytics'
  | 'ads'
  | 'seo'
  | 'system-hub'
  | 'research'
  | 'research-workspace'
  | 'article-editor';

export interface NavigationItem {
  id: PageId;
  title: string;
  icon: string;
  section: 'Главное' | 'Контент' | 'Редакция' | 'Система';
  /** Паттерн URL относительно `/admin/` (синхронизируется с History API) */
  path: string;
  keywords?: string[];
}

export const navigationItems: NavigationItem[] = [
  // Главное
  {
    id: 'dashboard',
    title: 'Дашборд',
    icon: 'LayoutDashboard',
    section: 'Главное',
    path: '',
    keywords: ['главная', 'home', 'панель'],
  },
  {
    id: 'ai-center',
    title: 'AI центр',
    icon: 'Sparkles',
    section: 'Главное',
    path: 'ai-center',
    keywords: ['искусственный интеллект', 'нейросеть'],
  },

  // Контент
  {
    id: 'content-hub',
    title: 'Контент',
    icon: 'Layers',
    section: 'Контент',
    path: 'content',
    keywords: ['обзор контента'],
  },
  {
    id: 'articles',
    title: 'Статьи',
    icon: 'FileText',
    section: 'Контент',
    path: 'content/articles',
    keywords: ['посты', 'публикации', 'записи'],
  },
  {
    id: 'pages',
    title: 'Страницы',
    icon: 'StickyNote',
    section: 'Контент',
    path: 'content/pages',
    keywords: ['страница', 'page', 'о проекте', 'контакты'],
  },
  {
    id: 'calendar',
    title: 'Календарь',
    icon: 'Calendar',
    section: 'Контент',
    path: 'content/calendar',
    keywords: ['расписание', 'планирование'],
  },
  {
    id: 'categories',
    title: 'Категории',
    icon: 'FolderTree',
    section: 'Контент',
    path: 'content/categories',
    keywords: ['рубрики'],
  },
  {
    id: 'tags',
    title: 'Метки',
    icon: 'Tag',
    section: 'Контент',
    path: 'content/tags',
    keywords: ['теги', 'labels'],
  },
  {
    id: 'media',
    title: 'Медиа',
    icon: 'Image',
    section: 'Контент',
    path: 'content/media',
    keywords: ['изображения', 'картинки', 'файлы'],
  },
  {
    id: 'research',
    title: 'Проекты',
    icon: 'FolderKanban',
    section: 'Контент',
    path: 'content/research',
    keywords: ['проекты', 'исследование', 'research', 'заметки'],
  },
  {
    id: 'research-workspace',
    title: 'Рабочее пространство',
    icon: 'FlaskConical',
    section: 'Контент',
    path: 'content/research/:id',
    keywords: [],
  },
  {
    id: 'article-editor',
    title: 'Редактор статьи',
    icon: 'PenLine',
    section: 'Контент',
    path: 'content/articles/:id',
    keywords: [],
  },

  // Редакция
  {
    id: 'editorial-hub',
    title: 'Редакция',
    icon: 'BookOpen',
    section: 'Редакция',
    path: 'editorial',
    keywords: ['обзор редакции'],
  },
  {
    id: 'manifest',
    title: 'Манифест',
    icon: 'FileHeart',
    section: 'Редакция',
    path: 'editorial/manifest',
    keywords: ['миссия', 'ценности'],
  },
  {
    id: 'style',
    title: 'Стиль',
    icon: 'Palette',
    section: 'Редакция',
    path: 'editorial/style',
    keywords: ['голос', 'тон', 'стайл гайд'],
  },
  {
    id: 'formats',
    title: 'Форматы',
    icon: 'Layout',
    section: 'Редакция',
    path: 'editorial/formats',
    keywords: ['шаблоны', 'структура'],
  },
  {
    id: 'socials',
    title: 'Соцсети',
    icon: 'Share2',
    section: 'Редакция',
    path: 'editorial/socials',
    keywords: ['социальные сети', 'smm'],
  },

  // Система
  {
    id: 'system-hub',
    title: 'Система',
    icon: 'Wrench',
    section: 'Система',
    path: 'system',
    keywords: ['обзор системы'],
  },
  {
    id: 'settings',
    title: 'Настройки',
    icon: 'Settings',
    section: 'Система',
    path: 'system/settings',
    keywords: ['конфигурация', 'параметры'],
  },
  {
    id: 'users',
    title: 'Пользователи',
    icon: 'Users',
    section: 'Система',
    path: 'system/users',
    keywords: ['команда', 'авторы'],
  },
  {
    id: 'promotion',
    title: 'Продвижение',
    icon: 'TrendingUp',
    section: 'Система',
    path: 'system/promotion',
    keywords: ['маркетинг', 'seo'],
  },
  {
    id: 'analytics',
    title: 'Аналитика',
    icon: 'BarChart3',
    section: 'Система',
    path: 'system/analytics',
    keywords: ['статистика', 'метрики'],
  },
  {
    id: 'ads',
    title: 'Реклама',
    icon: 'Megaphone',
    section: 'Система',
    path: 'system/ads',
    keywords: ['объявления', 'монетизация'],
  },
  {
    id: 'seo',
    title: 'SEO',
    icon: 'Search',
    section: 'Система',
    path: 'system/seo',
    keywords: ['оптимизация', 'поисковые системы'],
  },
];
