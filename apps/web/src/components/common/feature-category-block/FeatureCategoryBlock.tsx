'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import './FeatureCategoryBlock.scss';

/**
 * Пропсы для компонента FeatureCategoryBlock
 */
interface FeatureCategoryBlockProps {
  /**
   * Массив категорий для отображения
   * Если не передан, используются дефолтные значения
   */
  categories?: Category[];
  /**
   * Дополнительный CSS класс для кастомизации стилей
   * @default ''
   */
  className?: string;
  /**
   * Базовый путь для ссылок категорий
   * @default '' (для единой маршрутизации /[slug])
   */
  categoryBasePath?: string;
}

/**
 * Список категорий по умолчанию
 * Используется если пропс categories не передан
 * Примечание: это mock-данные, в будущем будут загружены из API
 */
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Экономика внимания',
    slug: 'attention-economy',
    description:
      'Как привлекать и удерживать внимание аудитории в цифровую эпоху',
    articleCount: 5,
  },
  {
    id: '2',
    name: 'ИИ-автоматизация',
    slug: 'ai-automation',
    description:
      'Использование искусственного интеллекта для автоматизации рутинных задач',
    articleCount: 3,
  },
  {
    id: '3',
    name: 'Взгляд в будущее',
    slug: 'future-vision',
    description: 'Тренды и прогнозы развития технологий и общества',
    articleCount: 2,
  },
  {
    id: '4',
    name: 'UI/UX дизайн',
    slug: 'ui-ux-design',
    description: 'Принципы создания удобных и красивых интерфейсов',
    articleCount: 4,
  },
  {
    id: '5',
    name: 'Редакторская деятельность',
    slug: 'editorial-work',
    description: 'Искусство создания и редактирования контента',
    articleCount: 3,
  },
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
  categoryBasePath = '',
}) => {
  return (
    <div className={`feature-category-block ${className}`}>
      {categories.map(category => {
        // Генерируем ссылку на категорию: /category-slug
        const href = `${categoryBasePath}/${category.slug}`;

        return (
          <Link
            key={category.id}
            href={href}
            className='feature-category-block__item'
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
};

export default FeatureCategoryBlock;
