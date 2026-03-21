import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMcpKeys,
  createMcpKey,
  toggleMcpKey,
  deleteMcpKey,
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

export function useToggleMcpKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (keyId: string) => toggleMcpKey(keyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminMcpKeys.keys() });
    },
  });
}

export function useDeleteMcpKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (keyId: string) => deleteMcpKey(keyId),
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
