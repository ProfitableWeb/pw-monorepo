'use client';

import React from 'react';
import { HiX } from 'react-icons/hi';
import './AppBarMenu.scss';
import AppBarMenuIcon from '../app-bar-menu-icon/';
import AppBarMenuSidebar from '../app-bar-menu-sidebar/';

interface AppBarMenuProps {
  isOpen: boolean;
  onMenuClick?: () => void;
}

const AppBarMenu = ({ isOpen, onMenuClick }: AppBarMenuProps) => {
  return (
    <div className='app-bar-menu'>
      <AppBarMenuIcon isOpen={isOpen} onClick={onMenuClick} />
      <AppBarMenuSidebar isOpen={isOpen} onClose={onMenuClick} />
    </div>
  );
};

export default AppBarMenu;
