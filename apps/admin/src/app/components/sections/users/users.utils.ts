import { formatDate } from '@/app/components/common';

/** Форматирование даты в относительный вид ("5 мин назад", "Вчера" и т.д.) */
export function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Не заходил';

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Только что';
  if (diffMin < 60) return `${diffMin} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дн назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед назад`;

  return formatDate(dateStr);
}

/** Получить инициалы из имени */
export function getInitials(name: string): string {
  if (!name) return '?';
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  );
}
