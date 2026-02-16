import type {
  Research,
  ResearchNote,
  ResearchSource,
  ResearchDraft,
  ResearchMedia,
  ResearchPublication,
} from '@/app/types/research';

// === Пользователи ===

const users = {
  nikolay: { id: 'user-1', name: 'Николай', avatarUrl: undefined },
  anna: { id: 'user-2', name: 'Анна Петрова', avatarUrl: undefined },
  maxim: { id: 'user-3', name: 'Максим Иванов', avatarUrl: undefined },
};

// === Исследования ===

export const mockResearches: Research[] = [
  {
    id: 'research-1',
    title: 'AI и автоматизация труда: кто потеряет работу к 2030?',
    description:
      'Комплексный анализ влияния генеративного AI на рынок труда. Какие профессии исчезнут, какие трансформируются, а какие появятся.',
    status: 'in_progress',
    categoryId: 'cat-ai',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-14T18:30:00Z',
    members: [
      { userId: 'user-1', role: 'owner', user: users.nikolay },
      { userId: 'user-2', role: 'editor', user: users.anna },
    ],
  },
  {
    id: 'research-2',
    title: 'Экономика промптов: новая профессия или временный хайп?',
    description:
      'Исследование рынка prompt engineering. Реальный спрос, зарплаты, перспективы, сравнение с другими AI-специальностями.',
    status: 'completed',
    createdAt: '2025-11-20T09:00:00Z',
    updatedAt: '2026-01-10T14:00:00Z',
    members: [{ userId: 'user-1', role: 'owner', user: users.nikolay }],
  },
  {
    id: 'research-3',
    title: 'No-code инструменты для создания контента',
    description:
      'Обзор и сравнение AI-инструментов для создания текстов, изображений, видео. Workflow автора-одиночки.',
    status: 'idea',
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-02-10T12:00:00Z',
    members: [
      { userId: 'user-1', role: 'owner', user: users.nikolay },
      { userId: 'user-2', role: 'viewer', user: users.anna },
      { userId: 'user-3', role: 'editor', user: users.maxim },
    ],
  },
];

// === Заметки ===

export const mockNotes: ResearchNote[] = [
  {
    id: 'note-1',
    researchId: 'research-1',
    title: 'Ключевые тезисы McKinsey Report 2025',
    content: `# McKinsey: Generative AI and the future of work

## Основные выводы

- К 2030 году **до 30% рабочих часов** в экономике США могут быть автоматизированы
- Наиболее уязвимы: офисные работники, специалисты по обработке данных, бухгалтеры
- Новые роли: AI-тренеры, операторы автономных систем, этика AI

## Цитаты

> "Generative AI has the potential to automate work activities that absorb 60 to 70 percent of employees' time today."

## Мои мысли

Отчёт слишком оптимистичен по срокам. Реальная автоматизация зависит от:
1. Скорости внедрения (корпорации медленные)
2. Регуляторного давления (EU AI Act)
3. Качества моделей в узких доменах`,
    authorId: 'user-1',
    createdAt: '2026-01-16T11:00:00Z',
    updatedAt: '2026-02-01T15:30:00Z',
  },
  {
    id: 'note-2',
    researchId: 'research-1',
    title: 'Интервью с HR-директором Яндекса',
    content: `# Заметки из интервью

**Дата**: 25 января 2026
**Собеседник**: Мария С., HR-директор, Яндекс

## Ключевые моменты

- Яндекс уже сократил 15% позиций в поддержке благодаря AI
- Программисты не сокращаются, но **джуниоров нанимают меньше**
- Внутренний AI-ассистент используют 80% сотрудников
- Появились новые роли: «AI-координатор» в каждом отделе`,
    authorId: 'user-1',
    createdAt: '2026-01-25T16:00:00Z',
    updatedAt: '2026-01-25T16:00:00Z',
  },
  {
    id: 'note-3',
    researchId: 'research-2',
    title: 'Результаты опроса prompt-инженеров',
    content: `# Опрос: 50 prompt engineers

## Методология
- LinkedIn + Reddit + профильные Telegram-каналы
- 50 респондентов из 12 стран

## Ключевые результаты
- Средняя зарплата: $95K (разброс $45K-$180K)
- 70% пришли из смежных областей (копирайтинг, ML, UX)
- 40% считают профессию «временной» (3-5 лет)
- Главный навык: **понимание домена**, не техника промптинга`,
    authorId: 'user-1',
    createdAt: '2025-12-05T10:00:00Z',
    updatedAt: '2025-12-20T14:00:00Z',
  },
];

// === Источники ===

export const mockSources: ResearchSource[] = [
  {
    id: 'source-1',
    researchId: 'research-1',
    title: 'McKinsey Global Institute: A new future of work',
    url: 'https://mckinsey.com/mgi/overview/a-new-future-of-work',
    annotation:
      'Флагманский отчёт McKinsey по влиянию генеративного AI на рынок труда. 68 стран, 800 профессий.',
    quotes: [
      'About 60 percent of occupations have at least 30 percent of activities that could be automated.',
      'The midpoint scenario suggests 15% of the global workforce may need to change occupations by 2030.',
    ],
    authorId: 'user-1',
    createdAt: '2026-01-16T10:30:00Z',
  },
  {
    id: 'source-2',
    researchId: 'research-1',
    title:
      'Goldman Sachs: The Potentially Large Effects of AI on Economic Growth',
    url: 'https://goldmansachs.com/insights/pages/generative-ai-could-raise-global-gdp',
    annotation:
      'Экономическое моделирование эффекта AI. Прогноз роста GDP на 7% за 10 лет. Потенциальная автоматизация 300M рабочих мест глобально.',
    quotes: [
      'Roughly two-thirds of current jobs are exposed to some degree of AI automation.',
    ],
    authorId: 'user-1',
    createdAt: '2026-01-18T09:00:00Z',
  },
  {
    id: 'source-3',
    researchId: 'research-2',
    title: "O'Reilly: 2025 Tech Salary Survey",
    url: 'https://oreilly.com/radar/2025-salary-survey',
    annotation:
      'Данные по зарплатам в tech. Секция по AI-ролям: prompt engineer, ML engineer, AI product manager.',
    quotes: [],
    authorId: 'user-1',
    createdAt: '2025-11-25T11:00:00Z',
  },
];

// === Черновики ===

export const mockDrafts: ResearchDraft[] = [
  {
    id: 'draft-1',
    researchId: 'research-1',
    title: 'Черновик v1: Кто потеряет работу?',
    content: `# AI и работа: реальность за хайпом

**Лид**: Каждую неделю выходит новый отчёт о том, как AI заберёт миллионы рабочих мест. Но что говорят реальные данные?

## Три лагеря

### Алармисты
McKinsey и Goldman Sachs рисуют картину массовой автоматизации...

### Оптимисты
MIT и OECD указывают на исторические параллели...

### Реалисты
Компании вроде Яндекса показывают промежуточный сценарий...

## Кто реально уязвим

*TODO: таблица профессий с оценкой риска*

## Выводы

*TODO: дописать*`,
    authorId: 'user-1',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-10T17:00:00Z',
  },
  {
    id: 'draft-2',
    researchId: 'research-2',
    title: 'Финальный драфт: Экономика промптов',
    content: `# Prompt Engineering: профессия или миф?

Год назад LinkedIn взорвался вакансиями «prompt engineer» с зарплатами $300K+. Сегодня рынок выглядит иначе.

## Расцвет и охлаждение

В 2024 году на LinkedIn было 15,000+ вакансий с упоминанием prompt engineering. К концу 2025 — менее 3,000. Что произошло?

## Данные опроса

Мы опросили 50 практикующих prompt-инженеров из 12 стран...

## Вердикт

Prompt engineering как отдельная профессия — **переходная форма**. Навыки промптинга станут частью любой роли, как сегодня Excel.`,
    authorId: 'user-1',
    createdAt: '2025-12-15T10:00:00Z',
    updatedAt: '2026-01-08T16:00:00Z',
  },
];

// === Медиа ===

export const mockMedia: ResearchMedia[] = [
  {
    id: 'media-1',
    researchId: 'research-1',
    fileName: 'mckinsey-automation-chart.png',
    fileUrl: '/uploads/research/mckinsey-automation-chart.png',
    mimeType: 'image/png',
    size: 245_760,
    authorId: 'user-1',
    createdAt: '2026-01-16T10:35:00Z',
  },
  {
    id: 'media-2',
    researchId: 'research-1',
    fileName: 'goldman-sachs-gdp-impact.pdf',
    fileUrl: '/uploads/research/goldman-sachs-gdp-impact.pdf',
    mimeType: 'application/pdf',
    size: 1_048_576,
    authorId: 'user-1',
    createdAt: '2026-01-18T09:05:00Z',
  },
  {
    id: 'media-3',
    researchId: 'research-2',
    fileName: 'salary-survey-data.xlsx',
    fileUrl: '/uploads/research/salary-survey-data.xlsx',
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 524_288,
    authorId: 'user-1',
    createdAt: '2025-11-25T11:10:00Z',
  },
];

// === Публикации ===

export const mockPublications: ResearchPublication[] = [
  {
    id: 'pub-1',
    researchId: 'research-2',
    type: 'article',
    title: 'Prompt Engineering: профессия или миф?',
    articleId: 'article-42',
    status: 'published',
  },
  {
    id: 'pub-2',
    researchId: 'research-2',
    type: 'social_post',
    title: 'Тред: 5 фактов о prompt engineering',
    status: 'draft',
  },
];
