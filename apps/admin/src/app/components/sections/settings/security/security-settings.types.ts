import type { LucideIcon } from 'lucide-react';

export interface SecuritySettingsProps {
  onChangeDetected: () => void;
}

export interface RoleDefinition {
  name: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  permissions: RolePermission[];
}

export interface RolePermission {
  label: string;
  granted: boolean;
}

export interface BlockedIpEntry {
  ip: string;
  addedDate: string;
}

export interface ApiTokenEntry {
  name: string;
  active: boolean;
  createdAt: string;
  description: string;
  maskedKey: string;
  revoked?: boolean;
}

export interface SecurityLogEntry {
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  title: string;
  details: string;
}
