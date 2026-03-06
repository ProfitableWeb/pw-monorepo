let _nextId = 1;

/** Генерирует уникальный ID для элементов артефактов (timestamp + счётчик). */
export function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${_nextId++}`;
}
