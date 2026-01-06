'use client';

import React from 'react';
import type { BaseArticleLayoutProps } from '../types';
import './ArticleLayoutFullWidth.scss';

/**
 * Full-Width Layout: только контент на всю ширину
 * 
 * Используется для лендингов, широких блоков, галерей.
 * Текстовые блоки внутри могут ограничиваться по ширине и центрироваться.
 * Поддержка газетной вёрстки (многоколоночный текст).
 * 
 * Примечание: контент занимает всю доступную ширину контейнера,
 * но отдельные элементы (текстовые блоки) могут иметь ограничение max-width.
 */
export const ArticleLayoutFullWidth: React.FC<BaseArticleLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`article-layout-full-width ${className}`}>
      <main className="article-layout-full-width__content">
        {children}
      </main>
    </div>
  );
};
