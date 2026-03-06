/**
 * Стор авторизации.
 *
 * Поддерживает login по email/password и OAuth (Google, Яндекс, Telegram).
 * Хранит текущего пользователя, флаг isAdmin (admin/editor) и isLoading.
 * `checkAuth` вызывается при старте приложения для восстановления сессии.
 *
 * @see lib/api-client.ts — authLogin, authLogout, authGetMe, getOAuthUrl
 */
import { create } from 'zustand';
import {
  authLogin,
  authLogout,
  authGetMe,
  getOAuthUrl,
  type AuthUser,
} from '@/lib/api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author';
  bio?: string;
  links?: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (
    provider: 'google' | 'yandex' | 'telegram'
  ) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

function mapUser(raw: AuthUser): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: raw.avatar,
    role: raw.role as 'admin' | 'editor' | 'author',
  };
}

function isAdminRole(role: string): boolean {
  return role === 'admin' || role === 'editor';
}

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const raw = await authLogin(email, password);
      const user = mapUser(raw);
      set({
        isAuthenticated: true,
        isAdmin: isAdminRole(user.role),
        user,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
      throw new Error('Неверный email или пароль');
    }
  },

  loginWithProvider: async provider => {
    set({ isLoading: true });
    try {
      const url = await getOAuthUrl(provider);
      window.location.href = url;
    } catch {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await authLogout();
    set({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      isLoading: false,
    });
  },

  checkAuth: async () => {
    try {
      const raw = await authGetMe();
      if (raw) {
        const user = mapUser(raw);
        set({
          isAuthenticated: true,
          isAdmin: isAdminRole(user.role),
          user,
        });
      } else {
        set({ isAuthenticated: false, isAdmin: false, user: null });
      }
    } catch {
      set({ isAuthenticated: false, isAdmin: false, user: null });
    }
  },

  updateUser: updates => {
    set(state => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },
}));
