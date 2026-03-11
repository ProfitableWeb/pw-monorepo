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

/** Варианты количества записей на подгрузку */
export const PER_PAGE_OPTIONS = [10, 25, 50] as const;

/** Дефолтное количество записей */
export const DEFAULT_PER_PAGE = 25;
