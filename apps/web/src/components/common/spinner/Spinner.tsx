import React from 'react';
import './Spinner.scss';

/**
 * Размер спиннера
 * - sm — внутри кнопок и инлайновых элементов
 * - md — блочные состояния загрузки
 * - lg — загрузка страницы целиком
 */
export type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  /**
   * Размер кольца
   * @default 'md'
   */
  size?: SpinnerSize;
  /**
   * Дополнительный CSS класс
   * @default ''
   */
  className?: string;
}

/**
 * Индикатор загрузки — вращающееся кольцо
 *
 * Чисто визуальный элемент: скрыт от скринридеров (`aria-hidden`),
 * текстовый статус задаёт контейнер, который его показывает.
 *
 * @component
 * @example
 * ```tsx
 * <Spinner size='lg' />
 * ```
 */
const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  return (
    <span className={`spinner spinner--${size} ${className}`} aria-hidden />
  );
};

export default Spinner;
