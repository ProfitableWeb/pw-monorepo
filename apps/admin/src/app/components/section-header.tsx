import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  variant?: 'large' | 'small';
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
  variant = 'large',
  className,
}: SectionHeaderProps) {
  if (variant === 'small') {
    // Маленький заголовок для подразделов
    return (
      <div className={cn('flex items-center gap-2 mb-3', className)}>
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
    );
  }

  // Большой заголовок для главных секций
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * SectionHeader - Универсальный компонент заголовка для секций
 * 
 * Поддерживает 2 варианта:
 * 
 * 1. 'large' - Большой заголовок для главных секций
 *    - Иконка 10x10 в цветном круге слева
 *    - Крупный заголовок H1
 *    - Опциональное описание
 * 
 * 2. 'small' - Маленький заголовок для подразделов
 *    - Иконка 4x4 слева
 *    - Маленький заголовок H3
 *    - Серый цвет текста
 * 
 * Примеры:
 * 
 * // Большой заголовок секции
 * <SectionHeader
 *   icon={Layout}
 *   title="Форматы контента"
 *   description="Шаблоны и структуры для различных типов материалов"
 * />
 * 
 * // Маленький заголовок подраздела
 * <SectionHeader
 *   variant="small"
 *   icon={FileType}
 *   title="Доступные форматы"
 * />
 */