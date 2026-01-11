import { Category } from '@/types';

/**
 * Mock-данные категорий
 *
 * В будущем будут заменены на данные из API
 * Slug категорий используются в маршрутизации /category-slug
 */
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Экономика внимания',
    slug: 'attention-economy',
    description:
      'Как привлекать и удерживать внимание аудитории в цифровую эпоху',
    articleCount: 5,
  },
  {
    id: '2',
    name: 'ИИ-автоматизация',
    slug: 'ai-automation',
    description:
      'Использование искусственного интеллекта для автоматизации рутинных задач',
    articleCount: 3,
  },
  {
    id: '3',
    name: 'UI/UX дизайн',
    slug: 'ui-ux-design',
    description: 'Принципы создания удобных и красивых интерфейсов',
    articleCount: 4,
  },
  {
    id: '4',
    name: 'Взгляд в будущее',
    slug: 'future-vision',
    description: 'Тренды и прогнозы развития технологий и общества',
    articleCount: 2,
  },
  {
    id: '5',
    name: 'Редакторская деятельность',
    slug: 'editorial-work',
    description: 'Искусство создания и редактирования контента',
    articleCount: 3,
  },
];
