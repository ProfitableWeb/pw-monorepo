import {
  BookOpen,
  Users,
  Target,
  FileText,
  Shield,
  TrendingUp,
  Rocket,
  Bot,
  Sparkles,
  Heart,
} from 'lucide-react';
import type { NavigationItem, ManifestData } from './manifest.types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'manifest-doc', label: 'Конструктор', icon: Sparkles },
  { id: 'mission', label: 'Миссия и ценности', icon: Heart },
  { id: 'audience', label: 'Целевая аудитория', icon: Users },
  { id: 'positioning', label: 'Позиционирование', icon: Target },
  { id: 'content-strategy', label: 'Контент-стратегия', icon: FileText },
  { id: 'editorial', label: 'Редакционная политика', icon: Shield },
  { id: 'metrics', label: 'Метрики успеха', icon: TrendingUp },
  { id: 'development', label: 'Развитие', icon: Rocket },
];

export const defaultManifest: ManifestData = {
  mission: {
    purpose: '',
    problem: '',
    vision: '',
    values: '',
  },
  audience: {
    target: '',
    pains: '',
    goals: '',
    channels: '',
    language: '',
  },
  positioning: {
    uniqueness: '',
    toneOfVoice: '',
    boundaries: '',
    expertise: '',
  },
  contentStrategy: {
    topics: '',
    formats: '',
    frequency: '',
    quality: '',
  },
  editorialPolicy: {
    topicSelection: '',
    research: '',
    factChecking: '',
    ethics: '',
  },
  metrics: {
    kpis: '',
    successDefinition: '',
    targets: '',
  },
  development: {
    direction: '',
    changes: '',
    experiments: '',
  },
  aiInstructions: {
    priorities: '',
    forbidden: '',
    examples: '',
    approval: '',
    sources: '',
  },
};

export const sections = [
  {
    id: 'mission',
    title: 'Миссия и видение',
    icon: BookOpen,
    color: 'text-blue-500',
    fields: [
      {
        key: 'purpose',
        label: 'Почему мы существуем?',
        placeholder: 'Глобальная цель издания...',
      },
      {
        key: 'problem',
        label: 'Какую проблему решаем?',
        placeholder: 'Боль аудитории...',
      },
      {
        key: 'vision',
        label: 'Какой мир мы хотим создать?',
        placeholder: 'Долгосрочное видение...',
      },
      {
        key: 'values',
        label: 'Наши ценности',
        placeholder: 'Принципы, которыми руководствуемся...',
      },
    ],
  },
  {
    id: 'audience',
    title: 'Аудитория',
    icon: Users,
    color: 'text-green-500',
    fields: [
      {
        key: 'target',
        label: 'Кто ваша целевая аудитория?',
        placeholder: 'Детальное описание...',
      },
      {
        key: 'pains',
        label: 'Их боли и проблемы',
        placeholder: 'Что их беспокоит...',
      },
      {
        key: 'goals',
        label: 'Их цели и стремления',
        placeholder: 'К чему они идут...',
      },
      {
        key: 'channels',
        label: 'Где они находятся?',
        placeholder: 'Каналы и платформы...',
      },
      {
        key: 'language',
        label: 'Язык аудитории',
        placeholder: 'Как они говорят, какие термины используют...',
      },
    ],
  },
  {
    id: 'positioning',
    title: 'Позиционирование',
    icon: Target,
    color: 'text-purple-500',
    fields: [
      {
        key: 'uniqueness',
        label: 'Наша уникальность',
        placeholder: 'Чем отличаемся от конкурентов...',
      },
      {
        key: 'toneOfVoice',
        label: 'Tone of Voice',
        placeholder: 'Как мы говорим (экспертно/дружелюбно/провокационно)...',
      },
      {
        key: 'boundaries',
        label: 'Что мы НЕ делаем',
        placeholder: 'Границы контента...',
      },
      {
        key: 'expertise',
        label: 'Наша экспертиза',
        placeholder: 'В чем мы сильны...',
      },
    ],
  },
  {
    id: 'contentStrategy',
    title: 'Контентная стратегия',
    icon: FileText,
    color: 'text-orange-500',
    fields: [
      {
        key: 'topics',
        label: 'Основные темы',
        placeholder: 'Топ-5 направлений контента...',
      },
      {
        key: 'formats',
        label: 'Форматы контента',
        placeholder: 'Статьи, гайды, кейсы, интервью...',
      },
      {
        key: 'frequency',
        label: 'Частота публикаций',
        placeholder: 'Сколько и когда...',
      },
      {
        key: 'quality',
        label: 'Стандарты качества',
        placeholder: 'Критерии хорошей статьи...',
      },
    ],
  },
  {
    id: 'editorialPolicy',
    title: 'Редакционная политика',
    icon: Shield,
    color: 'text-red-500',
    fields: [
      {
        key: 'topicSelection',
        label: 'Как мы выбираем темы?',
        placeholder: 'Критерии отбора...',
      },
      {
        key: 'research',
        label: 'Как мы исследуем?',
        placeholder: 'Методология...',
      },
      {
        key: 'factChecking',
        label: 'Как мы проверяем факты?',
        placeholder: 'Стандарты...',
      },
      {
        key: 'ethics',
        label: 'Этические принципы',
        placeholder: 'Что допустимо, что нет...',
      },
    ],
  },
  {
    id: 'metrics',
    title: 'Метрики успеха',
    icon: TrendingUp,
    color: 'text-cyan-500',
    fields: [
      { key: 'kpis', label: 'Ключевые KPI', placeholder: 'Что измеряем...' },
      {
        key: 'successDefinition',
        label: 'Определение успешной статьи',
        placeholder: 'Конкретные цифры...',
      },
      {
        key: 'targets',
        label: 'Целевые показатели',
        placeholder: 'К чему стремимся...',
      },
    ],
  },
  {
    id: 'development',
    title: 'Развитие и эволюция',
    icon: Rocket,
    color: 'text-pink-500',
    fields: [
      {
        key: 'direction',
        label: 'Куда мы идем?',
        placeholder: 'Планы на год/3 года...',
      },
      {
        key: 'changes',
        label: 'Что будем менять?',
        placeholder: 'Области развития...',
      },
      {
        key: 'experiments',
        label: 'Эксперименты',
        placeholder: 'Что хотим попробовать...',
      },
    ],
  },
  {
    id: 'aiInstructions',
    title: 'Инструкции для AI',
    icon: Bot,
    color: 'text-violet-500',
    fields: [
      {
        key: 'priorities',
        label: 'Приоритеты при выборе тем',
        placeholder: 'Алгоритм принятия решений...',
      },
      {
        key: 'forbidden',
        label: 'Запрещенные темы/подходы',
        placeholder: 'Чего избегать...',
      },
      {
        key: 'examples',
        label: 'Примеры идеальных статей',
        placeholder: 'Референсы...',
      },
      {
        key: 'approval',
        label: 'Процесс согласования',
        placeholder: 'Когда нужно человеческое одобрение...',
      },
      {
        key: 'sources',
        label: 'Используемые источники',
        placeholder: 'Откуда брать информацию...',
      },
    ],
  },
];

export const aiQuestions = [
  {
    id: 1,
    section: 'mission',
    question: 'Почему вы решили создать это издание?',
    hint: 'Подумайте о том, что вас мотивирует, какую ценность вы хотите принести миру.',
  },
  {
    id: 2,
    section: 'audience',
    question: 'Опишите вашего идеального читателя. Кто он?',
    hint: 'Возраст, профессия, интересы, проблемы, к чему стремится.',
  },
  {
    id: 3,
    section: 'positioning',
    question: 'Чем ваше издание отличается от других в вашей ие?',
    hint: 'Уникальный угол зрения, подход, экспертиза, формат.',
  },
  {
    id: 4,
    section: 'contentStrategy',
    question: 'О чем вы будете писать чаще всего? Назовите топ-3 темы.',
    hint: 'Сфокусируйтесь на том, в чем вы действительны эксперт.',
  },
  {
    id: 5,
    section: 'metrics',
    question: 'Как вы поймете, что ваше издание успешно?',
    hint: 'Конкретные цифры: просмотры, подписчики, вовлеченность, доход.',
  },
];
