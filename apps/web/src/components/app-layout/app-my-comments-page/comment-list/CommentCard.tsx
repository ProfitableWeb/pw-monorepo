'use client';

import React, { useState, useMemo, useEffect, memo } from 'react';
import Link from 'next/link';
import { LuMessageSquare } from 'react-icons/lu';
import { Comment } from '@profitable-web/types';
import { useAuth } from '@/contexts/auth';
import './CommentCard.scss';

interface CommentCardProps {
  comment: Comment;
}

/**
 * Утилита для форматирования даты с годом и временем
 * Использует локальное время пользователя
 */
function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * CommentCard - карточка комментария
 */
export const CommentCard = memo(({ comment }: CommentCardProps) => {
  const { user } = useAuth();
  const [avatarError, setAvatarError] = useState(false);
  const avatarInitial = comment.userName.charAt(0).toUpperCase();

  const avatarUrl = useMemo(() => {
    return user?.avatar || comment.userAvatar;
  }, [user?.avatar, comment.userAvatar]);

  // Сбрасываем ошибку при изменении URL аватарки
  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  return (
    <article className='comment-card'>
      <div className='comment-card__header'>
        <div className='comment-card__author'>
          <div className='comment-card__avatar-wrapper'>
            {avatarUrl && !avatarError ? (
              <img
                src={avatarUrl}
                alt={comment.userName}
                width={28}
                height={28}
                className='comment-card__avatar'
                onError={() => setAvatarError(true)}
                loading='lazy'
              />
            ) : (
              <div className='comment-card__avatar-fallback'>
                {avatarInitial}
              </div>
            )}
          </div>
          <span className='comment-card__author-name'>{comment.userName}</span>
        </div>
        <time
          className='comment-card__time'
          dateTime={comment.createdAt}
          title={new Date(comment.createdAt).toLocaleString('ru-RU')}
        >
          {formatDateTime(comment.createdAt)}
        </time>
      </div>

      <p className='comment-card__content'>{comment.content}</p>

      <div className='comment-card__divider' />

      <div className='comment-card__footer'>
        <LuMessageSquare className='comment-card__footer-icon' />
        <span className='comment-card__footer-text'>
          В ответ на:{' '}
          <Link
            href={`/${comment.articleSlug}`}
            className='comment-card__article-link'
          >
            {comment.articleTitle}
          </Link>
        </span>
      </div>
    </article>
  );
});

CommentCard.displayName = 'CommentCard';
