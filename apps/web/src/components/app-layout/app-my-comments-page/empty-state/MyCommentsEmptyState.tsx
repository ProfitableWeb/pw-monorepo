'use client';

import React from 'react';
import Link from 'next/link';
import { LuMessageSquare } from 'react-icons/lu';
import { motion } from 'framer-motion';
import './MyCommentsEmptyState.scss';

/**
 * MyCommentsEmptyState - компонент для состояния "нет комментариев"
 */
export const MyCommentsEmptyState: React.FC = () => {
  return (
    <motion.section
      className='my-comments-empty-state'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        className='my-comments-empty-state__icon'
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <LuMessageSquare />
      </motion.div>

      <motion.h1
        className='my-comments-empty-state__title'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        У вас пока нет комментариев
      </motion.h1>

      <motion.p
        className='my-comments-empty-state__description'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        Оставьте первый комментарий к статье — перейдите в{' '}
        <Link href='/categories' className='my-comments-empty-state__link'>
          Блог
        </Link>
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Link href='/categories' className='my-comments-empty-state__button'>
          Перейти к статьям
        </Link>
      </motion.div>
    </motion.section>
  );
};
