import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';

export function ContentPlanSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-4'>Регламент контент-плана</h3>
        <div className='space-y-4'>
          <div className='grid gap-2'>
            <Label htmlFor='frequency-posts'>Частота публикаций</Label>
            <Select defaultValue='3-week'>
              <SelectTrigger id='frequency-posts'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='daily'>Ежедневно</SelectItem>
                <SelectItem value='3-week'>3 раза в неделю</SelectItem>
                <SelectItem value='2-week'>2 раза в неделю</SelectItem>
                <SelectItem value='weekly'>1 раз в неделю</SelectItem>
                <SelectItem value='biweekly'>2 раза в месяц</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='publishing-days'>Дни публаций</Label>
            <div className='flex gap-2'>
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                <Button
                  key={day}
                  variant={[1, 3, 5].includes(index) ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1'
                >
                  {day}
                </Button>
              ))}
            </div>
            <p className='text-xs text-muted-foreground'>
              Выберите предпочтительные дни для публикаций
            </p>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='publishing-time'>
              Оптимальное время публикации
            </Label>
            <Input id='publishing-time' type='time' defaultValue='10:00' />
            <p className='text-xs text-muted-foreground'>
              Рекомендуемое время выхода статей
            </p>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='content-mix'>Распределене типов контента</Label>
            <div className='space-y-2 border rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Обучающие статьи</span>
                <span className='text-sm font-medium'>50%</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Кейсы и примеры</span>
                <span className='text-sm font-medium'>30%</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Новости индустрии</span>
                <span className='text-sm font-medium'>20%</span>
              </div>
            </div>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='guidelines'>
              Инструкции по контент-планированию
            </Label>
            <Textarea
              id='guidelines'
              rows={12}
              className='font-mono text-xs'
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
            <p className='text-xs text-muted-foreground'>
              Markdown-документ с правилами планирования контента
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
