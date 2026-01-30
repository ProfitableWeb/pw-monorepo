'use client';

import React from 'react';
import './ArticleAuthorDivider.scss';

interface ArticleAuthorDividerProps {
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

/**
 * ArticleAuthorDivider - компонент разделителя между блоками
 */
export const ArticleAuthorDivider: React.FC<ArticleAuthorDividerProps> = ({
  className = '',
}) => {
  return (
    <span
      className={`article-author-divider ${className}`}
      aria-hidden='true'
    />
  );
};
