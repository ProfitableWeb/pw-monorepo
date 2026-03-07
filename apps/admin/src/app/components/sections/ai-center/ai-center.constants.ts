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
