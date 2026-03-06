/**
 * Типы docking-layout для рабочего пространства исследований.
 *
 * LayoutNode — рекурсивное дерево: LayoutSplit делит область на две части,
 * LayoutPanel содержит вкладки (PanelTab). Поведение вкладок:
 * - `isPinned: false` — превью-вкладка (курсив, заменяется при клике на новый элемент)
 * - `isPinned: true` — закреплённая вкладка (остаётся открытой)
 * - `isDirty` — индикатор несохранённых изменений (●)
 *
 * @see store/workspace-layout-store.ts — управление деревом layout
 */
export type SplitDirection = 'horizontal' | 'vertical';
export type ItemType = 'note' | 'draft' | 'source' | 'media' | 'ai-chat';

export interface PanelTab {
  id: string;
  itemType: ItemType;
  itemId: string;
  title: string;
  isPinned: boolean; // false = превью (курсив, заменяется при следующем клике)
  isDirty?: boolean; // несохранённые изменения (индикатор ●)
}

export interface LayoutPanel {
  type: 'panel';
  id: string;
  tabs: PanelTab[];
  activeTabId: string | null;
}

export interface LayoutSplit {
  type: 'split';
  id: string;
  direction: SplitDirection;
  ratio: number; // 0..1, позиция разделителя
  first: LayoutNode;
  second: LayoutNode;
}

export type LayoutNode = LayoutSplit | LayoutPanel;
