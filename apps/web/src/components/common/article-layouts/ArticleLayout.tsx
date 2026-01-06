'use client';

import { ReactNode } from 'react';
import { ArticleLayoutThreeColumn } from './ArticleLayoutThreeColumn';
import { ArticleLayoutTwoColumn } from './ArticleLayoutTwoColumn';
import { ArticleLayoutFullWidth } from './ArticleLayoutFullWidth';
import type { ArticleLayoutType } from './types';

interface ArticleLayoutProps {
  /**
   * Тип layout'а (из БД или хардкод)
   */
  layout: ArticleLayoutType;
  
  /**
   * Контент статьи/страницы
   */
  children: ReactNode;
  
  /**
   * Table of Contents (только для three-column)
   */
  toc?: ReactNode;
  
  /**
   * Sidebar (для three-column и two-column)
   */
  sidebar?: ReactNode;
  
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

/**
 * ArticleLayout - универсальный компонент для отображения статей/страниц
 * 
 * Выбирает нужный layout компонент в зависимости от prop `layout`:
 * - 'three-column' - TOC | Content | Sidebar (длинные статьи с оглавлением)
 * - 'two-column' - Content | Sidebar (статьи со вспомогательной информацией)
 * - 'full-width' - только Content (лендинги, широкие блоки)
 * 
 * Пример использования:
 * ```tsx
 * <ArticleLayout
 *   layout="three-column"
 *   toc={<TableOfContents items={tocItems} />}
 *   sidebar={<AuthorCard />}
 * >
 *   <ArticleContent html={article.content} />
 * </ArticleLayout>
 * ```
 */
export const ArticleLayout: React.FC<ArticleLayoutProps> = ({
  layout,
  children,
  toc,
  sidebar,
  className,
}) => {
  switch (layout) {
    case 'three-column':
      return (
        <ArticleLayoutThreeColumn 
          toc={toc} 
          sidebar={sidebar}
          className={className}
        >
          {children}
        </ArticleLayoutThreeColumn>
      );
    
    case 'two-column':
      return (
        <ArticleLayoutTwoColumn 
          sidebar={sidebar}
          className={className}
        >
          {children}
        </ArticleLayoutTwoColumn>
      );
    
    case 'full-width':
      return (
        <ArticleLayoutFullWidth className={className}>
          {children}
        </ArticleLayoutFullWidth>
      );
    
    default:
      // Fallback на three-column
      console.warn(`Unknown layout type: ${layout}. Falling back to 'three-column'.`);
      return (
        <ArticleLayoutThreeColumn 
          toc={toc} 
          sidebar={sidebar}
          className={className}
        >
          {children}
        </ArticleLayoutThreeColumn>
      );
  }
};
