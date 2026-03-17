/** Форматирование размера файла в человекочитаемый вид */
export const formatBytes = (bytes: number): string => {
  if (bytes <= 0) return '0 Б';
  const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[i]}`;
};

// ---------------------------------------------------------------------------
// Дата / время
// ---------------------------------------------------------------------------

/**
 * Форматирование даты в русской локали.
 *
 * Пресеты:
 *  - `'short'`    → «17 мар. 2026»
 *  - `'long'`     → «17 марта 2026»
 *  - `'datetime'` → «17 мар. 2026, 14:30»
 *  - `'compact'`  → «17.03, 14:30»
 *  - Или произвольные `Intl.DateTimeFormatOptions`.
 */
type DatePreset = 'short' | 'long' | 'datetime' | 'compact';

const DATE_PRESETS: Record<DatePreset, Intl.DateTimeFormatOptions> = {
  short: { day: 'numeric', month: 'short', year: 'numeric' },
  long: { day: 'numeric', month: 'long', year: 'numeric' },
  datetime: {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
  compact: {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
};

export function formatDate(
  value: string | Date | null | undefined,
  preset: DatePreset | Intl.DateTimeFormatOptions = 'short',
  fallback = '—'
): string {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return fallback;
  const options = typeof preset === 'string' ? DATE_PRESETS[preset] : preset;
  return date.toLocaleDateString('ru-RU', options);
}
