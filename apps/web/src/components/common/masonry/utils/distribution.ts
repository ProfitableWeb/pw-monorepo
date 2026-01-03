import { Article } from '../types';

/**
 * Распределяет статьи по колонкам используя shortest column first алгоритм
 *
 * @param articles - Массив статей для распределения
 * @param columnCount - Количество колонок
 * @returns Массив колонок, каждая содержит массив статей
 *
 * @example
 * ```ts
 * const columns = distributeArticles(articles, 3);
 * columns[0] // Первая колонка со статьями
 * ```
 */
export function distributeArticles(
  articles: Article[],
  columnCount: number
): Article[][] {
  // Инициализация колонок
  const columns: Article[][] = Array.from({ length: columnCount }, () => []);

  // Отслеживание высоты каждой колонки (грубая оценка)
  const columnHeights: number[] = Array(columnCount).fill(0);

  articles.forEach(article => {
    // Находим колонку с минимальной высотой
    const shortestColumnIndex = columnHeights.indexOf(
      Math.min(...columnHeights)
    );

    // Добавляем статью в эту колонку
    columns[shortestColumnIndex]?.push(article);

    // Оцениваем высоту статьи (базовая формула)
    const estimatedHeight = estimateArticleHeight(article);
    if (columnHeights[shortestColumnIndex] !== undefined) {
      columnHeights[shortestColumnIndex] += estimatedHeight;
    }
  });

  return columns;
}

/**
 * Оценивает примерную высоту карточки статьи
 * Используется для shortest column first алгоритма
 */
function estimateArticleHeight(article: Article): number {
  let height = 0;

  // Заголовок + подзаголовок + дата (всегда присутствуют)
  height += 100;

  // Изображение (если есть)
  if (article.imageUrl) {
    height += 152 + 16; // высота изображения + margin
  }

  // Аннотация (примерная оценка по длине)
  const summaryLength = article.summary.replace(/<[^>]*>/g, '').length;
  height += Math.ceil(summaryLength / 50) * 20; // ~50 символов на строку, 20px высота строки

  // Padding внизу
  height += 30;

  return height;
}



