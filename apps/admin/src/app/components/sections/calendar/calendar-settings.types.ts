export type SettingsSection =
  | 'general'
  | 'appearance'
  | 'ai-agent'
  | 'content-plan'
  | 'notifications'
  | 'integrations';

export interface CalendarSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
