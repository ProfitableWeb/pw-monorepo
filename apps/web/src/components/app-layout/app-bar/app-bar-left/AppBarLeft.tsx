'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/common/logo-icon';
import './AppBarLeft.scss';
import AppBarMenu from './app-bar-menu-sidebar/app-bar-menu';

interface AppBarLeftProps {
  onMenuClick?: () => void;
}

const AppBarLeft: React.FC<AppBarLeftProps> = ({ onMenuClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuClick?.();
  };

  return (
    <div className='app-bar__left'>
      <Link href='/' className='app-bar__logo-link' aria-label='Перейти на главную страницу'>
        <Logo size='md' />
      </Link>
      <AppBarMenu isOpen={isMenuOpen} onMenuClick={handleMenuClick} />
    </div>
  );
};

export default AppBarLeft;
