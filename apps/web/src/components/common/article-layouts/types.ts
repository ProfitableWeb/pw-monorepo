import { ReactNode } from 'react';

/**
 * Типы layout'ов для статей/страниц
 */
export type ArticleLayoutType =
  | 'three-column'
  | 'two-column'
  | 'full-width'
  | 'one-column';

/**
 * Базовые пропсы для всех layout'ов
 */
export interface BaseArticleLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Пропсы для layout'а с Table of Contents
 */
export interface ArticleLayoutWithTocProps extends BaseArticleLayoutProps {
  toc?: ReactNode;
}

/**
 * Пропсы для layout'а с Sidebar
 */
export interface ArticleLayoutWithSidebarProps extends BaseArticleLayoutProps {
  sidebar?: ReactNode;
}

/**
 * Пропсы для полного layout'а (TOC + Sidebar)
 */
export interface ArticleLayoutFullProps
  extends ArticleLayoutWithTocProps, ArticleLayoutWithSidebarProps {}
