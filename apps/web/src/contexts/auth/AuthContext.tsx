'use client';

import React, { createContext, useEffect, useState, useCallback } from 'react';
import {
  authGetMe,
  authLogout,
  getOAuthUrl,
  type AuthUser,
} from '@/lib/api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export type AuthProvider = 'yandex' | 'telegram' | 'google';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (provider: AuthProvider) => void;
  loginWithTelegram: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  /** Обновить user после логина (вызывается из callback page) */
  refreshUser: () => Promise<void>;
}

function mapAuthUserToUser(raw: AuthUser): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: raw.avatar,
    role: raw.role,
  };
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const me = await authGetMe();
      setUser(me ? mapAuthUserToUser(me) : null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Проверка auth при монтировании (httpOnly cookie)
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((provider: AuthProvider) => {
    if (provider === 'telegram') {
      // Telegram использует Login Widget, не OAuth redirect
      return;
    }
    getOAuthUrl(provider).then(url => {
      window.location.href = url;
    });
  }, []);

  const loginWithTelegram = useCallback(
    async (data: Record<string, unknown>) => {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${API_BASE}/auth/telegram/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Ошибка входа через Telegram');
      const raw = await res.json();
      setUser(mapAuthUserToUser(raw));
    },
    []
  );

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await authGetMe();
    setUser(me ? mapAuthUserToUser(me) : null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithTelegram,
    logout,
    checkAuth,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
