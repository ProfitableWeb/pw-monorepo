import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  CheckCircle,
  Key,
  AlertTriangle,
  XCircle,
  Ban,
} from 'lucide-react';
import type {
  RoleDefinition,
  BlockedIpEntry,
  ApiTokenEntry,
  SecurityLogEntry,
} from './security-settings.types';

export const ROLES: RoleDefinition[] = [
  {
    name: 'Администратор',
    description: 'Полный доступ ко всем функциям системы',
    icon: ShieldAlert,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-500/10',
    permissions: [
      { label: 'Управление пользователями', granted: true },
      { label: 'Настройки системы', granted: true },
      { label: 'Все разделы', granted: true },
    ],
  },
  {
    name: 'Редактор',
    description: 'Управление контентом и публикациями',
    icon: ShieldCheck,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    permissions: [
      { label: 'Создание статей', granted: true },
      { label: 'Управление медиа', granted: true },
      { label: 'Категории и метки', granted: true },
      { label: 'Настройки системы', granted: false },
    ],
  },
  {
    name: 'Автор',
    description: 'Создание и редактирование собственных статей',
    icon: UserCheck,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/10',
    permissions: [
      { label: 'Свои статьи', granted: true },
      { label: 'Загрузка медиа', granted: true },
      { label: 'Чужие статьи', granted: false },
      { label: 'Управление пользователями', granted: false },
    ],
  },
];

export const BLOCKED_IPS: BlockedIpEntry[] = [
  { ip: '192.168.1.100', addedDate: 'Добавлен 5 фев 2026' },
  { ip: '10.0.0.55', addedDate: 'Добавлен 3 фев 2026' },
];

export const API_TOKENS: ApiTokenEntry[] = [
  {
    name: 'Основной токен',
    active: true,
    createdAt: 'Создан 15 янв 2026',
    description: 'Полный доступ',
    maskedKey: 'sk_live_••••••••••••••••••••••abc123',
  },
  {
    name: 'Токен только для чтения',
    active: true,
    createdAt: 'Создан 20 янв 2026',
    description: 'Только чтение',
    maskedKey: 'sk_live_••••••••••••••••••••••xyz789',
  },
  {
    name: 'Тестовый токен (отозван)',
    active: false,
    createdAt: 'Создан 10 янв 2026',
    description: 'Отозван 25 янв 2026',
    maskedKey: 'sk_test_••••••••••••••••••••••test01',
    revoked: true,
  },
];

export const SECURITY_LOG_ENTRIES: SecurityLogEntry[] = [
  {
    icon: CheckCircle,
    colorClass: 'text-green-500',
    bgClass: 'bg-green-500/5',
    borderClass: 'border-green-500/20',
    title: 'Успешный вход',
    details: 'admin@example.com • 192.168.1.50 • 7 фев 2026, 14:32',
  },
  {
    icon: Key,
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/5',
    borderClass: 'border-blue-500/20',
    title: 'Создан новый API токен',
    details: 'admin@example.com • 7 фев 2026, 12:15',
  },
  {
    icon: AlertTriangle,
    colorClass: 'text-yellow-500',
    bgClass: 'bg-yellow-500/5',
    borderClass: 'border-yellow-500/20',
    title: 'Изменены права доступа',
    details:
      'admin@example.com изменил роль user@example.com • 6 фев 2026, 18:45',
  },
  {
    icon: XCircle,
    colorClass: 'text-red-500',
    bgClass: 'bg-red-500/5',
    borderClass: 'border-red-500/20',
    title: 'Неудачная попытка входа',
    details: 'unknown@example.com • 10.0.0.55 • 6 фев 2026, 03:22',
  },
  {
    icon: Ban,
    colorClass: 'text-red-500',
    bgClass: 'bg-red-500/5',
    borderClass: 'border-red-500/20',
    title: 'IP-адрес заблокирован',
    details:
      '192.168.1.100 • Причина: множественные неудачные попытки • 5 фев 2026, 22:10',
  },
];
