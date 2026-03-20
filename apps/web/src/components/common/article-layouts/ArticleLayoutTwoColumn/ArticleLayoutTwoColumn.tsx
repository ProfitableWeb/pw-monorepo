import React, { memo } from 'react';
import clsx from 'clsx';
import type { ArticleLayoutWithSidebarProps } from '../types';
import './ArticleLayoutTwoColumn.scss';

/**
 * Two-Column Layout: Content | Sidebar
 *
 * Server Component: этот компонент чисто презентационный (нет state/effects),
 * поэтому может быть server component для лучшего SSR performance.
 *
 * Performance: React.memo предотвращает лишние re-renders когда props не меняются.
 *
 * Используется для статей со вспомогательной информацией, но без оглавления.
 *
 * Breakpoints:
 * - Desktop (>1024px): 2 колонки - Content (1fr) | Sidebar (300px)
 * - Tablet (768-1024px): 2 колонки - Content (1fr) | Sidebar (280px)
 * - Mobile (<768px): 1 колонка - только Content
 */
export const ArticleLayoutTwoColumn = memo<ArticleLayoutWithSidebarProps>(
  ({ children, sidebar, header, className }) => {
    return (
      <div className={clsx('article-layout-two-column', className)}>
        {/* Шапка статьи — на всю ширину grid */}
        {header && (
          <div className='article-layout-two-column__header'>{header}</div>
        )}

        {/* Основной контент */}
        <main className='article-layout-two-column__content'>{children}</main>

        {/* Sidebar - справа (Desktop + Tablet) */}
        {sidebar && (
          <aside
            className='article-layout-two-column__sidebar'
            aria-label='Sidebar'
          >
            {sidebar}
          </aside>
        )}
      </div>
    );
  }
);

ArticleLayoutTwoColumn.displayName = 'ArticleLayoutTwoColumn';
