import { useState, useMemo, useEffect } from 'react';
import { useHeaderStore } from '@/app/store/header-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';

import type { Tag, ViewMode, TagFormData } from './tags.types';
import { initialTags } from './tags.constants';

const DEFAULT_FORM_DATA: TagFormData = {
  name: '',
  slug: '',
  color: 'bg-gray-500',
  category: 'Без группы',
};

export function useTagsState() {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [viewMode, setViewMode] = useState<ViewMode>('cloud');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<TagFormData>(DEFAULT_FORM_DATA);

  // Стор заголовка для хлебных крошек
  const { setBreadcrumbs, reset } = useHeaderStore();

  // Установить хлебные крошки
  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.tags());

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const filteredTags = useMemo(() => {
    let result = tags;

    if (searchQuery) {
      result = result.filter(
        tag =>
          tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [tags, searchQuery]);

  const maxCount = Math.max(...tags.map(t => t.articlesCount), 1);

  const topTags = useMemo(() => {
    return [...tags]
      .sort((a, b) => b.articlesCount - a.articlesCount)
      .slice(0, 10);
  }, [tags]);

  const recentTags = useMemo(() => {
    return [...tags]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  }, [tags]);

  const unusedTags = useMemo(() => {
    return tags.filter(t => t.articlesCount === 0);
  }, [tags]);

  const tagsByGroup = useMemo(() => {
    const groups: Record<string, Tag[]> = {};
    tags.forEach(tag => {
      const group = tag.category || 'Без группы';
      if (!groups[group]) groups[group] = [];
      groups[group].push(tag);
    });
    return groups;
  }, [tags]);

  const handleSave = () => {
    if (editingTag) {
      setTags(prev =>
        prev.map(t => (t.id === editingTag.id ? { ...t, ...formData } : t))
      );
    } else {
      const newTag: Tag = {
        id: Date.now().toString(),
        name: formData.name,
        slug: formData.slug,
        color: formData.color,
        articlesCount: 0,
        category: formData.category,
        createdAt: new Date(),
      };
      setTags(prev => [...prev, newTag]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
    setSelectedTag(null);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      category: tag.category || 'Без группы',
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
        name: searchQuery,
        slug: searchQuery.toLowerCase().replace(/\s+/g, '-'),
        color: 'bg-gray-500',
        category: 'Без группы',
      });
      setIsAddDialogOpen(true);
    }
  };

  const totalArticles = tags.reduce((sum, tag) => sum + tag.articlesCount, 0);

  return {
    tags,
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
