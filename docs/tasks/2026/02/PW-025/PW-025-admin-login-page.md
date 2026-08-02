# PW-025: Экран входа в админку

## 📋 Информация о задаче

- **ID**: PW-025
- **Статус**: DONE
- **Создано**: 2026-02-11
- **Завершено**: 2026-02-14
- **Приоритет**: High ⚡
- **Компонент**: ⚙️ Admin
- **Теги**: #admin #auth #login #mock #zustand
- **Оценка времени**: 15-20 минут

## 🎯 Постановка задачи

### Описание

Добавить экран авторизации в админку (`apps/admin`). Пока mock-реализация на localStorage — UI и flow закладываются до
подключения реального бэкенда.

Сейчас админка загружается сразу без авторизации — нужен guard.

### Цель

Рабочий экран входа с mock-авторизацией, готовый к замене на реальный API.

### Способы входа

- Email + пароль
- Google OAuth
- Яндекс OAuth
- Telegram

### Критерии приемки

- [ ] Login page отображается при отсутствии сессии
- [ ] Вход по email/паролю работает (mock — любые данные)
- [ ] 3 кнопки OAuth: Google, Яндекс, Telegram (mock)
- [ ] Сессия сохраняется в localStorage (refresh → dashboard)
- [ ] Logout из sidebar → возврат на login
- [ ] Dark/light тема на login page
- [ ] Мобильная адаптивность
- [ ] `bun run build` — 0 ошибок

## 📋 План выполнения

### 1. Auth Store (`src/app/store/auth-store.ts`)

Zustand store по паттерну существующих (navigation-store, ai-store):

```ts
interface User {
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
  login(email: string, password: string): Promise<void>;
  loginWithProvider(provider: 'google' | 'yandex' | 'telegram'): Promise<void>;
  logout(): void;
  checkAuth(): void;
}
```

- Persist в localStorage (`pw-admin-auth`)
- Mock login: задержка 500ms → успех с mock-юзером
- Mock OAuth: задержка 1s → успех с mock-юзером по провайдеру
- Logout: очистка localStorage + сброс state

### 2. Login Page (`src/app/components/login-page.tsx`)

Полноэкранная страница. Только вход, без регистрации.

**Desktop** — двухколоночный layout:

- **Левая часть** (~55%): брендинг — градиентный фон, логотип ProfitableWeb, описание
- **Правая часть** (~45%): форма в Card

**Форма входа:**

- Заголовок «Вход в панель управления»
- Email input + Password input (с toggle видимости пароля)
- Чекбокс «Запомнить меня»
- Кнопка «Войти»
- Separator «или»
- 3 кнопки OAuth в ряд: Google, Яндекс, Telegram
- Toast через sonner при ошибке

**Мобильная версия:** одна колонка, логотип сверху, форма снизу.

**OAuth иконки:** SVG инлайн (без внешних зависимостей).

**Переиспользуемые компоненты:**

- `ui/button`, `ui/input`, `ui/label`, `ui/card`, `ui/separator`, `ui/checkbox`
- `theme-provider` (light/dark)
- `sonner` (toast уведомления)
- `react-hook-form` (валидация)
- Lucide icons: `Mail`, `Lock`, `Eye`, `EyeOff`

### 3. Auth Guard в App.tsx

```tsx
const { isAuthenticated, checkAuth } = useAuthStore();
useEffect(() => {
  checkAuth();
}, []);
if (!isAuthenticated) return <LoginPage />;
```

### 4. Logout в sidebar-nav.tsx

- Кнопка выхода в нижней секции sidebar (рядом с профилем)
- Данные юзера из auth store вместо захардкоженных

## 📁 Затрагиваемые файлы

| Действие | Файл                                                          |
| -------- | ------------------------------------------------------------- |
| Создать  | `src/app/store/auth-store.ts`                                 |
| Создать  | `src/app/components/login-page.tsx`                           |
| Изменить | `src/app/App.tsx` — auth guard                                |
| Изменить | `src/app/components/sidebar-nav.tsx` — logout + user из store |

## 🔗 Связанные задачи

- **Блокируется**: PW-024 (админка интегрирована) ✅
- **Блокирует**: Реальная авторизация через backend API (будущее)

## 📝 Заметки

### Mock-данные

При mock-авторизации создаётся пользователь:

```ts
{
  id: '1',
  name: 'Администратор',
  email: '<введённый email>',
  role: 'admin'
}
```

Для OAuth — имя и email подставляются по провайдеру.

### Техдолг

- Заменить mock на реальный API при реализации бэкенда
- Добавить JWT/session token
- Добавить страницу «Забыли пароль?»
- Роли и разграничение доступа

---

**Статусы**: TODO → DOING → TESTING → DONE
