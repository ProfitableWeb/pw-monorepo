import { useCallback, useState } from 'react';
import { toast } from 'sonner';
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
import { Clock, RotateCcw, Settings2, Loader2 } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import {
  EditorSettingsPanel,
  useEditorSettingsPanel,
  defineCustomThemes,
  type EditorTheme,
} from '../../editor-shared';
import { useRevisions, useRevision, useRestoreRevision } from '@/hooks/api';
import type { RevisionListItem } from '@/app/types/admin-api';

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
  articleId: string | null;
  currentContent: string;
  onRestore?: (content: string) => void;
}

export function HistoryTab({
  articleId,
  currentContent,
  onRestore,
}: HistoryTabProps) {
  const [selectedRevisionId, setSelectedRevisionId] = useState<string | null>(
    null
  );
  const [settings, setSettings] = useState<DiffSettings>(DEFAULT_DIFF_SETTINGS);
  const [restoreTarget, setRestoreTarget] = useState<RevisionListItem | null>(
    null
  );

  const settingsPanel = useEditorSettingsPanel();

  const { data: revisionsResult, isLoading: revisionsLoading } =
    useRevisions(articleId);
  const revisions = revisionsResult?.data ?? [];
  const { data: revisionDetail } = useRevision(articleId, selectedRevisionId);
  const restoreMutation = useRestoreRevision();

  const selectedListItem =
    revisions.find(r => r.id === selectedRevisionId) ?? null;

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
    if (!restoreTarget || !articleId) return;
    restoreMutation.mutate(
      { articleId, revisionId: restoreTarget.id },
      {
        onSuccess: data => {
          if (onRestore && data.content != null) {
            onRestore(data.content);
          }
        },
        onError: () => toast.error('Не удалось восстановить ревизию'),
      }
    );
    setRestoreTarget(null);
  }, [restoreTarget, articleId, restoreMutation, onRestore]);

  if (!articleId) {
    return (
      <div className='flex items-center justify-center h-full text-sm text-muted-foreground'>
        Сохраните статью, чтобы увидеть историю ревизий
      </div>
    );
  }

  return (
    <div className='flex h-full'>
      {/* Левый сайдбар — таймлайн ревизий */}
      <nav className='w-56 shrink-0 border-r flex flex-col'>
        <div className='flex items-center justify-between px-4 border-b min-h-[49px]'>
          <h3 className='text-xs font-semibold'>Ревизии</h3>
          <Badge variant='secondary' className='text-[10px]'>
            {revisions.length}
          </Badge>
        </div>

        <div className='flex-1 overflow-auto'>
          {revisionsLoading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='size-4 animate-spin text-muted-foreground' />
            </div>
          ) : revisions.length === 0 ? (
            <div className='px-4 py-6 text-xs text-muted-foreground text-center'>
              Нет ревизий
            </div>
          ) : (
            <div className='relative'>
              <div className='absolute left-[22px] top-4 bottom-4 w-px bg-muted-foreground/30' />
              {revisions.map(rev => {
                const isActive = selectedRevisionId === rev.id;
                return (
                  <button
                    key={rev.id}
                    type='button'
                    onClick={() => setSelectedRevisionId(rev.id)}
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
                        {rev.summary ?? 'Без описания'}
                      </p>
                      <p className='text-[10px] text-muted-foreground mt-0.5'>
                        {formatDate(rev.createdAt)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Справа — редактор diff */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Тулбар diff */}
        <div className='flex items-center justify-between px-4 py-2 border-b'>
          <div className='flex items-center gap-3'>
            {selectedListItem && (
              <span className='text-xs text-muted-foreground'>
                {selectedListItem.summary ?? 'Без описания'}{' '}
                <span className='opacity-60'>&rarr;</span> Текущая
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
            {selectedListItem && onRestore && (
              <Button
                variant='outline'
                size='sm'
                className='gap-1.5 text-xs'
                onClick={() => setRestoreTarget(selectedListItem)}
              >
                <RotateCcw className='size-3' />
                Восстановить
              </Button>
            )}
          </div>
        </div>

        {/* Редактор diff */}
        <div className='flex-1 min-h-0 min-w-0 overflow-hidden'>
          {revisionDetail ? (
            <DiffEditor
              height='100%'
              language='html'
              original={revisionDetail.content}
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
              Текущий контент будет заменён версией «
              {restoreTarget?.summary ?? 'Без описания'}» от{' '}
              {restoreTarget ? formatDate(restoreTarget.createdAt) : ''}. Это
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
    </div>
  );
}
