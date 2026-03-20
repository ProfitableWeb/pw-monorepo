/**
 * Тулбар вкладки «Редактор»: переключатель режима, форматирование,
 * настройки, кнопка превью в новом окне, полноэкранный режим.
 *
 * Кнопка «Превью» открывает web-приложение в отдельном окне и
 * передаёт данные через postMessage (тот же протокол, что и в iframe).
 */
import type React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import {
  Columns3,
  Eye,
  List,
  Maximize,
  Minimize,
  PanelRight,
  Settings2,
  Square,
  WandSparkles,
  Expand,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import type {
  EditorMode,
  ArticleFormData,
  PreviewArticleData,
} from '@/app/types/article-editor';
import { WEB_URL } from '../../preview/preview.types';

const MODE_LABELS: Record<EditorMode, string> = {
  html: 'HTML',
  markdown: 'Markdown',
  visual: 'Visual',
};

const LAYOUT_OPTIONS: {
  value: string;
  label: string;
  icon: typeof Columns3;
}[] = [
  { value: 'three-column', label: 'Три колонки', icon: Columns3 },
  { value: 'two-column', label: 'Две колонки', icon: PanelRight },
  { value: 'one-column', label: 'Одна колонка', icon: Square },
  { value: 'full-width', label: 'Полная ширина', icon: Expand },
];

function toPreviewData(form: ArticleFormData): PreviewArticleData {
  return {
    h1: form.h1,
    subtitle: form.subtitle,
    content: form.content,
    author: form.author,
    category: form.category,
    tags: form.tags,
    imageUrl: form.imageUrl,
    layout: form.layout,
    toc: form.toc,
  };
}

interface EditorToolbarProps {
  editorMode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onFormat: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  settingsOpen: boolean;
  onToggleSettings: () => void;
  settingsBtnRef: React.RefObject<HTMLButtonElement | null>;
  formData: ArticleFormData;
  onOpenToc: () => void;
  tocCount: number;
  layout: string;
  onLayoutChange: (layout: string) => void;
}

export function EditorToolbar({
  editorMode,
  onModeChange,
  onFormat,
  isFullscreen,
  onToggleFullscreen,
  settingsOpen,
  onToggleSettings,
  settingsBtnRef,
  formData,
  onOpenToc,
  tocCount,
  layout,
  onLayoutChange,
}: EditorToolbarProps) {
  return (
    <div className='flex items-center justify-between gap-3 p-3 border-b'>
      <div className='flex items-center gap-3'>
        <Select
          value={editorMode}
          onValueChange={v => onModeChange(v as EditorMode)}
        >
          <SelectTrigger className='w-36' size='sm'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(MODE_LABELS) as [EditorMode, string][]).map(
              ([mode, label]) => (
                <SelectItem key={mode} value={mode}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        {editorMode !== 'visual' && (
          <div className='flex items-center gap-0.5'>
            <Button
              variant='ghost'
              size='icon'
              className='size-8 text-muted-foreground hover:text-foreground'
              title='Форматировать код'
              onClick={onFormat}
            >
              <WandSparkles className='size-3.5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className={cn(
                'size-8 relative',
                tocCount > 0
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title='Оглавление (ToC)'
              onClick={onOpenToc}
            >
              <List className='size-3.5' />
              {tocCount > 0 && (
                <span className='absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-primary text-[9px] font-medium text-primary-foreground flex items-center justify-center'>
                  {tocCount}
                </span>
              )}
            </Button>
            <Button
              ref={settingsBtnRef}
              variant='ghost'
              size='icon'
              className={cn(
                'size-8',
                settingsOpen
                  ? 'text-foreground bg-accent'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title='Настройки редактора'
              onClick={onToggleSettings}
            >
              <Settings2 className='size-3.5' />
            </Button>
          </div>
        )}
      </div>

      <div className='flex items-center gap-3'>
        <Select value={layout} onValueChange={onLayoutChange}>
          <SelectTrigger className='w-40 h-8 text-xs' size='sm'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LAYOUT_OPTIONS.map(opt => {
              const Icon = opt.icon;
              return (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className='flex items-center gap-2'>
                    <Icon className='size-3.5' />
                    {opt.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Button
          variant='outline'
          size='sm'
          className='gap-1.5'
          onClick={() => {
            const previewWindow = window.open(`${WEB_URL}/preview`, '_blank');
            if (!previewWindow) return;
            const handler = (e: MessageEvent) => {
              if (e.origin !== new URL(WEB_URL).origin) return;
              if (e.data?.type === 'preview:ready') {
                previewWindow.postMessage(
                  { type: 'preview:update', data: toPreviewData(formData) },
                  WEB_URL
                );
                window.removeEventListener('message', handler);
              }
            };
            window.addEventListener('message', handler);
            setTimeout(
              () => window.removeEventListener('message', handler),
              30000
            );
          }}
        >
          <Eye className='h-3.5 w-3.5' />
          Превью
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='gap-1.5'
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? (
            <>
              <Minimize className='h-3.5 w-3.5' />
              Свернуть
            </>
          ) : (
            <>
              <Maximize className='h-3.5 w-3.5' />
              Полный экран
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
