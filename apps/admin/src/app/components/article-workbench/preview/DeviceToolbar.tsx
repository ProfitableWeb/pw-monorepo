/**
 * Тулбар DevicePreview: выбор устройства, пресета, zoom, поворот, ручной ввод размеров.
 * Скрывает расширенные контролы (пресет, zoom, размеры) в десктопном режиме.
 */
import { RotateCcw, Minus, Plus, Scan } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { cn } from '@/app/components/ui/utils';
import type { DeviceType } from '@/app/types/article-editor';
import {
  DEVICE_TABS,
  type DevicePreset,
  getPresetsForDevice,
} from './preview.types';

interface DeviceToolbarProps {
  device: DeviceType;
  onDeviceChange: (d: DeviceType) => void;
  selectedPreset: DevicePreset;
  onPresetChange: (label: string) => void;
  isCustomSize: boolean;
  isLandscape: boolean;
  onToggleRotation: () => void;
  zoom: number;
  autoFit: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  currentWidth: number;
  currentHeight: number;
  onSizeChange: (size: { width: number; height: number }) => void;
}

export function DeviceToolbar({
  device,
  onDeviceChange,
  selectedPreset,
  onPresetChange,
  isCustomSize,
  isLandscape,
  onToggleRotation,
  zoom,
  autoFit,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  currentWidth,
  currentHeight,
  onSizeChange,
}: DeviceToolbarProps) {
  const isDesktop = device === 'desktop';
  const presets = getPresetsForDevice(device);

  return (
    <div className='flex items-center gap-2 px-3 py-1.5 border-b bg-muted/30'>
      <Select
        value={device}
        onValueChange={(v: string) => onDeviceChange(v as DeviceType)}
      >
        <SelectTrigger className='h-7 w-[140px] text-xs' size='sm'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(
            Object.entries(DEVICE_TABS) as [
              DeviceType,
              (typeof DEVICE_TABS)['desktop'],
            ][]
          ).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <SelectItem key={key} value={key}>
                <span className='flex items-center gap-1.5'>
                  <Icon className='size-3.5' />
                  {config.label}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {!isDesktop && (
        <>
          <Select
            value={isCustomSize ? '__custom__' : selectedPreset.label}
            onValueChange={v => {
              if (v !== '__custom__') onPresetChange(v);
            }}
          >
            <SelectTrigger className='h-7 w-[170px] text-xs' size='sm'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {isCustomSize && (
                <SelectItem
                  key='__custom__'
                  value='__custom__'
                  className='text-muted-foreground italic'
                >
                  Custom
                </SelectItem>
              )}
              {presets.map(p => (
                <SelectItem key={p.label} value={p.label}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant='ghost'
            size='icon'
            className={cn('size-7', isLandscape && 'bg-muted')}
            onClick={onToggleRotation}
            title='Повернуть'
          >
            <RotateCcw className='size-3.5' />
          </Button>

          <div className='flex items-center gap-0.5'>
            <Button
              variant='ghost'
              size='icon'
              className='size-7'
              onClick={onZoomOut}
              title='Уменьшить'
            >
              <Minus className='size-3' />
            </Button>
            <span className='text-[10px] tabular-nums text-muted-foreground w-8 text-center select-none'>
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant='ghost'
              size='icon'
              className='size-7'
              onClick={onZoomIn}
              title='Увеличить'
            >
              <Plus className='size-3' />
            </Button>
          </div>

          <Button
            variant='ghost'
            size='sm'
            className={cn('h-7 text-xs px-2', autoFit && 'bg-muted')}
            onClick={onZoomFit}
            title='Подогнать'
          >
            <Scan className='size-3 mr-1' />
            Fit
          </Button>

          <div className='flex items-center gap-0.5 tabular-nums text-muted-foreground'>
            <input
              type='text'
              inputMode='numeric'
              value={currentWidth}
              maxLength={4}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                if (!raw) return;
                const v = Math.max(200, Math.min(2560, Number(raw)));
                onSizeChange({ width: v, height: currentHeight });
              }}
              className='w-6 bg-transparent text-right outline-none border-b border-transparent hover:border-muted-foreground/40 focus:border-primary text-[11px] leading-none tabular-nums'
            />
            <span className='select-none text-[11px]'>×</span>
            <input
              type='text'
              inputMode='numeric'
              value={currentHeight}
              maxLength={4}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                if (!raw) return;
                const v = Math.max(200, Math.min(2560, Number(raw)));
                onSizeChange({ width: currentWidth, height: v });
              }}
              className='w-7 bg-transparent outline-none border-b border-transparent hover:border-muted-foreground/40 focus:border-primary text-[11px] leading-none tabular-nums'
            />
          </div>
        </>
      )}
    </div>
  );
}
