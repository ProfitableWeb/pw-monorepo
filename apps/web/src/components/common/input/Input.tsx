'use client';

import React, { forwardRef } from 'react';
import './Input.scss';

/**
 * Пропсы для компонента Input
 * Расширяет стандартные HTML атрибуты input для полной совместимости
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Сообщение об ошибке или булев флаг для состояния ошибки
   * Если строка: показывает сообщение об ошибке под input
   * Если true: показывает стиль ошибки без сообщения
   */
  error?: string | boolean;

  /**
   * Опциональный текст label, отображаемый над input
   * Связан с input через htmlFor для accessibility
   */
  label?: string;

  /**
   * Вспомогательный текст, отображаемый под input (отдельно от ошибки)
   * Полезен для предоставления дополнительного контекста или инструкций
   */
  helperText?: string;

  /**
   * Делает контейнер на всю ширину
   */
  fullWidth?: boolean;

  /**
   * Дополнительные CSS классы
   */
  className?: string;
}

/**
 * Input - Универсальный компонент ввода с поддержкой тем
 *
 * Возможности:
 * - Поддерживает все стандартные HTML атрибуты input
 * - Состояния error, disabled и loading
 * - Поддержка тёмной/светлой темы через CSS переменные
 * - Полная accessibility (WCAG 2.1 AA)
 * - Опциональный label и вспомогательный текст
 *
 * @example
 * // Базовое использование
 * <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
 *
 * @example
 * // С label и ошибкой
 * <Input
 *   type="email"
 *   label="Email адрес"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error="Пожалуйста, введите корректный email"
 *   required
 * />
 *
 * @example
 * // С вспомогательным текстом
 * <Input
 *   type="password"
 *   label="Пароль"
 *   helperText="Минимум 8 символов"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      label,
      helperText,
      fullWidth = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    // Генерируем уникальный ID для input, если не предоставлен
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Собираем IDs для aria-describedby
    const ariaDescribedBy = [
      error && typeof error === 'string' ? errorId : null,
      helperText ? helperId : null,
    ]
      .filter(Boolean)
      .join(' ');

    // Формируем имена классов
    const classNames = [
      'input',
      error && 'input--error',
      props.disabled && 'input--disabled',
      fullWidth && 'input--full-width',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        className={`input-wrapper ${fullWidth ? 'input-wrapper--full-width' : ''}`}
      >
        {label && (
          <label htmlFor={inputId} className='input__label'>
            {label}
            {props.required && <span className='input__required'>*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={classNames}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy || undefined}
          {...props}
        />

        {error && typeof error === 'string' && (
          <p id={errorId} className='input__error-message' role='alert'>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className='input__helper-text'>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
