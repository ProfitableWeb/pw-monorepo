'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MotionConfig } from 'framer-motion';
import { ArticleCard } from '@/components/common/masonry';
import type { Article } from '@/components/common/masonry';

// Переопределяем matchMedia на уровне модуля (до рендера компонентов),
// чтобы useMediaQuery('(max-width: 767px)') возвращал false — iframe узкий,
// но карточка должна рендериться в десктопном виде (summary + image).
if (typeof window !== 'undefined') {
  const _matchMedia = window.matchMedia.bind(window);
  window.matchMedia = (query: string): MediaQueryList => {
    if (query.includes('max-width: 767px')) {
      const mql = _matchMedia(query);
      return {
        matches: false,
        media: mql.media,
        onchange: mql.onchange,
        addListener: mql.addListener.bind(mql),
        removeListener: mql.removeListener.bind(mql),
        addEventListener: mql.addEventListener.bind(mql),
        removeEventListener: mql.removeEventListener.bind(mql),
        dispatchEvent: mql.dispatchEvent.bind(mql),
      };
    }
    return _matchMedia(query);
  };
}

// Разрешённые origin для postMessage
const ALLOWED_ORIGINS = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  process.env.NEXT_PUBLIC_ADMIN_URL,
  typeof window !== 'undefined' ? window.location.origin : '',
].filter(Boolean) as string[];

interface PreviewCardData {
  title: string;
  subtitle: string;
  summary: string;
  category: string;
  imageUrl?: string;
  slug: string;
  createdAt: string;
}

/**
 * Preview-роут для iframe-предпросмотра карточки статьи из админки.
 *
 * Принимает данные через postMessage и рендерит настоящий ArticleCard
 * из masonry-сетки — точная копия того, что увидит пользователь на главной.
 */
export default function CardPreviewPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (!ALLOWED_ORIGINS.includes(event.origin)) return;

    const msg = event.data;
    if (!msg || typeof msg.type !== 'string') return;

    switch (msg.type) {
      case 'preview:update': {
        const d = msg.data as PreviewCardData;
        const hasImage =
          typeof d.imageUrl === 'string' && d.imageUrl.trim().length > 0;
        setArticle({
          id: 'preview',
          title: d.title || 'Заголовок статьи',
          subtitle: d.subtitle || '',
          summary: d.summary || '',
          createdAt: d.createdAt || new Date().toISOString(),
          slug: d.slug || 'preview',
          category: d.category || undefined,
          imageUrl: hasImage ? d.imageUrl : undefined,
        });
        break;
      }

      case 'preview:theme': {
        const theme = msg.theme as string;
        if (theme === 'light' || theme === 'dark') {
          document.documentElement.setAttribute('data-theme', theme);
        }
        break;
      }

      case 'preview:ping':
        (event.source as WindowProxy)?.postMessage(
          { type: 'preview:pong' },
          { targetOrigin: event.origin }
        );
        break;
    }
  }, []);

  // Слушаем postMessage и сигнализируем готовность
  useEffect(() => {
    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: 'preview:ready' }, '*');
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  // Перехватываем клики чтобы Link не навигировал
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target) e.preventDefault();
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  // Отправляем высоту контента родителю при изменении
  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new ResizeObserver(() => {
      const height = wrapperRef.current?.scrollHeight ?? 0;
      if (height > 0) {
        window.parent.postMessage({ type: 'preview:resize', height }, '*');
      }
    });

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [article]);

  if (!article) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          color: 'var(--color-text-muted, #888)',
          fontFamily: 'var(--font-inter, sans-serif)',
          fontSize: '14px',
        }}
      >
        Ожидание данных...
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        padding: '24px 32px',
        backgroundColor: 'var(--color-background, #fff)',
      }}
    >
      <MotionConfig transition={{ duration: 0 }}>
        <ArticleCard article={article} />
      </MotionConfig>
    </div>
  );
}
