'use client';

import React from 'react';
import './Button.scss';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'outline' | 'solid' | 'ghost';
  mode?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  href?: string;
  target?: '_blank' | '_self';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button - простая кнопка для форм и интерфейса
 *
 * Чистый стиль без градиентов и эффектов. Для эффектных CTA-кнопок
 * используйте FancyButton.
 *
 * Примеры:
 * ```tsx
 * <Button variant="outline">Отмена</Button>
 * <Button variant="solid" type="submit">Отправить</Button>
 * <Button variant="outline" mode="secondary">Удалить</Button>
 * ```
 */
export const Button = ({
  children,
  variant = 'outline',
  mode = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  target,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) => {
  const classNames = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    mode === 'secondary' && 'button--secondary',
    fullWidth && 'button--full-width',
    disabled && 'button--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <a
        href={href}
        className={classNames}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
