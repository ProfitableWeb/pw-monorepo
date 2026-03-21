/**
 * Общие breadcrumb-элементы для навигации по разделам «Система».
 * Используется всеми страницами, входящими в группу «Система».
 */
import {
  Settings,
  Users,
  TrendingUp,
  BarChart3,
  LayoutPanelTop,
  SearchCheck,
  Cable,
  Cog,
} from 'lucide-react';
import type { BreadcrumbItem } from './header-store';

/** Breadcrumb «Система» с dropdown-навигацией между разделами */
export const SYSTEM_BREADCRUMB: BreadcrumbItem = {
  label: 'Система',
  icon: Cog,
  dropdown: [
    { label: 'Настройки', icon: Settings, href: 'settings' },
    { label: 'Пользователи', icon: Users, href: 'users' },
    { label: 'Продвижение', icon: TrendingUp, href: 'promotion' },
    { label: 'Аналитика', icon: BarChart3, href: 'analytics' },
    { label: 'Реклама', icon: LayoutPanelTop, href: 'ads' },
    { label: 'SEO', icon: SearchCheck, href: 'seo' },
    { label: 'MCP', icon: Cable, href: 'mcp' },
  ],
};
