'use client';

import React from 'react';
import Link from 'next/link';
import './ArticleMeta.scss';

export interface ArticleMetaProps {
  /**
   * Дата публикации
   */
  publishedAt: Date;
  /**
   * Slug категории
   */
  categorySlug?: string;
  /**
   * Название категории (для отображения)
   */
  categoryName?: string;
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

/**
 * ArticleMeta - компонент мета-данных статьи (дата публикации, категория)
 *
 * Отображается под заголовком статьи или в другом подходящем месте.
 * Дата и категория отображаются мелким светло-серым шрифтом.
 * Ссылка на категорию: подчёркивание через border 1px, при наведении — прозрачно.
 */
export const ArticleMeta: React.FC<ArticleMetaProps> = ({
  publishedAt,
  categorySlug,
  categoryName,
  className = '',
}) => {
  const formatDate = (date: Date): string =>
    date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className={`article-meta ${className}`}>
      <time className='article-meta__date' dateTime={publishedAt.toISOString()}>
        {formatDate(publishedAt)}
      </time>
      {categoryName && <span className='article-meta__separator'>•</span>}
      {categoryName && categorySlug && (
        <Link
          href={`/${categorySlug}`}
          className='article-meta__category'
          prefetch={false}
        >
          {categoryName}
        </Link>
      )}
    </div>
  );
};
