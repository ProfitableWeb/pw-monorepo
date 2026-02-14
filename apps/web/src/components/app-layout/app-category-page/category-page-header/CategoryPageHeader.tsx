'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '@/types';
import {
  containerVariants,
  itemVariants,
} from './CategoryPageHeader.animations';
import './CategoryPageHeader.scss';

/**
 * Пропсы для компонента CategoryPageHeader
 */
export interface CategoryPageHeaderProps {
  /**
   * Категория для отображения в шапке
   */
  category: Category;
  /**
   * Дополнительный CSS класс для кастомизации стилей
   * @default ''
   */
  className?: string;
}

/**
 * Компонент шапки страницы категории
 *
 * Отображает название категории, описание и опциональные метаданные.
 * Использует Framer Motion для анимации появления элементов с эффектом stagger.
 * Аналог AppHomeHeroHeader, но упрощенный для категорий.
 *
 * @component
 * @example
 * ```tsx
 * <CategoryPageHeader
 *   category={{
 *     id: '1',
 *     name: 'Экономика внимания',
 *     slug: 'attention-economy',
 *     description: 'Как привлекать и удерживать внимание',
 *   }}
 *   className="custom-header"
 * />
 * ```
 *
 * @param {CategoryPageHeaderProps} props - Свойства компонента
 * @returns {JSX.Element} Анимированная шапка категории
 */
const CategoryPageHeader = ({
  category,
  className = '',
}: CategoryPageHeaderProps) => {
  return (
    <motion.section
      className={`category-page-header ${className}`}
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <div className='category-page-header__container'>
        {/* Главный заголовок - семантический H1 для SEO */}
        <motion.h1
          className='category-page-header__title'
          variants={itemVariants}
        >
          {category.name}
        </motion.h1>
        {/* Описание категории (если есть) */}
        {category.description && (
          <motion.p
            className='category-page-header__description'
            variants={itemVariants}
          >
            {category.description}
          </motion.p>
        )}
      </div>
    </motion.section>
  );
};

export default CategoryPageHeader;
