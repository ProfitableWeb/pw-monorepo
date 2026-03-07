# Календарь публикаций (`calendar/`)

Планирование контента — календарь с видами неделя/месяц/квартал/год и диалог настроек.

## Структура

```
calendar/
├── CalendarSection.tsx              # Оркестратор: хедер, вид, нижние карточки, диалог
├── CalendarHeader.tsx               # Навигация по периодам, переключатель видов
├── CalendarBottomCards.tsx           # Карточки запланированных и AI-предложений
├── useCalendarState.ts              # Хук: навигация, посты, фильтрация
├── calendar.constants.ts            # Моки постов, названия месяцев, дни недели
├── calendar.types.ts                # ScheduledPost
├── calendar.utils.ts                # generateCalendarDays, getPostColor
├── index.ts                         # Barrel-экспорт
│
├── views/                           # Представления календаря
│   ├── WeekView.tsx
│   ├── MonthView.tsx
│   ├── QuarterView.tsx
│   ├── YearView.tsx
│   └── index.ts
│
├── settings-dialog/                 # Диалог настроек календаря
│   ├── CalendarSettingsDialog.tsx       # Оркестратор: sidebar + контент секции
│   ├── calendar-settings.constants.ts  # Список секций навигации
│   ├── calendar-settings.types.ts
│   ├── assets/
│   │   ├── GeneralSection.tsx          # Общие настройки
│   │   ├── AppearanceSection.tsx       # Внешний вид
│   │   ├── AiAgentSection.tsx          # AI-агент
│   │   ├── ContentPlanSection.tsx      # Контент-план
│   │   ├── NotificationsSection.tsx    # Уведомления
│   │   └── IntegrationsSection.tsx     # Интеграции
│   └── index.ts
```

## Архитектура

### Потоки данных

- **Стейт**: `useCalendarState` — навигация по периодам, моковые посты, фильтрация по дню
- **Виды**: CalendarSection рендерит один из 4 видов по `calendarView`
- **Настройки**: CalendarSettingsDialog — модальный диалог с sidebar-навигацией по 6 секциям
