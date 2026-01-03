'use client';

import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Клиентский компонент-обёртка для всех провайдеров
 * Используется в layout.tsx для обеспечения доступа к контекстам
 */
export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <ThemeProvider defaultTheme='light'>{children}</ThemeProvider>;
};
