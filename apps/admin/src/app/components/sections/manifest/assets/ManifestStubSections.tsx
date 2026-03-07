import { ScrollArea } from '@/app/components/ui/scroll-area';

export function MissionSection() {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 max-w-6xl mx-auto space-y-6'>
        <h1 className='text-3xl font-bold mb-2'>Миссия и ценности</h1>
        <p className='text-muted-foreground'>
          Определите миссию и ценности вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}

export function AudienceSection() {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 max-w-6xl mx-auto space-y-6'>
        <h1 className='text-3xl font-bold mb-2'>Целевая аудитория</h1>
        <p className='text-muted-foreground'>
          Определите целевую аудиторию вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}

export function PositioningSection() {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 max-w-6xl mx-auto space-y-6'>
        <h1 className='text-3xl font-bold mb-2'>Позиционирование</h1>
        <p className='text-muted-foreground'>
          Опеделите позиционирование вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}

export function ContentStrategySection() {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 max-w-6xl mx-auto space-y-6'>
        <h1 className='text-3xl font-bold mb-2'>Контент-стратегия</h1>
        <p className='text-muted-foreground'>
          Определите контент-стратегию вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}

export function EditorialSection() {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 max-w-6xl mx-auto space-y-6'>
        <h1 className='text-3xl font-bold mb-2'>Редакционная политика</h1>
        <p className='text-muted-foreground'>
          Определите редакционную поитику вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}

export function MetricsSection() {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 max-w-6xl mx-auto space-y-6'>
        <h1 className='text-3xl font-bold mb-2'>Метрики успеха</h1>
        <p className='text-muted-foreground'>
          Определите метрики успеха вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}

export function DevelopmentSection() {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 max-w-6xl mx-auto space-y-6'>
        <h1 className='text-3xl font-bold mb-2'>Развитие</h1>
        <p className='text-muted-foreground'>
          Определите план развития вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}
