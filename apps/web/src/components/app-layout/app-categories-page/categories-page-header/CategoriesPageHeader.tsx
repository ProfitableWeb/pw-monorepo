'use client';

import React from 'react';
import { motion } from 'framer-motion';
import './CategoriesPageHeader.scss';

/**
 * CategoriesPageHeader - шапка страницы категорий
 *
 * Отображает заголовок и описание страницы
 * Оптимизировано для SEO с ключевыми словами и структурированной информацией
 */
export const CategoriesPageHeader = () => {
  return (
    <motion.header
      className='categories-page-header'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className='categories-page-header__title'>Рубрики статей</h1>
      <p className='categories-page-header__description'>
        Исследовательская лаборатория, где разные домены знаний соединяются для
        построения эффективных веб-проектов.
      </p>
    </motion.header>
  );
};

export default CategoriesPageHeader;
