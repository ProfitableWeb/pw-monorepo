/**
 * Константы breakpoint'ов для адаптивного masonry-блока
 * Поддержка от мобильных устройств до ultra-wide мониторов
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1200,
  desktop: 1800,
  large: 2400,
  xl: 3000,
  xxl: 3200,
} as const;

/**
 * Определяет количество колонок на основе ширины экрана
 *
 * @param width - Ширина экрана в пикселях
 * @returns Количество колонок (1-7)
 *
 * @example
 * ```ts
 * getColumnCount(1920) // => 3 (desktop)
 * getColumnCount(3840) // => 7 (ultra-wide)
 * ```
 */
export function getColumnCount(width: number): number {
  if (width < BREAKPOINTS.mobile) return 1;
  if (width < BREAKPOINTS.tablet) return 2;
  if (width < BREAKPOINTS.desktop) return 3;
  if (width < BREAKPOINTS.large) return 4;
  if (width < BREAKPOINTS.xl) return 5;
  if (width < BREAKPOINTS.xxl) return 6;
  return 7;
}

/**
 * Возвращает gap между колонками для текущего breakpoint
 */
export function getColumnGap(width: number): number {
  if (width < BREAKPOINTS.mobile) return 24;
  if (width < BREAKPOINTS.tablet) return 30;
  return 40;
}

/**
 * Возвращает gap между карточками для текущего breakpoint
 */
export function getCardGap(width: number): number {
  if (width < BREAKPOINTS.mobile) return 24;
  return 10;
}
