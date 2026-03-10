/**
 * PW-042 | Общие утилиты секции «Мониторинг».
 */

/** Форматирование ISO-даты в компактный вид: ДД.ММ, ЧЧ:ММ */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Диапазоны фильтрации по дате (мс) */
export const DATE_RANGE_MS: Record<string, number> = {
  '24h': 86_400_000,
  '7d': 604_800_000,
  '30d': 2_592_000_000,
};

/** Варианты количества записей на подгрузку */
export const PER_PAGE_OPTIONS = [10, 25, 50] as const;

/** Дефолтное количество записей */
export const DEFAULT_PER_PAGE = 25;
