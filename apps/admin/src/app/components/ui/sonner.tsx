'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group [&_[data-icon]_svg]:!text-[#5ADC5A] [&_[data-type=error]_[data-icon]_svg]:!text-red-500'
      position='top-center'
      toastOptions={{
        style: {
          borderRadius: '6px',
          fontSize: '13px',
          border: '1px solid var(--border)',
          background: 'var(--popover)',
          color: 'var(--popover-foreground)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          padding: '12px 16px',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
