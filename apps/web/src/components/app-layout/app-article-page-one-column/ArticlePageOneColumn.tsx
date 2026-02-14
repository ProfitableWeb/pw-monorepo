'use client';

import React, { useState, useCallback } from 'react';
import { ArticleCommentThread, Comment } from '@profitable-web/types';
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
import { oneColumnArticleContent } from '@/config/one-column-article-content';
import { exampleSelfAssessmentQuestions } from '@/config/self-assessment-questions';
import { exampleArticleResources } from '@/config/article-resources';
import './ArticlePageOneColumn.scss';

const ARTICLE_SLUG = 'one-column-article';

interface ArticlePageOneColumnProps {
  initialThreads: ArticleCommentThread[];
}

/**
 * ArticlePageOneColumn - пример страницы с одноколоночным лейаутом
 *
 * Демонстрирует использование одноколоночного лейаута для статей
 * с блоками 100% ширины и блоком комментариев.
 *
 * @component
 * @returns {JSX.Element} Страница статьи с одноколоночным лейаутом
 */
export const ArticlePageOneColumn = ({
  initialThreads,
}: ArticlePageOneColumnProps) => {
  const { user } = useAuth();
  const [threads, setThreads] =
    useState<ArticleCommentThread[]>(initialThreads);

  const handleAddComment = useCallback(
    (content: string, parentId?: string) => {
      if (!user) return;
      const now = new Date().toISOString();
      const newComment: Comment = {
        id: `temp-${Date.now()}`,
        userId: 'current-user',
        userName: user.name,
        userAvatar: user.avatar,
        articleId: ARTICLE_SLUG,
        articleSlug: ARTICLE_SLUG,
        articleTitle: oneColumnArticleContent.title,
        content,
        createdAt: now,
        ...(parentId && { parentId }),
      };
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
    },
    [user]
  );

  return (
    <div className='article-page-one-column'>
      <AppBar />
      <AppPageWrapper>
        <main>
          {/* Заголовок статьи */}
          <ArticleHeader
            title={oneColumnArticleContent.title}
            subtitle={oneColumnArticleContent.subtitle}
            publishedAt={new Date(oneColumnArticleContent.publishedAt)}
            categorySlug={oneColumnArticleContent.categorySlug}
            categoryName={oneColumnArticleContent.categoryName}
          />

          {/* Одноколоночный лейаут с контентом */}
          <ArticleLayout layout='one-column'>
            <ArticleContentOneColumn html={oneColumnArticleContent.content} />

            {/* Блок самопроверки */}
            <SelfAssessment questions={exampleSelfAssessmentQuestions} />

            {/* Блок ресурсов */}
            <ArticleResources resources={exampleArticleResources} />

            {/* Блок комментариев */}
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
