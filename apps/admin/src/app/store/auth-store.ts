import { create } from 'zustand'

const STORAGE_KEY = 'pw-admin-auth'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'editor' | 'author'
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithProvider: (provider: 'google' | 'yandex' | 'telegram') => Promise<void>
  logout: () => void
  checkAuth: () => void
}

const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const mockUserFromEmail = (email: string): User => ({
  id: '1',
  name: email.split('@')[0] || 'Администратор',
  email,
  role: 'admin',
})

const mockUserFromProvider = (provider: 'google' | 'yandex' | 'telegram'): User => {
  const providers = {
    google: { id: '2', name: 'Google User', email: 'user@gmail.com', role: 'admin' as const },
    yandex: { id: '3', name: 'Яндекс Пользователь', email: 'user@yandex.ru', role: 'admin' as const },
    telegram: { id: '4', name: 'Telegram User', email: 'user@telegram.org', role: 'admin' as const },
  }
  return providers[provider]
}

const saveToStorage = (user: User) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } catch {}
}

const loadFromStorage = (): User | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true })
    await mockDelay(500)
    const user = mockUserFromEmail(email)
    saveToStorage(user)
    set({ isAuthenticated: true, user, isLoading: false })
  },

  loginWithProvider: async (provider) => {
    set({ isLoading: true })
    await mockDelay(1000)
    const user = mockUserFromProvider(provider)
    saveToStorage(user)
    set({ isAuthenticated: true, user, isLoading: false })
  },

  logout: () => {
    clearStorage()
    set({ isAuthenticated: false, user: null, isLoading: false })
  },

  checkAuth: () => {
    const user = loadFromStorage()
    if (user) {
      set({ isAuthenticated: true, user })
    }
  },
}))
