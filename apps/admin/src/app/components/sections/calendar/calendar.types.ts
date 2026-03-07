export interface ScheduledPost {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'scheduled' | 'ai-suggestion' | 'event';
  category: string;
}
