import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import { LayoutGrid, Palette, Bot, FileText, Bell, Link2 } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

type SettingsSection = "general" | "appearance" | "ai-agent" | "content-plan" | "notifications" | "integrations";

interface CalendarSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CalendarSettingsDialog({ open, onOpenChange }: CalendarSettingsDialogProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");

  const sections = [
    { id: "general" as SettingsSection, label: "Общие", icon: LayoutGrid },
    { id: "appearance" as SettingsSection, label: "Оформление", icon: Palette },
    { id: "ai-agent" as SettingsSection, label: "AI Агент", icon: Bot },
    { id: "content-plan" as SettingsSection, label: "Контент-план", icon: FileText },
    { id: "notifications" as SettingsSection, label: "Уведомления", icon: Bell },
    { id: "integrations" as SettingsSection, label: "Интеграции", icon: Link2 },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Общие настройки</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="default-view">Режим отображения по умолчанию</Label>
                  <Select defaultValue="month">
                    <SelectTrigger id="default-view">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year">Год</SelectItem>
                      <SelectItem value="quarter">Квартал</SelectItem>
                      <SelectItem value="month">Месяц</SelectItem>
                      <SelectItem value="week">Неделя</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Выберите режим, который будет открываться при загрузке календаря
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="first-day">Первый день недели</Label>
                  <Select defaultValue="monday">
                    <SelectTrigger id="first-day">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Понедельник</SelectItem>
                      <SelectItem value="sunday">Воскресенье</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="time-format">Формат времени</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger id="time-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24-часовой (14:00)</SelectItem>
                      <SelectItem value="12h">12-часовой (2:00 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="language">Язык интерфейса</Label>
                  <Select defaultValue="ru">
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Показывать выходные дни</Label>
                    <p className="text-xs text-muted-foreground">
                      Выделять субботу и воскресенье в календаре
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Нумерация недель</Label>
                    <p className="text-xs text-muted-foreground">
                      Отображать номера недель в году
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Оформление календаря</h3>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Цветовые схемы событий</Label>
                  
                  <div className="space-y-3 border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-500/30 border-2 border-blue-500" />
                        <div>
                          <div className="text-sm font-medium">Запланированные статьи</div>
                          <div className="text-xs text-muted-foreground">Основные публикации</div>
                        </div>
                      </div>
                      <Input type="color" defaultValue="#3b82f6" className="w-16 h-8" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-purple-500/30 border-2 border-purple-500" />
                        <div>
                          <div className="text-sm font-medium">AI-предложения</div>
                          <div className="text-xs text-muted-foreground">Сгенерированные темы</div>
                        </div>
                      </div>
                      <Input type="color" defaultValue="#a855f7" className="w-16 h-8" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-green-500/30 border-2 border-green-500" />
                        <div>
                          <div className="text-sm font-medium">События</div>
                          <div className="text-xs text-muted-foreground">Вебинары и конференции</div>
                        </div>
                      </div>
                      <Input type="color" defaultValue="#22c55e" className="w-16 h-8" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="density">Плотность отображения</Label>
                  <Select defaultValue="comfortable">
                    <SelectTrigger id="density">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Компактная</SelectItem>
                      <SelectItem value="comfortable">Комфортная</SelectItem>
                      <SelectItem value="spacious">Просторная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Показывать время в событиях</Label>
                    <p className="text-xs text-muted-foreground">
                      Отображать точное время публикации
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Анимации при переключении</Label>
                    <p className="text-xs text-muted-foreground">
                      Плавные переходы между режимами
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        );

      case "ai-agent":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Настройки AI Агента</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Включить AI Агента</Label>
                    <p className="text-xs text-muted-foreground">
                      Автоматическая генерация идей для контента
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="frequency">Частота предложений</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger id="frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Ежедневно</SelectItem>
                      <SelectItem value="weekly">Еженедельно</SelectItem>
                      <SelectItem value="biweekly">Раз в 2 недели</SelectItem>
                      <SelectItem value="monthly">Ежемесячно</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Как часто AI будет предлагать новые темы для статей
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="suggestions-count">Количество предложений</Label>
                  <Input id="suggestions-count" type="number" defaultValue="5" min="1" max="20" />
                  <p className="text-xs text-muted-foreground">
                    Сколько идей генерировать за раз (1-20)
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tone">Тон контента</Label>
                  <Select defaultValue="professional">
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Профессиональный</SelectItem>
                      <SelectItem value="casual">Неформальный</SelectItem>
                      <SelectItem value="educational">Образовательный</SelectItem>
                      <SelectItem value="entertaining">Развлекательный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="topics">Приоритетные тематики</Label>
                  <Textarea
                    id="topics"
                    placeholder="Веб-дизайн, React, UI/UX, Типографика..."
                    rows={3}
                    defaultValue="Веб-дизайн, Frontend разработка, UI/UX, Figma, TypeScript"
                  />
                  <p className="text-xs text-muted-foreground">
                    Укажите темы через запятую, которые интересуют вашу аудиторию
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Учитывать тренды</Label>
                    <p className="text-xs text-muted-foreground">
                      Анализировать актуальные темы в индустрии
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Избегать повторов</Label>
                    <p className="text-xs text-muted-foreground">
                      Не предлагать похожие темы на уже опубликованные
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        );

      case "content-plan":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Регламент контент-плана</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="frequency-posts">Частота публикаций</Label>
                  <Select defaultValue="3-week">
                    <SelectTrigger id="frequency-posts">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Ежедневно</SelectItem>
                      <SelectItem value="3-week">3 раза в неделю</SelectItem>
                      <SelectItem value="2-week">2 раза в неделю</SelectItem>
                      <SelectItem value="weekly">1 раз в неделю</SelectItem>
                      <SelectItem value="biweekly">2 раза в месяц</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="publishing-days">Дни ��ублаций</Label>
                  <div className="flex gap-2">
                    {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, index) => (
                      <Button
                        key={day}
                        variant={[1, 3, 5].includes(index) ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Выберите предпочтительные дни для публикаций
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="publishing-time">Оптимальное время публикации</Label>
                  <Input id="publishing-time" type="time" defaultValue="10:00" />
                  <p className="text-xs text-muted-foreground">
                    Рекомендуемое время выхода статей
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content-mix">Распределене типов контента</Label>
                  <div className="space-y-2 border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Обучающие статьи</span>
                      <span className="text-sm font-medium">50%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Кейсы и примеры</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Новости индустрии</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="guidelines">Инструкции по контент-планированию</Label>
                  <Textarea
                    id="guidelines"
                    rows={12}
                    className="font-mono text-xs"
                    defaultValue={`# Регламент контент-планирования

## Частота публикаций
- **Основной график**: 3 раза в неделю (Понедельник, Среда, Пятница)
- **Оптимальное время**: 10:00 по МСК
- **Минимальный интервал**: 48 часов между публикациями

## Очередность тем
1. Обучающий контент (50%) - гайды, туториалы, best practices
2. Практические кейсы (30%) - разборы проектов, примеры
3. Новости и тренды (20%) - обзоры новых инструментов, технологий

## Структура месячного плана
- **Неделя 1**: Введение в тему + практический пример
- **Неделя 2**: Углубленный гайд + кейс
- **Неделя 3**: Обзр инструментов + сравнительный анализ
- **Неделя 4**: Подведение итогов + анонс следующего месяца

## Сезонность
- **Q1**: Планирование года, новые тренды
- **Q2**: Практические навыки, инструменты
- **Q3**: Кейсы, портфолио-проекты
- **Q4**: Итоги года, прогнозы

## Качество контента
- Минимальная длина статьи: 1500 слов
- Обязательно: иллюстрации, примеры кода, ссылки
- Вычитка: минимум 24 часа до публикации`}
                  />
                  <p className="text-xs text-muted-foreground">
                    Markdown-документ с правилами планирования контента
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Уведомления</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Включить уведомления</Label>
                    <p className="text-xs text-muted-foreground">
                      Получать напоминания о публикациях
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="font-medium text-sm">Типы уведомлений</div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Напоминание о публикации</Label>
                      <p className="text-xs text-muted-foreground">
                        За 1 час до запланированного времени
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Новые AI-предложения</Label>
                      <p className="text-xs text-muted-foreground">
                        При появлении новых идей от AI
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Еженедельный дайджест</Label>
                      <p className="text-xs text-muted-foreground">
                        Обзор планов на неделю каждый понедельник
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Пропущенные публикации</Label>
                      <p className="text-xs text-muted-foreground">
                        Оповещение о несостоявшихся публикациях
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="font-medium text-sm">Каналы дставки</div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email уведомления</Label>
                      <p className="text-xs text-muted-foreground">
                        Отправлять на почту
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email адрес</Label>
                    <Input id="email" type="email" placeholder="your@email.com" defaultValue="editor@blog.ru" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push-уведомления</Label>
                      <p className="text-xs text-muted-foreground">
                        Браузерные уведомления
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Telegram бот</Label>
                      <p className="text-xs text-muted-foreground">
                        Уведомления в Telegram
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "integrations":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Интеграции</h3>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Социальные сети</Label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-blue-500 flex items-center justify-center text-white font-bold">
                          VK
                        </div>
                        <div>
                          <div className="text-sm font-medium">ВКонтакте</div>
                          <div className="text-xs text-muted-foreground">Не одключено</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Подключить</Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-sky-500 flex items-center justify-center text-white font-bold">
                          TG
                        </div>
                        <div>
                          <div className="text-sm font-medium">Telegram</div>
                          <div className="text-xs text-green-600 dark:text-green-400">Подключено</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Настроить</Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                          X
                        </div>
                        <div>
                          <div className="text-sm font-medium">X (Twitter)</div>
                          <div className="text-xs text-muted-foreground">Не подключено</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Подключить</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Label>Платформы публикации</Label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-orange-500 flex items-center justify-center text-white font-bold">
                          H
                        </div>
                        <div>
                          <div className="text-sm font-medium">Habr</div>
                          <div className="text-xs text-muted-foreground">Не подключено</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Подключить</Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">
                          M
                        </div>
                        <div>
                          <div className="text-sm font-medium">Medium</div>
                          <div className="text-xs text-muted-foreground">Не подключено</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Подключить</Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                          WP
                        </div>
                        <div>
                          <div className="text-sm font-medium">WordPress</div>
                          <div className="text-xs text-green-600 dark:text-green-400">Подключено</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Настроить</Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Автопубликация</Label>
                      <p className="text-xs text-muted-foreground">
                        Автоматически публиковать во все подключенные каналы
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-6xl md:w-[90vw] w-full md:h-[85vh] h-[90vh] md:top-[50%] top-auto md:bottom-auto bottom-0 md:translate-y-[-50%] translate-y-0 md:rounded-lg rounded-t-2xl rounded-b-none p-0 gap-0 flex flex-col">
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="px-4 md:px-6 py-3 border-b shrink-0">
          <DialogTitle className="text-base md:text-lg font-semibold">Настройки календаря публикаций</DialogTitle>
          <DialogDescription className="text-xs md:text-sm text-muted-foreground">
            Настройте параметры календаря публикаций, чтобы он соответствовал вашим потребностям.
          </DialogDescription>
        </div>
        
        <div className="flex md:flex-row flex-col flex-1 overflow-hidden min-h-0">
          {/* Desktop: Left Navigation | Mobile: Top Navigation */}
          <div className="md:w-64 w-full md:border-r border-b md:border-b-0 md:bg-muted/30 bg-background md:p-4 p-0 shrink-0">
            <nav className="md:space-y-1 flex md:flex-col flex-row md:overflow-visible overflow-x-auto scrollbar-mobile">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex items-center gap-2 md:gap-3 md:px-3 px-4 md:py-2 py-3 md:rounded-lg text-xs md:text-sm transition-colors md:w-full whitespace-nowrap shrink-0",
                      activeSection === section.id
                        ? "md:bg-muted bg-background text-foreground border-b-2 md:border-b-0 border-primary"
                        : "md:hover:bg-muted/50 hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="md:inline">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Content - Fixed height for mobile to prevent jumping */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-mobile min-h-0">
            {renderSectionContent()}
          </div>
        </div>

        <div className="px-4 md:px-6 py-3 border-t flex justify-end gap-2 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-sm">
            Отмена
          </Button>
          <Button onClick={() => onOpenChange(false)} className="text-sm">
            Сохранить изменения
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}