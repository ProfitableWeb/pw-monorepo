'use client';

import React from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import './AppBarMenuIcon.scss';

interface AppBarMenuIconProps {
  isOpen: boolean;
  onClick?: () => void;
}

const AppBarMenuIcon: React.FC<AppBarMenuIconProps> = ({ isOpen, onClick }) => {
  return (
    <button
      className={`app-bar-menu-icon ${isOpen ? 'app-bar-menu-icon--open' : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
    >
      <div className='app-bar-menu-icon__container'>
        <HiMenu className='app-bar-menu-icon__menu' />
        <HiX className='app-bar-menu-icon__close' />
      </div>
    </button>
  );
};

export default AppBarMenuIcon;
