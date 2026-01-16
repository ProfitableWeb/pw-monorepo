import React, { memo } from 'react';
import clsx from 'clsx';
import type { BaseArticleLayoutProps } from '../types';
import './ArticleLayoutOneColumn.scss';

/**
 * One-Column Layout: только контент в одной колонке
 *
 * Server Component: этот компонент чисто презентационный (нет state/effects),
 * поэтому может быть server component для лучшего SSR performance.
 *
 * Performance: React.memo предотвращает лишние re-renders когда props не меняются.
 *
 * Используется для статей с одноколоночным лейаутом.
 * Контент ограничен max-width: 70ch для оптимальной читаемости (50-75 символов — best practice).
 *
 * Для широких элементов (изображения, таблицы) используйте вспомогательные классы:
 * - .wide-block — расширенный блок (~90ch)
 * - .full-width-block — блок на всю ширину viewport
 *
 * Пример:
 * ```html
 * <p>Обычный текст с оптимальной шириной...</p>
 * <img class="wide-block" src="..." alt="Широкое изображение" />
 * <div class="full-width-block">Контент на всю ширину</div>
 * ```
 *
 * Отличия от full-width:
 * - One-column: оптимизирован для статей, текст ограничен для читаемости
 * - Full-width: для лендингов, газетной вёрстки без ограничений
 */
export const ArticleLayoutOneColumn = memo<BaseArticleLayoutProps>(
  ({ children, className }) => {
    return (
      <div className={clsx('article-layout-one-column', className)}>
        <main className='article-layout-one-column__content'>{children}</main>
      </div>
    );
  }
);

ArticleLayoutOneColumn.displayName = 'ArticleLayoutOneColumn';
