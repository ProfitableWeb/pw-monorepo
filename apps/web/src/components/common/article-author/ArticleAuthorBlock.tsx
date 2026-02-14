'use client';

import React from 'react';
import { AUTHOR_SCHEMA, AUTHOR_DATA } from '@/config/author';
import { ArticleAuthorAvatar } from './avatar';
import { ArticleAuthorMeta } from './meta';
import { ArticleAuthorDivider } from './divider';
import { ArticleAuthorDescription } from './description';
import './ArticleAuthorBlock.scss';

interface ArticleAuthorBlockProps {
  /**
   * Имя автора
   */
  name?: string;
  /**
   * Описание/биография автора
   */
  description?: string;
  /**
   * Должность автора (для SEO)
   */
  jobTitle?: string;
  /**
   * URL изображения аватара
   */
  avatarSrc?: string;
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

// Моковые данные по умолчанию
const DEFAULT_AUTHOR = {
  name: AUTHOR_DATA.name,
  description: AUTHOR_DATA.description,
  jobTitle: AUTHOR_DATA.jobTitle,
  avatarSrc: '/imgs/author/avatar.jpg',
};

/**
 * ArticleAuthorBlock - блок автора статьи
 *
 * Отображается под заголовком статьи.
 * Содержит аватар, имя, социальные сети и описание автора.
 * Включает JSON-LD разметку Person для SEO.
 */
export const ArticleAuthorBlock = ({
  name = DEFAULT_AUTHOR.name,
  description = DEFAULT_AUTHOR.description,
  jobTitle = DEFAULT_AUTHOR.jobTitle,
  avatarSrc = DEFAULT_AUTHOR.avatarSrc,
  className = '',
}: ArticleAuthorBlockProps) => {
  // Формируем JSON-LD разметку для автора
  const jsonLd = {
    ...AUTHOR_SCHEMA,
    name,
    description,
    jobTitle,
  };

  return (
    <div className={`article-author-block ${className}`}>
      {/* JSON-LD для SEO */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Аватар */}
      <ArticleAuthorAvatar src={avatarSrc} alt={name} />

      {/* Мета-информация (метка, имя, социальные сети) */}
      <ArticleAuthorMeta name={name} />

      {/* Разделитель и описание */}
      {description && (
        <>
          <ArticleAuthorDivider />
          <ArticleAuthorDescription description={description} />
        </>
      )}
    </div>
  );
};
