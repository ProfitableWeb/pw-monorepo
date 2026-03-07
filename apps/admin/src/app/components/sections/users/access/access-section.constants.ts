import type {
  RoleDefinition,
  BlockedIp,
  ApiToken,
  SecurityLogEntry,
} from './access-section.types';

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    name: 'Администратор',
    description: 'Полный доступ ко всем функциям системы',
    colorClass: 'bg-red-500/10',
    icon: 'shield-alert',
    permissions: [
      { label: 'Управление пользователями', granted: true },
      { label: 'Настройки системы', granted: true },
      { label: 'Все разделы', granted: true },
    ],
  },
  {
    name: 'Редактор',
    description: 'Управление контентом и публикациями',
    colorClass: 'bg-blue-500/10',
    icon: 'shield-check',
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
    colorClass: 'bg-purple-500/10',
    icon: 'user-check',
    permissions: [
      { label: 'Свои статьи', granted: true },
      { label: 'Загрузка медиа', granted: true },
      { label: 'Чужие статьи', granted: false },
      { label: 'Управление пользователями', granted: false },
    ],
  },
];

export const BLOCKED_IPS: BlockedIp[] = [
  { address: '192.168.1.100', addedDate: '5 фев 2026' },
  { address: '10.0.0.55', addedDate: '3 фев 2026' },
];

export const API_TOKENS: ApiToken[] = [
  {
    name: 'Основной токен',
    active: true,
    description: 'Создан 15 янв 2026 • Полный доступ',
    maskedKey: 'sk_live_••••••••••••••••••••••abc123',
  },
  {
    name: 'Токен только для чтения',
    active: true,
    description: 'Создан 20 янв 2026 • Только чтение',
    maskedKey: 'sk_live_••••••••••••••••••••••xyz789',
  },
  {
    name: 'Тестовый токен (отозван)',
    active: false,
    description: 'Создан 10 янв 2026 • Отозван 25 янв 2026',
    maskedKey: 'sk_test_••••••••••••••••••••••test01',
  },
];

export const SECURITY_LOG_ENTRIES: SecurityLogEntry[] = [
  {
    type: 'success',
    title: 'Успешный вход',
    details: 'admin@example.com • 192.168.1.50 • 7 фев 2026, 14:32',
  },
  {
    type: 'info',
    title: 'Создан новый API токен',
    details: 'admin@example.com • 7 фев 2026, 12:15',
  },
  {
    type: 'warning',
    title: 'Изменены права доступа',
    details:
      'admin@example.com изменил роль user@example.com • 6 фев 2026, 18:45',
  },
  {
    type: 'error',
    title: 'Неудачная попытка входа',
    details: 'unknown@example.com • 10.0.0.55 • 6 фев 2026, 03:22',
  },
  {
    type: 'blocked',
    title: 'IP-адрес зблокирован',
    details:
      '192.168.1.100 • Причина: множественные неудачные попытки • 5 фев 2026, 22:10',
  },
];
