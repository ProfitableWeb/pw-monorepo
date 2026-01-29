'use client';

import React, { useState } from 'react';
import { Comment } from '@profitable-web/types';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/common/form-controls';
import './ArticleCommentForm.scss';

interface ArticleCommentFormProps {
  replyingTo?: Comment | null;
  onSubmit: (content: string, parentId?: string) => void;
  onCancelReply?: () => void;
}

export function ArticleCommentForm({
  replyingTo,
  onSubmit,
  onCancelReply,
}: ArticleCommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    onSubmit(trimmed, replyingTo?.id);
    setContent('');
    onCancelReply?.();
  };

  const placeholder = replyingTo
    ? `Ответ на комментарий ${replyingTo.userName}...`
    : 'Написать комментарий...';

  return (
    <form
      className='article-comment-form'
      onSubmit={handleSubmit}
      noValidate
      aria-label={
        replyingTo ? 'Форма ответа на комментарий' : 'Форма нового комментария'
      }
    >
      {replyingTo && (
        <div id='reply-hint' className='article-comment-form__reply-hint'>
          <span>Ответ на комментарий {replyingTo.userName}</span>
          {onCancelReply && (
            <button
              type='button'
              className='article-comment-form__cancel-reply'
              onClick={onCancelReply}
              aria-label='Отменить ответ'
            >
              Отмена
            </button>
          )}
        </div>
      )}
      <div className='article-comment-form__author'>
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            width={32}
            height={32}
            className='article-comment-form__avatar'
          />
        ) : (
          <span className='article-comment-form__avatar-fallback'>
            {user?.name?.charAt(0).toUpperCase() ?? '?'}
          </span>
        )}
        <span className='article-comment-form__author-name'>{user?.name}</span>
      </div>
      <textarea
        className='article-comment-form__textarea'
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={placeholder}
        rows={4}
        aria-label='Текст комментария'
        aria-describedby={replyingTo ? 'reply-hint' : undefined}
      />
      <div className='article-comment-form__actions'>
        <span
          className='article-comment-form__submit-wrap'
          title={!content.trim() ? 'Введите текст комментария' : undefined}
        >
          <Button
            type='submit'
            variant='outline'
            size='md'
            className='article-comment-form__submit'
            disabled={!content.trim()}
            enableHoverElevation={false}
          >
            {replyingTo ? 'Ответить' : 'Отправить'}
          </Button>
        </span>
      </div>
    </form>
  );
}
