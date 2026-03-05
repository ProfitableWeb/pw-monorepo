import { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/app/components/ui/resizable';
import { Save, Eye, CheckCircle2, Loader2, WifiOff } from 'lucide-react';
import type { AutosaveStatus } from '@/app/types/article-editor';
import { DevicePreview } from './DevicePreview';
import { VisualEditor } from './VisualEditor';
import { useArticleEditorStore } from '@/app/store/article-editor-store';
import type { EditorMode } from '@/app/types/article-editor';

const MODE_LABELS: Record<EditorMode, string> = {
  html: 'HTML',
  markdown: 'Markdown',
  visual: 'Visual',
};

const AUTOSAVE_CONFIG: Record<
  AutosaveStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  saved: {
    label: 'Сохранено',
    icon: CheckCircle2,
    className: 'text-muted-foreground',
  },
  syncing: {
    label: 'Сохранение...',
    icon: Loader2,
    className: 'text-muted-foreground animate-spin',
  },
  offline: { label: 'Офлайн', icon: WifiOff, className: 'text-destructive' },
};

const MODE_LANGUAGES: Record<EditorMode, string> = {
  markdown: 'markdown',
  html: 'html',
  visual: 'markdown',
};

export function EditorTab() {
  const {
    content,
    editorMode,
    autosaveStatus,
    showConversionWarning,
    setContent,
    requestModeChange,
    confirmModeChange,
    cancelModeChange,
    markSaved,
  } = useArticleEditorStore();

  const statusConfig = AUTOSAVE_CONFIG[autosaveStatus];
  const StatusIcon = statusConfig.icon;

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        setContent(value);
      }
    },
    [setContent]
  );

  const handleSave = useCallback(() => {
    // Mock save — in real implementation would call API
    markSaved();
  }, [markSaved]);

  return (
    <div className='flex flex-col h-full'>
      {/* Toolbar */}
      <div className='flex items-center justify-between gap-3 p-3 border-b'>
        <div className='flex items-center gap-3'>
          <Select
            value={editorMode}
            onValueChange={v => requestModeChange(v as EditorMode)}
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
        </div>

        <div className='flex items-center gap-3'>
          <span
            className={`flex items-center gap-1.5 text-xs ${statusConfig.className}`}
          >
            <StatusIcon className='h-3.5 w-3.5' />
            {statusConfig.label}
          </span>
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5'
            onClick={handleSave}
          >
            <Save className='h-3.5 w-3.5' />
            Сохранить
          </Button>
          <Button variant='outline' size='sm' className='gap-1.5'>
            <Eye className='h-3.5 w-3.5' />
            Превью
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      {editorMode === 'visual' ? (
        <div className='flex-1 min-h-0 overflow-auto'>
          <VisualEditor content={content} onChange={setContent} />
        </div>
      ) : (
        <ResizablePanelGroup direction='horizontal' className='flex-1 min-h-0'>
          <ResizablePanel defaultSize={50} minSize={30}>
            <Editor
              height='100%'
              language={MODE_LANGUAGES[editorMode]}
              value={content}
              onChange={handleEditorChange}
              theme='vs-dark'
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
              }}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={25}>
            <DevicePreview content={content} mode={editorMode} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      {/* AI Conversion Guard Dialog */}
      <AlertDialog
        open={showConversionWarning}
        onOpenChange={open => {
          if (!open) cancelModeChange();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Конвертация формата</AlertDialogTitle>
            <AlertDialogDescription>
              Конвертация требует обработки ИИ для сохранения форматирования.
              Некоторые элементы разметки могут быть изменены. Продолжить?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmModeChange}>
              Продолжить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
