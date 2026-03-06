import { useCallback, useEffect, useRef, useState } from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';
import { format as prettierFormat } from 'prettier/standalone';
import htmlPlugin from 'prettier/plugins/html';
import markdownPlugin from 'prettier/plugins/markdown';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import {
  Eye,
  GripHorizontal,
  Maximize,
  Minimize,
  Settings2,
  WandSparkles,
  X,
} from 'lucide-react';
import type { editor } from 'monaco-editor';
import { cn } from '@/app/components/ui/utils';
import { DevicePreview } from './DevicePreview';
import { VisualEditor } from './VisualEditor';
import { useArticleEditorStore } from '@/app/store/article-editor-store';
import type {
  EditorMode,
  ArticleFormData,
  PreviewArticleData,
} from '@/app/types/article-editor';

const MODE_LABELS: Record<EditorMode, string> = {
  html: 'HTML',
  markdown: 'Markdown',
  visual: 'Visual',
};

const MODE_LANGUAGES: Record<EditorMode, string> = {
  markdown: 'markdown',
  html: 'html',
  visual: 'markdown',
};

type EditorTheme =
  | 'vs-dark'
  | 'light'
  | 'hc-black'
  | 'monokai'
  | 'dracula'
  | 'github-dark'
  | 'one-dark'
  | 'nord'
  | 'solarized-dark'
  | 'github-light'
  | 'solarized-light'
  | 'one-light'
  | 'nord-light';

interface ThemeMeta {
  label: string;
  category: 'dark' | 'light';
  colors: [string, string, string]; // [background, foreground, accent]
}

const THEME_META: Record<EditorTheme, ThemeMeta> = {
  'vs-dark': {
    label: 'VS Dark',
    category: 'dark',
    colors: ['#1E1E1E', '#D4D4D4', '#569CD6'],
  },
  monokai: {
    label: 'Monokai',
    category: 'dark',
    colors: ['#272822', '#F8F8F2', '#F92672'],
  },
  dracula: {
    label: 'Dracula',
    category: 'dark',
    colors: ['#282A36', '#F8F8F2', '#FF79C6'],
  },
  'github-dark': {
    label: 'GitHub Dark',
    category: 'dark',
    colors: ['#0D1117', '#C9D1D9', '#7EE787'],
  },
  'one-dark': {
    label: 'One Dark',
    category: 'dark',
    colors: ['#282C34', '#ABB2BF', '#C678DD'],
  },
  nord: {
    label: 'Nord',
    category: 'dark',
    colors: ['#2E3440', '#D8DEE9', '#81A1C1'],
  },
  'solarized-dark': {
    label: 'Solarized Dark',
    category: 'dark',
    colors: ['#002B36', '#839496', '#2AA198'],
  },
  'hc-black': {
    label: 'Контраст',
    category: 'dark',
    colors: ['#000000', '#FFFFFF', '#569CD6'],
  },
  light: {
    label: 'Светлая',
    category: 'light',
    colors: ['#FFFFFF', '#000000', '#0000FF'],
  },
  'github-light': {
    label: 'GitHub Light',
    category: 'light',
    colors: ['#FFFFFF', '#24292F', '#CF222E'],
  },
  'solarized-light': {
    label: 'Solarized Light',
    category: 'light',
    colors: ['#FDF6E3', '#657B83', '#268BD2'],
  },
  'one-light': {
    label: 'One Light',
    category: 'light',
    colors: ['#FAFAFA', '#383A42', '#A626A4'],
  },
  'nord-light': {
    label: 'Nord Light',
    category: 'light',
    colors: ['#ECEFF4', '#2E3440', '#5E81AC'],
  },
};

const darkThemes = (
  Object.entries(THEME_META) as [EditorTheme, ThemeMeta][]
).filter(([, m]) => m.category === 'dark');
const lightThemes = (
  Object.entries(THEME_META) as [EditorTheme, ThemeMeta][]
).filter(([, m]) => m.category === 'light');

function ThemeColorDots({ colors }: { colors: [string, string, string] }) {
  return (
    <div className='flex items-center -space-x-1'>
      {colors.map((color, i) => (
        <div
          key={i}
          className='size-3 rounded-full border border-border/50'
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

function defineCustomThemes(monaco: Monaco) {
  monaco.editor.defineTheme('monokai', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '75715E', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'F92672' },
      { token: 'string', foreground: 'E6DB74' },
      { token: 'number', foreground: 'AE81FF' },
      { token: 'type', foreground: '66D9EF', fontStyle: 'italic' },
      { token: 'tag', foreground: 'F92672' },
      { token: 'attribute.name', foreground: 'A6E22E' },
      { token: 'attribute.value', foreground: 'E6DB74' },
      { token: 'delimiter', foreground: 'F8F8F2' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#F8F8F2',
      'editor.lineHighlightBackground': '#3E3D32',
      'editorCursor.foreground': '#F8F8F0',
      'editor.selectionBackground': '#49483E',
    },
  });

  monaco.editor.defineTheme('dracula', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272A4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'FF79C6' },
      { token: 'string', foreground: 'F1FA8C' },
      { token: 'number', foreground: 'BD93F9' },
      { token: 'type', foreground: '8BE9FD', fontStyle: 'italic' },
      { token: 'tag', foreground: 'FF79C6' },
      { token: 'attribute.name', foreground: '50FA7B' },
      { token: 'attribute.value', foreground: 'F1FA8C' },
      { token: 'delimiter', foreground: 'F8F8F2' },
    ],
    colors: {
      'editor.background': '#282A36',
      'editor.foreground': '#F8F8F2',
      'editor.lineHighlightBackground': '#44475A',
      'editorCursor.foreground': '#F8F8F0',
      'editor.selectionBackground': '#44475A',
    },
  });

  monaco.editor.defineTheme('github-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8B949E', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'FF7B72' },
      { token: 'string', foreground: 'A5D6FF' },
      { token: 'number', foreground: '79C0FF' },
      { token: 'type', foreground: 'FFA657' },
      { token: 'tag', foreground: '7EE787' },
      { token: 'attribute.name', foreground: '79C0FF' },
      { token: 'attribute.value', foreground: 'A5D6FF' },
      { token: 'delimiter', foreground: 'C9D1D9' },
    ],
    colors: {
      'editor.background': '#0D1117',
      'editor.foreground': '#C9D1D9',
      'editor.lineHighlightBackground': '#161B22',
      'editorCursor.foreground': '#C9D1D9',
      'editor.selectionBackground': '#264F78',
    },
  });

  monaco.editor.defineTheme('one-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5C6370', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'C678DD' },
      { token: 'string', foreground: '98C379' },
      { token: 'number', foreground: 'D19A66' },
      { token: 'type', foreground: 'E5C07B' },
      { token: 'tag', foreground: 'E06C75' },
      { token: 'attribute.name', foreground: 'D19A66' },
      { token: 'attribute.value', foreground: '98C379' },
      { token: 'delimiter', foreground: 'ABB2BF' },
    ],
    colors: {
      'editor.background': '#282C34',
      'editor.foreground': '#ABB2BF',
      'editor.lineHighlightBackground': '#2C313C',
      'editorCursor.foreground': '#528BFF',
      'editor.selectionBackground': '#3E4451',
    },
  });

  monaco.editor.defineTheme('nord', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '616E88', fontStyle: 'italic' },
      { token: 'keyword', foreground: '81A1C1' },
      { token: 'string', foreground: 'A3BE8C' },
      { token: 'number', foreground: 'B48EAD' },
      { token: 'type', foreground: '8FBCBB' },
      { token: 'tag', foreground: '81A1C1' },
      { token: 'attribute.name', foreground: '8FBCBB' },
      { token: 'attribute.value', foreground: 'A3BE8C' },
      { token: 'delimiter', foreground: 'D8DEE9' },
    ],
    colors: {
      'editor.background': '#2E3440',
      'editor.foreground': '#D8DEE9',
      'editor.lineHighlightBackground': '#3B4252',
      'editorCursor.foreground': '#D8DEE9',
      'editor.selectionBackground': '#434C5E',
    },
  });

  monaco.editor.defineTheme('solarized-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '586E75', fontStyle: 'italic' },
      { token: 'keyword', foreground: '859900' },
      { token: 'string', foreground: '2AA198' },
      { token: 'number', foreground: 'D33682' },
      { token: 'type', foreground: 'B58900' },
      { token: 'tag', foreground: '268BD2' },
      { token: 'attribute.name', foreground: '93A1A1' },
      { token: 'attribute.value', foreground: '2AA198' },
      { token: 'delimiter', foreground: '839496' },
    ],
    colors: {
      'editor.background': '#002B36',
      'editor.foreground': '#839496',
      'editor.lineHighlightBackground': '#073642',
      'editorCursor.foreground': '#839496',
      'editor.selectionBackground': '#073642',
    },
  });

  // — Light themes —

  monaco.editor.defineTheme('github-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'CF222E' },
      { token: 'string', foreground: '0A3069' },
      { token: 'number', foreground: '0550AE' },
      { token: 'type', foreground: '953800' },
      { token: 'tag', foreground: '116329' },
      { token: 'attribute.name', foreground: '0550AE' },
      { token: 'attribute.value', foreground: '0A3069' },
      { token: 'delimiter', foreground: '24292F' },
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#24292F',
      'editor.lineHighlightBackground': '#F6F8FA',
      'editorCursor.foreground': '#24292F',
      'editor.selectionBackground': '#BBDFFF',
    },
  });

  monaco.editor.defineTheme('solarized-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '93A1A1', fontStyle: 'italic' },
      { token: 'keyword', foreground: '859900' },
      { token: 'string', foreground: '2AA198' },
      { token: 'number', foreground: 'D33682' },
      { token: 'type', foreground: 'B58900' },
      { token: 'tag', foreground: '268BD2' },
      { token: 'attribute.name', foreground: '657B83' },
      { token: 'attribute.value', foreground: '2AA198' },
      { token: 'delimiter', foreground: '586E75' },
    ],
    colors: {
      'editor.background': '#FDF6E3',
      'editor.foreground': '#657B83',
      'editor.lineHighlightBackground': '#EEE8D5',
      'editorCursor.foreground': '#657B83',
      'editor.selectionBackground': '#EEE8D5',
    },
  });

  monaco.editor.defineTheme('one-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: 'A0A1A7', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'A626A4' },
      { token: 'string', foreground: '50A14F' },
      { token: 'number', foreground: '986801' },
      { token: 'type', foreground: 'C18401' },
      { token: 'tag', foreground: 'E45649' },
      { token: 'attribute.name', foreground: '986801' },
      { token: 'attribute.value', foreground: '50A14F' },
      { token: 'delimiter', foreground: '383A42' },
    ],
    colors: {
      'editor.background': '#FAFAFA',
      'editor.foreground': '#383A42',
      'editor.lineHighlightBackground': '#F2F2F2',
      'editorCursor.foreground': '#526FFF',
      'editor.selectionBackground': '#E5E5E6',
    },
  });

  monaco.editor.defineTheme('nord-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '9DA2AD', fontStyle: 'italic' },
      { token: 'keyword', foreground: '5E81AC' },
      { token: 'string', foreground: 'A3BE8C' },
      { token: 'number', foreground: 'B48EAD' },
      { token: 'type', foreground: '8FBCBB' },
      { token: 'tag', foreground: '81A1C1' },
      { token: 'attribute.name', foreground: '8FBCBB' },
      { token: 'attribute.value', foreground: 'A3BE8C' },
      { token: 'delimiter', foreground: '2E3440' },
    ],
    colors: {
      'editor.background': '#ECEFF4',
      'editor.foreground': '#2E3440',
      'editor.lineHighlightBackground': '#E5E9F0',
      'editorCursor.foreground': '#2E3440',
      'editor.selectionBackground': '#D8DEE9',
    },
  });
}

type FormatterType = 'monaco' | 'prettier';

type HtmlWhitespaceSensitivity = 'css' | 'strict' | 'ignore';

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

const FORMATTER_LABELS: Record<FormatterType, string> = {
  prettier: 'Prettier',
  monaco: 'Monaco (встроенный)',
};

const HTML_WS_LABELS: Record<HtmlWhitespaceSensitivity, string> = {
  css: 'По CSS',
  strict: 'Строгий',
  ignore: 'Игнорировать',
};

const WEB_URL = (
  import.meta.env.VITE_WEB_URL || 'http://localhost:3000'
).replace(/\/$/, '');

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

interface EditorTabProps {
  formData: ArticleFormData;
}

export function EditorTab({ formData }: EditorTabProps) {
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [panelPos, setPanelPos] = useState({ x: -1, y: -1 });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const settingsBtnRef = useRef<HTMLButtonElement>(null);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Escape to exit fullscreen
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
    const editor = editorRef.current;
    if (!editor) return;

    if (settings.formatter === 'prettier') {
      const source = editor.getValue();
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
        editor.setValue(formatted);
      } catch {
        // fallback to Monaco formatter on error
        editor.getAction('editor.action.formatDocument')?.run();
      }
    } else {
      editor.getAction('editor.action.formatDocument')?.run();
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
      if (value !== undefined) {
        setContent(value);
      }
    },
    [setContent]
  );

  const updateSetting = useCallback(
    <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleToggleSettings = useCallback(() => {
    if (!settingsOpen && panelPos.x === -1) {
      const rect = settingsBtnRef.current?.getBoundingClientRect();
      if (rect) {
        setPanelPos({ x: Math.max(8, rect.left), y: rect.bottom + 8 });
      }
    }
    setSettingsOpen(o => !o);
  }, [settingsOpen, panelPos.x]);

  const handleDragDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      dragOffset.current = {
        x: e.clientX - panelPos.x,
        y: e.clientY - panelPos.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [panelPos]
  );

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPanelPos({
      x: Math.max(0, e.clientX - dragOffset.current.x),
      y: Math.max(0, e.clientY - dragOffset.current.y),
    });
  }, []);

  const handleDragUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col h-full',
        isFullscreen && 'fixed inset-0 z-50 bg-background'
      )}
    >
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
          {editorMode !== 'visual' && (
            <div className='flex items-center gap-0.5'>
              <Button
                variant='ghost'
                size='icon'
                className='size-8 text-muted-foreground hover:text-foreground'
                title='Форматировать код'
                onClick={handleFormat}
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
                onClick={handleToggleSettings}
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
            onClick={toggleFullscreen}
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
            <DevicePreview articleData={toPreviewData(formData)} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      {/* Editor Settings — draggable floating panel */}
      {settingsOpen && (
        <div
          className='fixed z-50 w-[280px] rounded-lg border bg-popover/90 backdrop-blur-[2px] shadow-xl'
          style={{ left: panelPos.x, top: panelPos.y }}
        >
          {/* Drag handle */}
          <div
            className='flex items-center justify-between px-3 py-2 border-b cursor-grab active:cursor-grabbing select-none'
            onPointerDown={handleDragDown}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragUp}
          >
            <div className='flex items-center gap-2'>
              <GripHorizontal className='size-3.5 text-muted-foreground/40' />
              <span className='text-xs font-semibold text-foreground'>
                Настройки редактора
              </span>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='size-5 text-muted-foreground hover:text-foreground'
              onClick={() => setSettingsOpen(false)}
              type='button'
            >
              <X className='size-3' />
            </Button>
          </div>

          {/* Settings content */}
          <div className='p-4 space-y-4'>
            {/* Font size */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <Label className='text-xs'>Размер шрифта</Label>
                <span className='text-[10px] tabular-nums text-muted-foreground'>
                  {settings.fontSize}px
                </span>
              </div>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([v]) => updateSetting('fontSize', v)}
                min={10}
                max={24}
                step={1}
              />
            </div>

            {/* Tab size */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <Label className='text-xs'>Размер таба</Label>
                <span className='text-[10px] tabular-nums text-muted-foreground'>
                  {settings.tabSize}
                </span>
              </div>
              <Slider
                value={[settings.tabSize]}
                onValueChange={([v]) => updateSetting('tabSize', v)}
                min={2}
                max={8}
                step={2}
              />
            </div>

            {/* Word wrap */}
            <div className='flex items-center justify-between'>
              <Label htmlFor='wordWrap' className='text-xs'>
                Перенос строк
              </Label>
              <Switch
                id='wordWrap'
                checked={settings.wordWrap}
                onCheckedChange={v => updateSetting('wordWrap', v)}
              />
            </div>

            {/* Line numbers */}
            <div className='flex items-center justify-between'>
              <Label htmlFor='lineNumbers' className='text-xs'>
                Номера строк
              </Label>
              <Switch
                id='lineNumbers'
                checked={settings.lineNumbers}
                onCheckedChange={v => updateSetting('lineNumbers', v)}
              />
            </div>

            {/* Minimap */}
            <div className='flex items-center justify-between'>
              <Label htmlFor='minimap' className='text-xs'>
                Миникарта
              </Label>
              <Switch
                id='minimap'
                checked={settings.minimap}
                onCheckedChange={v => updateSetting('minimap', v)}
              />
            </div>

            {/* Theme */}
            <div className='flex items-center justify-between'>
              <Label className='text-xs'>Тема</Label>
              <Select
                value={settings.theme}
                onValueChange={v => updateSetting('theme', v as EditorTheme)}
              >
                <SelectTrigger className='w-[170px]' size='sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Тёмные</SelectLabel>
                    {darkThemes.map(([key, meta]) => (
                      <SelectItem key={key} value={key}>
                        <ThemeColorDots colors={meta.colors} />
                        {meta.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Светлые</SelectLabel>
                    {lightThemes.map(([key, meta]) => (
                      <SelectItem key={key} value={key}>
                        <ThemeColorDots colors={meta.colors} />
                        {meta.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Formatter section */}
            <div className='border-t border-border/50 pt-4 space-y-4'>
              <div className='flex items-center justify-between'>
                <Label className='text-xs'>Форматтер</Label>
                <Select
                  value={settings.formatter}
                  onValueChange={v =>
                    updateSetting('formatter', v as FormatterType)
                  }
                >
                  <SelectTrigger className='w-[150px]' size='sm'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.entries(FORMATTER_LABELS) as [
                        FormatterType,
                        string,
                      ][]
                    ).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {settings.formatter === 'prettier' && (
                <>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <Label className='text-xs'>Ширина строки</Label>
                      <span className='text-[10px] tabular-nums text-muted-foreground'>
                        {settings.prettierPrintWidth}
                      </span>
                    </div>
                    <Slider
                      value={[settings.prettierPrintWidth]}
                      onValueChange={([v]) =>
                        updateSetting('prettierPrintWidth', v)
                      }
                      min={40}
                      max={160}
                      step={10}
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <Label className='text-xs'>HTML пробелы</Label>
                    <Select
                      value={settings.prettierHtmlWhitespaceSensitivity}
                      onValueChange={v =>
                        updateSetting(
                          'prettierHtmlWhitespaceSensitivity',
                          v as HtmlWhitespaceSensitivity
                        )
                      }
                    >
                      <SelectTrigger className='w-[150px]' size='sm'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          Object.entries(HTML_WS_LABELS) as [
                            HtmlWhitespaceSensitivity,
                            string,
                          ][]
                        ).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
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
