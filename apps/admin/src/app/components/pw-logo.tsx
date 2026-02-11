import { cn } from '@/app/components/ui/utils';

const sizes = {
  sm: { width: 20, height: 14 },
  md: { width: 31, height: 22 },
  lg: { width: 36, height: 22 },
  xl: { width: 50, height: 35 },
  '2xl': { width: 70, height: 49 },
} as const;

interface PwLogoProps {
  size?: keyof typeof sizes;
  className?: string;
  /** Переопределить цвет буквы P (по умолчанию — foreground темы) */
  primaryClass?: string;
  /** Переопределить цвет буквы W (по умолчанию — primary темы) */
  accentClass?: string;
}

export function PwLogo({
  size = 'md',
  className,
  primaryClass = 'fill-foreground',
  accentClass = 'fill-primary',
}: PwLogoProps) {
  const { width, height } = sizes[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 31 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('block transition-colors', className)}
    >
      <g clipPath='url(#pw-logo-clip)'>
        {/* P */}
        <path
          opacity='0.8'
          d='M5.21471 14.5333V22H0V0H8.6213C10.2722 0 11.7396 0.311111 13.0062 0.933333C14.2815 1.55556 15.2598 2.43556 15.9586 3.57333C16.6574 4.72 17.0068 6.00889 17.0068 7.46667C17.0068 9.60889 16.2556 11.3244 14.7444 12.6133C13.2333 13.8933 11.1631 14.5422 8.53395 14.5422H5.20597L5.21471 14.5333ZM5.21471 10.4356H8.63004C9.64328 10.4356 10.4119 10.1778 10.936 9.66222C11.4689 9.14667 11.7309 8.42667 11.7309 7.48444C11.7309 6.45333 11.4601 5.63556 10.9186 5.02222C10.377 4.08889 9.63454 4.09778 8.69118 4.08889H5.21471V10.4356Z'
          className={cn('transition-colors', primaryClass)}
        />
        {/* W */}
        <g opacity='0.65'>
          <path
            d='M23.357 13.7956L25.8377 0H31L26.4142 22H21.0073L18.1161 9.45778L15.2773 22H9.88786L5.28459 0H10.4644L12.9451 13.7956L15.9149 0H20.3347L23.3483 13.7956H23.357Z'
            className={cn('transition-colors', accentClass)}
          />
        </g>
      </g>
      <defs>
        <clipPath id='pw-logo-clip'>
          <rect width='31' height='22' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}
