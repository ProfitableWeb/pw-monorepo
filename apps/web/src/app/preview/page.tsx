'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArticleHeader } from '@/components/app-layout/app-article-page-one-column/article-header';
import { ArticleContentOneColumn } from '@/components/common/article-content';
import { ArticleLayout } from '@/components/common/article-layouts';
import { SelfAssessment } from '@/components/common/self-assessment';
import { ArticleResources } from '@/components/common/article-resources';
import { ArticleCommentsBlock } from '@/components/app-layout/article-comments';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { exampleSelfAssessmentQuestions } from '@/config/self-assessment-questions';
import { exampleArticleResources } from '@/config/article-resources';

// Разрешённые origin для postMessage
const ALLOWED_ORIGINS = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  process.env.NEXT_PUBLIC_ADMIN_URL,
].filter(Boolean) as string[];

const MOCK_THREADS: [] = [];

interface PreviewArticleData {
  h1: string;
  subtitle: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
}

/**
 * Preview-роут для iframe-предпросмотра из админки.
 *
 * Принимает данные статьи через postMessage и рендерит их
 * теми же компонентами, что и публичный фронтенд.
 */
export default function PreviewPage() {
  const [article, setArticle] = useState<PreviewArticleData | null>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    // Валидация origin
    if (!ALLOWED_ORIGINS.includes(event.origin)) return;

    const msg = event.data;
    if (!msg || typeof msg.type !== 'string') return;

    switch (msg.type) {
      case 'preview:update':
        setArticle(msg.data);
        break;

      case 'preview:click': {
        const el = document.elementFromPoint(msg.x, msg.y);
        if (el instanceof HTMLElement) el.click();
        break;
      }

      case 'preview:scroll': {
        // Scroll container is .main-layout (html/body have overflow: hidden)
        const scroller =
          document.querySelector('.main-layout') ?? document.documentElement;
        scroller.scrollBy({ top: msg.deltaY, behavior: 'instant' });
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

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    // Сигнализируем родителю что готовы принимать данные
    window.parent.postMessage({ type: 'preview:ready' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

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
    <AppPageWrapper>
      <main>
        <ArticleHeader
          title={article.h1}
          subtitle={article.subtitle}
          publishedAt={new Date()}
          categoryName={article.category}
        />

        <ArticleLayout layout='one-column'>
          <ArticleContentOneColumn html={article.content} />
          <SelfAssessment questions={exampleSelfAssessmentQuestions} />
          <ArticleResources resources={exampleArticleResources} />
          <ArticleCommentsBlock
            threads={MOCK_THREADS}
            onAddComment={() => {}}
          />
        </ArticleLayout>
      </main>
      <AppFooter />
    </AppPageWrapper>
  );
}
