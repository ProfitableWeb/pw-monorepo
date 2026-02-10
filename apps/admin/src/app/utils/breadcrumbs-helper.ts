import { 
  LayoutDashboard, 
  Layers, 
  Pencil, 
  FileText, 
  Calendar, 
  FolderOpen, 
  Tag, 
  Image,
  FileHeart,
  Palette,
  Layout,
  Share2,
  type LucideIcon
} from 'lucide-react';
import { BreadcrumbItem } from '@/app/store/header-store';

/**
 * Маппинг названий разделов на иконки
 */
const iconMap: Record<string, LucideIcon> = {
  // Главные разделы
  'Дашборд': LayoutDashboard,
  'Контент': Layers,
  'Редакция': Pencil,
  
  // Контент
  'Статьи': FileText,
  'Календарь': Calendar,
  'Категории': FolderOpen,
  'Метки': Tag,
  'Медиа': Image,
  
  // Редакция
  'Манифест': FileHeart,
  'Стиль': Palette,
  'Форматы': Layout,
  'Соцсети': Share2,
};

/**
 * Создает breadcrumb с автоматическим добавлением иконки
 * @param label - название раздела
 * @param href - опциональная ссылка
 * @param icon - опциональная иконка (если не указана, будет найдена автоматически)
 */
export function createBreadcrumb(
  label: string, 
  href?: string, 
  icon?: LucideIcon
): BreadcrumbItem {
  return {
    label,
    href,
    icon: icon || iconMap[label],
  };
}

/**
 * Создает массив breadcrumbs с автоматическим добавлением иконок
 * @param items - массив объектов с label, href (опционально) и icon (опционально)
 */
export function createBreadcrumbs(
  items: Array<{ label: string; href?: string; icon?: LucideIcon }>
): BreadcrumbItem[] {
  return items.map(item => createBreadcrumb(item.label, item.href, item.icon));
}

/**
 * Готовые наборы breadcrumbs для часто используемых путей
 */
export const breadcrumbPresets = {
  // Контент
  articles: () => createBreadcrumbs([
    { label: 'Дашборд', href: 'dashboard' },
    { label: 'Контент', href: 'content-hub' },
    { label: 'Статьи' },
  ]),
  
  calendar: () => createBreadcrumbs([
    { label: 'Дашборд', href: 'dashboard' },
    { label: 'Контент', href: 'content-hub' },
    { label: 'Календарь' },
  ]),
  
  categories: () => createBreadcrumbs([
    { label: 'Дашборд', href: 'dashboard' },
    { label: 'Контент', href: 'content-hub' },
    { label: 'Категории' },
  ]),
  
  tags: () => createBreadcrumbs([
    { label: 'Дашборд', href: 'dashboard' },
    { label: 'Контент', href: 'content-hub' },
    { label: 'Метки' },
  ]),
  
  media: () => createBreadcrumbs([
    { label: 'Дашборд', href: 'dashboard' },
    { label: 'Контент', href: 'content-hub' },
    { label: 'Медиа' },
  ]),
  
  // Редакция
  manifest: () => createBreadcrumbs([
    { label: 'Дашборд', href: 'dashboard' },
    { label: 'Редакция', href: 'editorial-hub' },
    { label: 'Манифест' },
  ]),
  
  style: () => createBreadcrumbs([
    { label: 'Дашборд', href: 'dashboard' },
    { label: 'Редакция', href: 'editorial-hub' },
    { label: 'Стиль' },
  ]),
  
  formats: () => createBreadcrumbs([
    { label: 'Дашборд', href: 'dashboard' },
    { label: 'Редакция', href: 'editorial-hub' },
    { label: 'Форматы' },
  ]),
  
  socials: () => createBreadcrumbs([
    { label: 'Дашборд', href: 'dashboard' },
    { label: 'Редакция', href: 'editorial-hub' },
    { label: 'Соцсети' },
  ]),
  
  // Хабы
  contentHub: () => createBreadcrumbs([
    { label: 'Дашборд', href: 'dashboard' },
    { label: 'Контент' },
  ]),
  
  editorialHub: () => createBreadcrumbs([
    { label: 'Дашборд', href: 'dashboard' },
    { label: 'Редакция' },
  ]),
};
