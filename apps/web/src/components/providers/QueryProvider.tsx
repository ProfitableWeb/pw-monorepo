'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * React Query Provider — оборачивает приложение для работы с клиентскими хуками.
 * Создаёт QueryClient один раз на клиенте (useState гарантирует стабильность).
 */
export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
