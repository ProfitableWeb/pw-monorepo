import { useState, useMemo, useEffect } from 'react';
import { useHeaderStore } from '@/app/store/header-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';
import {
  useAdminTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from '@/hooks/api';
import { hexToTw, twToHex } from '@/app/components/common/colors';
import { toast } from 'sonner';

import type { Tag, ViewMode, TagFormData } from './tags.types';

const DEFAULT_FORM_DATA: TagFormData = {
  name: '',
  slug: '',
  color: 'bg-gray-500',
  group: 'Без группы',
};

export function useTagsState() {
  const { data: apiTags, isLoading } = useAdminTags();
  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const deleteMutation = useDeleteTag();

  const [viewMode, setViewMode] = useState<ViewMode>('cloud');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<TagFormData>(DEFAULT_FORM_DATA);

  // Маппинг API → UI (мемоизировано)
  const tags = useMemo<Tag[]>(
    () =>
      (apiTags ?? []).map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        color: t.color ? hexToTw(t.color) : 'bg-gray-500',
        articlesCount: t.articleCount,
        group: t.group,
        createdAt: t.createdAt,
      })),
    [apiTags]
  );

  // Стор заголовка для хлебных крошек
  const { setBreadcrumbs, reset } = useHeaderStore();

  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.tags());
    return () => reset();
  }, [setBreadcrumbs, reset]);

  // Фильтрация по поиску и группе
  const filteredTags = useMemo(() => {
    let result = tags;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        tag =>
          tag.name.toLowerCase().includes(q) ||
          tag.slug.toLowerCase().includes(q)
      );
    }

    if (selectedGroup) {
      const groupValue = selectedGroup === 'Без группы' ? null : selectedGroup;
      result = result.filter(tag => tag.group === groupValue);
    }

    return result;
  }, [tags, searchQuery, selectedGroup]);

  const maxCount = Math.max(...tags.map(t => t.articlesCount), 1);

  const topTags = useMemo(
    () =>
      [...tags].sort((a, b) => b.articlesCount - a.articlesCount).slice(0, 10),
    [tags]
  );

  const recentTags = useMemo(
    () =>
      [...tags]
        .filter(t => t.createdAt)
        .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
        .slice(0, 5),
    [tags]
  );

  const unusedTags = useMemo(
    () => tags.filter(t => t.articlesCount === 0),
    [tags]
  );

  const tagsByGroup = useMemo(() => {
    const groups: Record<string, Tag[]> = {};
    tags.forEach(tag => {
      const group = tag.group || 'Без группы';
      if (!groups[group]) groups[group] = [];
      groups[group].push(tag);
    });
    return groups;
  }, [tags]);

  const handleSave = () => {
    const colorHex = twToHex(formData.color);
    const groupValue = formData.group === 'Без группы' ? null : formData.group;

    if (editingTag) {
      updateMutation.mutate(
        {
          id: editingTag.id,
          data: {
            name: formData.name,
            slug: formData.slug || undefined,
            color: colorHex,
            group: groupValue,
          },
        },
        {
          onSuccess: () => {
            toast.success('Метка обновлена');
            handleCloseDialog();
          },
          onError: err => toast.error(`Ошибка: ${err.message}`),
        }
      );
    } else {
      createMutation.mutate(
        {
          name: formData.name,
          slug: formData.slug || undefined,
          color: colorHex,
          group: groupValue,
        },
        {
          onSuccess: () => {
            toast.success('Метка создана');
            handleCloseDialog();
          },
          onError: err => toast.error(`Ошибка: ${err.message}`),
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Метка удалена');
        setSelectedTag(null);
      },
      onError: err => toast.error(`Ошибка: ${err.message}`),
    });
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      group: tag.group || 'Без группы',
    });
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingTag(null);
    setFormData(DEFAULT_FORM_DATA);
  };

  const handleQuickAdd = () => {
    if (
      searchQuery &&
      !tags.find(t => t.name.toLowerCase() === searchQuery.toLowerCase())
    ) {
      setFormData({
        ...DEFAULT_FORM_DATA,
        name: searchQuery,
      });
      setIsAddDialogOpen(true);
    }
  };

  const totalArticles = tags.reduce((sum, tag) => sum + tag.articlesCount, 0);

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return {
    tags,
    isLoading,
    isMutating,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    selectedGroup,
    setSelectedGroup,
    isAddDialogOpen,
    setIsAddDialogOpen,
    editingTag,
    formData,
    setFormData,
    filteredTags,
    maxCount,
    topTags,
    recentTags,
    unusedTags,
    tagsByGroup,
    totalArticles,
    handleSave,
    handleDelete,
    handleEdit,
    handleCloseDialog,
    handleQuickAdd,
  };
}
