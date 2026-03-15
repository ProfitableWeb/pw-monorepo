import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import {
  adminGetUsers,
  adminGetUserStats,
  adminGetUserDetail,
  adminUpdateUser,
  adminDeleteUser,
  adminUploadUserAvatar,
  adminDeleteUserAvatar,
  adminSetUserPassword,
  type AdminUsersParams,
} from '@/lib/api-client';

const userKeys = {
  all: ['admin', 'users'] as const,
  lists: () => [...userKeys.all] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
};

/** Хук для загрузки списка пользователей с фильтрацией */
export function useAdminUsers(params?: AdminUsersParams) {
  return useQuery({
    queryKey: [...userKeys.lists(), params],
    queryFn: () => adminGetUsers(params),
    placeholderData: keepPreviousData,
  });
}

/** Хук для загрузки статистики пользователей */
export function useAdminUserStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => adminGetUserStats(),
  });
}

/** Хук для загрузки детального профиля пользователя */
export function useAdminUserDetail(userId: string | null) {
  return useQuery({
    queryKey: userKeys.detail(userId!),
    queryFn: () => adminGetUserDetail(userId!),
    enabled: userId !== null,
  });
}

/** Хук для обновления пользователя */
export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: {
        name?: string;
        email?: string;
        role?: string;
        is_active?: boolean;
      };
    }) => adminUpdateUser(userId, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      qc.invalidateQueries({ queryKey: userKeys.stats() });
      qc.invalidateQueries({ queryKey: userKeys.detail(vars.userId) });
    },
  });
}

/** Хук для деактивации (soft-delete) пользователя */
export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminDeleteUser(userId),
    onSuccess: (_data, userId) => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      qc.invalidateQueries({ queryKey: userKeys.stats() });
      qc.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
}

/** Хук для загрузки аватара пользователя */
export function useUploadUserAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      adminUploadUserAvatar(userId, file),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      qc.invalidateQueries({ queryKey: userKeys.detail(vars.userId) });
    },
  });
}

/** Хук для удаления аватара пользователя */
export function useDeleteUserAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminDeleteUserAvatar(userId),
    onSuccess: (_data, userId) => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      qc.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
}

/** Хук для установки/сброса пароля пользователя */
export function useSetUserPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      newPassword,
    }: {
      userId: string;
      newPassword: string;
    }) => adminSetUserPassword(userId, newPassword),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: userKeys.detail(vars.userId) });
    },
  });
}
