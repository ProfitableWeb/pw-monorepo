'use client';

import React, { useMemo, useState, useEffect } from 'react';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import CategoriesPageHeader from './categories-page-header';
import CategoryCard from './category-card';
import { Category } from '@/types';
import './AppCategoriesPage.scss';

export interface AppCategoriesPageProps {
  categories: Category[];
}

/**
 * Распределяет категории по колонкам используя shortest column first алгоритм
 */
function distributeCategories(
  categories: Category[],
  columnCount: number
): Category[][] {
  const columns: Category[][] = Array.from({ length: columnCount }, () => []);
  const columnHeights: number[] = Array(columnCount).fill(0);

  categories.forEach(category => {
    const shortestColumnIndex = columnHeights.indexOf(
      Math.min(...columnHeights)
    );

    columns[shortestColumnIndex]?.push(category);

    // Оцениваем высоту категории (базовая формула)
    let height = 100; // заголовок + подзаголовок
    if (category.description) {
      const descLength = category.description.replace(/<[^>]*>/g, '').length;
      height += Math.ceil(descLength / 50) * 20; // ~50 символов на строку
    }
    height += 30; // padding-bottom

    if (columnHeights[shortestColumnIndex] !== undefined) {
      columnHeights[shortestColumnIndex] += height;
    }
  });

  return columns;
}

/**
 * Определяет количество колонок в зависимости от ширины экрана
 */
function getColumnCount(): number {
  if (typeof window === 'undefined') return 3;
  const width = window.innerWidth;
  if (width < 768) return 1;
  if (width < 1024) return 2;
  return 3;
}

/**
 * Client Component для страницы категорий
 * Получает данные категорий из Server Component
 */
const AppCategoriesPage: React.FC<AppCategoriesPageProps> = ({
  categories,
}) => {
  const [columnCount, setColumnCount] = useState(3);
  const [isMounted, setIsMounted] = useState(false);

  // Эффект для определения количества колонок и предотвращения hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const updateColumnCount = () => {
      setColumnCount(getColumnCount());
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  // Распределяем категории по колонкам
  const effectiveColumnCount = isMounted ? columnCount : 3;
  const columns = useMemo(
    () => distributeCategories(categories, effectiveColumnCount),
    [categories, effectiveColumnCount]
  );

  return (
    <div className='categories-page'>
      <AppBar />
      <AppPageWrapper>
        <main>
          <CategoriesPageHeader />
          <section className='categories-page__content'>
            <div className='categories-page__grid'>
              {columns.map((column, columnIndex) => (
                <div key={columnIndex} className='categories-page__column'>
                  {column.map((category, index) => {
                    const globalIndex = columnIndex + index * columns.length;
                    return (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        index={globalIndex}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};

export default AppCategoriesPage;
