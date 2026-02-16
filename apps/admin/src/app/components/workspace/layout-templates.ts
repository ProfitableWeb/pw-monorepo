import type { LayoutNode } from '@/app/types/workspace-layout';

let nextId = 1;
function uid() {
  return `panel-${nextId++}`;
}

/** Сбросить счётчик (для тестов) */
export function resetIdCounter() {
  nextId = 1;
}

/** Одна панель на весь центр */
export function editorLayout(): LayoutNode {
  return { type: 'panel', id: uid(), tabs: [], activeTabId: null };
}

/** Горизонтальный split 50/50 */
export function editorPreviewLayout(): LayoutNode {
  return {
    type: 'split',
    id: uid(),
    direction: 'horizontal',
    ratio: 0.5,
    first: { type: 'panel', id: uid(), tabs: [], activeTabId: null },
    second: { type: 'panel', id: uid(), tabs: [], activeTabId: null },
  };
}

/** Три панели: источники | редактор / превью */
export function researchLayout(): LayoutNode {
  return {
    type: 'split',
    id: uid(),
    direction: 'horizontal',
    ratio: 0.35,
    first: { type: 'panel', id: uid(), tabs: [], activeTabId: null },
    second: {
      type: 'split',
      id: uid(),
      direction: 'vertical',
      ratio: 0.6,
      first: { type: 'panel', id: uid(), tabs: [], activeTabId: null },
      second: { type: 'panel', id: uid(), tabs: [], activeTabId: null },
    },
  };
}

export type LayoutTemplate = {
  name: string;
  label: string;
  create: () => LayoutNode;
};

export const layoutTemplates: LayoutTemplate[] = [
  { name: 'editor', label: 'Редактор', create: editorLayout },
  {
    name: 'editor-preview',
    label: 'Редактор + превью',
    create: editorPreviewLayout,
  },
  { name: 'research', label: 'Исследование', create: researchLayout },
];

export function getDefaultLayout(): LayoutNode {
  return editorLayout();
}
