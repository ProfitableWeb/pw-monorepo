/**
 * Хук жизненного цикла iframe-превью.
 *
 * Протокол postMessage (admin ↔ web):
 * 1. iframe загружается → отправляет `preview:ready`
 * 2. admin получает ready → отправляет `preview:update` с данными статьи (debounce 200ms)
 * 3. admin может отправлять `preview:scroll` и `preview:click` для имитации взаимодействия
 *
 * Безопасность: все входящие сообщения проверяются по `e.origin === new URL(WEB_URL).origin`
 * (строгое сравнение, не includes — защита от поддоменов вроде evil-localhost:3000).
 *
 * Таймаут: если iframe не ответит `preview:ready` за 15 секунд — показываем ошибку.
 *
 * @see apps/web/src/app/preview/page.tsx — принимающая сторона протокола
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import type { PreviewArticleData } from '@/app/types/article-editor';
import { WEB_URL } from './preview.types';

interface UseIframeMessagingOptions {
  articleData: PreviewArticleData;
  iframeKey: number;
}

export function useIframeMessaging({
  articleData,
  iframeKey,
}: UseIframeMessagingOptions) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Слушать preview:ready от iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== new URL(WEB_URL).origin) return;
      if (e.data?.type === 'preview:ready') {
        setIframeReady(true);
        setIframeError(false);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Сбросить состояние iframe при смене ключа
  useEffect(() => {
    setIframeReady(false);
    setIframeError(false);
  }, [iframeKey]);

  // Таймаут загрузки
  useEffect(() => {
    if (iframeReady || iframeError) return;
    const timer = setTimeout(() => setIframeError(true), 15000);
    return () => clearTimeout(timer);
  }, [iframeReady, iframeError]);

  // Отправить данные статьи в iframe (с debounce)
  useEffect(() => {
    if (!iframeReady || !iframeRef.current?.contentWindow) return;
    const timer = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'preview:update', data: articleData },
        WEB_URL
      );
    }, 200);
    return () => clearTimeout(timer);
  }, [articleData, iframeReady]);

  const sendScroll = useCallback((deltaY: number) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'preview:scroll', deltaY },
      WEB_URL
    );
  }, []);

  const sendClick = useCallback(
    (clientX: number, clientY: number, zoom: number) => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const rect = iframe.getBoundingClientRect();
      const x = (clientX - rect.left) / zoom;
      const y = (clientY - rect.top) / zoom;
      iframe.contentWindow?.postMessage(
        { type: 'preview:click', x, y },
        WEB_URL
      );
    },
    []
  );

  return {
    iframeRef,
    iframeReady,
    iframeError,
    sendScroll,
    sendClick,
  };
}
