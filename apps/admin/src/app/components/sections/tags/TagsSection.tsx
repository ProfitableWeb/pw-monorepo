import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import {
  Plus,
  Search,
  TrendingUp,
  Clock,
  AlertCircle,
  Cloud,
  Grid3x3,
  List,
} from 'lucide-react';

import { TAG_GROUPS } from './tags.constants';
import { useTagsState } from './useTagsState';
import { TagCloudView } from './assets/TagCloudView';
import { TagGridView } from './assets/TagGridView';
import { TagListView } from './assets/TagListView';
import { TagDetailDialog } from './assets/TagDetailDialog';
import { TagFormDialog } from './assets/TagFormDialog';

export function TagsSection() {
  const {
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
  } = useTagsState();

  return (
    <div className='p-6 space-y-6'>
      {/* Заголовок */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Управление метками</h1>
          <p className='text-muted-foreground mt-1'>
            {tags.length} меток • {totalArticles} использований •{' '}
            {unusedTags.length} неиспользуемых
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Новая метка
        </Button>
      </div>

      {/* Карточки статистики */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='p-4 border rounded-lg bg-card space-y-2'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <TrendingUp className='h-4 w-4' />
            <span className='text-sm font-medium'>Популярные метки</span>
          </div>
          <div className='flex flex-wrap gap-1.5'>
            {topTags.slice(0, 5).map(tag => (
              <Badge key={tag.id} variant='secondary' className='text-xs'>
                {tag.name} ({tag.articlesCount})
              </Badge>
            ))}
          </div>
        </div>

        <div className='p-4 border rounded-lg bg-card space-y-2'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Clock className='h-4 w-4' />
            <span className='text-sm font-medium'>Недавно добавленные</span>
          </div>
          <div className='flex flex-wrap gap-1.5'>
            {recentTags.map(tag => (
              <Badge key={tag.id} variant='secondary' className='text-xs'>
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className='p-4 border rounded-lg bg-card space-y-2'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <AlertCircle className='h-4 w-4' />
            <span className='text-sm font-medium'>Неиспользуемые</span>
          </div>
          <div className='flex flex-wrap gap-1.5'>
            {unusedTags.length > 0 ? (
              unusedTags.slice(0, 5).map(tag => (
                <Badge key={tag.id} variant='outline' className='text-xs'>
                  {tag.name}
                </Badge>
              ))
            ) : (
              <p className='text-xs text-muted-foreground'>
                Все метки используются!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Управление */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Поиск меток...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-9 pr-20'
          />
          {searchQuery &&
            !filteredTags.find(
              t => t.name.toLowerCase() === searchQuery.toLowerCase()
            ) && (
              <Button
                size='sm'
                variant='ghost'
                className='absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs'
                onClick={handleQuickAdd}
              >
                <Plus className='h-3 w-3 mr-1' />
                Создать
              </Button>
            )}
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1 border rounded-lg p-1'>
            <Button
              size='sm'
              variant={viewMode === 'cloud' ? 'default' : 'ghost'}
              onClick={() => setViewMode('cloud')}
              className='h-8 w-8 p-0'
            >
              <Cloud className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className='h-8 w-8 p-0'
            >
              <Grid3x3 className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className='h-8 w-8 p-0'
            >
              <List className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Фильтры по группам */}
      <div className='flex items-center gap-2 flex-wrap'>
        <Button
          size='sm'
          variant={selectedGroup === null ? 'default' : 'outline'}
          onClick={() => setSelectedGroup(null)}
        >
          Все группы
        </Button>
        {TAG_GROUPS.map(group => (
          <Button
            key={group}
            size='sm'
            variant={selectedGroup === group ? 'default' : 'outline'}
            onClick={() => setSelectedGroup(group)}
          >
            {group} ({tagsByGroup[group]?.length || 0})
          </Button>
        ))}
      </div>

      {/* Отображение тегов */}
      {viewMode === 'cloud' && (
        <TagCloudView
          tags={filteredTags}
          maxCount={maxCount}
          selectedTagId={selectedTag?.id ?? null}
          onSelect={setSelectedTag}
        />
      )}

      {viewMode === 'grid' && (
        <TagGridView
          tags={filteredTags}
          onSelect={setSelectedTag}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {viewMode === 'list' && (
        <TagListView
          tags={filteredTags}
          onSelect={setSelectedTag}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Диалог деталей тега */}
      <TagDetailDialog
        tag={selectedTag}
        onClose={() => setSelectedTag(null)}
        onEdit={handleEdit}
      />

      {/* Диалог создания/редактирования */}
      <TagFormDialog
        open={isAddDialogOpen}
        editingTag={editingTag}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSave}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
