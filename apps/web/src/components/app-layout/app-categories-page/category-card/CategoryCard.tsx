'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Category } from '@/types';
import './CategoryCard.scss';

interface CategoryCardProps {
  category: Category;
  index: number;
}

/**
 * CategoryCard - минималистичное представление категории
 *
 * Отображает информацию о категории без рамок и карточек,
 * в стиле статей на главной странице (ArticleCard).
 */
export const CategoryCard = ({ category, index }: CategoryCardProps) => {
  return (
    <motion.article
      className='category-card'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/${category.slug}`}
        className='category-card__header-link'
        aria-label={`Перейти к категории ${category.name}`}
      >
        <header>
          <h2 className='category-card__title'>{category.name}</h2>
          {category.subtitle && (
            <div className='category-card__subtitle-wrap'>
              <p className='category-card__subtitle'>{category.subtitle}</p>
            </div>
          )}
        </header>
      </Link>

      {category.description && (
        <div
          className='category-card__description'
          dangerouslySetInnerHTML={{ __html: category.description }}
        />
      )}
    </motion.article>
  );
};

export default CategoryCard;
