'use client';

import React from 'react';
import SocialIcons from '@/components/common/social-icons';
import { SOCIAL_LINKS_AUTHOR } from '@/components/common/social-icons';
import './ArticleAuthorMeta.scss';

interface ArticleAuthorMetaProps {
  /**
   * Имя автора
   */
  name: string;
  /**
   * Текст метки (например, "Автор статьи")
   */
  label?: string;
  /**
   * Показывать ли социальные сети
   */
  showSocials?: boolean;
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

/**
 * ArticleAuthorMeta - компонент мета-информации автора (метка, имя, социальные сети)
 */
export const ArticleAuthorMeta = ({
  name,
  label = 'Автор статьи',
  showSocials = true,
  className = '',
}: ArticleAuthorMetaProps) => {
  return (
    <div className={`article-author-meta ${className}`}>
      {label && <span className='article-author-meta__label'>{label}</span>}
      <h3 className='article-author-meta__name'>{name}</h3>
      {showSocials && (
        <div className='article-author-meta__socials'>
          <SocialIcons
            size='md'
            className='article-author-meta__socials-icons'
            links={SOCIAL_LINKS_AUTHOR}
          />
        </div>
      )}
    </div>
  );
};
