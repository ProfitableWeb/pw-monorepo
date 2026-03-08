export const STATUSES = [
  { value: 'published', label: 'Опубликованные' },
  { value: 'draft', label: 'Черновики' },
  { value: 'scheduled', label: 'Запланированные' },
  { value: 'archived', label: 'Архивные' },
] as const;

export const VALID_STATUSES = new Set(STATUSES.map(s => s.value));
