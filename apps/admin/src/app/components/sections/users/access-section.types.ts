export interface RolePermission {
  label: string;
  granted: boolean;
}

export interface RoleDefinition {
  name: string;
  description: string;
  colorClass: string;
  icon: 'shield-alert' | 'shield-check' | 'user-check';
  permissions: RolePermission[];
}

export interface BlockedIp {
  address: string;
  addedDate: string;
}

export interface ApiToken {
  name: string;
  active: boolean;
  description: string;
  maskedKey: string;
}

export type SecurityLogType =
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'blocked';

export interface SecurityLogEntry {
  type: SecurityLogType;
  title: string;
  details: string;
}
