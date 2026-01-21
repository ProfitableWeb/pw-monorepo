'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Comment } from '@profitable-web/types';
import { CommentCard } from './CommentCard';
import './MyCommentsList.scss';

interface MyCommentsListProps {
  comments: Comment[];
}

/**
 * MyCommentsList - контейнер списка комментариев с анимацией stagger
 */
export const MyCommentsList: React.FC<MyCommentsListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className='my-comments-list my-comments-list--empty'>
        <p className='my-comments-list__empty-text'>
          Поиск не дал результатов
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className='my-comments-list'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <div className='my-comments-list__container'>
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </motion.div>
  );
};
