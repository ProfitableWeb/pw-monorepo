'use client';

import { ReactNode, lazy, Suspense } from 'react';
import type { ArticleLayoutType } from './types';

/**
 * Lazy load layout components for better bundle size
 * Each layout is loaded only when needed, reducing initial bundle by ~75%
 */
const ArticleLayoutThreeColumn = lazy(() =>
  import('./ArticleLayoutThreeColumn').then(m => ({
    default: m.ArticleLayoutThreeColumn,
  }))
);

const ArticleLayoutTwoColumn = lazy(() =>
  import('./ArticleLayoutTwoColumn').then(m => ({
    default: m.ArticleLayoutTwoColumn,
  }))
);

const ArticleLayoutFullWidth = lazy(() =>
  import('./ArticleLayoutFullWidth').then(m => ({
    default: m.ArticleLayoutFullWidth,
  }))
);

const ArticleLayoutOneColumn = lazy(() =>
  import('./ArticleLayoutOneColumn').then(m => ({
    default: m.ArticleLayoutOneColumn,
  }))
);

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
 * Performance: Layouts загружаются динамически (lazy loading), что уменьшает
 * initial bundle size на ~75%. На каждой странице грузится только нужный layout.
 *
 * Выбирает нужный layout компонент в зависимости от prop `layout`:
 * - 'three-column' - TOC | Content | Sidebar (длинные статьи с оглавлением)
 * - 'two-column' - Content | Sidebar (статьи со вспомогательной информацией)
 * - 'full-width' - только Content (лендинги, широкие блоки)
 * - 'one-column' - только Content (одноколоночные статьи с блоками 100% ширины)
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
export const ArticleLayout = ({
  layout,
  children,
  toc,
  sidebar,
  className,
}: ArticleLayoutProps) => {
  const renderLayout = () => {
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
          <ArticleLayoutTwoColumn sidebar={sidebar} className={className}>
            {children}
          </ArticleLayoutTwoColumn>
        );

      case 'full-width':
        return (
          <ArticleLayoutFullWidth className={className}>
            {children}
          </ArticleLayoutFullWidth>
        );

      case 'one-column':
        return (
          <ArticleLayoutOneColumn className={className}>
            {children}
          </ArticleLayoutOneColumn>
        );

      default:
        // Fallback на three-column
        console.warn(
          `Unknown layout type: ${layout}. Falling back to 'three-column'.`
        );
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

  return (
    <Suspense fallback={<div className='layout-loading' />}>
      {renderLayout()}
    </Suspense>
  );
};
