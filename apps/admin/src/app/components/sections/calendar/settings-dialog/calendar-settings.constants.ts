import { LayoutGrid, Palette, Bot, FileText, Bell, Link2 } from 'lucide-react';
import type { SettingsSection } from './calendar-settings.types';

export interface SettingsNavItem {
  id: SettingsSection;
  label: string;
  icon: typeof LayoutGrid;
}

export const SETTINGS_SECTIONS: SettingsNavItem[] = [
  { id: 'general', label: 'Общие', icon: LayoutGrid },
  { id: 'appearance', label: 'Оформление', icon: Palette },
  { id: 'ai-agent', label: 'AI Агент', icon: Bot },
  { id: 'content-plan', label: 'Контент-план', icon: FileText },
  { id: 'notifications', label: 'Уведомления', icon: Bell },
  { id: 'integrations', label: 'Интеграции', icon: Link2 },
];
