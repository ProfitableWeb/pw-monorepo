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
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (
    provider: 'google' | 'yandex' | 'telegram'
  ) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
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

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const raw = await authLogin(email, password);
      const user = mapUser(raw);
      set({ isAuthenticated: true, user, isLoading: false });
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
    set({ isAuthenticated: false, user: null, isLoading: false });
  },

  checkAuth: async () => {
    try {
      const raw = await authGetMe();
      if (raw) {
        set({ isAuthenticated: true, user: mapUser(raw) });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch {
      set({ isAuthenticated: false, user: null });
    }
  },
}));
