'use client';

import React, { createContext, useEffect, useState, useCallback } from 'react';

export interface User {
  name: string;
  avatar: string;
}

export type AuthProvider = 'vk' | 'telegram';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (provider: AuthProvider) => void;
  logout: () => void;
}

const STORAGE_KEY = 'auth_user';

// Моковые данные для генерации пользователей
const MOCK_NAMES = [
  'Алексей',
  'Мария',
  'Дмитрий',
  'Анна',
  'Сергей',
  'Екатерина',
  'Иван',
  'Ольга',
];

const MOCK_AVATARS = ['/imgs/author/avatar.jpg'];

const generateMockUser = (): User => {
  const name = 'Николай';
  const avatar = '/imgs/author/avatar.jpg';
  return { name, avatar };
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Восстановление из localStorage при инициализации
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedUser = JSON.parse(stored) as User;
        if (parsedUser.name && parsedUser.avatar) {
          setUser(parsedUser);
        }
      }
    } catch {
      // Если данные повреждены, просто игнорируем
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback((provider: AuthProvider) => {
    // В будущем здесь будет реальная OAuth логика
    // Пока просто генерируем mock-пользователя
    console.log(`[Auth] Login via ${provider}`);
    const newUser = generateMockUser();
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
