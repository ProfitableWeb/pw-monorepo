'use client';

import React from 'react';
import Link from 'next/link';
import { LuMessageSquare } from 'react-icons/lu';
import './MyCommentsEmptyState.scss';

/**
 * MyCommentsEmptyState - компонент для состояния "нет комментариев"
 */
export const MyCommentsEmptyState: React.FC = () => {
  return (
    <section className='my-comments-empty-state'>
      <div className='my-comments-empty-state__icon'>
        <LuMessageSquare />
      </div>

      <h1 className='my-comments-empty-state__title'>
        У вас пока нет комментариев
      </h1>

      <p className='my-comments-empty-state__description'>
        Оставьте первый комментарий к статье — перейдите в{' '}
        <Link href='/categories' className='my-comments-empty-state__link'>
          Блог
        </Link>
      </p>

      <div>
        <Link href='/categories' className='my-comments-empty-state__button'>
          Перейти к статьям
        </Link>
      </div>
    </section>
  );
};
