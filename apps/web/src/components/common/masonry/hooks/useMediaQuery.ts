'use client';

import { useState, useEffect } from 'react';

/**
 * Hook для работы с media queries
 * 
 * @param query - Media query строка (например, "(max-width: 768px)")
 * @returns true если media query совпадает, false в противном случае
 * 
 * @example
 * ```tsx
 * const isMobile = useMediaQuery("(max-width: 767px)");
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Проверка SSR
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Устанавливаем начальное значение
    setMatches(mediaQuery.matches);

    // Обработчик изменений
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Подписываемся на изменения
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}



