'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LuMessageSquare } from 'react-icons/lu';
import { Comment } from '@profitable-web/types';
import './CommentCard.scss';

interface CommentCardProps {
  comment: Comment;
}

/**
 * Утилита для форматирования относительного времени
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * CommentCard - карточка комментария
 */
export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <motion.article
      className='comment-card'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      <div className='comment-card__header'>
        <div className='comment-card__author'>
          {comment.userAvatar && (
            <div className='comment-card__avatar-wrapper'>
              <Image
                src={comment.userAvatar}
                alt={comment.userName}
                width={28}
                height={28}
                className='comment-card__avatar'
              />
            </div>
          )}
          <span className='comment-card__author-name'>
            {comment.userName}
          </span>
        </div>
        <time
          className='comment-card__time'
          dateTime={comment.createdAt}
          title={new Date(comment.createdAt).toLocaleString('ru-RU')}
        >
          {formatRelativeTime(comment.createdAt)}
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
    </motion.article>
  );
};
