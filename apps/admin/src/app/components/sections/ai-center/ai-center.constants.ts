export interface AIModel {
  id: string;
  name: string;
  description: string;
}

export const AI_MODELS: AIModel[] = [
  { id: 'opus-4.6', name: 'Opus 4.6', description: 'Самая мощная модель' },
  {
    id: 'sonnet-4.2',
    name: 'Sonnet 4.2',
    description: 'Баланс скорости и качества',
  },
  { id: 'glm-4.7', name: 'GLM 4.7', description: 'Быстрая и эффективная' },
  { id: 'haiku-3.5', name: 'Haiku 3.5', description: 'Максимальная скорость' },
];

export interface QuickPrompt {
  label: string;
  description: string;
  prompt: string;
  icon: 'FileText' | 'Sparkles' | 'Lightbulb' | 'Zap';
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    label: 'Написать статью',
    description: 'Создайте качественный контент для блога',
    prompt: 'Помоги написать статью о новых трендах в веб-разработке',
    icon: 'FileText',
  },
  {
    label: 'Анализ метрик',
    description: 'Получите инсайты по аналитике блога',
    prompt: 'Проанализируй текущие метрики блога и дай рекомендации',
    icon: 'Sparkles',
  },
  {
    label: 'Идеи контента',
    description: 'Найдите темы для новых публикаций',
    prompt: 'Предложи темы для следующих публикаций на основе трендов',
    icon: 'Lightbulb',
  },
  {
    label: 'SEO оптимизация',
    description: 'Улучшите видимость в поисковиках',
    prompt: 'Оптимизируй SEO для моих последних статей',
    icon: 'Zap',
  },
];

/** Иконки для выбора в диалоге создания шаблона */
export const TEMPLATE_ICON_OPTIONS = [
  { value: 'FileText', label: 'Документ' },
  { value: 'Sparkles', label: 'Искры' },
  { value: 'Lightbulb', label: 'Лампочка' },
  { value: 'Zap', label: 'Молния' },
  { value: 'PenLine', label: 'Ручка' },
  { value: 'TrendingUp', label: 'График' },
  { value: 'Search', label: 'Поиск' },
] as const;
