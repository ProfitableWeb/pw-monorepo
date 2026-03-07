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
import { Switch } from '@/app/components/ui/switch';

export function AiAgentSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-4'>Настройки AI Агента</h3>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Включить AI Агента</Label>
              <p className='text-xs text-muted-foreground'>
                Автоматическая генерация идей для контента
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='frequency'>Частота предложений</Label>
            <Select defaultValue='weekly'>
              <SelectTrigger id='frequency'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='daily'>Ежедневно</SelectItem>
                <SelectItem value='weekly'>Еженедельно</SelectItem>
                <SelectItem value='biweekly'>Раз в 2 недели</SelectItem>
                <SelectItem value='monthly'>Ежемесячно</SelectItem>
              </SelectContent>
            </Select>
            <p className='text-xs text-muted-foreground'>
              Как часто AI будет предлагать новые темы для статей
            </p>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='suggestions-count'>Количество предложений</Label>
            <Input
              id='suggestions-count'
              type='number'
              defaultValue='5'
              min='1'
              max='20'
            />
            <p className='text-xs text-muted-foreground'>
              Сколько идей генерировать за раз (1-20)
            </p>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='tone'>Тон контента</Label>
            <Select defaultValue='professional'>
              <SelectTrigger id='tone'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='professional'>Профессиональный</SelectItem>
                <SelectItem value='casual'>Неформальный</SelectItem>
                <SelectItem value='educational'>Образовательный</SelectItem>
                <SelectItem value='entertaining'>Развлекательный</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='topics'>Приоритетные тематики</Label>
            <Textarea
              id='topics'
              placeholder='Веб-дизайн, React, UI/UX, Типографика...'
              rows={3}
              defaultValue='Веб-дизайн, Frontend разработка, UI/UX, Figma, TypeScript'
            />
            <p className='text-xs text-muted-foreground'>
              Укажите темы через запятую, которые интересуют вашу аудиторию
            </p>
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Учитывать тренды</Label>
              <p className='text-xs text-muted-foreground'>
                Анализировать актуальные темы в индустрии
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Избегать повторов</Label>
              <p className='text-xs text-muted-foreground'>
                Не предлагать похожие темы на уже опубликованные
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
