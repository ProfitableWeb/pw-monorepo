'use client';

import React from 'react';
import { motion } from 'framer-motion';
import './MyCommentsPageHeader.scss';

interface MyCommentsPageHeaderProps {
  count: number;
}

/**
 * MyCommentsPageHeader - шапка страницы с количеством комментариев
 */
export const MyCommentsPageHeader: React.FC<MyCommentsPageHeaderProps> = ({
  count,
}) => {
  return (
    <motion.header
      className='my-comments-page-header'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className='my-comments-page-header__container'>
        <motion.h1
          className='my-comments-page-header__title'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          Мои комментарии
        </motion.h1>

        <motion.div
          className='my-comments-page-header__stats'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <span className='my-comments-page-header__stats-label'>
            Всего комментариев:
          </span>
          <span className='my-comments-page-header__stats-badge'>{count}</span>
        </motion.div>
      </div>
    </motion.header>
  );
};
