import type { Share2 } from 'lucide-react';

export interface Channel {
  id: string;
  name: string;
  icon: typeof Share2;
  color: string;
  subscribers: number;
  engagement: number;
  posts: number;
  reach: number;
  status: 'active' | 'paused' | 'scheduled';
}

export interface Campaign {
  id: string;
  title: string;
  channel: string;
  status: 'active' | 'scheduled' | 'completed';
  progress: number;
  reach: number;
  engagement: number;
  startDate: string;
}
