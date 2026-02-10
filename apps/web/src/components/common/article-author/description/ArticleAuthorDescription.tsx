'use client';

import React from 'react';
import './ArticleAuthorDescription.scss';

interface ArticleAuthorDescriptionProps {
  /**
   * Текст описания автора
   */
  description: string;
  /**
   * URL ссылки "Подробнее"
   */
  linkUrl?: string;
  /**
   * Текст ссылки
   */
  linkText?: string;
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

/**
 * ArticleAuthorDescription - компонент описания автора
 */
export const ArticleAuthorDescription: React.FC<
  ArticleAuthorDescriptionProps
> = ({
  description,
  linkUrl = '/author',
  linkText = 'Подробнее',
  className = '',
}) => {
  return (
    <div className={`article-author-description ${className}`}>
      <p className='article-author-description__text'>{description}</p>
      <a href={linkUrl} className='article-author-description__link'>
        {linkText}
      </a>
    </div>
  );
};
