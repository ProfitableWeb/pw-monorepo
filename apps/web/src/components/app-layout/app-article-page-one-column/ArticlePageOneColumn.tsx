'use client';

import React from 'react';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { ArticleLayout } from '@/components/common/article-layouts';
import { ArticleContentOneColumn } from '@/components/common/article-content';
import { SelfAssessment } from '@/components/common/self-assessment';
import { ArticleResources } from '@/components/common/article-resources';
import { ArticleHeader } from './article-header';
import { oneColumnArticleContent } from '@/config/one-column-article-content';
import { exampleSelfAssessmentQuestions } from '@/config/self-assessment-questions';
import { exampleArticleResources } from '@/config/article-resources';
import './ArticlePageOneColumn.scss';

/**
 * ArticlePageOneColumn - пример страницы с одноколоночным лейаутом
 *
 * Демонстрирует использование одноколоночного лейаута для статей
 * с блоками 100% ширины.
 *
 * @component
 * @returns {JSX.Element} Страница статьи с одноколоночным лейаутом
 */
export const ArticlePageOneColumn: React.FC = () => {
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
          </ArticleLayout>
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};
