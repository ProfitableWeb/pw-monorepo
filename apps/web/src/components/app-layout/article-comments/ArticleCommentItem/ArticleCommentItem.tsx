'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Comment } from '@profitable-web/types';
import { useAuth } from '@/contexts/auth';
import { formatRelativeTime } from '../utils/formatRelativeTime';
import './ArticleCommentItem.scss';

interface ArticleCommentItemProps {
  root: Comment;
  replies: Comment[];
  onAddReply: (content: string, parentId: string) => void;
  /** При клике «Ответить» — форма ответа показывается в Block с анимацией */
  onReply?: (comment: Comment) => void;
}

export function ArticleCommentItem({
  root,
  replies,
  onAddReply,
  onReply,
}: ArticleCommentItemProps) {
  const { user } = useAuth();
  const [avatarError, setAvatarError] = useState(false);
  const avatarInitial = root.userName.charAt(0).toUpperCase();
  const avatarUrl = useMemo(
    () => user?.avatar ?? root.userAvatar,
    [user?.avatar, root.userAvatar]
  );

  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  return (
    <article className='article-comment-item'>
      <div className='article-comment-item__header'>
        <div className='article-comment-item__author'>
          <div className='article-comment-item__avatar-wrapper'>
            {avatarUrl && !avatarError ? (
              <img
                src={avatarUrl}
                alt={root.userName}
                width={32}
                height={32}
                className='article-comment-item__avatar'
                onError={() => setAvatarError(true)}
                loading='lazy'
              />
            ) : (
              <span className='article-comment-item__avatar-fallback'>
                {avatarInitial}
              </span>
            )}
          </div>
          <span className='article-comment-item__author-name'>
            {root.userName}
          </span>
        </div>
        <time
          className='article-comment-item__time'
          dateTime={root.createdAt}
          title={new Date(root.createdAt).toLocaleString('ru-RU')}
        >
          {formatRelativeTime(root.createdAt)}
        </time>
      </div>
      <p className='article-comment-item__content'>{root.content}</p>
      {user && onReply && (
        <div className='article-comment-item__actions'>
          <button
            type='button'
            className='article-comment-item__reply-btn'
            onClick={() => onReply(root)}
            aria-label={`Ответить на комментарий ${root.userName}`}
          >
            Ответить
          </button>
        </div>
      )}
    </article>
  );
}
