'use client';

import React from 'react';
import Link from 'next/link';
import './FeatureCategoryBlock.scss';

/**
 * Пропсы для компонента FeatureCategoryBlock
 */
interface FeatureCategoryBlockProps {
  /**
   * Массив категорий для отображения
   * Если не передан, используются дефолтные значения
   */
  categories?: string[];
  /**
   * Дополнительный CSS класс для кастомизации стилей
   * @default ''
   */
  className?: string;
  /**
   * Базовый путь для ссылок категорий
   * @default '/categories'
   */
  categoryBasePath?: string;
}

/**
 * Список категорий по умолчанию
 * Используется если пропс categories не передан
 */
const DEFAULT_CATEGORIES = [
  'Экономика внимания',
  'ИИ-автоматизация',
  'Взгляд в будущее',
  'UI/UX дизайн',
  'Редакторская деятельность',
];

/**
 * Компонент для отображения блока категорий/тегов проекта
 *
 * Показывает список категорий в виде горизонтальной полосы с тегами.
 * Адаптивен под мобильные и десктопные устройства.
 *
 * @component
 * @example
 * ```tsx
 * // С дефолтными категориями
 * <FeatureCategoryBlock />
 *
 * // С кастомными категориями
 * <FeatureCategoryBlock
 *   categories={['Web Dev', 'Mobile', 'AI']}
 *   className="custom-style"
 * />
 * ```
 *
 * @param {FeatureCategoryBlockProps} props - Свойства компонента
 * @returns {JSX.Element} Блок с категориями
 */
const FeatureCategoryBlock: React.FC<FeatureCategoryBlockProps> = ({
  categories = DEFAULT_CATEGORIES,
  className = '',
  categoryBasePath = '/categories',
}) => {
  return (
    <div className={`feature-category-block ${className}`}>
      {categories.map((category, index) => {
        const href = `#`;

        return (
          <Link
            key={index}
            href={href}
            className='feature-category-block__item'
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
};

export default FeatureCategoryBlock;
