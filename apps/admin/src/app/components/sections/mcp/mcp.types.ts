import type { LucideIcon } from 'lucide-react';

/** ID секции навигации в MCP-разделе */
export type McpSectionId = 'keys' | 'guide' | 'audit';

/** Секция навигации в MCP-разделе */
export interface McpSection {
  id: McpSectionId;
  label: string;
  icon: LucideIcon;
}

export type McpKeyScope = 'read' | 'write' | 'admin';

export interface McpApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  scope: McpKeyScope;
  isActive: boolean;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  userName?: string;
}

/** Payload для создания MCP-ключа */
export interface McpKeyCreatePayload {
  name: string;
  scope: McpKeyScope;
  expires_in_days?: number | null;
}

/** Ответ при создании — содержит raw key (показывается один раз) */
export interface McpApiKeyCreateResult {
  id: string;
  name: string;
  rawKey: string;
  keyPrefix: string;
  scope: McpKeyScope;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export interface McpAuditEntry {
  id: string;
  timestamp: string;
  keyPrefix: string;
  keyName: string;
  tool: string;
  resourceType: string | null;
  resourceId: string | null;
  userName: string | null;
}

export interface McpConnectionStatus {
  available: boolean;
  toolCount: number;
}
