'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuLogOut, LuMessageSquare, LuSettings } from 'react-icons/lu';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/common/toast';
import './UserMenu.scss';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    toast.info('До встречи!');
  };

  if (!user) return null;

  return (
    <div className='user-menu' ref={menuRef}>
      <button
        className='user-menu__trigger'
        onClick={() => setIsOpen(!isOpen)}
        aria-label='Меню пользователя'
        aria-expanded={isOpen}
        aria-haspopup='true'
      >
        <span className='user-menu__avatar-wrapper'>
          <Image
            src={user.avatar}
            alt={user.name}
            width={28}
            height={28}
            className='user-menu__avatar'
          />
        </span>
      </button>

      {isOpen && (
        <div className='user-menu__dropdown' role='menu'>
          <div className='user-menu__header'>
            <span className='user-menu__avatar-wrapper user-menu__avatar-wrapper--large'>
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className='user-menu__avatar user-menu__avatar--large'
              />
            </span>
            <span className='user-menu__name'>{user.name}</span>
          </div>
          <div className='user-menu__divider' />
          <Link
            href='/my-comments'
            className='user-menu__item'
            role='menuitem'
            onClick={() => setIsOpen(false)}
          >
            <LuMessageSquare />
            <span>Мои комментарии</span>
          </Link>
          <Link
            href='/settings'
            className='user-menu__item'
            role='menuitem'
            onClick={() => setIsOpen(false)}
          >
            <LuSettings />
            <span>Настройки</span>
          </Link>
          <button
            className='user-menu__item'
            onClick={handleLogout}
            role='menuitem'
          >
            <LuLogOut />
            <span>Выйти</span>
          </button>
        </div>
      )}
    </div>
  );
};
