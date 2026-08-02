'use client';

import { useSyncExternalStore } from 'react';

import {
  getCookieConsentServerSnapshot,
  getCookieConsentSnapshot,
  subscribeCookieConsent,
  type CookieConsent,
} from '@/lib/cookie-consent';

/**
 * Текущий выбор посетителя по cookie.
 *
 * Возвращает null, пока выбор не сделан, — и во время SSR/гидрации, поэтому
 * серверная и клиентская разметка совпадают, а расхождения гидрации нет.
 */
export function useCookieConsent(): CookieConsent | null {
  return useSyncExternalStore(
    subscribeCookieConsent,
    getCookieConsentSnapshot,
    getCookieConsentServerSnapshot
  );
}
