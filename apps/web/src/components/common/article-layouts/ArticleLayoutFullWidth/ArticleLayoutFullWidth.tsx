import React, { memo } from 'react';
import clsx from 'clsx';
import type { BaseArticleLayoutProps } from '../types';
import './ArticleLayoutFullWidth.scss';

/**
 * Full-Width Layout: только контент на всю ширину
 *
 * Server Component: этот компонент чисто презентационный (нет state/effects),
 * поэтому может быть server component для лучшего SSR performance.
 *
 * Performance: React.memo предотвращает лишние re-renders когда props не меняются.
 *
 * Используется для лендингов, широких блоков, галерей.
 * Текстовые блоки внутри могут ограничиваться по ширине и центрироваться.
 * Поддержка газетной вёрстки (многоколоночный текст).
 *
 * Примечание: контент занимает всю доступную ширину контейнера,
 * но отдельные элементы (текстовые блоки) могут иметь ограничение max-width.
 */
export const ArticleLayoutFullWidth = memo<BaseArticleLayoutProps>(
  ({ children, className }) => {
    return (
      <div className={clsx('article-layout-full-width', className)}>
        <main className='article-layout-full-width__content'>{children}</main>
      </div>
    );
  }
);

ArticleLayoutFullWidth.displayName = 'ArticleLayoutFullWidth';
