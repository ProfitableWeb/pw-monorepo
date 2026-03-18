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
import { Eye, Maximize, Minimize, Settings2, WandSparkles } from 'lucide-react';
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

function toPreviewData(form: ArticleFormData): PreviewArticleData {
  return {
    h1: form.h1,
    subtitle: form.subtitle,
    content: form.content,
    author: form.author,
    category: form.category,
    tags: form.tags,
    imageUrl: form.imageUrl,
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
