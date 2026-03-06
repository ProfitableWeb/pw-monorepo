/**
 * Переиспользуемая плавающая панель настроек редактора.
 *
 * Паттерн использования:
 * ```tsx
 * const panel = useEditorSettingsPanel();   // состояние + drag-логика
 * <button ref={panel.triggerRef} onClick={panel.toggle}>⚙</button>
 * <EditorSettingsPanel fontSize={14} ... {...panel}>
 *   <ExtraSettings />  // дочерние элементы рендерятся внизу панели
 * </EditorSettingsPanel>
 * ```
 *
 * Панель: фиксированная (fixed), перетаскивается за grip-хэндл,
 * позиционируется относительно кнопки-триггера при первом открытии.
 *
 * @see EditorTab — использует с FormatterSettings в children
 * @see CardTab — использует без children (только базовые настройки)
 */
import { useState, useRef, useCallback, type ReactNode } from 'react';
import { GripHorizontal, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Slider } from '@/app/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  type EditorTheme,
  type ThemeMeta,
  darkThemes,
  lightThemes,
} from './editor-themes';

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export interface EditorSettingsPanelProps {
  title?: string;

  fontSize: number;
  onFontSizeChange: (v: number) => void;
  fontSizeMin?: number;
  fontSizeMax?: number;

  wordWrap: boolean;
  onWordWrapChange: (v: boolean) => void;

  lineNumbers?: boolean;
  onLineNumbersChange?: (v: boolean) => void;

  minimap?: boolean;
  onMinimapChange?: (v: boolean) => void;

  tabSize?: number;
  onTabSizeChange?: (v: number) => void;

  theme?: EditorTheme;
  onThemeChange?: (v: EditorTheme) => void;

  children?: ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Hook: draggable + toggle logic                                     */
/* ------------------------------------------------------------------ */

export function useEditorSettingsPanel() {
  const [open, setOpen] = useState(false);
  const [panelPos, setPanelPos] = useState({ x: -1, y: -1 });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(() => {
    setOpen(prev => {
      if (!prev && panelPos.x === -1) {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect) {
          setPanelPos({ x: Math.max(8, rect.left), y: rect.bottom + 8 });
        }
      }
      return !prev;
    });
  }, [panelPos.x]);

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

  return {
    open,
    setOpen,
    panelPos,
    triggerRef,
    toggle,
    handleDragDown,
    handleDragMove,
    handleDragUp,
  };
}

/* ------------------------------------------------------------------ */
/*  ThemeColorDots                                                     */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function EditorSettingsPanel({
  title = 'Настройки редактора',
  fontSize,
  onFontSizeChange,
  fontSizeMin = 10,
  fontSizeMax = 24,
  wordWrap,
  onWordWrapChange,
  lineNumbers,
  onLineNumbersChange,
  minimap,
  onMinimapChange,
  tabSize,
  onTabSizeChange,
  theme,
  onThemeChange,
  children,
  ...panel
}: EditorSettingsPanelProps & ReturnType<typeof useEditorSettingsPanel>) {
  if (!panel.open) return null;

  return (
    <div
      className='fixed z-50 w-[280px] rounded-lg border bg-popover/90 backdrop-blur-[2px] shadow-xl'
      style={{ left: panel.panelPos.x, top: panel.panelPos.y }}
    >
      {/* Drag handle */}
      <div
        className='flex items-center justify-between px-3 py-2 border-b cursor-grab active:cursor-grabbing select-none'
        onPointerDown={panel.handleDragDown}
        onPointerMove={panel.handleDragMove}
        onPointerUp={panel.handleDragUp}
      >
        <div className='flex items-center gap-2'>
          <GripHorizontal className='size-3.5 text-muted-foreground/40' />
          <span className='text-xs font-semibold text-foreground'>{title}</span>
        </div>
        <Button
          variant='ghost'
          size='icon'
          className='size-5 text-muted-foreground hover:text-foreground'
          onClick={() => panel.setOpen(false)}
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
              {fontSize}px
            </span>
          </div>
          <Slider
            value={[fontSize]}
            onValueChange={vals => onFontSizeChange(vals[0] ?? fontSize)}
            min={fontSizeMin}
            max={fontSizeMax}
            step={1}
          />
        </div>

        {/* Tab size */}
        {tabSize !== undefined && onTabSizeChange && (
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label className='text-xs'>Размер таба</Label>
              <span className='text-[10px] tabular-nums text-muted-foreground'>
                {tabSize}
              </span>
            </div>
            <Slider
              value={[tabSize]}
              onValueChange={vals => onTabSizeChange(vals[0] ?? tabSize ?? 2)}
              min={2}
              max={8}
              step={2}
            />
          </div>
        )}

        {/* Word wrap */}
        <div className='flex items-center justify-between'>
          <Label htmlFor='esp-wordWrap' className='text-xs'>
            Перенос строк
          </Label>
          <Switch
            id='esp-wordWrap'
            checked={wordWrap}
            onCheckedChange={onWordWrapChange}
          />
        </div>

        {/* Line numbers */}
        {lineNumbers !== undefined && onLineNumbersChange && (
          <div className='flex items-center justify-between'>
            <Label htmlFor='esp-lineNumbers' className='text-xs'>
              Номера строк
            </Label>
            <Switch
              id='esp-lineNumbers'
              checked={lineNumbers}
              onCheckedChange={onLineNumbersChange}
            />
          </div>
        )}

        {/* Minimap */}
        {minimap !== undefined && onMinimapChange && (
          <div className='flex items-center justify-between'>
            <Label htmlFor='esp-minimap' className='text-xs'>
              Миникарта
            </Label>
            <Switch
              id='esp-minimap'
              checked={minimap}
              onCheckedChange={onMinimapChange}
            />
          </div>
        )}

        {/* Theme */}
        {theme !== undefined && onThemeChange && (
          <div className='flex items-center justify-between'>
            <Label className='text-xs'>Тема</Label>
            <Select
              value={theme}
              onValueChange={v => onThemeChange(v as EditorTheme)}
            >
              <SelectTrigger className='w-[170px]' size='sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Тёмные</SelectLabel>
                  {darkThemes.map(([key, meta]: [EditorTheme, ThemeMeta]) => (
                    <SelectItem key={key} value={key}>
                      <ThemeColorDots colors={meta.colors} />
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Светлые</SelectLabel>
                  {lightThemes.map(([key, meta]: [EditorTheme, ThemeMeta]) => (
                    <SelectItem key={key} value={key}>
                      <ThemeColorDots colors={meta.colors} />
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Extra sections */}
        {children}
      </div>
    </div>
  );
}
