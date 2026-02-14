'use client';

import React from 'react';
import { Comment } from '@profitable-web/types';
import { CommentCard } from './CommentCard';
import './MyCommentsList.scss';

interface MyCommentsListProps {
  comments: Comment[];
}

/**
 * MyCommentsList - контейнер списка комментариев
 */
export const MyCommentsList = ({ comments }: MyCommentsListProps) => {
  if (comments.length === 0) {
    return (
      <div className='my-comments-list my-comments-list--empty'>
        <p className='my-comments-list__empty-text'>Поиск не дал результатов</p>
      </div>
    );
  }

  return (
    <div className='my-comments-list'>
      <div className='my-comments-list__container'>
        {comments.map(comment => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
