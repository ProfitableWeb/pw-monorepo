'use client';

import React from 'react';
import {
  ToastContainer,
  ToastContainerProps,
  cssTransition,
} from 'react-toastify';
import { useTheme } from '@/contexts/ThemeContext';
import './Toast.scss';

// Кастомная плавная анимация с выраженным ускорением/замедлением
const SmoothTransition = cssTransition({
  enter: 'toast-enter',
  exit: 'toast-exit',
  collapseDuration: 300,
});

export const ToastProvider = () => {
  const { theme } = useTheme();
  const toastOptions: ToastContainerProps = {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: theme === 'dark' ? 'dark' : 'light',
    stacked: true,
    transition: SmoothTransition,
  };

  return <ToastContainer {...toastOptions} />;
};
