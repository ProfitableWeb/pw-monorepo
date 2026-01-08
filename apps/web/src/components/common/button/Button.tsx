'use client';

import React from 'react';
import './Button.scss';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'outline' | 'solid' | 'ghost';
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
 * Button - универсальный компонент кнопки
 *
 * Используется для: subscribe buttons, action buttons, links
 * Стиль взят из дизайна социальных сетей и кнопки "Подписаться на PW"
 *
 * Примеры:
 * ```tsx
 * // Outline button (как "Подписаться на PW")
 * <Button variant="outline" fullWidth>Подписаться</Button>
 *
 * // Link button
 * <Button href="/subscribe" variant="outline">Подписаться</Button>
 *
 * // Action button
 * <Button variant="solid" onClick={handleClick}>Отправить</Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'outline',
  size = 'md',
  fullWidth = false,
  href,
  target,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const classNames = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full-width',
    disabled && 'button--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Обёртка для контента, чтобы он был поверх градиента
  const content = <span className='button__content'>{children}</span>;

  // Если есть href - рендерим как ссылку
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
        {content}
      </a>
    );
  }

  // Иначе - как кнопку
  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
};
