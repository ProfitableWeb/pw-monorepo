'use client';

import React, { useState } from 'react';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { AboutHero } from '@/components/about-page/about-hero';
import { ArticleLayout } from '@/components/common/article-layouts';
import { ArticleContent } from '@/components/common/article-content';
import { TableOfContents } from '@/components/common/table-of-contents';
import { AuthorCard, ProjectCard } from '@/components/common/sidebar-widgets';
import { NewsletterForm } from '@/components/common/newsletter-form';
import { aboutContent } from '@/config/about-content';

/**
 * AboutPageClient - клиентский компонент для страницы "О проекте"
 *
 * Использует новую универсальную систему ArticleLayout:
 * - ArticleLayout: wrapper компонент с выбором layout'а
 * - ArticleContent: рендеринг HTML контента
 * - TableOfContents: оглавление слева
 * - AuthorCard: информация об авторе справа
 */
export const AboutPageClient: React.FC = () => {
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  return (
    <div className='about-page' suppressHydrationWarning>
      <AppBar />
      <AppPageWrapper>
        <main>
          {/* Hero секция */}
          <AboutHero
            title={aboutContent.hero.title}
            subtitle={aboutContent.hero.subtitle}
          />

          {/* Универсальный layout с TOC и Sidebar */}
          <ArticleLayout
            layout='three-column'
            toc={<TableOfContents items={aboutContent.tocItems} />}
            sidebar={
              <>
                <AuthorCard />
                <ProjectCard onSubscribeClick={() => setIsNewsletterModalOpen(true)} />
              </>
            }
          >
            {/* HTML контент из конфига (как будет приходить из БД) */}
            <ArticleContent html={aboutContent.content} />
          </ArticleLayout>
        </main>
        <AppFooter />
      </AppPageWrapper>

      {/* Модальное окно подписки */}
      <NewsletterForm
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
      />
    </div>
  );
};
