'use client';

import React, { useState, useEffect } from 'react';
import AppBarLeft from './app-bar-left/AppBarLeft';
import AppBarRight from './app-bar-right/AppBarRight';
import './AppBar.scss';

interface AppBarProps {
  className?: string;
}

const AppBar = ({ className = '' }: AppBarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const container = document.querySelector('.main-layout');

    const handleScroll = () => {
      const scrollTop = container ? container.scrollTop : window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    // Первоначальная проверка
    handleScroll();

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`app-bar ${isScrolled ? 'app-bar--scrolled' : ''} ${className}`}
    >
      <div className='app-bar__container'>
        <AppBarLeft />
        <AppBarRight />
      </div>
    </header>
  );
};

export default AppBar;
