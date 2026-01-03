import React from 'react';

interface SunMoonIconProps {
  /** Текущая тема */
  theme: string;
  /** Размер иконки */
  size?: number;
  /** CSS класс */
  className?: string;
  /** Отключить анимации */
  disableAnimations?: boolean;
}

/**
 * SVG иконка солнышко-луна с анимацией переходов
 * Основано на https://github.com/argyleink/gui-challenges/tree/main/theme-switch
 */
export const SunMoonIcon: React.FC<SunMoonIconProps> = ({
  theme,
  size = 20,
  className,
  disableAnimations = false,
}) => {
  // Уникальный ID для маски (чтобы избежать конфликтов при нескольких иконках на странице)
  const maskId = React.useMemo(
    () => `moon-mask-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  // Формируем классы без библиотеки clsx
  const classes = [
    'sun-moon-icon',
    `sun-moon-icon--${theme}`,
    disableAnimations && 'sun-moon-icon--no-animation',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      className={classes}
      aria-hidden='true'
      width={size}
      height={size}
      viewBox='0 0 24 24'
    >
      <mask className='sun-moon-icon__moon-mask' id={maskId}>
        <rect x='0' y='0' width='100%' height='100%' fill='white' />
        <circle
          className='sun-moon-icon__moon-mask-circle'
          cx='24'
          cy='12'
          r='6'
          fill='black'
        />
      </mask>
      <circle
        className='sun-moon-icon__sun'
        cx='12'
        cy='12'
        r='6'
        mask={`url(#${maskId})`}
        fill='currentColor'
      />
      <g className='sun-moon-icon__sun-beams' stroke='currentColor'>
        <line x1='12' y1='1' x2='12' y2='3' />
        <line x1='12' y1='21' x2='12' y2='23' />
        <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
        <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
        <line x1='1' y1='12' x2='3' y2='12' />
        <line x1='21' y1='12' x2='23' y2='12' />
        <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
        <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
      </g>
    </svg>
  );
};
