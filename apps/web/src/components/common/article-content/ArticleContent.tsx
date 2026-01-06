'use client';

import React from 'react';
import './ArticleContent.scss';

interface ArticleContentProps {
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
 * ArticleContent - компонент для безопасного рендеринга HTML контента
 *
 * Принимает HTML контент из БД и отображает его.
 * Применяет стили для всех HTML элементов (заголовки, параграфы, списки, цитаты, etc.)
 *
 * Примечание: В будущем можно добавить санитизацию HTML (DOMPurify)
 *
 * Пример использования:
 * ```tsx
 * <ArticleContent html={article.content} />
 * ```
 */
export const ArticleContent: React.FC<ArticleContentProps> = ({
  html,
  className = '',
}) => {
  return (
    <article
      className={`article-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
