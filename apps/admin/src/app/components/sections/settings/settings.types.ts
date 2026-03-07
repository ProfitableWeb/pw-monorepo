import type { Settings } from 'lucide-react';

export interface SettingsCategory {
  id: string;
  label: string;
  icon: typeof Settings;
  sections?: {
    id: string;
    label: string;
  }[];
}
