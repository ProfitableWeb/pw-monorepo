import {
  Globe,
  FileText,
  Link,
  Code,
  Activity,
  Zap,
  Target,
  BookOpen,
} from 'lucide-react';
import type { SeoCategory } from './seo.types';

/** Список категорий для навигации в SEO-разделе */
export const seoCategories: SeoCategory[] = [
  {
    id: 'general',
    label: 'Общие настройки',
    icon: Globe,
  },
  {
    id: 'meta',
    label: 'Мета-теги',
    icon: FileText,
  },
  {
    id: 'sitemap',
    label: 'Sitemap & Robots',
    icon: Link,
  },
  {
    id: 'schema',
    label: 'Структурированные данные',
    icon: Code,
  },
  {
    id: 'monitoring',
    label: 'Мониторинг',
    icon: Activity,
  },
  {
    id: 'performance',
    label: 'Производительность',
    icon: Zap,
  },
  {
    id: 'urls',
    label: 'URL и редиректы',
    icon: Link,
  },
  {
    id: 'content',
    label: 'Контент-анализ',
    icon: Target,
  },
  {
    id: 'knowledge-base',
    label: 'База знаний',
    icon: BookOpen,
  },
];
