'use client';

import React from 'react';
import type { ArticleLayoutFullProps } from '../types';
import './ArticleLayoutThreeColumn.scss';

/**
 * Three-Column Layout: TOC | Content | Sidebar
 * 
 * Используется для длинных статей с оглавлением и дополнительной информацией.
 * 
 * Breakpoints:
 * - Desktop (>1024px): 3 колонки - TOC (220px) | Content (1fr) | Sidebar (300px)
 * - Tablet (768-1024px): 2 колонки - Content (1fr) | Sidebar (280px), TOC скрыт
 * - Mobile (<768px): 1 колонка - только Content
 */
export const ArticleLayoutThreeColumn: React.FC<ArticleLayoutFullProps> = ({
  children,
  toc,
  sidebar,
  className = '',
}) => {
  return (
    <div className={`article-layout-three-column ${className}`}>
      {/* Table of Contents - слева (только Desktop) */}
      {toc && (
        <aside className="article-layout-three-column__toc" aria-label="Table of contents">
          {toc}
        </aside>
      )}

      {/* Основной контент */}
      <main className="article-layout-three-column__content">
        {children}
      </main>

      {/* Sidebar - справа (Desktop + Tablet) */}
      {sidebar && (
        <aside className="article-layout-three-column__sidebar" aria-label="Sidebar">
          {sidebar}
        </aside>
      )}
    </div>
  );
};
