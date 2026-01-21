'use client';

import React, { forwardRef } from 'react';
import './Input.scss';

/**
 * Props for the Input component
 * Extends standard HTML input attributes for full compatibility
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error message string or boolean flag for error state
   * When string: displays the error message below the input
   * When true: shows error styling without message
   */
  error?: string | boolean;

  /**
   * Optional label text displayed above the input
   * Connected to input via htmlFor for accessibility
   */
  label?: string;

  /**
   * Helper text displayed below the input (separate from error)
   * Useful for providing additional context or instructions
   */
  helperText?: string;

  /**
   * Make the container full width
   */
  fullWidth?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Input - Universal input component with theme support
 *
 * Features:
 * - Supports all standard HTML input attributes
 * - Error, disabled, and loading states
 * - Dark/light theme support via CSS variables
 * - Full accessibility (WCAG 2.1 AA)
 * - Optional label and helper text
 *
 * @example
 * // Basic usage
 * <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
 *
 * @example
 * // With label and error
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
 * // With helper text
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
    // Generate unique ID for input if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Collect aria-describedby IDs
    const ariaDescribedBy = [
      error && typeof error === 'string' ? errorId : null,
      helperText ? helperId : null,
    ]
      .filter(Boolean)
      .join(' ');

    // Build class names
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
