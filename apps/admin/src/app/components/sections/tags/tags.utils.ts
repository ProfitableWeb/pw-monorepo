/** Возвращает CSS-класс размера текста в зависимости от количества статей */
export const getTagSize = (count: number, maxCount: number): string => {
  const ratio = count / maxCount;
  if (ratio > 0.7) return 'text-4xl';
  if (ratio > 0.5) return 'text-3xl';
  if (ratio > 0.3) return 'text-2xl';
  if (ratio > 0.15) return 'text-xl';
  return 'text-base';
};

/** Возвращает CSS-класс прозрачности в зависимости от количества статей */
export const getTagOpacity = (count: number, maxCount: number): string => {
  const ratio = count / maxCount;
  if (ratio > 0.7) return 'opacity-100';
  if (ratio > 0.5) return 'opacity-90';
  if (ratio > 0.3) return 'opacity-80';
  if (ratio > 0.15) return 'opacity-70';
  return 'opacity-60';
};
