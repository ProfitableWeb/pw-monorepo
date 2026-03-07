export interface AdCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft' | 'completed';
  type: 'banner' | 'native' | 'video' | 'text';
  impressions: number;
  clicks: number;
  ctr: number;
  spent: number;
  budget: number;
  startDate: string;
  endDate: string;
}

export interface AdPlacement {
  id: string;
  name: string;
  location: string;
  format: string;
  fillRate: number;
  revenue: number;
  impressions: number;
}
