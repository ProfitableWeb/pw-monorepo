'use client';

import React from 'react';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppHomeHeroHeader from '@/components/app-layout/app-home-page/app-home-hero-header';
import AppFooter from '@/components/app-layout/app-footer';
import { MasonryGrid } from '@/components/common/masonry';
import { PageSpinner } from '@/components/common/spinner';
import { Article } from '@/components/common/masonry/types';

interface AppHomePageProps {
  articles: Article[];
}

/**
 * Client Component для главной страницы
 * Получает данные статей из Server Component
 */
const AppHomePage = ({ articles }: AppHomePageProps) => {
  return (
    <div className='home-page'>
      {/*
        Hero и карточки приходят с сервера с opacity: 0 (framer-motion) —
        до гидратации вся область между аппбаром и футером пустая
      */}
      <PageSpinner />
      <AppBar />
      <AppPageWrapper>
        <main>
          <AppHomeHeroHeader />
          <MasonryGrid articles={articles} />
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};

export default AppHomePage;
