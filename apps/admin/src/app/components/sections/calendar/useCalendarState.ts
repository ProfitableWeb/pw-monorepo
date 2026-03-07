import { useState, useEffect } from 'react';
import {
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addQuarters,
  subQuarters,
  addYears,
  subYears,
} from 'date-fns';
import { useHeaderStore } from '@/app/store/header-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';
import { mockScheduledPosts, MONTH_NAMES } from './calendar.constants';
import type { ScheduledPost } from './calendar.types';
import type { ComboboxOption } from '@/app/components/ui/combobox';

export function useCalendarState() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [posts, setPosts] = useState<ScheduledPost[]>(mockScheduledPosts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [calendarView, setCalendarView] = useState('month');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Стор заголовка для хлебных крошек
  const { setBreadcrumbs, reset } = useHeaderStore();

  // Установить хлебные крошки
  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.calendar());

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const getPostsForDay = (day: Date | null) => {
    if (!day) return [];
    return posts.filter(post => isSameDay(post.date, day));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const previousPeriod = () => {
    switch (calendarView) {
      case 'week':
        setCurrentMonth(subWeeks(currentMonth, 1));
        break;
      case 'month':
        setCurrentMonth(subMonths(currentMonth, 1));
        break;
      case 'quarter':
        setCurrentMonth(subQuarters(currentMonth, 1));
        break;
      case 'year':
        setCurrentMonth(subYears(currentMonth, 1));
        break;
    }
  };

  const nextPeriod = () => {
    switch (calendarView) {
      case 'week':
        setCurrentMonth(addWeeks(currentMonth, 1));
        break;
      case 'month':
        setCurrentMonth(addMonths(currentMonth, 1));
        break;
      case 'quarter':
        setCurrentMonth(addQuarters(currentMonth, 1));
        break;
      case 'year':
        setCurrentMonth(addYears(currentMonth, 1));
        break;
    }
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(parseInt(monthIndex));
    setCurrentMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(parseInt(year));
    setCurrentMonth(newDate);
  };

  const monthOptions: ComboboxOption[] = MONTH_NAMES.map((month, index) => ({
    value: index.toString(),
    label: month,
  }));

  const currentYear = currentMonth.getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

  const yearOptions: ComboboxOption[] = years.map(year => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const scheduledPosts = posts.filter(p => p.type === 'scheduled');
  const aiSuggestions = posts.filter(p => p.type === 'ai-suggestion');

  return {
    currentMonth,
    posts,
    setPosts,
    isDialogOpen,
    setIsDialogOpen,
    calendarView,
    setCalendarView,
    isSettingsOpen,
    setIsSettingsOpen,
    getPostsForDay,
    goToToday,
    previousPeriod,
    nextPeriod,
    previousMonth,
    nextMonth,
    handleMonthChange,
    handleYearChange,
    monthOptions,
    yearOptions,
    scheduledPosts,
    aiSuggestions,
  };
}
