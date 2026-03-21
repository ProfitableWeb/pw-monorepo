import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMcpKeys,
  createMcpKey,
  revokeMcpKey,
  getMcpAuditLog,
  testMcpConnection,
  type McpAuditParams,
} from '@/lib/api-client';
import type { McpKeyCreatePayload } from '@/app/components/sections/mcp/mcp.types';
import { adminMcpKeys } from '@/lib/query-keys';

export function useMcpKeys() {
  return useQuery({
    queryKey: adminMcpKeys.keys(),
    queryFn: getMcpKeys,
    staleTime: 30_000,
  });
}

export function useCreateMcpKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: McpKeyCreatePayload) => createMcpKey(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminMcpKeys.keys() });
    },
  });
}

export function useRevokeMcpKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (keyId: string) => revokeMcpKey(keyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminMcpKeys.keys() });
    },
  });
}

export function useMcpAuditLog(params?: McpAuditParams) {
  return useQuery({
    queryKey: [...adminMcpKeys.audit(), params],
    queryFn: () => getMcpAuditLog(params),
    staleTime: 15_000,
  });
}

export function useMcpConnectionTest() {
  return useMutation({
    mutationFn: testMcpConnection,
  });
}
