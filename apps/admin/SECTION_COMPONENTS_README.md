# Универсальные компоненты для секций дашборда

## Обзор

Создана система универсальных компонентов для обеспечения консистентного дизайна во всех секциях дашборда. Дизайн
основан на стиле, использованном в разделе "Стиль" (style-dashboard).

## Компоненты

### 1. SectionCard (`/src/app/components/section-card.tsx`)

Универсальный компонент карточки с 3 вариантами отображения:

#### Variant: `default` (по умолчанию)

Полноразмерная карточка с большой иконкой слева:

- Иконка 12x12 в скругленном контейнере
- Заголовок и описание справа
- Поддержка badges, stats, progress bar
- Стрелка ArrowRight при наведении (если кликабельно)

```tsx
<SectionCard
  icon={FileText}
  title='Статья'
  description='Классический текстовый материал'
  badges={[{ label: 'Обзор' }, { label: 'Туториал' }]}
  stats={[{ label: 'шаблона', value: 3 }]}
  progress={87}
  onClick={() => console.log('Click')}
/>
```

#### Variant: `compact`

Компактная карточка с меньшим spacing:

- Иконка 10x10 слева
- Горизонтальная компоновка
- ChevronRight при наведении

```tsx
<SectionCard
  variant='compact'
  icon={Settings}
  title='Настройки'
  description='Конфигурация системы'
  metadata='Последнее обновление: 2 дня назад'
  onClick={() => {}}
/>
```

#### Variant: `tool`

Центрированная карточка для инструментов:

- Иконка 12x12 по центру сверху
- Заголовок и описание по центру снизу
- Идеально для grid из 3 колонок

```tsx
<SectionCard variant='tool' icon={BarChart3} title='Аналитика' description='Детальная статистика' onClick={() => {}} />
```

### 2. SectionHeader (`/src/app/components/section-header.tsx`)

Универсальный компонент заголовка с 2 вариантами:

#### Variant: `large` (по умолчанию)

Большой заголовок для главных секций:

- Иконка 10x10 в цветном круге
- H1 заголовок
- Опциональное описание

```tsx
<SectionHeader
  icon={Layout}
  title='Форматы контента'
  description='Шаблоны и структуры для различных типов материалов'
/>
```

#### Variant: `small`

Маленький заголовок для подразделов:

- Иконка 4x4
- H3 заголовок
- Серый текст

```tsx
<SectionHeader variant='small' icon={FileType} title='Доступные форматы' />
```

## Обновленные компоненты

Следующие компоненты были обновлены для использования новой системы:

### ✅ FormatsDashboard

- Использует SectionCard с variant="default" для форматов
- Использует SectionHeader для заголовков секций
- Добавлен ScrollArea для корректного скролла

### ✅ SocialsDashboard

- Кастомные карточки для активных платформ с детальной статистикой
- SectionCard variant="tool" для инструментов
- Добавлены Badge и Progress индикаторы
- Статус-карточка с общей статистикой

### ✅ EditorialHub

- Обновлены breadcrumbs с иконками
- Импортированы новые компоненты (готово к использованию)

### ✅ ContentHub

- Обновлены breadcrumbs с иконками
- Импортированы новые компоненты (готово к использованию)

## Преимущества новой системы

1. **Консистентность** - Единый дизайн во всех секциях
2. **Переиспользуемость** - Меньше дублирования кода
3. **Гибкость** - 3 варианта карточек для разных сценариев
4. **Доступность** - Правильная работа hover эффектов и кликабельности
5. **Масштабируемость** - Легко добавлять новые секции

## Рекомендации по использованию

### Для списка элементов с деталями

Используйте `variant="default"` с badges, stats и progress:

```tsx
<SectionCard
  icon={FileText}
  title="..."
  description="..."
  badges={[...]}
  stats={[...]}
  progress={75}
/>
```

### Для простых ссылок/переходов

Используйте `variant="compact"`:

```tsx
<SectionCard variant='compact' icon={Settings} title='...' description='...' />
```

### Для сетки инструментов (3 колонки)

Используйте `variant="tool"` в grid:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <SectionCard variant="tool" icon={...} title="..." description="..." />
  <SectionCard variant="tool" icon={...} title="..." description="..." />
  <SectionCard variant="tool" icon={...} title="..." description="..." />
</div>
```

## Дополнительные возможности

### Кастомные цвета иконок

```tsx
<SectionCard
  icon={Twitter}
  iconColor='bg-blue-500/10 text-blue-500'
  // ...
/>
```

### Stats с иконками

```tsx
<SectionCard
  stats={[
    { icon: Activity, label: 'параметра', value: 24 },
    { icon: Clock, label: '5 минут назад' },
  ]}
  // ...
/>
```

### Progress индикатор

```tsx
<SectionCard
  progress={87}
  // автоматически добавляет прогресс-бар с процентами
/>
```

## Миграция существующих компонентов

Чтобы обновить существующий компонент:

1. Импортируйте компоненты:

```tsx
import { SectionCard } from '@/app/components/section-card';
import { SectionHeader } from '@/app/components/section-header';
import { ScrollArea } from '@/app/components/ui/scroll-area';
```

2. Оберните контент в ScrollArea (если нужен скролл):

```tsx
<div className='flex-1 overflow-hidden'>
  <ScrollArea className='h-full'>
    <div className='max-w-5xl mx-auto p-6 space-y-8 pb-12'>{/* Контент */}</div>
  </ScrollArea>
</div>
```

3. Замените заголовки на SectionHeader:

```tsx
<SectionHeader icon={YourIcon} title='Заголовок' description='Описание' />
```

4. Замените карточки на SectionCard с нужным variant.
