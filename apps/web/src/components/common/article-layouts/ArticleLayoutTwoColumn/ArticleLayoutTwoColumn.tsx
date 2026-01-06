'use client';

import React from 'react';
import type { ArticleLayoutWithSidebarProps } from '../types';
import './ArticleLayoutTwoColumn.scss';

/**
 * Two-Column Layout: Content | Sidebar
 * 
 * Используется для статей со вспомогательной информацией, но без оглавления.
 * 
 * Breakpoints:
 * - Desktop (>1024px): 2 колонки - Content (1fr) | Sidebar (300px)
 * - Tablet (768-1024px): 2 колонки - Content (1fr) | Sidebar (280px)
 * - Mobile (<768px): 1 колонка - только Content
 */
export const ArticleLayoutTwoColumn: React.FC<ArticleLayoutWithSidebarProps> = ({
  children,
  sidebar,
  className = '',
}) => {
  return (
    <div className={`article-layout-two-column ${className}`}>
      {/* Основной контент */}
      <main className="article-layout-two-column__content">
        {children}
      </main>

      {/* Sidebar - справа (Desktop + Tablet) */}
      {sidebar && (
        <aside className="article-layout-two-column__sidebar" aria-label="Sidebar">
          {sidebar}
        </aside>
      )}
    </div>
  );
};
