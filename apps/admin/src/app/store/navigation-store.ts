import { create } from 'zustand';

export type PageId = 
  | 'dashboard'
  | 'ai-center'
  | 'articles'
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
  | 'seo';

export interface NavigationItem {
  id: PageId;
  title: string;
  icon: string;
  section: 'Главное' | 'Контент' | 'Редакция' | 'Система';
  path: string;
  keywords?: string[];
}

export const navigationItems: NavigationItem[] = [
  // Главное
  { id: 'dashboard', title: 'Дашборд', icon: 'LayoutDashboard', section: 'Главное', path: 'dashboard', keywords: ['главная', 'home', 'панель'] },
  { id: 'ai-center', title: 'AI центр', icon: 'Sparkles', section: 'Главное', path: 'ai-center', keywords: ['искусственный интеллект', 'нейросеть'] },
  
  // Контент
  { id: 'content-hub', title: 'Контент', icon: 'Layers', section: 'Контент', path: 'content-hub', keywords: ['обзор контента'] },
  { id: 'articles', title: 'Статьи', icon: 'FileText', section: 'Контент', path: 'articles', keywords: ['посты', 'публикации', 'записи'] },
  { id: 'calendar', title: 'Календарь', icon: 'Calendar', section: 'Контент', path: 'calendar', keywords: ['расписание', 'планирование'] },
  { id: 'categories', title: 'Категории', icon: 'FolderTree', section: 'Контент', path: 'categories', keywords: ['рубрики'] },
  { id: 'tags', title: 'Метки', icon: 'Tag', section: 'Контент', path: 'tags', keywords: ['теги', 'labels'] },
  { id: 'media', title: 'Медиа', icon: 'Image', section: 'Контент', path: 'media', keywords: ['изображения', 'картинки', 'файлы'] },
  
  // Редакция
  { id: 'editorial-hub', title: 'Редакция', icon: 'BookOpen', section: 'Редакция', path: 'editorial-hub', keywords: ['обзор редакции'] },
  { id: 'manifest', title: 'Манифест', icon: 'FileHeart', section: 'Редакция', path: 'manifest', keywords: ['миссия', 'ценности'] },
  { id: 'style', title: 'Стиль', icon: 'Palette', section: 'Редакция', path: 'style', keywords: ['голос', 'тон', 'стайл гайд'] },
  { id: 'formats', title: 'Форматы', icon: 'Layout', section: 'Редакция', path: 'formats', keywords: ['шаблоны', 'структура'] },
  { id: 'socials', title: 'Соцсети', icon: 'Share2', section: 'Редакция', path: 'socials', keywords: ['социальные сети', 'smm'] },
  
  // Система
  { id: 'settings', title: 'Настройки', icon: 'Settings', section: 'Система', path: 'settings', keywords: ['конфигурация', 'параметры'] },
  { id: 'users', title: 'Пользователи', icon: 'Users', section: 'Система', path: 'users', keywords: ['команда', 'авторы'] },
  { id: 'promotion', title: 'Продвижение', icon: 'TrendingUp', section: 'Система', path: 'promotion', keywords: ['маркетинг', 'seo'] },
  { id: 'analytics', title: 'Аналитика', icon: 'BarChart3', section: 'Система', path: 'analytics', keywords: ['статистика', 'метрики'] },
  { id: 'ads', title: 'Реклама', icon: 'Megaphone', section: 'Система', path: 'ads', keywords: ['объявления', 'монетизация'] },
  { id: 'seo', title: 'SEO', icon: 'Search', section: 'Система', path: 'seo', keywords: ['оптимизация', 'поисковые системы'] },
];

interface NavigationStore {
  currentPage: PageId;
  recentPages: PageId[];
  navigateTo: (pageId: PageId) => void;
  getPageTitle: (pageId: PageId) => string;
  getNavigationItem: (pageId: PageId) => NavigationItem | undefined;
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  currentPage: 'dashboard',
  recentPages: [],
  
  navigateTo: (pageId: PageId) => {
    set((state) => {
      const recentPages = [pageId, ...state.recentPages.filter(p => p !== pageId)].slice(0, 5);
      return { currentPage: pageId, recentPages };
    });
  },
  
  getPageTitle: (pageId: PageId) => {
    const item = navigationItems.find(item => item.id === pageId);
    return item?.title || 'Панель управления';
  },
  
  getNavigationItem: (pageId: PageId) => {
    return navigationItems.find(item => item.id === pageId);
  },
}));