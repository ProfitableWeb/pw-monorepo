import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { cn } from '@/app/components/ui/utils';
import { Search, X, ChevronDown, Check } from 'lucide-react';
import { STATUSES } from '../articles.constants';

interface FiltersToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string | undefined;
  onStatusChange: (status: string | undefined) => void;
  selectedCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
  categoryNames: string[];
  onClearAll: () => void;
}

export function FiltersToolbar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  categoryNames,
  onClearAll,
}: FiltersToolbarProps) {
  const hasActiveFilters = !!selectedStatus || !!selectedCategory;

  return (
    <div className='flex flex-col gap-4'>
      {/* Строка поиска */}
      <div className='flex-1 max-w-md'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Поиск по названию или автору...'
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className='pl-9'
          />
        </div>
      </div>

      {/* Фильтр-чипы */}
      <div className='flex flex-wrap items-center gap-2'>
        {/* Фильтр по статусу */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className={cn('h-8', selectedStatus && 'border-primary')}
            >
              Статус
              {selectedStatus && (
                <Badge variant='secondary' className='ml-2 h-5 px-1.5'>
                  1
                </Badge>
              )}
              <ChevronDown className='ml-2 h-3 w-3' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-56 p-3' align='start'>
            <div className='space-y-1'>
              <div className='font-medium text-sm mb-3'>Статус статьи</div>
              {STATUSES.map(status => (
                <button
                  key={status.value}
                  onClick={() =>
                    onStatusChange(
                      selectedStatus === status.value ? undefined : status.value
                    )
                  }
                  className={cn(
                    'flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent',
                    selectedStatus === status.value && 'bg-accent'
                  )}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedStatus === status.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {status.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Фильтр по категории */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className={cn('h-8', selectedCategory && 'border-primary')}
            >
              Категория
              {selectedCategory && (
                <Badge variant='secondary' className='ml-2 h-5 px-1.5'>
                  1
                </Badge>
              )}
              <ChevronDown className='ml-2 h-3 w-3' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-56 p-3' align='start'>
            <div className='space-y-1'>
              <div className='font-medium text-sm mb-3'>Категории</div>
              {categoryNames.map(category => (
                <button
                  key={category}
                  onClick={() =>
                    onCategoryChange(
                      selectedCategory === category ? undefined : category
                    )
                  }
                  className={cn(
                    'flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent text-left',
                    selectedCategory === category && 'bg-accent'
                  )}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 shrink-0',
                      selectedCategory === category
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {category}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Сбросить все */}
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onClearAll}
            className='h-8 text-muted-foreground'
          >
            <X className='mr-2 h-3 w-3' />
            Сбросить все
          </Button>
        )}

        {/* Активные фильтры */}
        {selectedStatus && (
          <Badge variant='secondary' className='h-8 gap-1 pl-3 pr-2'>
            {STATUSES.find(s => s.value === selectedStatus)?.label}
            <button
              onClick={() => onStatusChange(undefined)}
              className='ml-1 hover:bg-muted rounded-sm p-0.5'
            >
              <X className='h-3 w-3' />
            </button>
          </Badge>
        )}

        {selectedCategory && (
          <Badge variant='secondary' className='h-8 gap-1 pl-3 pr-2'>
            {selectedCategory}
            <button
              onClick={() => onCategoryChange(undefined)}
              className='ml-1 hover:bg-muted rounded-sm p-0.5'
            >
              <X className='h-3 w-3' />
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
}
