'use client';

import React, { useState } from 'react';
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
      <Logo size='md' />
      <AppBarMenu isOpen={isMenuOpen} onMenuClick={handleMenuClick} />
    </div>
  );
};

export default AppBarLeft;
