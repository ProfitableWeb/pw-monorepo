import type {
  AdminUserBrief,
  AdminUserDetail,
  AdminUserListStats,
} from '@/lib/api-client';

/** Алиасы для краткости внутри секции users/ */
export type UserBrief = AdminUserBrief;
export type UserDetail = AdminUserDetail;
export type UserListStats = AdminUserListStats;

export type UserStatus = 'active' | 'inactive';

export interface NavigationItem {
  id: string;
  label: string;
  icon: any;
}
