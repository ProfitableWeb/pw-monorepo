'use client';

import React from 'react';
import './ArticleCommentsBlockSkeleton.scss';

const SKELETON_ITEMS = 3;

/**
 * Skeleton загрузки блока комментариев: повторяет структуру карточек (аватар, имя, время, текст)
 */
export function ArticleCommentsBlockSkeleton() {
  return (
    <div
      className='article-comments-block-skeleton'
      role='status'
      aria-label='Загрузка комментариев'
    >
      <div className='article-comments-block-skeleton__list'>
        {Array.from({ length: SKELETON_ITEMS }, (_, i) => (
          <div key={i} className='article-comments-block-skeleton__item'>
            <div className='article-comments-block-skeleton__header'>
              <div className='article-comments-block-skeleton__author'>
                <div className='article-comments-block-skeleton__avatar' />
                <div className='article-comments-block-skeleton__name' />
              </div>
              <div className='article-comments-block-skeleton__time' />
            </div>
            <div className='article-comments-block-skeleton__content'>
              <div className='article-comments-block-skeleton__line article-comments-block-skeleton__line--full' />
              <div className='article-comments-block-skeleton__line article-comments-block-skeleton__line--medium' />
              {i === 0 && (
                <div className='article-comments-block-skeleton__line article-comments-block-skeleton__line--short' />
              )}
            </div>
            {i !== 2 && (
              <div className='article-comments-block-skeleton__reply' />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
