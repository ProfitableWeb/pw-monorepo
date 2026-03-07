import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Calendar } from '@/app/components/ui/calendar';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Input } from '@/app/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { cn } from '@/app/components/ui/utils';
import { Search, X, CalendarIcon, ChevronDown } from 'lucide-react';
import { STATUSES } from './articles.constants';

interface FiltersToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatuses: string[];
  onToggleStatus: (status: string) => void;
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  categoryNames: string[];
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  onClearAll: () => void;
}

export function FiltersToolbar({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onToggleStatus,
  selectedCategories,
  onToggleCategory,
  categoryNames,
  dateRange,
  onDateRangeChange,
  onClearAll,
}: FiltersToolbarProps) {
  const hasActiveFilters =
    selectedStatuses.length > 0 ||
    selectedCategories.length > 0 ||
    dateRange.from ||
    dateRange.to;

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
              className={cn(
                'h-8',
                selectedStatuses.length > 0 && 'border-primary'
              )}
            >
              Статус
              {selectedStatuses.length > 0 && (
                <Badge variant='secondary' className='ml-2 h-5 px-1.5'>
                  {selectedStatuses.length}
                </Badge>
              )}
              <ChevronDown className='ml-2 h-3 w-3' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-56 p-3' align='start'>
            <div className='space-y-2'>
              <div className='font-medium text-sm mb-3'>Статус статьи</div>
              {STATUSES.map(status => (
                <div key={status.value} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={selectedStatuses.includes(status.value)}
                    onCheckedChange={() => onToggleStatus(status.value)}
                  />
                  <label
                    htmlFor={`status-${status.value}`}
                    className='text-sm cursor-pointer flex-1'
                  >
                    {status.label}
                  </label>
                </div>
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
              className={cn(
                'h-8',
                selectedCategories.length > 0 && 'border-primary'
              )}
            >
              Категория
              {selectedCategories.length > 0 && (
                <Badge variant='secondary' className='ml-2 h-5 px-1.5'>
                  {selectedCategories.length}
                </Badge>
              )}
              <ChevronDown className='ml-2 h-3 w-3' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-56 p-3' align='start'>
            <div className='space-y-2'>
              <div className='font-medium text-sm mb-3'>Категории</div>
              {categoryNames.map(category => (
                <div key={category} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => onToggleCategory(category)}
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className='text-sm cursor-pointer flex-1'
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Фильтр по дате */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className={cn(
                'h-8',
                (dateRange.from || dateRange.to) && 'border-primary'
              )}
            >
              <CalendarIcon className='mr-2 h-3 w-3' />
              Дата
              {(dateRange.from || dateRange.to) && (
                <Badge variant='secondary' className='ml-2 h-5 px-1.5'>
                  1
                </Badge>
              )}
              <ChevronDown className='ml-2 h-3 w-3' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <div className='p-3'>
              <div className='font-medium text-sm mb-3'>Диапазон дат</div>
              <Calendar
                mode='range'
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={range => onDateRangeChange(range || {})}
                numberOfMonths={2}
              />
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
        {selectedStatuses.map(status => (
          <Badge
            key={status}
            variant='secondary'
            className='h-8 gap-1 pl-3 pr-2'
          >
            {STATUSES.find(s => s.value === status)?.label}
            <button
              onClick={() => onToggleStatus(status)}
              className='ml-1 hover:bg-muted rounded-sm p-0.5'
            >
              <X className='h-3 w-3' />
            </button>
          </Badge>
        ))}

        {selectedCategories.map(category => (
          <Badge
            key={category}
            variant='secondary'
            className='h-8 gap-1 pl-3 pr-2'
          >
            {category}
            <button
              onClick={() => onToggleCategory(category)}
              className='ml-1 hover:bg-muted rounded-sm p-0.5'
            >
              <X className='h-3 w-3' />
            </button>
          </Badge>
        ))}

        {(dateRange.from || dateRange.to) && (
          <Badge variant='secondary' className='h-8 gap-1 pl-3 pr-2'>
            {dateRange.from && dateRange.to
              ? `${dateRange.from.toLocaleDateString('ru-RU')} - ${dateRange.to.toLocaleDateString('ru-RU')}`
              : dateRange.from
                ? `С ${dateRange.from.toLocaleDateString('ru-RU')}`
                : `До ${dateRange.to?.toLocaleDateString('ru-RU')}`}
            <button
              onClick={() => onDateRangeChange({})}
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
