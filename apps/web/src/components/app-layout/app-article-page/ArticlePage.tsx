'use client';

import React from 'react';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { Article } from '@/components/common/masonry/types';
import { ArticleMeta } from '@/components/common/article-meta';
import { Category } from '@/types';
import './ArticlePage.scss';

export interface ArticlePageProps {
  article: Article;
  /** Категория статьи (для ссылки), при наличии получается в [slug]/page */
  category?: Category | null;
}

/**
 * Заглушка страницы статьи
 *
 * Базовая заглушка для проверки маршрутизации статей.
 * Полноценная реализация будет создана в отдельной задаче.
 *
 * @component
 * @param {ArticlePageProps} props - Свойства компонента
 * @returns {JSX.Element} Заглушка страницы статьи
 */
const ArticlePage = ({ article, category }: ArticlePageProps) => {
  return (
    <div className='article-page'>
      <AppBar />
      <AppPageWrapper>
        <main className='article-page__main'>
          <article className='article-page__content'>
            <header className='article-page__header'>
              <h1 className='article-page__title'>{article.title}</h1>
              <p className='article-page__subtitle'>{article.subtitle}</p>
              <ArticleMeta
                publishedAt={new Date(article.createdAt)}
                categorySlug={article.category}
                categoryName={category?.name}
                className='article-page__meta'
              />
            </header>

            <div className='article-page__body'>
              <p className='article-page__excerpt'>{article.subtitle}</p>

              <div className='article-page__placeholder'>
                <p>
                  🚧 Полноценная страница статьи будет реализована в отдельной
                  задаче
                </p>
                <p>
                  Это заглушка для тестирования маршрутизации /{article.slug}
                </p>
              </div>
            </div>
          </article>
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};

export default ArticlePage;
