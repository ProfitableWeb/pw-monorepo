'use client';

import React from 'react';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import CategoryPageHeader from './category-page-header';
import AppFooter from '@/components/app-layout/app-footer';
import { MasonryGrid } from '@/components/common/masonry';
import { Category } from '@/types';
import { Article } from '@/components/common/masonry/types';

export interface AppCategoryPageProps {
  category: Category;
  articles: Article[];
}

/**
 * Client Component для страницы категории
 * Получает данные категории и статей из Server Component
 */
const AppCategoryPage: React.FC<AppCategoryPageProps> = ({
  category,
  articles,
}) => {
  return (
    <div className='category-page'>
      <AppBar />
      <AppPageWrapper>
        <main>
          <CategoryPageHeader category={category} />
          <MasonryGrid articles={articles} />
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};

export default AppCategoryPage;
