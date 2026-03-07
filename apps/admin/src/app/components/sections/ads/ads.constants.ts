import type { AdCampaign, AdPlacement } from './ads.types';

export const campaigns: AdCampaign[] = [
  {
    id: '1',
    name: 'Промо премиум подписки',
    status: 'active',
    type: 'banner',
    impressions: 125000,
    clicks: 3200,
    ctr: 2.56,
    spent: 4500,
    budget: 10000,
    startDate: '1 фев 2026',
    endDate: '28 фев 2026',
  },
  {
    id: '2',
    name: 'Курс по веб-разработке',
    status: 'active',
    type: 'native',
    impressions: 89000,
    clicks: 2800,
    ctr: 3.15,
    spent: 3200,
    budget: 8000,
    startDate: '5 фев 2026',
    endDate: '5 мар 2026',
  },
  {
    id: '3',
    name: 'Партнерская программа',
    status: 'paused',
    type: 'text',
    impressions: 45000,
    clicks: 890,
    ctr: 1.98,
    spent: 1800,
    budget: 5000,
    startDate: '10 янв 2026',
    endDate: '10 фев 2026',
  },
  {
    id: '4',
    name: 'Видео-обзоры',
    status: 'draft',
    type: 'video',
    impressions: 0,
    clicks: 0,
    ctr: 0,
    spent: 0,
    budget: 15000,
    startDate: '15 фев 2026',
    endDate: '15 мар 2026',
  },
];

export const placements: AdPlacement[] = [
  {
    id: '1',
    name: 'Сайдбар десктоп',
    location: 'Правая колонка',
    format: 'Banner 300x600',
    fillRate: 92,
    revenue: 2400,
    impressions: 89000,
  },
  {
    id: '2',
    name: 'Между статьями',
    location: 'Лента блога',
    format: 'Native',
    fillRate: 85,
    revenue: 3200,
    impressions: 125000,
  },
  {
    id: '3',
    name: 'Мобильный баннер',
    location: 'Низ экрана',
    format: 'Banner 320x100',
    fillRate: 78,
    revenue: 1800,
    impressions: 67000,
  },
  {
    id: '4',
    name: 'В статье',
    location: 'Середина контента',
    format: 'Banner 728x90',
    fillRate: 95,
    revenue: 4100,
    impressions: 156000,
  },
];

export const statusLabels: Record<AdCampaign['status'], string> = {
  active: 'Активна',
  paused: 'Пауза',
  draft: 'Черновик',
  completed: 'Завершена',
};

export const statusColors: Record<AdCampaign['status'], string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  paused: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

export const typeLabels: Record<AdCampaign['type'], string> = {
  banner: 'Баннер',
  native: 'Нативная',
  video: 'Видео',
  text: 'Текстовая',
};
