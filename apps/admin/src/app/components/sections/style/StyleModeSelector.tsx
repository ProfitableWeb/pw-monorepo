import { Globe, User, Check, ChevronsUpDown, Info } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/components/ui/command';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { cn } from '@/app/components/ui/utils';
import { authors } from './style.constants';
import type { StyleMode, Author } from './style.types';

interface StyleModeSelectorProps {
  styleMode: StyleMode;
  onStyleModeChange: (value: StyleMode) => void;
  selectedAuthor: string;
  onSelectedAuthorChange: (id: string) => void;
  authorComboboxOpen: boolean;
  onAuthorComboboxOpenChange: (open: boolean) => void;
  useEditorialBase: boolean;
  onUseEditorialBaseChange: (value: boolean) => void;
  currentAuthor: Author;
}

export function StyleModeSelector({
  styleMode,
  onStyleModeChange,
  selectedAuthor,
  onSelectedAuthorChange,
  authorComboboxOpen,
  onAuthorComboboxOpenChange,
  useEditorialBase,
  onUseEditorialBaseChange,
  currentAuthor,
}: StyleModeSelectorProps) {
  return (
    <Card className='mb-6'>
      <CardContent className='p-4'>
        <Tabs
          value={styleMode}
          onValueChange={value => onStyleModeChange(value as StyleMode)}
        >
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <TabsList className='w-full sm:w-auto'>
                <TabsTrigger
                  value='editorial'
                  className='flex-1 sm:flex-initial gap-2'
                >
                  <Globe className='h-4 w-4' />
                  <span className='hidden sm:inline'>Общий стиль редакции</span>
                  <span className='sm:hidden'>Редакция</span>
                </TabsTrigger>
                <TabsTrigger
                  value='personal'
                  className='flex-1 sm:flex-initial gap-2'
                >
                  <User className='h-4 w-4' />
                  <span className='hidden sm:inline'>
                    Персональный стиль автора
                  </span>
                  <span className='sm:hidden'>Автор</span>
                </TabsTrigger>
              </TabsList>

              {styleMode === 'personal' && (
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-muted-foreground hidden md:inline'>
                    Автор:
                  </span>
                  <Popover
                    open={authorComboboxOpen}
                    onOpenChange={onAuthorComboboxOpenChange}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        role='combobox'
                        aria-expanded={authorComboboxOpen}
                        className='w-full sm:w-[240px] justify-between'
                      >
                        <div className='flex items-center gap-2 min-w-0'>
                          <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium flex-shrink-0'>
                            {currentAuthor.avatar}
                          </div>
                          <span className='truncate'>{currentAuthor.name}</span>
                        </div>
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-[280px] p-0' align='end'>
                      <Command>
                        <CommandInput placeholder='Поиск автора...' />
                        <CommandList>
                          <CommandEmpty>Автор не найден</CommandEmpty>
                          <CommandGroup>
                            {authors.map(author => (
                              <CommandItem
                                key={author.id}
                                value={author.name}
                                onSelect={() => {
                                  onSelectedAuthorChange(author.id);
                                  onAuthorComboboxOpenChange(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    selectedAuthor === author.id
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                <div className='flex items-center gap-2 min-w-0 flex-1'>
                                  <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium flex-shrink-0'>
                                    {author.avatar}
                                  </div>
                                  <div className='flex flex-col min-w-0 flex-1'>
                                    <span className='text-sm truncate'>
                                      {author.name}
                                    </span>
                                    <span className='text-xs text-muted-foreground truncate'>
                                      {author.role}
                                    </span>
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {styleMode === 'personal' && (
              <div className='pt-4 border-t space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Switch
                      id='use-editorial-base'
                      checked={useEditorialBase}
                      onCheckedChange={onUseEditorialBaseChange}
                    />
                    <Label
                      htmlFor='use-editorial-base'
                      className='cursor-pointer'
                    >
                      Использовать общий стиль редакции как основу
                    </Label>
                  </div>
                </div>

                <div className='flex items-start gap-2 text-sm'>
                  <Info className='h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0' />
                  <p className='text-muted-foreground'>
                    {useEditorialBase
                      ? 'Персональные настройки автора дополняют общий стиль редакции. Если параметр не настроен, используется значение из общего стиля.'
                      : 'Создается полностью независимый стиль автора. Настройки общего стиля редакции не применяются.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
