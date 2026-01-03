'use client';

import { useState, useEffect, useCallback } from 'react';
import { getColumnCount } from '@/utils/breakpoints';

/**
 * Debounce функция для оптимизации resize events
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;

  const debouncedFunc = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debouncedFunc.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };

  return debouncedFunc;
}

/**
 * Hook для определения количества колонок на основе ширины экрана
 * Использует debounce для оптимизации производительности при resize
 *
 * @param debounceMs - Задержка debounce в миллисекундах (по умолчанию 150)
 * @returns Количество колонок (1-7)
 *
 * @example
 * ```tsx
 * const columnCount = useResponsiveColumns();
 * // или с кастомной задержкой
 * const columnCount = useResponsiveColumns(200);
 * ```
 */
export function useResponsiveColumns(debounceMs: number = 100): number {
  const [columnCount, setColumnCount] = useState<number>(() =>
    typeof window !== 'undefined' ? getColumnCount(window.innerWidth) : 3
  );

  const handleResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      setColumnCount(getColumnCount(window.innerWidth));
    }
  }, []);

  useEffect(() => {
    // Проверка SSR
    if (typeof window === 'undefined') return;

    // Создаём debounced версию handleResize
    const debouncedHandleResize = debounce(handleResize, debounceMs);

    // Устанавливаем начальное значение
    handleResize();

    // Подписываемся на resize
    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      debouncedHandleResize.cancel?.();
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [debounceMs, handleResize]);

  return columnCount;
}



