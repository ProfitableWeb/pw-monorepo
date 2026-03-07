import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Bot,
  Plus,
  FileText,
  Sparkles,
  Lightbulb,
  Zap,
  PenLine,
  TrendingUp,
  Search,
} from 'lucide-react';
import { QUICK_PROMPTS, TEMPLATE_ICON_OPTIONS } from './ai-center.constants';
import type { QuickPrompt } from './ai-center.constants';

const ICON_MAP = {
  FileText,
  Sparkles,
  Lightbulb,
  Zap,
  PenLine,
  TrendingUp,
  Search,
} as const;

interface EmptyStateProps {
  onSetInput: (value: string) => void;
}

function QuickPromptCard({
  prompt,
  onClick,
}: {
  prompt: QuickPrompt;
  onClick: () => void;
}) {
  const Icon = ICON_MAP[prompt.icon];

  return (
    <button
      onClick={onClick}
      className='group p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left'
    >
      <div className='flex items-start gap-3'>
        <div className='flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
          <Icon className='h-5 w-5 text-primary' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-medium mb-1'>{prompt.label}</h3>
          <p className='text-sm text-muted-foreground'>{prompt.description}</p>
        </div>
      </div>
    </button>
  );
}

function TemplateDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateIcon, setTemplateIcon] = useState('FileText');
  const [templatePrompt, setTemplatePrompt] = useState('');

  const resetForm = () => {
    setTemplateName('');
    setTemplateDescription('');
    setTemplateIcon('FileText');
    setTemplatePrompt('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className='mt-4 w-full max-w-2xl p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-accent/50 transition-colors text-left group'>
          <div className='flex items-center justify-center gap-2 text-muted-foreground group-hover:text-primary'>
            <Plus className='h-5 w-5' />
            <span className='font-medium'>Добавить шаблон</span>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Создать новый шаблон</DialogTitle>
          <DialogDescription>
            Добавьте свой шаблон для быстрого доступа к часто используемым
            промптам
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='template-name'>Название</Label>
            <Input
              id='template-name'
              placeholder='Например: Написать пост в блог'
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='template-description'>Описание</Label>
            <Input
              id='template-description'
              placeholder='Краткое описание шаблона'
              value={templateDescription}
              onChange={e => setTemplateDescription(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='template-icon'>Иконка</Label>
            <Select value={templateIcon} onValueChange={setTemplateIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_ICON_OPTIONS.map(option => {
                  const Icon = ICON_MAP[option.value as keyof typeof ICON_MAP];
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className='flex items-center gap-2'>
                        <Icon className='h-4 w-4' />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='template-prompt'>Текст промпта</Label>
            <Textarea
              id='template-prompt'
              placeholder='Введите промпт, который будет использоваться при клике на шаблон'
              value={templatePrompt}
              onChange={e => setTemplatePrompt(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => {
              setIsOpen(false);
              resetForm();
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={() => {
              // TODO: Save template to store
              console.log('Save template:', {
                name: templateName,
                description: templateDescription,
                icon: templateIcon,
                prompt: templatePrompt,
              });
              setIsOpen(false);
              resetForm();
            }}
            disabled={!templateName || !templatePrompt}
          >
            Создать шаблон
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EmptyState({ onSetInput }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center px-4'>
      <div className='w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6'>
        <Bot className='h-10 w-10 text-primary' />
      </div>

      <h2 className='text-2xl font-semibold mb-3'>Начните новую сессию</h2>
      <p className='text-muted-foreground mb-8 max-w-md'>
        Используйте AI для написания статей, анализа данных, создания контента и
        многого другого.
      </p>

      {/* Быстрые промпты */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl'>
        {QUICK_PROMPTS.map(prompt => (
          <QuickPromptCard
            key={prompt.icon}
            prompt={prompt}
            onClick={() => onSetInput(prompt.prompt)}
          />
        ))}
      </div>

      {/* Кнопка добавления шаблона */}
      <TemplateDialog />
    </div>
  );
}
