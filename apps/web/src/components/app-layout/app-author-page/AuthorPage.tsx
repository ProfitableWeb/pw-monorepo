'use client';

import React from 'react';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { MasonryGrid } from '@/components/common/masonry';
import { Article } from '@/components/common/masonry/types';
import SocialIcons from '@/components/common/social-icons';
import { SOCIAL_LINKS_AUTHOR } from '@/components/common/social-icons';
import { AUTHOR_DATA, AUTHOR_SCHEMA } from '@/config/author';
import AuthorPageHeader from './author-page-header';
import './AuthorPage.scss';

interface AuthorPageProps {
  articles: Article[];
}

/**
 * AuthorPage - компонент страницы автора
 */
export const AuthorPage = ({ articles }: AuthorPageProps) => {
  return (
    <div className='author-page'>
      <AppBar />
      <AppPageWrapper>
        <main>
          {/* JSON-LD для SEO */}
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(AUTHOR_SCHEMA) }}
          />

          <AuthorPageHeader />

          <div className='author-page__container'>
            <div className='author-page__triptych'>
              {/* Блок 1: Биография */}
              <section className='author-page__triptych-item'>
                <h2 className='author-page__section-title'>Об авторе</h2>
                <div className='author-page__bio-text'>
                  {AUTHOR_DATA.bio.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Блок 2: Специализация */}
              <section className='author-page__triptych-item'>
                <h2 className='author-page__section-title'>Фокус</h2>
                <div className='author-page__specialization'>
                  {AUTHOR_DATA.specialization.map((item, index) => (
                    <div key={index} className='author-page__spec-item'>
                      <span className='author-page__spec-label'>
                        {item.label}
                      </span>
                      <p className='author-page__spec-value'>{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Блок 3: Контакты */}
              <section className='author-page__triptych-item'>
                <h2 className='author-page__section-title'>Связь</h2>
                <div className='author-page__contacts-minimal'>
                  <p className='author-page__contacts-text'>
                    Открыт для обсуждения новых идей, исследований и
                    сотрудничества.
                  </p>
                  <a
                    href={`mailto:${AUTHOR_DATA.email}`}
                    className='author-page__email-minimal'
                  >
                    {AUTHOR_DATA.email}
                  </a>
                  <div className='author-page__socials-minimal'>
                    <SocialIcons size='md' links={SOCIAL_LINKS_AUTHOR} />
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
