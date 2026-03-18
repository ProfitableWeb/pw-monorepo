'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArticleHeader } from '@/components/app-layout/app-article-page-one-column/article-header';
import { ArticleContentOneColumn } from '@/components/common/article-content';
import { ArticleLayout } from '@/components/common/article-layouts';
import { SelfAssessment } from '@/components/common/self-assessment/SelfAssessment';
import { ArticleResources } from '@/components/common/article-resources/ArticleResources';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';

// Разрешённые origin для postMessage
const ALLOWED_ORIGINS = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  process.env.NEXT_PUBLIC_ADMIN_URL,
  typeof window !== 'undefined' ? window.location.origin : '',
].filter(Boolean) as string[];

interface SelfCheckItem {
  id: string;
  question: string;
  answer: string;
}

interface SourceItem {
  id: string;
  title: string;
  url: string;
  type: string;
}

interface ArtifactsData {
  selfCheck: { enabled: boolean; items: SelfCheckItem[] };
  sources: { enabled: boolean; items: SourceItem[] };
  glossary: {
    enabled: boolean;
    items: { id: string; term: string; definition: string }[];
  };
  provenance: { enabled: boolean; workspaceId: string; showLink: boolean };
}

interface PreviewArticleData {
  h1: string;
  subtitle: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  artifacts?: ArtifactsData;
}

/**
 * Preview-роут для iframe-предпросмотра из админки.
 *
 * Принимает данные статьи через postMessage и рендерит их
 * теми же компонентами, что и публичный фронтенд.
 *
 * @see apps/admin/src/app/types/article-editor.ts — PreviewArticleData, ArtifactsData
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

  const { artifacts } = article;

  // Вопросы для самопроверки — рендерим если секция включена и есть непустые вопросы
  const selfCheckQuestions =
    artifacts?.selfCheck?.enabled && artifacts.selfCheck.items.length > 0
      ? artifacts.selfCheck.items.filter(q => q.question.trim())
      : [];

  // Ресурсы — рендерим если секция включена и есть непустые источники
  const resources =
    artifacts?.sources?.enabled && artifacts.sources.items.length > 0
      ? artifacts.sources.items
          .filter(s => s.title.trim() && s.url.trim())
          .map(s => ({ id: s.id, title: s.title, url: s.url, external: true }))
      : [];

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

          {selfCheckQuestions.length > 0 && (
            <SelfAssessment questions={selfCheckQuestions} />
          )}

          {resources.length > 0 && <ArticleResources resources={resources} />}
        </ArticleLayout>
      </main>
      <AppFooter />
    </AppPageWrapper>
  );
}
