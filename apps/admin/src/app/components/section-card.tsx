import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { LucideIcon } from 'lucide-react';

export type SectionCardVariant = 'default' | 'compact' | 'tool';

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: SectionCardVariant;
  onClick?: () => void;
  className?: string;
  // Дополнительные элементы для разных вариантов
  badges?: { label: string; variant?: 'default' | 'secondary' | 'outline' }[];
  stats?: { icon?: LucideIcon; label: string; value?: string | number }[];
  progress?: number;
  metadata?: string;
  iconColor?: string;
}

export function SectionCard({
  icon: Icon,
  title,
  description,
  variant = 'default',
  onClick,
  className,
  badges = [],
  stats = [],
  progress,
  metadata,
  iconColor,
}: SectionCardProps) {
  const isClickable = !!onClick;

  if (variant === 'tool') {
    // Компактный вариант для инструментов (центрированный)
    return (
      <Card
        className={cn(
          'transition-all',
          isClickable && 'cursor-pointer hover:border-primary/50 hover:shadow-md group',
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-6 text-center">
          <div
            className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors',
              iconColor || 'bg-primary/10 text-primary',
              isClickable && 'group-hover:bg-primary/20'
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <h4 className="font-semibold mb-2">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
          {metadata && (
            <p className="text-xs text-muted-foreground mt-2">{metadata}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    // Компактный вариант без большого spacing
    return (
      <Card
        className={cn(
          'transition-all',
          isClickable && 'cursor-pointer hover:border-primary/50 hover:shadow-md group',
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                iconColor || 'bg-muted',
                isClickable && 'group-hover:bg-muted/80'
              )}
            >
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold">{title}</h4>
                {isClickable && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
              {metadata && (
                <p className="text-xs text-muted-foreground mt-1">{metadata}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default вариант - полноразмерный с большими иконками (как в style-dashboard)
  return (
    <Card
      className={cn(
        'transition-all',
        isClickable && 'cursor-pointer hover:border-primary/50 hover:shadow-md group',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
              iconColor || 'bg-muted',
              isClickable && 'group-hover:bg-muted/80'
            )}
          >
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{title}</h4>
              {isClickable && (
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {badges.map((badge, index) => (
                  <Badge key={index} variant={badge.variant || 'secondary'}>
                    {badge.label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Stats */}
            {stats.length > 0 && (
              <div className="flex items-center gap-4 text-sm">
                {stats.map((stat, index) => {
                  const StatIcon = stat.icon;
                  return (
                    <div key={index} className="flex items-center gap-1.5">
                      {StatIcon && <StatIcon className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-muted-foreground">
                        {stat.value ? `${stat.value} ` : ''}
                        {stat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Progress */}
            {progress !== undefined && (
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Заполненность</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Metadata */}
            {metadata && !stats.length && (
              <div className="text-xs text-muted-foreground mt-2">{metadata}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * SectionCard - Универсальный компонент карточки для секций дашборда
 * 
 * Поддерживает 3 варианта отображения:
 * 
 * 1. 'default' - Полноразмерная карточка с большой иконкой (как в style-dashboard)
 *    - Иконка 12x12 слева
 *    - Заголовок, описание справа
 *    - Поддерживает badges, stats, progress, metadata
 *    - Стрелка ArrowRight при наведении (если есть onClick)
 * 
 * 2. 'compact' - Компактная карточка с меньшим spacing
 *    - Иконка 10x10 слева
 *    - Заголовок, описание справа
 *    - ChevronRight при наведении (если есть onClick)
 * 
 * 3. 'tool' - Центрированная карточка для инструментов
 *    - Иконка 12x12 по центру сверху
 *    - Заголовок и описание по центру снизу
 *    - Используется в grid из 3 колонок
 * 
 * Примеры использования:
 * 
 * // Default вариант с badges и stats
 * <SectionCard
 *   icon={FileText}
 *   title="Статья"
 *   description="Классический текстовый материал"
 *   badges={[{ label: 'Обзор' }, { label: 'Туториал' }]}
 *   stats={[{ label: 'шаблона', value: 3 }]}
 *   onClick={() => {}}
 * />
 * 
 * // Tool вариант
 * <SectionCard
 *   icon={BarChart3}
 *   title="Аналитика"
 *   description="Детальная статистика"
 *   variant="tool"
 *   onClick={() => {}}
 * />
 */