import { useCallback, useState } from 'react';
import { DiffEditor, type Monaco } from '@monaco-editor/react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
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
import { Clock, RotateCcw, Trash2, Settings2 } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { mockRevisions } from '@/app/mock/article-mock';
import {
  EditorSettingsPanel,
  useEditorSettingsPanel,
  defineCustomThemes,
  type EditorTheme,
} from '../../editor-shared';
import type { RevisionEntry } from '@/app/types/article-editor';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface DiffSettings {
  fontSize: number;
  wordWrap: boolean;
  theme: EditorTheme;
  renderSideBySide: boolean;
}

const DEFAULT_DIFF_SETTINGS: DiffSettings = {
  fontSize: 14,
  wordWrap: true,
  theme: 'vs-dark',
  renderSideBySide: true,
};

interface HistoryTabProps {
  currentContent: string;
  onRestore?: (content: string) => void;
}

export function HistoryTab({ currentContent, onRestore }: HistoryTabProps) {
  const [selectedRevision, setSelectedRevision] =
    useState<RevisionEntry | null>(mockRevisions[1] ?? null);
  const [settings, setSettings] = useState<DiffSettings>(DEFAULT_DIFF_SETTINGS);
  const [restoreTarget, setRestoreTarget] = useState<RevisionEntry | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<RevisionEntry | null>(null);

  const settingsPanel = useEditorSettingsPanel();

  const updateSetting = useCallback(
    <K extends keyof DiffSettings>(key: K, value: DiffSettings[K]) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    defineCustomThemes(monaco);
  }, []);

  const handleRestore = useCallback(() => {
    if (restoreTarget && onRestore) {
      onRestore(restoreTarget.content);
    }
    setRestoreTarget(null);
  }, [restoreTarget, onRestore]);

  return (
    <div className='flex h-full'>
      {/* Левый сайдбар — таймлайн ревизий */}
      <nav className='w-56 shrink-0 border-r flex flex-col'>
        <div className='flex items-center justify-between px-4 border-b min-h-[49px]'>
          <h3 className='text-xs font-semibold'>Ревизии</h3>
          <Badge variant='secondary' className='text-[10px]'>
            {mockRevisions.length}
          </Badge>
        </div>

        <div className='flex-1 overflow-auto'>
          <div className='relative'>
            <div className='absolute left-[22px] top-4 bottom-4 w-px bg-muted-foreground/30' />
            {mockRevisions.map(rev => {
              const isActive = selectedRevision?.id === rev.id;
              return (
                <button
                  key={rev.id}
                  type='button'
                  onClick={() => setSelectedRevision(rev)}
                  className={cn(
                    'flex items-start gap-2.5 w-full px-3 py-2.5 text-left transition-colors relative',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <div className='relative z-10 p-1 rounded-full bg-background border shrink-0 mt-0.5'>
                    <Clock className='size-3 ' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs font-medium line-clamp-2 leading-relaxed'>
                      {rev.summary}
                    </p>
                    <p className='text-[10px] text-muted-foreground mt-0.5'>
                      {rev.author} · {formatDate(rev.date)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Справа — редактор diff */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Тулбар diff */}
        <div className='flex items-center justify-between px-4 py-2 border-b'>
          <div className='flex items-center gap-3'>
            {selectedRevision && (
              <span className='text-xs text-muted-foreground'>
                {selectedRevision.summary} <span className='opacity-60'>→</span>{' '}
                Текущая
              </span>
            )}
          </div>

          <div className='flex items-center gap-3'>
            {/* Переключатель inline / side-by-side */}
            <div className='flex items-center gap-2'>
              <Label
                htmlFor='diff-side-by-side'
                className='text-[10px] text-muted-foreground'
              >
                Рядом
              </Label>
              <Switch
                id='diff-side-by-side'
                checked={settings.renderSideBySide}
                onCheckedChange={v => updateSetting('renderSideBySide', v)}
              />
            </div>

            {/* Кнопка настроек */}
            <Button
              ref={settingsPanel.triggerRef}
              variant='ghost'
              size='icon'
              className={cn(
                'size-7',
                settingsPanel.open
                  ? 'text-foreground bg-accent'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title='Настройки'
              onClick={settingsPanel.toggle}
            >
              <Settings2 className='size-3.5' />
            </Button>

            {/* Кнопка восстановления */}
            {selectedRevision && onRestore && (
              <Button
                variant='outline'
                size='sm'
                className='gap-1.5 text-xs'
                onClick={() => setRestoreTarget(selectedRevision)}
              >
                <RotateCcw className='size-3' />
                Восстановить
              </Button>
            )}
            {selectedRevision &&
              selectedRevision.id !==
                mockRevisions[mockRevisions.length - 1]?.id && (
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-7 text-muted-foreground hover:text-destructive'
                  title='Удалить ревизию'
                  onClick={() => setDeleteTarget(selectedRevision)}
                >
                  <Trash2 className='size-3.5' />
                </Button>
              )}
          </div>
        </div>

        {/* Редактор diff */}
        <div className='flex-1 min-h-0 min-w-0 overflow-hidden'>
          {selectedRevision ? (
            <DiffEditor
              height='100%'
              language='html'
              original={selectedRevision.content}
              modified={currentContent}
              beforeMount={handleBeforeMount}
              theme={settings.theme}
              options={{
                readOnly: true,
                fontSize: settings.fontSize,
                wordWrap: settings.wordWrap ? 'on' : 'off',
                renderSideBySide: settings.renderSideBySide,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                minimap: { enabled: false },
                unicodeHighlight: {
                  ambiguousCharacters: false,
                  invisibleCharacters: false,
                },
              }}
            />
          ) : (
            <div className='flex items-center justify-center h-full text-sm text-muted-foreground'>
              Выберите ревизию для сравнения
            </div>
          )}
        </div>
      </div>

      {/* Плавающая панель настроек */}
      <EditorSettingsPanel
        title='Настройки Diff'
        fontSize={settings.fontSize}
        onFontSizeChange={v => updateSetting('fontSize', v)}
        wordWrap={settings.wordWrap}
        onWordWrapChange={v => updateSetting('wordWrap', v)}
        theme={settings.theme}
        onThemeChange={v => updateSetting('theme', v)}
        {...settingsPanel}
      />

      {/* Диалог подтверждения восстановления */}
      <AlertDialog
        open={!!restoreTarget}
        onOpenChange={open => {
          if (!open) setRestoreTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Восстановить версию?</AlertDialogTitle>
            <AlertDialogDescription>
              Текущий контент будет заменён версией «{restoreTarget?.summary}»
              от {restoreTarget ? formatDate(restoreTarget.date) : ''}. Это
              действие можно отменить через Ctrl+Z.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>
              Восстановить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Диалог подтверждения удаления */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={open => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить ревизию?</AlertDialogTitle>
            <AlertDialogDescription>
              Ревизия «{deleteTarget?.summary}» от{' '}
              {deleteTarget ? formatDate(deleteTarget.date) : ''} будет удалена
              безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={() => {
                // TODO: delete revision via API
                if (selectedRevision?.id === deleteTarget?.id) {
                  setSelectedRevision(null);
                }
                setDeleteTarget(null);
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
