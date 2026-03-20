/**
 * Вкладка «Редактор» — основной редактор контента статьи.
 *
 * Три режима: HTML (Monaco), Markdown (Monaco), Visual (Tiptap).
 * В режимах HTML/Markdown — split-pane: слева код, справа DevicePreview.
 *
 * Форматирование: Prettier (in-browser, standalone) или встроенный Monaco formatter.
 * Настройки (тема, шрифт, табы, перенос строк) — через EditorSettingsPanel
 * из `editor-shared/`, с FormatterSettings в `children`.
 *
 * Переключение режимов (HTML ↔ Markdown) требует конвертации через ИИ —
 * показывается AlertDialog с предупреждением.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MonacoEditor, { type Monaco } from '@monaco-editor/react';
import { format as prettierFormat } from 'prettier/standalone';
import htmlPlugin from 'prettier/plugins/html';
import markdownPlugin from 'prettier/plugins/markdown';
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
import type { editor } from 'monaco-editor';
import { cn } from '@/app/components/ui/utils';
import { DevicePreview } from '../../preview';
import { VisualEditor } from '../../shared';
import {
  EditorSettingsPanel,
  useEditorSettingsPanel,
  defineCustomThemes,
  type EditorTheme,
  type FormatterType,
  type HtmlWhitespaceSensitivity,
} from '../../editor-shared';
import { useArticleEditorStore } from '@/app/store/article-editor-store';
import type {
  EditorMode,
  ArticleFormData,
  PreviewArticleData,
} from '@/app/types/article-editor';
import { EditorToolbar } from './EditorToolbar';
import { FormatterSettings } from './FormatterSettings';
import { TocModal } from './TocModal';
import type { TocItem } from '@/app/types/article-editor';

const MODE_LANGUAGES: Record<EditorMode, string> = {
  markdown: 'markdown',
  html: 'html',
  visual: 'markdown',
};

interface EditorSettings {
  fontSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  tabSize: number;
  theme: EditorTheme;
  formatter: FormatterType;
  prettierPrintWidth: number;
  prettierHtmlWhitespaceSensitivity: HtmlWhitespaceSensitivity;
}

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  wordWrap: true,
  lineNumbers: true,
  minimap: false,
  tabSize: 2,
  theme: 'vs-dark',
  formatter: 'prettier',
  prettierPrintWidth: 80,
  prettierHtmlWhitespaceSensitivity: 'css',
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
    artifacts: form.artifacts,
    layout: form.layout,
    toc: form.toc,
  };
}

interface EditorTabProps {
  formData: ArticleFormData;
  onTocChange: (toc: TocItem[]) => void;
  onLayoutChange: (layout: string) => void;
}

export function EditorTab({
  formData,
  onTocChange,
  onLayoutChange,
}: EditorTabProps) {
  const {
    content,
    editorMode,
    showConversionWarning,
    setContent,
    requestModeChange,
    confirmModeChange,
    cancelModeChange,
  } = useArticleEditorStore();

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const settingsPanel = useEditorSettingsPanel();
  const [tocModalOpen, setTocModalOpen] = useState(false);

  const tocCount = useMemo(
    () => formData.toc?.filter(i => i.enabled).length ?? 0,
    [formData.toc]
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    defineCustomThemes(monaco);
  }, []);

  const handleEditorMount = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor) => {
      editorRef.current = editorInstance;
    },
    []
  );

  const handleFormat = useCallback(async () => {
    const ed = editorRef.current;
    if (!ed) return;

    if (settings.formatter === 'prettier') {
      const source = ed.getValue();
      const parser = editorMode === 'markdown' ? 'markdown' : 'html';
      const plugins =
        editorMode === 'markdown' ? [markdownPlugin] : [htmlPlugin];
      try {
        const formatted = await prettierFormat(source, {
          parser,
          plugins,
          printWidth: settings.prettierPrintWidth,
          tabWidth: settings.tabSize,
          htmlWhitespaceSensitivity: settings.prettierHtmlWhitespaceSensitivity,
        });
        ed.setValue(formatted);
      } catch {
        ed.getAction('editor.action.formatDocument')?.run();
      }
    } else {
      ed.getAction('editor.action.formatDocument')?.run();
    }
  }, [
    settings.formatter,
    settings.prettierPrintWidth,
    settings.tabSize,
    settings.prettierHtmlWhitespaceSensitivity,
    editorMode,
  ]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) setContent(value);
    },
    [setContent]
  );

  const updateSetting = useCallback(
    <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <div
      className={cn(
        'flex flex-col h-full',
        isFullscreen && 'fixed inset-0 z-50 bg-background'
      )}
    >
      <EditorToolbar
        editorMode={editorMode}
        onModeChange={m => requestModeChange(m)}
        onFormat={handleFormat}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        settingsOpen={settingsPanel.open}
        onToggleSettings={settingsPanel.toggle}
        settingsBtnRef={settingsPanel.triggerRef}
        formData={formData}
        onOpenToc={() => setTocModalOpen(true)}
        tocCount={tocCount}
        layout={formData.layout ?? 'three-column'}
        onLayoutChange={onLayoutChange}
      />

      {editorMode === 'visual' ? (
        <div className='flex-1 min-h-0 overflow-auto'>
          <VisualEditor content={content} onChange={setContent} />
        </div>
      ) : (
        <ResizablePanelGroup direction='horizontal' className='flex-1 min-h-0'>
          <ResizablePanel defaultSize={50} minSize={30}>
            <MonacoEditor
              height='100%'
              language={MODE_LANGUAGES[editorMode]}
              value={content}
              onChange={handleEditorChange}
              beforeMount={handleBeforeMount}
              onMount={handleEditorMount}
              theme={settings.theme}
              options={{
                minimap: { enabled: settings.minimap },
                fontSize: settings.fontSize,
                lineNumbers: settings.lineNumbers ? 'on' : 'off',
                wordWrap: settings.wordWrap ? 'on' : 'off',
                tabSize: settings.tabSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                unicodeHighlight: {
                  ambiguousCharacters: false,
                  invisibleCharacters: false,
                },
              }}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={25}>
            <DevicePreview
              articleData={toPreviewData({ ...formData, content })}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      <EditorSettingsPanel
        fontSize={settings.fontSize}
        onFontSizeChange={v => updateSetting('fontSize', v)}
        wordWrap={settings.wordWrap}
        onWordWrapChange={v => updateSetting('wordWrap', v)}
        lineNumbers={settings.lineNumbers}
        onLineNumbersChange={v => updateSetting('lineNumbers', v)}
        minimap={settings.minimap}
        onMinimapChange={v => updateSetting('minimap', v)}
        tabSize={settings.tabSize}
        onTabSizeChange={v => updateSetting('tabSize', v)}
        theme={settings.theme}
        onThemeChange={v => updateSetting('theme', v)}
        {...settingsPanel}
      >
        <FormatterSettings
          formatter={settings.formatter}
          onFormatterChange={v => updateSetting('formatter', v)}
          prettierPrintWidth={settings.prettierPrintWidth}
          onPrintWidthChange={v => updateSetting('prettierPrintWidth', v)}
          htmlWhitespaceSensitivity={settings.prettierHtmlWhitespaceSensitivity}
          onHtmlWsChange={v =>
            updateSetting('prettierHtmlWhitespaceSensitivity', v)
          }
        />
      </EditorSettingsPanel>

      <TocModal
        open={tocModalOpen}
        onOpenChange={setTocModalOpen}
        content={content}
        toc={formData.toc ?? []}
        onSave={onTocChange}
      />

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
