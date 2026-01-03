'use client';

import { useEffect, useState } from 'react';

/**
 * Hook для определения предпочтения пользователя по уменьшению анимаций
 * Используется для accessibility (a11y)
 * 
 * @returns true если пользователь предпочитает уменьшенные анимации
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = usePreferReducedMotion();
 * 
 * const duration = prefersReducedMotion ? 0 : 0.4;
 * ```
 */
export function usePreferReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Проверка SSR
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Устанавливаем начальное значение
    setPrefersReducedMotion(mediaQuery.matches);

    // Обработчик изменений
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}



