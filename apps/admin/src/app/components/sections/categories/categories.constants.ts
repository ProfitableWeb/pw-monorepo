/** Sentinel-значение для Radix Select: «нет родителя» */
export const NO_PARENT_VALUE = '__none__' as const;

/** Реэкспорт общих утилит цветов для удобства импорта внутри секции */
export {
  COLORS,
  hexToTw,
  twToHex,
  fallbackColor,
} from '@/app/components/common/colors';
