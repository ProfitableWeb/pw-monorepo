'use client';

import React from 'react';
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import { useTheme } from '@/contexts/ThemeContext';
import './Toast.scss';

export const ToastProvider: React.FC = () => {
  const { theme } = useTheme();
  const toastOptions: ToastContainerProps = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: theme === 'dark' ? 'dark' : 'light',
    stacked: false,
  };

  return <ToastContainer {...toastOptions} />;
};
