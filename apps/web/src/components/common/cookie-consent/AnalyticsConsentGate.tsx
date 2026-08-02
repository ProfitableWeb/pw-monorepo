'use client';

import React from 'react';

import { useCookieConsent } from './useCookieConsent';

interface AnalyticsConsentGateProps {
  children: React.ReactNode;
}

/**
 * PW-074 | Условный рендер аналитики.
 *
 * Ничего не монтирует, пока посетитель не выбрал «Принять». Отказ и отсутствие
 * выбора трактуются одинаково — аналитика не загружается.
 *
 * Компонент клиентский, поэтому в серверную разметку его содержимое не попадает
 * никогда: без JavaScript ни счётчик, ни noscript-пиксель не сработают, и это
 * корректно — без JS согласие выразить нельзя.
 */
export function AnalyticsConsentGate({ children }: AnalyticsConsentGateProps) {
  const consent = useCookieConsent();

  if (consent !== 'accepted') return null;

  return <>{children}</>;
}
