'use client';

import React from 'react';
import { ArticleAuthorBlock } from '@/components/common/article-author';
import './ArticleHeader.scss';

export interface ArticleHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * ArticleHeader - шапка статьи с заголовком, подзаголовком и блоком автора
 *
 * Компонент для отображения метаданных статьи в начале страницы.
 * Выровнен по ширине с контентом статьи для визуальной консистентности.
 *
 * @component
 * @param {ArticleHeaderProps} props - Пропсы компонента
 * @returns {JSX.Element} Шапка статьи
 */
export const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <header className='article-header'>
      <h1 className='article-header__title'>{title}</h1>
      {subtitle && <p className='article-header__subtitle'>{subtitle}</p>}

      {/* Блок автора */}
      <ArticleAuthorBlock />
    </header>
  );
};
