// Мок-данные уведомлений
export const agentNotifications = [
  {
    id: '1',
    type: 'agent',
    title: 'Исследование завершено',
    description: 'AI-агент завершил исследование рынка блоков питания',
    time: '5 мин назад',
    status: 'completed',
  },
  {
    id: '2',
    type: 'agent',
    title: 'Статья написана',
    description: 'Готова статья «10 трендов веб-дизайна 2026»',
    time: '1 час назад',
    status: 'completed',
  },
];

export const publicationNotifications = [
  {
    id: '3',
    type: 'publication',
    title: 'Публикация через 2 часа',
    description: 'Статья «Гайд по React Server Components» будет опубликована',
    time: 'Сегодня в 15:00',
    status: 'scheduled',
  },
  {
    id: '4',
    type: 'publication',
    title: 'Публикация завтра',
    description: 'Обзор «Лучшие практики TypeScript» ожидает публикации',
    time: 'Завтра в 10:00',
    status: 'scheduled',
  },
];
