'use client';

import React from 'react';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { MasonryGrid } from '@/components/common/masonry';
import { Article } from '@/components/common/masonry/types';
import SocialIcons from '@/components/common/social-icons';
import {
  SOCIAL_LINKS_AUTHOR,
  buildSocialLinks,
} from '@/components/common/social-icons';
import { AUTHOR_FALLBACK } from '@/config/author';
import type { AuthorProfile } from '@/lib/api-client';
import AuthorPageHeader from './author-page-header';
import './AuthorPage.scss';

interface AuthorPageProps {
  author: AuthorProfile | null;
  articles: Article[];
}

/**
 * AuthorPage - компонент страницы автора
 */
export const AuthorPage = ({ author, articles }: AuthorPageProps) => {
  const name = author?.name ?? AUTHOR_FALLBACK.name;
  const bio = author?.bio ?? AUTHOR_FALLBACK.description;
  const email = author?.email ?? AUTHOR_FALLBACK.email;
  const socialLinks = author?.socialLinks
    ? buildSocialLinks(author.socialLinks)
    : SOCIAL_LINKS_AUTHOR;
  const bioParagraphs = bio ? bio.split('\n\n').filter(Boolean) : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description: bio,
    url: `https://profitableweb.ru/author/${author?.id ?? ''}`,
    image: author?.avatar
      ? `https://profitableweb.ru${author.avatar}`
      : `https://profitableweb.ru${AUTHOR_FALLBACK.avatar}`,
    ...(author?.socialLinks && {
      sameAs: Object.values(author.socialLinks),
    }),
  };

  return (
    <div className='author-page'>
      <AppBar />
      <AppPageWrapper>
        <main>
          {/* JSON-LD для SEO */}
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          <AuthorPageHeader author={author} />

          <div className='author-page__container'>
            <div className='author-page__triptych'>
              {/* Блок 1: Биография */}
              <section className='author-page__triptych-item'>
                <h2 className='author-page__section-title'>Об авторе</h2>
                <div className='author-page__bio-text'>
                  {bioParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Блок 2: Контакты */}
              <section className='author-page__triptych-item'>
                <h2 className='author-page__section-title'>Связь</h2>
                <div className='author-page__contacts-minimal'>
                  <p className='author-page__contacts-text'>
                    Открыт для обсуждения новых идей, исследований и
                    сотрудничества.
                  </p>
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className='author-page__email-minimal'
                    >
                      {email}
                    </a>
                  )}
                  <div className='author-page__socials-minimal'>
                    <SocialIcons size='md' links={socialLinks} />
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Статьи автора */}
          {articles.length > 0 && (
            <section className='author-page__articles'>
              <div className='author-page__articles-container'>
                <h2 className='author-page__articles-title'>Статьи автора</h2>
                <div className='author-page__articles-grid'>
                  <MasonryGrid articles={articles} />
                </div>
              </div>
            </section>
          )}
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};
