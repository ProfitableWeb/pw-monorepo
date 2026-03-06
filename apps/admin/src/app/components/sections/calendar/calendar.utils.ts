import { startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

/**
 * Генерация массива дней для отображения месяца в сетке 7xN.
 * Пустые ячейки заполняются null.
 */
export function generateCalendarDays(month: Date): (Date | null)[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfMonth = getDay(monthStart);
  const startDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const calendarDaysWithStart = Array(startDayIndex)
    .fill(null)
    .concat(daysInMonth);
  const remainingCells = 7 - (calendarDaysWithStart.length % 7);
  return remainingCells === 7
    ? calendarDaysWithStart
    : calendarDaysWithStart.concat(Array(remainingCells).fill(null));
}

/** Цвет поста по типу */
export function getPostColor(type: string): string {
  switch (type) {
    case 'scheduled':
      return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30';
    case 'ai-suggestion':
      return 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30';
    case 'event':
      return 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30';
    default:
      return 'bg-muted';
  }
}
