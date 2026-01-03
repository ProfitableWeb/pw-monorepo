'use client';

import React from 'react';
import './AppPageWrapper.scss';

/**
 * Пропсы для компонента AppPageWrapper
 */
interface AppPageWrapperProps {
  /**
   * Содержимое страницы
   */
  children: React.ReactNode;
  /**
   * Дополнительный CSS класс для кастомизации стилей
   * @default ''
   */
  className?: string;
}

/**
 * Компонент-обертка для страниц приложения
 *
 * Обеспечивает адаптивную ширину контента с автоматическим центрированием
 * и padding'ами, адаптирующимися под размер экрана.
 *
 * @component
 * @example
 * ```tsx
 * <AppPageWrapper>
 *   <h1>Заголовок страницы</h1>
 *   <p>Контент</p>
 * </AppPageWrapper>
 * ```
 *
 * @param {AppPageWrapperProps} props - Свойства компонента
 * @returns {JSX.Element} Обёртка с адаптивной шириной
 */
const AppPageWrapper: React.FC<AppPageWrapperProps> = ({
  children,
  className = '',
}) => {
  return <div className={`app-page-wrapper ${className}`}>{children}</div>;
};

export default AppPageWrapper;
