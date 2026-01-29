/**
 * Относительное время в духе «2 часа назад», «вчера», «15 янв. 2025»
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60)
    return `${diffMins} ${plural(diffMins, 'минуту', 'минуты', 'минут')} назад`;
  if (diffHours < 24)
    return `${diffHours} ${plural(diffHours, 'час', 'часа', 'часов')} назад`;
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7)
    return `${diffDays} ${plural(diffDays, 'день', 'дня', 'дней')} назад`;

  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
