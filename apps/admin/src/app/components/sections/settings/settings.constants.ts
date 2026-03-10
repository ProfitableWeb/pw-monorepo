import {
  User,
  Sliders,
  Globe,
  Shield,
  Bell,
  Zap,
  HardDrive,
  Activity,
  Palette,
  Key,
} from 'lucide-react';
import type { SettingsCategory } from './settings.types';

export const settingsCategories: SettingsCategory[] = [
  {
    id: 'profile',
    label: 'Профиль',
    icon: User,
    sections: [
      { id: 'data', label: 'Данные' },
      { id: 'security', label: 'Безопасность' },
      { id: 'oauth', label: 'OAuth' },
    ],
  },
  {
    id: 'general',
    label: 'Общие',
    icon: Sliders,
    sections: [
      { id: 'basics', label: 'Основные' },
      { id: 'regional', label: 'Региональные' },
      { id: 'localization', label: 'Локализация' },
    ],
  },
  {
    id: 'blog',
    label: 'Блог',
    icon: Globe,
    sections: [
      { id: 'publishing', label: 'Публикация' },
      { id: 'comments', label: 'Комментарии' },
      { id: 'rss', label: 'RSS и подписки' },
    ],
  },
  {
    id: 'security',
    label: 'Безопасность',
    icon: Shield,
    sections: [
      { id: 'authentication', label: 'Аутентификация' },
      { id: 'password', label: 'Пароль' },
      { id: 'sessions', label: 'Сессии' },
      { id: 'access-control', label: 'Настройка доступа' },
    ],
  },
  {
    id: 'notifications',
    label: 'Уведомления',
    icon: Bell,
    sections: [
      { id: 'email', label: 'Email' },
      { id: 'push', label: 'Push' },
      { id: 'digest', label: 'Дайджесты' },
    ],
  },
  {
    id: 'integrations',
    label: 'Интеграции',
    icon: Zap,
    sections: [
      { id: 'services', label: 'Внешние сервисы' },
      { id: 'api-keys', label: 'API ключи' },
      { id: 'webhooks', label: 'Webhooks' },
    ],
  },
  {
    id: 'storage',
    label: 'Хранилище',
    icon: HardDrive,
    sections: [
      { id: 'overview', label: 'Обзор' },
      { id: 'stats', label: 'Статистика' },
      { id: 'diagnostics', label: 'Диагностика' },
    ],
  },
  {
    id: 'monitoring',
    label: 'Мониторинг',
    icon: Activity,
    sections: [
      { id: 'system', label: 'Система' },
      { id: 'errors', label: 'Ошибки' },
      { id: 'audit', label: 'Аудит' },
    ],
  },
  {
    id: 'appearance',
    label: 'Внешний вид',
    icon: Palette,
    sections: [
      { id: 'theme', label: 'Тема' },
      { id: 'branding', label: 'Брендинг' },
      { id: 'customization', label: 'Кастомизация' },
    ],
  },
  {
    id: 'developers',
    label: 'Разработчики',
    icon: Key,
    sections: [
      { id: 'api', label: 'API' },
      { id: 'oauth', label: 'OAuth приложения' },
      { id: 'advanced', label: 'Расширенные' },
    ],
  },
];
