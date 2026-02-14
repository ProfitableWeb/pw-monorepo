'use client';

import React from 'react';
import './ArticleAuthorAvatar.scss';

interface ArticleAuthorAvatarProps {
  /**
   * URL изображения аватара
   */
  src: string;
  /**
   * Альтернативный текст для изображения
   */
  alt: string;
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

/**
 * ArticleAuthorAvatar - компонент аватара автора
 */
export const ArticleAuthorAvatar = ({
  src,
  alt,
  className = '',
}: ArticleAuthorAvatarProps) => {
  return (
    <div className={`article-author-avatar ${className}`}>
      <img src={src} alt={alt} className='article-author-avatar__img' />
    </div>
  );
};
