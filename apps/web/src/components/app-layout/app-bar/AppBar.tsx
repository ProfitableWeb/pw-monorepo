'use client';

import React, { useState, useEffect } from 'react';
import AppBarLeft from './app-bar-left/AppBarLeft';
import AppBarRight from './app-bar-right/AppBarRight';
import './AppBar.scss';

interface AppBarProps {
  className?: string;
}

const AppBar: React.FC<AppBarProps> = ({ className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
