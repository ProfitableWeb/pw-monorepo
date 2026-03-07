import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Combobox, type ComboboxOption } from '@/app/components/ui/combobox';
import { CardHeader } from '@/app/components/ui/card';

interface CalendarHeaderProps {
  currentMonth: Date;
  calendarView: string;
  setCalendarView: (view: string) => void;
  previousPeriod: () => void;
  nextPeriod: () => void;
  handleMonthChange: (monthIndex: string) => void;
  handleYearChange: (year: string) => void;
  monthOptions: ComboboxOption[];
  yearOptions: ComboboxOption[];
  onSettingsOpen: () => void;
}

export function CalendarHeader({
  currentMonth,
  calendarView,
  setCalendarView,
  previousPeriod,
  nextPeriod,
  handleMonthChange,
  handleYearChange,
  monthOptions,
  yearOptions,
  onSettingsOpen,
}: CalendarHeaderProps) {
  return (
    <CardHeader>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' onClick={previousPeriod}>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <div className='flex items-center gap-2'>
            <Combobox
              options={monthOptions}
              value={currentMonth.getMonth().toString()}
              onValueChange={handleMonthChange}
              placeholder='Месяц'
              searchPlaceholder='Набор месяца...'
              className='w-[140px]'
            />
            <Combobox
              options={yearOptions}
              value={currentMonth.getFullYear().toString()}
              onValueChange={handleYearChange}
              placeholder='Год'
              searchPlaceholder='Набор года...'
              className='w-[100px]'
            />
          </div>
          <Button variant='outline' size='icon' onClick={nextPeriod}>
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
        <div className='flex items-center gap-2'>
          <Select value={calendarView} onValueChange={setCalendarView}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='year'>Год</SelectItem>
              <SelectItem value='quarter'>Квартал</SelectItem>
              <SelectItem value='month'>Месяц</SelectItem>
              <SelectItem value='week'>Неделя</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline' size='icon' onClick={onSettingsOpen}>
            <Settings className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
