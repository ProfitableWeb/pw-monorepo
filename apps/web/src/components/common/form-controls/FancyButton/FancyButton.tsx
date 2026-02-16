'use client';

import React from 'react';
import './FancyButton.scss';

interface FancyButtonProps {
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
  enableHoverElevation?: boolean;
}

/**
 * FancyButton - эффектная кнопка с градиентами и анимациями
 *
 * Используется для: CTA-кнопки, важные действия, акценты интерфейса
 * Имеет градиентный оверлей на hover, приподнятие при наведении
 *
 * Примеры:
 * ```tsx
 * // CTA-кнопка с приподнятием
 * <FancyButton variant="solid" enableHoverElevation>Сохранить</FancyButton>
 *
 * // Outline с градиентом
 * <FancyButton variant="outline">Подписаться</FancyButton>
 * ```
 */
export const FancyButton = ({
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
  enableHoverElevation = false,
}: FancyButtonProps) => {
  const classNames = [
    'fancy-button',
    `fancy-button--${variant}`,
    `fancy-button--${size}`,
    fullWidth && 'fancy-button--full-width',
    disabled && 'fancy-button--disabled',
    enableHoverElevation && 'fancy-button--hover-elevation',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = <span className='fancy-button__content'>{children}</span>;

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
