'use client';

import React from 'react';
import Link from 'next/link';
import { LuMessageSquare } from 'react-icons/lu';
import './MyCommentsEmptyState.scss';

interface MyCommentsEmptyStateProps {
  /**
   * Гость видит пустой список не потому, что комментариев нет, а потому что
   * `/users/me/comments` требует авторизации. Показывать ему «у вас пока нет
   * комментариев» — недостоверно.
   */
  unauthenticated?: boolean;
}

/**
 * MyCommentsEmptyState - компонент для состояния "нет комментариев"
 */
export const MyCommentsEmptyState = ({
  unauthenticated = false,
}: MyCommentsEmptyStateProps) => {
  return (
    <section className='my-comments-empty-state'>
      <div className='my-comments-empty-state__icon'>
        <LuMessageSquare />
      </div>

      <h1 className='my-comments-empty-state__title'>
        {unauthenticated
          ? 'Войдите, чтобы увидеть свои комментарии'
          : 'У вас пока нет комментариев'}
      </h1>

      {unauthenticated ? (
        <p className='my-comments-empty-state__description'>
          Список комментариев доступен только владельцу учётной записи. Войдите
          через меню в шапке сайта.
        </p>
      ) : (
        <p className='my-comments-empty-state__description'>
          Оставьте первый комментарий к статье — перейдите в{' '}
          <Link href='/categories' className='my-comments-empty-state__link'>
            Блог
          </Link>
        </p>
      )}

      <div>
        <Link href='/categories' className='my-comments-empty-state__button'>
          Перейти к статьям
        </Link>
      </div>
    </section>
  );
};
