'use client';

import React from 'react';
import './ArticleContentOneColumn.scss';

interface ArticleContentOneColumnProps {
  /**
   * HTML контент статьи (из БД)
   */
  html: string;

  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

/**
 * ArticleContentOneColumn - компонент для одноколоночного контента
 *
 * Отличается от ArticleContent тем, что:
 * - Параграфы и списки могут быть 100% ширины (без ограничения max-width: 75ch)
 * - Поддерживает блоки на всю ширину для широких элементов (изображения, таблицы, etc.)
 * - Использует те же стили элементов оформления текста (заголовки, цитаты, код, etc.)
 *
 * Пример использования:
 * ```tsx
 * <ArticleContentOneColumn html={article.content} />
 * ```
 */
export const ArticleContentOneColumn: React.FC<
  ArticleContentOneColumnProps
> = ({ html, className = '' }) => {
  return (
    <article
      className={`article-content-one-column ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
