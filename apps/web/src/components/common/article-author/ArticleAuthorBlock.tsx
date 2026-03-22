'use client';

import React from 'react';
import { AUTHOR_SCHEMA, AUTHOR_DATA } from '@/config/author';
import { ArticleAuthorAvatar } from './avatar';
import { ArticleAuthorMeta } from './meta';
import { ArticleAuthorDivider } from './divider';
import { ArticleAuthorDescription } from './description';
import type { Author } from '@/lib/api-client';
import './ArticleAuthorBlock.scss';

interface ArticleAuthorBlockProps {
  author?: Author;
  className?: string;
}

/**
 * ArticleAuthorBlock - блок автора статьи
 *
 * Отображается под заголовком статьи.
 * Содержит аватар, имя и описание автора.
 * Включает JSON-LD разметку Person для SEO.
 */
export const ArticleAuthorBlock = ({
  author,
  className = '',
}: ArticleAuthorBlockProps) => {
  const name = author?.name ?? AUTHOR_DATA.name;
  const description = author?.bio ?? AUTHOR_DATA.description;
  const avatarSrc = author?.avatar ?? '/imgs/author/avatar.jpg';

  const jsonLd = author
    ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name,
        description,
        image: author.avatar,
        sameAs: author.socialLinks
          ? Object.values(author.socialLinks)
          : undefined,
      }
    : AUTHOR_SCHEMA;

  return (
    <div className={`article-author-block ${className}`}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ArticleAuthorAvatar src={avatarSrc} alt={name} />
      <ArticleAuthorMeta name={name} />

      {description && (
        <>
          <ArticleAuthorDivider />
          <ArticleAuthorDescription description={description} />
        </>
      )}
    </div>
  );
};
