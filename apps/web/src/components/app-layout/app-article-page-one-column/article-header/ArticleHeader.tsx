'use client';

import React from 'react';
import { ArticleAuthorBlock } from '@/components/common/article-author';
import { ArticleMeta } from '@/components/common/article-meta';
import './ArticleHeader.scss';

export interface ArticleHeaderProps {
  title: string;
  subtitle?: string;
  /** Дата публикации — при наличии показывается с категорией */
  publishedAt?: Date;
  categorySlug?: string;
  categoryName?: string;
}

/**
 * ArticleHeader - шапка статьи с заголовком, подзаголовком и блоком автора
 *
 * Компонент для отображения метаданных статьи в начале страницы.
 * Выровнен по ширине с контентом статьи для визуальной консистентности.
 *
 * @component
 * @param {ArticleHeaderProps} props - Пропсы компонента
 * @returns {JSX.Element} Шапка статьи
 */
export const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title,
  subtitle,
  publishedAt,
  categorySlug,
  categoryName,
}) => {
  return (
    <header className='article-header'>
      <h1 className='article-header__title'>{title}</h1>
      {subtitle && <p className='article-header__subtitle'>{subtitle}</p>}

      {/* Дата и категория (мелкий светло-серый шрифт, категория — ссылка) */}
      {publishedAt && (
        <ArticleMeta
          publishedAt={publishedAt}
          categorySlug={categorySlug}
          categoryName={categoryName}
          className='article-header__meta'
        />
      )}

      {/* Блок автора */}
      <ArticleAuthorBlock />
    </header>
  );
};
