'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArticleCommentThread, Comment } from '@profitable-web/types';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/common/form-controls';
import { ArticleCommentItem } from '../ArticleCommentItem';
import { ArticleCommentReplies } from '../ArticleCommentReplies';
import { ArticleCommentForm } from '../ArticleCommentForm';
import { ArticleCommentsBlockSkeleton } from './ArticleCommentsBlockSkeleton';
import './ArticleCommentsBlock.scss';

interface ArticleCommentsBlockProps {
  threads: ArticleCommentThread[];
  onAddComment: (content: string, parentId?: string) => void;
  /** Показывать skeleton вместо списка комментариев */
  loading?: boolean;
}

export function ArticleCommentsBlock({
  threads,
  onAddComment,
  loading = false,
}: ArticleCommentsBlockProps) {
  const { user } = useAuth();
  const formSectionRef = useRef<HTMLDivElement>(null);
  const inlineReplyFormRef = useRef<HTMLDivElement>(null);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [closingReplyId, setClosingReplyId] = useState<string | null>(null);

  // Прокрутка к форме ответа при открытии (после появления в DOM)
  useEffect(() => {
    if (!replyingTo || closingReplyId) return;
    const id = requestAnimationFrame(() => {
      inlineReplyFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
    return () => cancelAnimationFrame(id);
  }, [replyingTo, closingReplyId]);

  const totalCommentCount = threads.reduce(
    (acc, t) => acc + 1 + t.replies.length,
    0
  );

  const scrollToForm = useCallback(() => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSubmit = useCallback(
    (content: string, parentId?: string) => {
      onAddComment(content, parentId);
      setReplyingTo(null);
    },
    [onAddComment]
  );

  const handleCancelReply = useCallback((commentId: string) => {
    setClosingReplyId(commentId);
    setTimeout(() => {
      setReplyingTo(null);
      setClosingReplyId(null);
    }, 300);
  }, []);

  return (
    <section
      className='article-comments-block'
      aria-labelledby='article-comments-title'
    >
      <div className='article-comments-block__header'>
        <h2
          id='article-comments-title'
          className='article-comments-block__title'
        >
          Комментарии
        </h2>
        {!loading && totalCommentCount > 3 && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={scrollToForm}
            aria-label='Перейти к форме добавления комментария'
          >
            Добавить комментарий
          </Button>
        )}
      </div>

      {loading ? (
        <ArticleCommentsBlockSkeleton />
      ) : (
        <div className='article-comments-block__list' role='list'>
          {threads.length === 0 ? (
            <p className='article-comments-block__empty'>
              Пока нет комментариев. Будьте первым!
            </p>
          ) : (
            threads.map(({ root, replies }) => (
              <div key={root.id} className='article-comments-block__thread'>
                <ArticleCommentItem
                  root={root}
                  replies={replies}
                  onAddReply={onAddComment}
                  onReply={user ? () => setReplyingTo(root) : undefined}
                />
                {user && replyingTo?.id === root.id && (
                  <div
                    ref={inlineReplyFormRef}
                    className={`article-comments-block__inline-reply ${
                      closingReplyId === root.id
                        ? 'article-comments-block__inline-reply--closing'
                        : ''
                    }`}
                    role='region'
                    aria-label='Форма ответа на комментарий'
                  >
                    <ArticleCommentForm
                      replyingTo={replyingTo}
                      onSubmit={handleSubmit}
                      onCancelReply={() => handleCancelReply(root.id)}
                    />
                  </div>
                )}
                {replies.length > 0 && (
                  <ArticleCommentReplies
                    replies={replies}
                    defaultVisible={3}
                    onReply={content => onAddComment(content, root.id)}
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}

      {!loading && (
        <div
          ref={formSectionRef}
          id='article-comments-form'
          className='article-comments-block__form-section'
        >
          {user ? (
            <ArticleCommentForm onSubmit={onAddComment} />
          ) : (
            <p className='article-comments-block__guest-cta'>
              <Link
                href='/log-in'
                className='article-comments-block__guest-link'
              >
                Войдите
              </Link>
              , чтобы оставить комментарий.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
