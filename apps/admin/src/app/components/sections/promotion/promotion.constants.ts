import { MessageCircle, Share2 } from 'lucide-react';

import type { Campaign, Channel } from './promotion.types';

export const channels: Channel[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    icon: MessageCircle,
    color: 'text-blue-500',
    subscribers: 12500,
    engagement: 8.5,
    posts: 142,
    reach: 98000,
    status: 'active',
  },
  {
    id: 'vk',
    name: 'ВКонтакте',
    icon: Share2,
    color: 'text-blue-600',
    subscribers: 8200,
    engagement: 5.2,
    posts: 98,
    reach: 45000,
    status: 'active',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: Share2,
    color: 'text-gray-900',
    subscribers: 3400,
    engagement: 6.8,
    posts: 234,
    reach: 28000,
    status: 'active',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Share2,
    color: 'text-red-500',
    subscribers: 5600,
    engagement: 12.3,
    posts: 24,
    reach: 156000,
    status: 'paused',
  },
];

export const campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Запуск нового формата статей',
    channel: 'Telegram',
    status: 'active',
    progress: 65,
    reach: 8500,
    engagement: 7.2,
    startDate: '15 янв 2026',
  },
  {
    id: '2',
    title: 'Промо серии гайдов по React',
    channel: 'ВКонтакте',
    status: 'active',
    progress: 42,
    reach: 3200,
    engagement: 5.8,
    startDate: '18 янв 2026',
  },
  {
    id: '3',
    title: 'Конкурс для читателей',
    channel: 'Twitter / X',
    status: 'scheduled',
    progress: 0,
    reach: 0,
    engagement: 0,
    startDate: '1 фев 2026',
  },
];

export const statusLabels: Record<Campaign['status'], string> = {
  active: 'Активна',
  scheduled: 'Запланирована',
  completed: 'Завершена',
};

export const statusColors: Record<Campaign['status'], string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  scheduled: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  completed: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};
