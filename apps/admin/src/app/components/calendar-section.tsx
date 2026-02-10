import { useHeaderStore } from "@/app/store/header-store";
import { breadcrumbPresets } from "@/app/utils/breadcrumbs-helper";
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday, isSameMonth } from "date-fns";
import { ru } from "date-fns/locale";
import { Plus, ChevronLeft, ChevronRight, Sparkles, Calendar as CalendarIcon, Settings, LayoutGrid, Palette, Bot, FileText, Bell, Link2 } from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { startOfWeek, endOfWeek, addWeeks, subWeeks, startOfQuarter, endOfQuarter, addQuarters, subQuarters, startOfYear, endOfYear, addYears, subYears, eachMonthOfInterval } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Combobox, type ComboboxOption } from "@/app/components/ui/combobox";
import { Switch } from "@/app/components/ui/switch";
import { CalendarSettingsDialog } from "@/app/components/calendar-settings-dialog";

interface ScheduledPost {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: "scheduled" | "ai-suggestion" | "event";
  category: string;
}

const mockScheduledPosts: ScheduledPost[] = [
  {
    id: "1",
    title: "10 трендов веб-дизайна 2026",
    date: new Date(2026, 0, 5),
    time: "10:00",
    type: "scheduled",
    category: "Дизайн",
  },
  {
    id: "2",
    title: "React 19: что нового?",
    date: new Date(2026, 0, 7),
    time: "14:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "3",
    title: "AI в маркетинге: полное руководство",
    date: new Date(2026, 0, 10),
    time: "09:00",
    type: "ai-suggestion",
    category: "Маркетинг",
  },
  {
    id: "4",
    title: "Оптимизация производительности Next.js",
    date: new Date(2026, 0, 12),
    time: "11:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "5",
    title: "UX-копирайтинг: лучшие практики",
    date: new Date(2026, 0, 15),
    time: "15:00",
    type: "scheduled",
    category: "UX",
  },
  {
    id: "6",
    title: "Вебинар: Дизайн-системы",
    date: new Date(2026, 0, 18),
    time: "16:00",
    type: "event",
    category: "События",
  },
  {
    id: "7",
    title: "Tailwind CSS 4.0: обзор новых функций",
    date: new Date(2026, 0, 3),
    time: "11:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "8",
    title: "Психология цвета в UI",
    date: new Date(2026, 0, 8),
    time: "13:00",
    type: "scheduled",
    category: "Дизайн",
  },
  {
    id: "9",
    title: "Микроинтеракции: гайд",
    date: new Date(2026, 0, 14),
    time: "10:00",
    type: "ai-suggestion",
    category: "UX",
  },
  {
    id: "10",
    title: "TypeScript для начинающих",
    date: new Date(2026, 0, 20),
    time: "09:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "11",
    title: "Адаптивная типографика",
    date: new Date(2026, 0, 22),
    time: "14:00",
    type: "scheduled",
    category: "Дизайн",
  },
  {
    id: "12",
    title: "Доступность веб-приложений",
    date: new Date(2026, 0, 25),
    time: "12:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "13",
    title: "Конференция Frontend 2026",
    date: new Date(2026, 0, 27),
    time: "10:00",
    type: "event",
    category: "События",
  },
  {
    id: "14",
    title: "Анимация в вебе: лучшие практики",
    date: new Date(2026, 0, 29),
    time: "15:00",
    type: "scheduled",
    category: "Дизайн",
  },
  {
    id: "15",
    title: "SEO-оптимизация в 2026",
    date: new Date(2026, 0, 16),
    time: "11:00",
    type: "ai-suggestion",
    category: "Маркетинг",
  },
  {
    id: "16",
    title: "Figma: продвинутые техники",
    date: new Date(2026, 0, 9),
    time: "16:00",
    type: "scheduled",
    category: "Дизайн",
  },
  {
    id: "17",
    title: "Serverless архитектура",
    date: new Date(2026, 0, 13),
    time: "10:30",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "18",
    title: "A/B тестирование интерфейсов",
    date: new Date(2026, 0, 21),
    time: "13:00",
    type: "scheduled",
    category: "UX",
  },
  // Февраль 2026
  {
    id: "19",
    title: "CSS Grid: продвинутые техники",
    date: new Date(2026, 1, 2),
    time: "10:00",
    type: "scheduled",
    category: "CSS",
  },
  {
    id: "20",
    title: "Vue 3 Composition API",
    date: new Date(2026, 1, 4),
    time: "14:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "21",
    title: "Контент-маркетинг для технических блогов",
    date: new Date(2026, 1, 6),
    time: "09:00",
    type: "ai-suggestion",
    category: "Маркетинг",
  },
  {
    id: "22",
    title: "Svelte 5: обзор новинок",
    date: new Date(2026, 1, 9),
    time: "11:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "23",
    title: "Мастер-класс: адаптивный дизайн",
    date: new Date(2026, 1, 11),
    time: "15:00",
    type: "event",
    category: "События",
  },
  {
    id: "24",
    title: "WebAssembly в production",
    date: new Date(2026, 1, 13),
    time: "16:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "25",
    title: "Design Tokens: стандартизация",
    date: new Date(2026, 1, 5),
    time: "11:00",
    type: "scheduled",
    category: "Дизайн",
  },
  {
    id: "26",
    title: "Progressive Web Apps 2026",
    date: new Date(2026, 1, 7),
    time: "13:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "27",
    title: "Тренды в motion-дизайне",
    date: new Date(2026, 1, 10),
    time: "10:00",
    type: "ai-suggestion",
    category: "Дизайн",
  },
  {
    id: "28",
    title: "GraphQL с Apollo Client",
    date: new Date(2026, 1, 15),
    time: "09:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "29",
    title: "Бренд-дизайн для стартапов",
    date: new Date(2026, 1, 17),
    time: "14:00",
    type: "scheduled",
    category: "Дизайн",
  },
  {
    id: "30",
    title: "Тестирование React-компонентов",
    date: new Date(2026, 1, 19),
    time: "12:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "31",
    title: "Вебинар: AI-инструменты для дизайнеров",
    date: new Date(2026, 1, 21),
    time: "10:00",
    type: "event",
    category: "События",
  },
  {
    id: "32",
    title: "Производительность веб-приложений",
    date: new Date(2026, 1, 24),
    time: "15:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "33",
    title: "Стратегии контент-календаря",
    date: new Date(2026, 1, 12),
    time: "11:00",
    type: "ai-suggestion",
    category: "Маркетинг",
  },
  {
    id: "34",
    title: "Framer Motion: анимации",
    date: new Date(2026, 1, 8),
    time: "16:00",
    type: "scheduled",
    category: "Разработка",
  },
  {
    id: "35",
    title: "Micro-frontends на практике",
    date: new Date(2026, 1, 14),
    time: "10:30",
    type: "scheduled",
    category: "Архитектура",
  },
  {
    id: "36",
    title: "UX-исследования: методы",
    date: new Date(2026, 1, 18),
    time: "13:00",
    type: "scheduled",
    category: "UX",
  },
  {
    id: "37",
    title: "Node.js 22: новые возможности",
    date: new Date(2026, 1, 26),
    time: "09:00",
    type: "scheduled",
    category: "Разработка",
  },
];

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function CalendarSection() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [posts, setPosts] = useState<ScheduledPost[]>(mockScheduledPosts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [calendarView, setCalendarView] = useState("month");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Header store for breadcrumbs
  const { setBreadcrumbs, reset } = useHeaderStore();

  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.calendar());

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const getPostsForDay = (day: Date | null) => {
    if (!day) return [];
    return posts.filter((post) => isSameDay(post.date, day));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const previousPeriod = () => {
    switch (calendarView) {
      case "week":
        setCurrentMonth(subWeeks(currentMonth, 1));
        break;
      case "month":
        setCurrentMonth(subMonths(currentMonth, 1));
        break;
      case "quarter":
        setCurrentMonth(subQuarters(currentMonth, 1));
        break;
      case "year":
        setCurrentMonth(subYears(currentMonth, 1));
        break;
    }
  };

  const nextPeriod = () => {
    switch (calendarView) {
      case "week":
        setCurrentMonth(addWeeks(currentMonth, 1));
        break;
      case "month":
        setCurrentMonth(addMonths(currentMonth, 1));
        break;
      case "quarter":
        setCurrentMonth(addQuarters(currentMonth, 1));
        break;
      case "year":
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

  const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const monthOptions: ComboboxOption[] = months.map((month, index) => ({
    value: index.toString(),
    label: month,
  }));

  const currentYear = currentMonth.getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);
  
  const yearOptions: ComboboxOption[] = years.map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const getPostColor = (type: string) => {
    switch (type) {
      case "scheduled":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
      case "ai-suggestion":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30";
      case "event":
        return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
      default:
        return "bg-muted";
    }
  };

  // Helper function to generate calendar days for a specific month
  const generateCalendarDays = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const firstDayOfMonth = getDay(monthStart);
    const startDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const calendarDaysWithStart = Array(startDayIndex).fill(null).concat(daysInMonth);
    const remainingCells = 7 - (calendarDaysWithStart.length % 7);
    return remainingCells === 7 
      ? calendarDaysWithStart 
      : calendarDaysWithStart.concat(Array(remainingCells).fill(null));
  };

  // Week view rendering
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentMonth, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border">
        {WEEKDAYS.map((day) => (
          <div key={day} className="bg-card p-3 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {weekDays.map((day, index) => {
          const dayPosts = getPostsForDay(day);
          const isCurrentDay = isToday(day);

          return (
            <div key={index} className="min-h-[200px] bg-card p-2">
              <div className={cn("text-sm font-medium mb-2", isCurrentDay && "text-primary font-bold")}>
                {format(day, "d MMM", { locale: ru })}
              </div>
              <div className="space-y-1">
                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    className={cn(
                      "text-xs p-1.5 rounded border cursor-pointer hover:opacity-80 transition-opacity",
                      getPostColor(post.type)
                    )}
                  >
                    <div className="font-medium truncate">{post.title}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{post.time}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Month view rendering
  const renderMonthView = () => {
    const calendarDays = generateCalendarDays(currentMonth);

    return (
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border">
        {WEEKDAYS.map((day) => (
          <div key={day} className="bg-card p-3 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => {
          const dayPosts = getPostsForDay(day);
          const isCurrentDay = day && isToday(day);
          const isCurrentMonth = day && isSameMonth(day, currentMonth);

          return (
            <div
              key={index}
              className={cn("min-h-[120px] p-2", day ? "bg-card" : "calendar-empty-cell")}
            >
              {day && (
                <>
                  <div
                    className={cn(
                      "text-sm font-medium mb-2",
                      isCurrentDay && "text-primary font-bold",
                      !isCurrentMonth && "text-muted-foreground/50"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        className={cn(
                          "text-xs p-1.5 rounded border cursor-pointer hover:opacity-80 transition-opacity",
                          getPostColor(post.type)
                        )}
                      >
                        <div className="font-medium truncate">{post.title}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">{post.time}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Quarter view rendering
  const renderQuarterView = () => {
    const quarterStart = startOfQuarter(currentMonth);
    const quarterMonths = eachMonthOfInterval({
      start: quarterStart,
      end: endOfQuarter(quarterStart),
    });

    return (
      <div className="grid grid-cols-3 gap-4">
        {quarterMonths.map((month) => {
          const calendarDays = generateCalendarDays(month);
          
          return (
            <div key={month.toString()} className="space-y-2">
              <div className="text-center font-medium text-sm">
                {format(month, "LLLL yyyy", { locale: ru })}
              </div>
              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border text-[10px]">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="bg-card p-1 text-center font-medium text-muted-foreground">
                    {day[0]}
                  </div>
                ))}
                {calendarDays.map((day, index) => {
                  const dayPosts = getPostsForDay(day);
                  const isCurrentDay = day && isToday(day);
                  const isCurrentMonth = day && isSameMonth(day, month);

                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-[40px] p-0.5",
                        day ? "bg-card" : "calendar-empty-cell"
                      )}
                    >
                      {day && (
                        <>
                          <div
                            className={cn(
                              "text-[10px] font-medium",
                              isCurrentDay && "text-primary font-bold",
                              !isCurrentMonth && "text-muted-foreground/50"
                            )}
                          >
                            {format(day, "d")}
                          </div>
                          {dayPosts.length > 0 && (
                            <div className="flex gap-0.5 mt-0.5">
                              {dayPosts.slice(0, 3).map((post) => (
                                <div
                                  key={post.id}
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    post.type === "scheduled" && "bg-blue-500",
                                    post.type === "ai-suggestion" && "bg-purple-500",
                                    post.type === "event" && "bg-green-500"
                                  )}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Year view rendering
  const renderYearView = () => {
    const yearStart = startOfYear(currentMonth);
    const yearMonths = eachMonthOfInterval({
      start: yearStart,
      end: endOfYear(yearStart),
    });

    return (
      <div className="grid grid-cols-4 gap-4">
        {yearMonths.map((month) => {
          const calendarDays = generateCalendarDays(month);
          
          return (
            <div key={month.toString()} className="space-y-2">
              <div className="text-center font-medium text-xs">
                {format(month, "LLLL", { locale: ru })}
              </div>
              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border text-[9px]">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="bg-card p-0.5 text-center font-medium text-muted-foreground">
                    {day[0]}
                  </div>
                ))}
                {calendarDays.map((day, index) => {
                  const dayPosts = getPostsForDay(day);
                  const isCurrentDay = day && isToday(day);
                  const isCurrentMonth = day && isSameMonth(day, month);

                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-[24px] p-0.5",
                        day ? "bg-card" : "calendar-empty-cell"
                      )}
                    >
                      {day && (
                        <>
                          <div
                            className={cn(
                              "text-[9px] font-medium",
                              isCurrentDay && "text-primary font-bold",
                              !isCurrentMonth && "text-muted-foreground/50"
                            )}
                          >
                            {format(day, "d")}
                          </div>
                          {dayPosts.length > 0 && (
                            <div className="w-1 h-1 rounded-full bg-primary mx-auto mt-0.5" />
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const scheduledPosts = posts.filter((p) => p.type === "scheduled");
  const aiSuggestions = posts.filter((p) => p.type === "ai-suggestion");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Планирование контента
          </h1>
          <p className="text-muted-foreground mt-1">
            {posts.length} запланированных публикаций • {scheduledPosts.length} статей • {aiSuggestions.length} AI-предложений
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Запланировать публикацию
        </Button>
      </div>

      {/* SVG Pattern Definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <pattern
            id="diagonal-stripes"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
          </pattern>
        </defs>
      </svg>

      {/* Calendar Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={previousPeriod}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Combobox
                  options={monthOptions}
                  value={currentMonth.getMonth().toString()}
                  onValueChange={handleMonthChange}
                  placeholder="Месяц"
                  searchPlaceholder="Набор месяца..."
                  className="w-[140px]"
                />
                <Combobox
                  options={yearOptions}
                  value={currentMonth.getFullYear().toString()}
                  onValueChange={handleYearChange}
                  placeholder="Год"
                  searchPlaceholder="Набор года..."
                  className="w-[100px]"
                />
              </div>
              <Button variant="outline" size="icon" onClick={nextPeriod}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select value={calendarView} onValueChange={setCalendarView}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Год</SelectItem>
                  <SelectItem value="quarter">Квартал</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                  <SelectItem value="week">Неделя</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          {calendarView === "week" && renderWeekView()}
          {calendarView === "month" && renderMonthView()}
          {calendarView === "quarter" && renderQuarterView()}
          {calendarView === "year" && renderYearView()}
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Scheduled Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarIcon className="h-4 w-4" />
              Запланированные статьи
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scheduledPosts.length > 0 ? (
              <div className="space-y-2">
                {scheduledPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="text-sm">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(post.date, "d MMMM", { locale: ru })} • {post.time}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Нет запланированных статей
              </p>
            )}
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4" />
              AI-предложения
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiSuggestions.length > 0 ? (
              <div className="space-y-2">
                {aiSuggestions.map((post) => (
                  <div key={post.id} className="text-sm">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(post.date, "d MMMM", { locale: ru })} • {post.time}
                    </div>
                  </div>
                ))}
                <Button variant="link" className="h-auto p-0 text-xs">
                  Просмотреть предложения
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Нет AI-предложений
              </p>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Легенда</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-blue-500/40 border border-blue-500/50"></div>
                <span className="text-sm">Запланированная статья</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-purple-500/40 border border-purple-500/50"></div>
                <span className="text-sm">AI-редложение</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-green-500/40 border border-green-500/50"></div>
                <span className="text-sm">Событие</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Dialog */}
      <CalendarSettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}