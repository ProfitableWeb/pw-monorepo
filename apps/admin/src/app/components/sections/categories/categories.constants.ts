/** Константы цветов для категорий */

export const COLORS = [
  { name: 'Серый', tw: 'bg-gray-500', hex: '#6b7280' },
  { name: 'Красный', tw: 'bg-red-500', hex: '#ef4444' },
  { name: 'Оранжевый', tw: 'bg-orange-500', hex: '#f97316' },
  { name: 'Желтый', tw: 'bg-yellow-500', hex: '#eab308' },
  { name: 'Зеленый', tw: 'bg-green-500', hex: '#22c55e' },
  { name: 'Синий', tw: 'bg-blue-500', hex: '#3b82f6' },
  { name: 'Фиолетовый', tw: 'bg-purple-500', hex: '#a855f7' },
  { name: 'Розовый', tw: 'bg-pink-500', hex: '#ec4899' },
] as const;

const HEX_TO_TW: Record<string, string> = Object.fromEntries(
  COLORS.map(c => [c.hex, c.tw])
);

const TW_TO_HEX: Record<string, string> = Object.fromEntries(
  COLORS.map(c => [c.tw, c.hex])
);

/** Hex → Tailwind class для рендеринга. Fallback: bg-gray-500 */
export function hexToTw(hex: string | null | undefined): string {
  return (hex && HEX_TO_TW[hex]) || 'bg-gray-500';
}

/** Tailwind class → hex для отправки в API */
export function twToHex(tw: string): string {
  return TW_TO_HEX[tw] || '#6b7280';
}

/** Назначение цвета по индексу (для категорий без цвета) */
export function fallbackColor(index: number): string {
  return COLORS[index % COLORS.length]?.tw ?? 'bg-gray-500';
}
