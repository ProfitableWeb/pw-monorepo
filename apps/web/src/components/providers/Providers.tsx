'use client';

import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/auth';
import { ToastProvider } from '@/components/common/toast';
import { QueryProvider } from './QueryProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Клиентский компонент-обёртка для всех провайдеров
 * Используется в layout.tsx для обеспечения доступа к контекстам
 */
export const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme='light'>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};
