export type StyleMode = 'editorial' | 'personal';

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface StyleStats {
  completeness: number;
  rulesCount: number;
  termsCount: number;
  imagePromptsCount: number;
  lastUpdated: string;
}
