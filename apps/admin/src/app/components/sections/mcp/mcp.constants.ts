import { KeyRound, BookOpen, ScrollText } from 'lucide-react';
import type { McpSection } from './mcp.types';

/** Секции навигации в MCP-разделе */
export const mcpSections: McpSection[] = [
  { id: 'keys', label: 'Ключи доступа', icon: KeyRound },
  { id: 'guide', label: 'Подключение', icon: BookOpen },
  { id: 'audit', label: 'Лог действий', icon: ScrollText },
];
