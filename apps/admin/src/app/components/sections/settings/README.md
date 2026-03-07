# Настройки (`settings/`)

Страница настроек с sidebar-навигацией по 8 разделам.

## Структура

```
settings/
├── SettingsPage.tsx              # Оркестратор: sidebar-навигация, рендер активного раздела
├── settings.constants.ts         # Категории навигации (sidebar)
├── settings.types.ts             # SettingsCategory
├── index.ts                      # Barrel-экспорт
│
├── profile/                      # Настройки профиля пользователя
│   ├── ProfileSettings.tsx          # Оркестратор: табы Данные/Безопасность/OAuth
│   ├── useProfileSettings.ts        # Хук: загрузка профиля, аватар, пароль, OAuth
│   ├── profile-settings.constants.ts
│   ├── profile-settings.types.ts
│   ├── assets/
│   │   ├── AvatarCard.tsx           # Загрузка/удаление аватара
│   │   ├── PersonalDataCard.tsx     # Имя, email, био, ссылки
│   │   ├── PasswordCard.tsx         # Установка/смена пароля
│   │   ├── PasswordInput.tsx        # Поле пароля с toggle видимости
│   │   └── OAuthCard.tsx            # Привязка/отвязка OAuth-провайдеров
│   └── index.ts
│
├── security/                     # Настройки безопасности системы
│   ├── SecuritySettings.tsx         # Оркестратор: табы 2FA/Пароль/Сессии/Доступ
│   ├── security-settings.constants.ts  # Роли, заблокированные IP, токены, лог
│   ├── security-settings.types.ts
│   ├── assets/
│   │   ├── AccessControlTab.tsx     # Роли, IP, токены, политики, журнал
│   │   ├── IpAccessControl.tsx      # Whitelist/blacklist IP
│   │   ├── ApiTokenList.tsx         # Управление API-токенами
│   │   ├── SecurityLogCard.tsx      # Журнал безопасности
│   │   └── RoleCard.tsx             # Карточка роли с разрешениями
│   └── index.ts
│
├── shared/                       # Переиспользуемые внутри секции
│   └── SettingRow.tsx               # Строка настройки: иконка + label + switch
│
├── GeneralSettings.tsx           # Общие: блог, региональные, локализация
├── BlogSettings.tsx              # Блог: публикация, комментарии, RSS
├── AppearanceSettings.tsx        # Внешний вид: тема, брендинг, кастомизация
├── NotificationSettings.tsx      # Уведомления: email, push, дайджесты
├── IntegrationSettings.tsx       # Интеграции: сервисы, API-ключи, webhooks
└── DeveloperSettings.tsx         # Разработчики: API, OAuth-приложения, расширенные
```

## Архитектура

### Потоки данных

- **Навигация**: `SettingsPage` хранит `activeCategory` в useState, рендерит соответствующий компонент
- **Unsaved changes**: каждый таб получает `onChangeDetected` callback, SettingsPage показывает панель сохранения
- **Профиль**: `useProfileSettings` загружает данные через `useAuthStore`, управляет формой и API-вызовами

### Паттерн декомпозиции

- **profile/** и **security/** — кластеры с 5+ связанных файлов, вынесены в поддиректории с `assets/`
- **shared/** — `SettingRow` используется в 7 из 8 табов
- Остальные табы — одиночные файлы (<220 строк), остаются плоскими на уровне секции
