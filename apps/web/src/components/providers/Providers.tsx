'use client';

import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/auth';
import { ToastProvider } from '@/components/common/toast';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Клиентский компонент-обёртка для всех провайдеров
 * Используется в layout.tsx для обеспечения доступа к контекстам
 */
export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider defaultTheme='light'>
      <AuthProvider>
        {children}
        <ToastProvider />
      </AuthProvider>
    </ThemeProvider>
  );
};
