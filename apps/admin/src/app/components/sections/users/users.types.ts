export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'viewer';
  status: 'active' | 'inactive' | 'invited';
  avatar: string;
  lastActive: string;
  articlesCount: number;
  joinedDate?: string;
  department?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: any;
}
