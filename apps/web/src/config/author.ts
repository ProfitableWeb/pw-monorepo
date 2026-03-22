/**
 * Минимальный fallback для случая, когда API недоступен.
 * Основные данные автора приходят из GET /api/authors/primary.
 */
export const AUTHOR_FALLBACK = {
  name: 'ProfitableWeb',
  jobTitle: 'Автор',
  description: 'Автор исследовательского блога ProfitableWeb',
  avatar: '/imgs/author/avatar.jpg',
  email: 'hello@profitableweb.ru',
};
