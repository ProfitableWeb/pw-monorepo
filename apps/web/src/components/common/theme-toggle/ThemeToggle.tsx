'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SunMoonIcon } from './SunMoonIcon';
import './SunMoonIcon.scss';
import './ThemeToggle.scss';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Заглушка во время SSR для предотвращения гидрации
  if (!isMounted) {
    return (
      <div className='theme-toggle theme-toggle--loading' aria-hidden='true' />
    );
  }

  return (
    <button
      className='theme-toggle'
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-pressed={theme === 'dark'}
      title='Переключить тему'
      type='button'
    >
      <SunMoonIcon theme={theme} size={20} />
    </button>
  );
};

export default ThemeToggle;
