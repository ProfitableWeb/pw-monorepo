'use client';

import React, { useState, useCallback } from 'react';
import { ArticleCommentThread } from '@profitable-web/types';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { ArticleLayout } from '@/components/common/article-layouts';
import { ArticleContentOneColumn } from '@/components/common/article-content';
import { SelfAssessment } from '@/components/common/self-assessment';
import { ArticleResources } from '@/components/common/article-resources';
import { ArticleCommentsBlock } from '@/components/app-layout/article-comments';
import { ArticleHeader } from './article-header';
import { useAuth } from '@/contexts/auth';
import { createComment } from '@/lib/api-client';
import { oneColumnArticleContent } from '@/config/one-column-article-content';
import { exampleSelfAssessmentQuestions } from '@/config/self-assessment-questions';
import { exampleArticleResources } from '@/config/article-resources';
import './ArticlePageOneColumn.scss';

const ARTICLE_SLUG = 'one-column-article';

interface ArticlePageOneColumnProps {
  initialThreads: ArticleCommentThread[];
}

export const ArticlePageOneColumn = ({
  initialThreads,
}: ArticlePageOneColumnProps) => {
  const { user } = useAuth();
  const [threads, setThreads] =
    useState<ArticleCommentThread[]>(initialThreads);

  const handleAddComment = useCallback(
    async (content: string, parentId?: string) => {
      if (!user) return;

      try {
        const newComment = await createComment(ARTICLE_SLUG, content, parentId);

        if (parentId) {
          setThreads(prev =>
            prev.map(t =>
              t.root.id === parentId
                ? { ...t, replies: [...t.replies, newComment] }
                : t
            )
          );
        } else {
          setThreads(prev => [...prev, { root: newComment, replies: [] }]);
        }
      } catch {
        // Ошибка авторизации обрабатывается в api-client (refresh + retry)
      }
    },
    [user]
  );

  return (
    <div className='article-page-one-column'>
      <AppBar />
      <AppPageWrapper>
        <main>
          <ArticleHeader
            title={oneColumnArticleContent.title}
            subtitle={oneColumnArticleContent.subtitle}
            publishedAt={new Date(oneColumnArticleContent.publishedAt)}
            categorySlug={oneColumnArticleContent.categorySlug}
            categoryName={oneColumnArticleContent.categoryName}
          />

          <ArticleLayout layout='one-column'>
            <ArticleContentOneColumn html={oneColumnArticleContent.content} />
            <SelfAssessment questions={exampleSelfAssessmentQuestions} />
            <ArticleResources resources={exampleArticleResources} />

            <ArticleCommentsBlock
              threads={threads}
              onAddComment={handleAddComment}
            />
          </ArticleLayout>
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};
