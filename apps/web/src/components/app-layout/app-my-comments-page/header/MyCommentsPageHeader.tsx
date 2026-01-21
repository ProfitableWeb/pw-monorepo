'use client';

import React from 'react';
import './MyCommentsPageHeader.scss';

interface MyCommentsPageHeaderProps {
  count: number;
}

/**
 * MyCommentsPageHeader - шапка страницы с количеством комментариев
 */
export const MyCommentsPageHeader: React.FC<MyCommentsPageHeaderProps> = ({
  count,
}) => {
  return (
    <header className='my-comments-page-header'>
      <div className='my-comments-page-header__container'>
        <h1 className='my-comments-page-header__title'>Мои комментарии</h1>

        <div className='my-comments-page-header__stats'>
          <span className='my-comments-page-header__stats-label'>
            Всего комментариев:
          </span>
          <span className='my-comments-page-header__stats-badge'>{count}</span>
        </div>
      </div>
    </header>
  );
};
