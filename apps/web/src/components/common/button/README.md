# Button Component

Универсальный компонент кнопки на основе дизайна "Подписаться на PW" и социальных сетей.

## Использование

### Базовое использование

```tsx
import { Button } from '@/components/common/button';

// Outline button (как "Подписаться на PW")
<Button variant="outline">Подписаться</Button>

// Solid button (с заливкой)
<Button variant="solid">Отправить</Button>

// Ghost button (без фона)
<Button variant="ghost">Отмена</Button>
```

### Кнопка-ссылка

```tsx
// Обычная ссылка
<Button href="/subscribe" variant="outline">
  Подписаться
</Button>

// Ссылка в новом окне
<Button href="https://example.com" variant="outline" target="_blank">
  Перейти
</Button>
```

### Размеры

```tsx
// Small
<Button size="sm">Маленькая</Button>

// Medium (по умолчанию)
<Button size="md">Средняя</Button>

// Large
<Button size="lg">Большая</Button>
```

### Модификаторы

```tsx
// Полная ширина
<Button fullWidth>Подписаться на PW</Button>

// Disabled
<Button disabled>Недоступна</Button>

// С обработчиком
<Button onClick={() => console.log('Clicked')}>
  Кликни меня
</Button>
```

### Кастомный контент

```tsx
// С акцентом (как в "Подписаться на PW")
<Button variant="outline" fullWidth>
  Подписаться на <span className="accent">PW</span>
</Button>

// С иконкой
<Button variant="outline">
  <Icon /> Подписаться
</Button>
```

## Варианты (Variants)

### outline (по умолчанию)

- Белый/черный фон
- Граница `var(--color-border)`
- Hover: изменение фона и границы
- **Используется**: subscribe buttons, secondary actions

### solid

- Цветной фон `var(--color-primary)`
- Белый текст
- Hover: более темный фон
- **Используется**: primary actions, CTAs

### ghost

- Прозрачный фон
- Без границы
- Hover: легкий фон
- **Используется**: tertiary actions, cancel buttons

## Размеры (Sizes)

| Size | Padding   | Font Size | Когда использовать |
| ---- | --------- | --------- | ------------------ |
| sm   | 8px 16px  | 13px      | Компактные кнопки  |
| md   | 12px 20px | 14px      | Стандартные кнопки |
| lg   | 14px 24px | 15px      | Важные действия    |

## API

### Props

| Prop      | Type                            | Default   | Description             |
| --------- | ------------------------------- | --------- | ----------------------- |
| children  | ReactNode                       | -         | Содержимое кнопки       |
| variant   | 'outline' \| 'solid' \| 'ghost' | 'outline' | Вариант кнопки          |
| size      | 'sm' \| 'md' \| 'lg'            | 'md'      | Размер кнопки           |
| fullWidth | boolean                         | false     | Полная ширина           |
| href      | string                          | -         | Ссылка (рендерит `<a>`) |
| target    | '\_blank' \| '\_self'           | -         | Открытие ссылки         |
| onClick   | () => void                      | -         | Обработчик клика        |
| disabled  | boolean                         | false     | Disabled состояние      |
| className | string                          | ''        | Дополнительный класс    |
| type      | 'button' \| 'submit' \| 'reset' | 'button'  | Тип кнопки              |

## Примеры из проекта

### AuthorCard - "Подписаться на PW"

```tsx
<Button href={subscribeLink} variant='outline' size='md' fullWidth target='_blank'>
  Подписаться на <span className='author-card__subscribe-btn-accent'>PW</span>
</Button>
```

### NewsletterForm - Submit button

```tsx
<Button type='submit' variant='solid' fullWidth disabled={isLoading}>
  {isLoading ? 'Отправка...' : 'Подписаться'}
</Button>
```

## Стилизация

### Кастомные стили

Можно добавить дополнительные классы через prop `className`:

```tsx
<Button className='my-custom-button'>Кнопка</Button>
```

### Акцентные элементы внутри

```scss
.my-component {
  .accent {
    color: var(--color-success);
    font-weight: 600;
  }
}
```

## Accessibility

- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Focus visible outline
- ✅ ARIA disabled state
- ✅ Semantic HTML (`<button>` или `<a>`)
- ✅ Screen reader friendly

## Темы

Автоматически адаптируется под светлую и темную темы через CSS переменные.
