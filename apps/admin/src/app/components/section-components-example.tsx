/**
 * Пример использования универсальных компонентов SectionCard и SectionHeader
 * Этот файл показывает все варианты использования и не используется в продакшене
 */

import { SectionCard } from '@/app/components/section-card';
import { SectionHeader } from '@/app/components/section-header';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { FileText, Settings, BarChart3, Activity, Clock, Palette } from 'lucide-react';

export function SectionComponentsExample() {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="max-w-5xl mx-auto p-6 space-y-8 pb-12">
          {/* Большой заголовок */}
          <SectionHeader
            icon={Palette}
            title="Примеры компонентов"
            description="Все варианты использования SectionCard и SectionHeader"
          />

          {/* Default вариант */}
          <div>
            <SectionHeader
              variant="small"
              icon={FileText}
              title="Default вариант - полноразмерные карточки"
              className="mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SectionCard
                icon={FileText}
                title="С badges и stats"
                description="Карточка с бейджами и статистикой"
                badges={[
                  { label: 'Активно', variant: 'default' },
                  { label: 'Популярно', variant: 'secondary' },
                ]}
                stats={[
                  { icon: Activity, label: 'элементов', value: 24 },
                  { icon: Clock, label: '5 минут назад' },
                ]}
                onClick={() => console.log('Clicked')}
              />

              <SectionCard
                icon={Settings}
                title="С progress bar"
                description="Карточка с индикатором прогресса"
                progress={87}
                metadata="Последнее обновление: 2 часа назад"
                onClick={() => console.log('Clicked')}
              />

              <SectionCard
                icon={BarChart3}
                title="Все вместе"
                description="Карточка со всеми элементами"
                badges={[{ label: 'Новое', variant: 'outline' }]}
                stats={[{ label: 'параметров', value: 12 }]}
                progress={75}
                onClick={() => console.log('Clicked')}
              />

              <SectionCard
                icon={FileText}
                title="Не кликабельная"
                description="Карточка без onClick - нет стрелки"
                stats={[{ label: 'элементов', value: 5 }]}
              />
            </div>
          </div>

          {/* Compact вариант */}
          <div>
            <SectionHeader
              variant="small"
              icon={Settings}
              title="Compact вариант - компактные карточки"
              className="mb-4"
            />
            <div className="space-y-3">
              <SectionCard
                variant="compact"
                icon={Settings}
                title="Компактная карточка"
                description="Меньше spacing, ChevronRight вместо ArrowRight"
                onClick={() => console.log('Clicked')}
              />

              <SectionCard
                variant="compact"
                icon={FileText}
                title="С metadata"
                description="Дополнительная информация внизу"
                metadata="Обновлено: 1 день назад"
                onClick={() => console.log('Clicked')}
              />
            </div>
          </div>

          {/* Tool вариант */}
          <div>
            <SectionHeader
              variant="small"
              icon={BarChart3}
              title="Tool вариант - инструменты (3 колонки)"
              className="mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SectionCard
                variant="tool"
                icon={BarChart3}
                title="Аналитика"
                description="Детальная статистика по всем разделам"
                onClick={() => console.log('Clicked')}
              />

              <SectionCard
                variant="tool"
                icon={Settings}
                title="Настройки"
                description="Конфигурация системы"
                onClick={() => console.log('Clicked')}
              />

              <SectionCard
                variant="tool"
                icon={FileText}
                title="Отчеты"
                description="Генерация и экспорт отчетов"
                metadata="Доступно 12 шаблонов"
                onClick={() => console.log('Clicked')}
              />
            </div>
          </div>

          {/* Кастомные цвета */}
          <div>
            <SectionHeader
              variant="small"
              icon={Palette}
              title="Кастомные цвета иконок"
              className="mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SectionCard
                icon={Activity}
                title="Синяя иконка"
                description="Кастомный цвет фона и текста"
                iconColor="bg-blue-500/10 text-blue-500"
                onClick={() => console.log('Clicked')}
              />

              <SectionCard
                icon={BarChart3}
                title="Зеленая иконка"
                description="Другой кастомный цвет"
                iconColor="bg-green-500/10 text-green-500"
                onClick={() => console.log('Clicked')}
              />

              <SectionCard
                icon={Settings}
                title="Фиолетовая иконка"
                description="Еще один вариант цвета"
                iconColor="bg-purple-500/10 text-purple-500"
                onClick={() => console.log('Clicked')}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
