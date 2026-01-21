# Input Component

Универсальный компонент ввода с поддержкой тёмной и светлой темы.

## Использование

### Базовое использование

```tsx
import { Input } from '@/components/common/input';

// Простое поле ввода
<Input type='email' placeholder='your@email.com' value={email} onChange={e => setEmail(e.target.value)} />;
```

### С label

```tsx
// С заголовком поля
<Input type='email' label='Email адрес' value={email} onChange={e => setEmail(e.target.value)} required />
```

### С ошибкой

```tsx
// С сообщением об ошибке
<Input
  type='email'
  label='Email адрес'
  value={email}
  onChange={e => setEmail(e.target.value)}
  error='Пожалуйста, введите корректный email'
  required
/>

// Или просто визуальное состояние ошибки (без сообщения)
<Input type='email' value={email} onChange={e => setEmail(e.target.value)} error={hasError} />
```

### С вспомогательным текстом

```tsx
// С подсказкой под полем
<Input
  type='password'
  label='Пароль'
  helperText='Минимум 8 символов'
  value={password}
  onChange={e => setPassword(e.target.value)}
/>
```

### Disabled состояние

```tsx
// Неактивное поле
<Input type='text' value={value} disabled />

// Или условно
<Input
  type='email'
  value={email}
  onChange={e => setEmail(e.target.value)}
  disabled={isLoading || status === 'success'}
/>
```

### Полная ширина

```tsx
// На всю ширину контейнера
<Input type='email' fullWidth placeholder='your@email.com' value={email} onChange={e => setEmail(e.target.value)} />
```

## API

### Props

| Prop       | Type                                                                      | Default | Description                         |
| ---------- | ------------------------------------------------------------------------- | ------- | ----------------------------------- |
| type       | 'text' \| 'email' \| 'password' \| 'tel' \| 'number' \| 'url' \| 'search' | 'text'  | Тип input                           |
| label      | string                                                                    | -       | Текст label над полем               |
| helperText | string                                                                    | -       | Вспомогательный текст под полем     |
| error      | string \| boolean                                                         | -       | Сообщение об ошибке или флаг ошибки |
| fullWidth  | boolean                                                                   | false   | Полная ширина контейнера            |
| className  | string                                                                    | ''      | Дополнительные CSS классы           |
| ...props   | InputHTMLAttributes                                                       | -       | Все стандартные HTML атрибуты input |

### Состояния

#### Error State

```tsx
// Строка - показывает сообщение об ошибке
<Input error='Email должен быть корректным' />

// Булев - показывает только визуальное состояние ошибки
<Input error={hasError} />
```

#### Disabled State

```tsx
<Input disabled />
```

## Accessibility

- ✅ Правильная связь label с input через `htmlFor` и `id`
- ✅ `aria-invalid` для состояния ошибки
- ✅ `aria-describedby` для связи с helper text и error message
- ✅ Keyboard navigation работает корректно
- ✅ Focus visible для клавиатурной навигации
- ✅ Соответствие WCAG 2.1 Level AA

## Темы

Автоматически адаптируется под светлую и тёмную темы через CSS переменные:

```scss
// Тёмные цвета (data-theme="dark")
background: var(--input-background); // #262626
border: var(--input-border); // #525252
color: var(--input-text); // #f5f5f5

// Светлые цвета (data-theme="light")
background: var(--input-background); // #fafafa
border: var(--input-border); // #d4d4d4
color: var(--input-text); // #171717

// Ошибки (меняется с темой)
border-color: var(--color-error); // #f87171 (dark) / #ef4444 (light)
```

## Примеры из проекта

### NewsletterForm - Email input

```tsx
<Input
  type='email'
  value={email}
  onChange={e => setEmail(e.target.value)}
  placeholder='your@email.com'
  disabled={isLoading || status === 'success'}
  error={errorMessage || undefined}
  fullWidth
/>
```

### Форма авторизации (пример)

```tsx
<Input
  type='email'
  label='Email'
  placeholder='Введите email'
  value={email}
  onChange={e => setEmail(e.target.value)}
  error={errors.email}
  required
/>

<Input
  type='password'
  label='Пароль'
  helperText='Минимум 8 символов'
  placeholder='Введите пароль'
  value={password}
  onChange={e => setPassword(e.target.value)}
  error={errors.password}
  required
/>
```

## Стилизация

### Кастомные стили

Можно добавить дополнительные классы через prop `className`:

```tsx
<Input className='my-custom-input' placeholder='Custom styling' />
```

```scss
.my-custom-input {
  // Кастомные стили будут применены к input элементу
  border-radius: 12px;
  font-size: 18px;
}
```

### Вложенные элементы

Компонент рендерит следующую структуру:

```html
<div class="input-wrapper">
  <label class="input__label">Label <span class="input__required">*</span></label>
  <input class="input" />
  <p class="input__error-message">Error message</p>
  <p class="input__helper-text">Helper text</p>
</div>
```

CSS классы для стилизации:

- `.input-wrapper` - контейнер
- `.input__label` - label над полем
- `.input__required` - звездочка для обязательных полей
- `.input` - сам input
- `.input__error-message` - сообщение об ошибке
- `.input__helper-text` - вспомогательный текст

### Модификаторы состояний

```scss
// Ошибка
.input--error {
  border-color: var(--color-error);
}

// Неактивен
.input--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

// Полная ширина
.input--full-width {
  width: 100%;
}
```

## Особенности реализации

### ForwardRef

Компонент использует `forwardRef`, что позволяет передавать ref на нативный input элемент:

```tsx
const inputRef = useRef<HTMLInputElement>(null);

<Input ref={inputRef} type='text' />;

// Доступ к нативному элементу
const focusInput = () => {
  inputRef.current?.focus();
};
```

### Автоматическая генерация ID

Если не передан prop `id`, компонент автоматически генерирует уникальный ID для правильной связи с label.

### Атрибуты ARIA

Компонент автоматически устанавливает правильные ARIA атрибуты:

- `aria-invalid` - когда есть ошибка
- `aria-describedby` - связывает input с helper text и error message
- `role='alert'` - для error message

### TypeScript

Полная поддержка TypeScript с расширенными типами:

```tsx
import type { InputProps } from '@/components/common/input';

// Все стандартные input атрибуты доступны
const MyInput: React.FC<InputProps & { myCustomProp: string }> = props => {
  return <Input {...props} />;
};
```
