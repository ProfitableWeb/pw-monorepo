'use client';

import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/components/common/toast';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Клиентский компонент-обёртка для всех провайдеров
 * Используется в layout.tsx для обеспечения доступа к контекстам
 */
export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme='light'>
      {children}
      <ToastProvider />
    </ThemeProvider>
  );
};
