'use client';

import React from 'react';
import { motion } from 'framer-motion';
import FeatureCategoryBlock from '@/components/common/feature-category-block';
import {
  containerVariants,
  itemVariants,
} from './AppHomeHeroHeader.animations';
import './AppHomeHeroHeader.scss';

/**
 * Пропсы для компонента AppHomeHeroHeader
 */
interface AppHomeHeroHeaderProps {
  /**
   * Дополнительный CSS класс для кастомизации стилей
   * @default ''
   */
  className?: string;
}

/**
 * Компонент героической секции главной страницы приложения
 *
 * Отображает вдохновляющий заголовок, описательные параграфы и блок категорий.
 * Использует Framer Motion для анимации появления элементов с эффектом stagger.
 *
 * @component
 * @example
 * ```tsx
 * <AppHomeHeroHeader className="custom-hero" />
 * ```
 *
 * @param {AppHomeHeroHeaderProps} props - Свойства компонента
 * @returns {JSX.Element} Анимированная секция с hero-контентом
 */
const AppHomeHeroHeader = ({ className = '' }: AppHomeHeroHeaderProps) => {
  return (
    <motion.section
      className={`hero-header ${className}`}
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <div className='hero-header__container'>
        {/* Главный заголовок - семантический H1 для SEO */}
        <motion.h1 className='hero-header__title' variants={itemVariants}>
          Представьте Общество,
          <br /> где <a href='#'>труд — форма самораскрытия</a>,
          <br /> а <a href='#'>технологии — продолжение сознания</a>
        </motion.h1>

        {/* Параграф 1: О создании контента */}
        <motion.p className='hero-header__text' variants={itemVariants}>
          Создание контента, сервисов и физических продуктов в сфере своих
          интересов — это самое увлекательное занятие, где соединяются страсть и
          труд.
          <br />В таком союзе рождается <a href='#'>состояние потока</a>, где
          работа становится сверх-эффективной.
        </motion.p>

        {/* Параграф 2: Маркированный текст с highlight-эффектом */}
        <motion.p className='hero-header__text' variants={itemVariants}>
          <span className='mark-highlight'>
            Как превратить хобби в доходное дело
          </span>{' '}
          — этому и посвящён данный <a href='#'>исследовательский проект</a>.
        </motion.p>

        {/* Блок категорий */}
        <motion.div variants={itemVariants}>
          <FeatureCategoryBlock />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AppHomeHeroHeader;
