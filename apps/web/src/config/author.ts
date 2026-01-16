export const AUTHOR_DATA = {
  id: 'https://profitableweb.ru/author#person',
  name: 'Николай Егоров',
  firstName: 'Николай',
  lastName: 'Егоров',
  jobTitle: 'Фуллстек-разработчик и дизайнер',
  description:
    'Исследователь агентных систем, AI-автоматизации. Фуллстек-разработчик и дизайнер с опытом более 15 лет.',
  bio: [
    'Фуллстек-разработчик и дизайнер с опытом более 15 лет. Специализируюсь на создании высоконагруженных веб-приложений и сложных интерфейсных решений.',
    'Исследователь в области агентных систем и AI-автоматизации. Изучаю возможности применения искусственного интеллекта для оптимизации бизнес-процессов и создания автономных цифровых сущностей.',
    'Основатель ProfitableWeb — площадки для исследования и создания прибыльных веб-проектов, где технологии встречаются с экономикой и дизайном.',
  ],
  specialization: [
    {
      label: 'Разработка',
      value: 'Архитектура сложных систем, Fullstack, Agentic AI',
    },
    { label: 'Дизайн', value: 'Продуктовый дизайн, UX/UI, Типографика' },
    {
      label: 'Исследования',
      value: 'Автоматизация, Цифровая экономика, Сложные системы',
    },
  ],
  avatar: '/imgs/author/avatar.jpg',
  url: 'https://profitableweb.ru/author',
  socials: [
    { name: 'VK', url: 'https://vk.com/profitableweb.ru' },
    { name: 'Telegram', url: 'https://t.me/ProfitableWeb_ru' },
    { name: 'Dzen', url: 'https://dzen.ru/profitableweb' },
    { name: 'GitHub', url: 'https://github.com/profitableweb' },
  ],
  email: 'hello@profitableweb.ru',
};

export const AUTHOR_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': AUTHOR_DATA.id,
  name: AUTHOR_DATA.name,
  givenName: AUTHOR_DATA.firstName,
  familyName: AUTHOR_DATA.lastName,
  jobTitle: AUTHOR_DATA.jobTitle,
  description: AUTHOR_DATA.description,
  url: AUTHOR_DATA.url,
  image: `https://profitableweb.ru${AUTHOR_DATA.avatar}`,
  sameAs: AUTHOR_DATA.socials.map(s => s.url),
};
