import { useState, useRef, useEffect } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { DeviceType, EditorMode } from '@/app/types/article-editor';

const DEVICE_CONFIG: Record<
  DeviceType,
  { width: number; label: string; icon: typeof Monitor }
> = {
  desktop: { width: 1280, label: 'Десктоп', icon: Monitor },
  tablet: { width: 768, label: 'Планшет', icon: Tablet },
  mobile: { width: 375, label: 'Мобильный', icon: Smartphone },
};

interface DevicePreviewProps {
  content: string;
  mode: EditorMode;
}

export function DevicePreview({ content, mode }: DevicePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      const containerWidth = entry.contentRect.width;
      const deviceWidth = DEVICE_CONFIG[device].width;
      setScale(Math.min(1, containerWidth / deviceWidth));
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [device]);

  const deviceWidth = DEVICE_CONFIG[device].width;

  return (
    <div className='flex flex-col h-full'>
      {/* Device Switcher */}
      <div className='flex items-center gap-1 p-2 border-b bg-muted/30'>
        {(
          Object.entries(DEVICE_CONFIG) as [
            DeviceType,
            typeof DEVICE_CONFIG.desktop,
          ][]
        ).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Button
              key={key}
              variant={device === key ? 'secondary' : 'ghost'}
              size='sm'
              className='h-7 gap-1.5 text-xs'
              onClick={() => setDevice(key)}
            >
              <Icon className='h-3.5 w-3.5' />
              <span className='hidden sm:inline'>{config.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Preview Area */}
      <div
        ref={containerRef}
        className='flex-1 overflow-auto bg-muted/20 p-4 flex justify-center'
      >
        <div
          className={cn(
            'bg-background border rounded-lg shadow-sm overflow-auto',
            device !== 'desktop' && 'mx-auto'
          )}
          style={{
            width: deviceWidth,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            minHeight: 400,
          }}
        >
          <div className='p-6 prose prose-sm dark:prose-invert max-w-none'>
            {mode === 'html' || mode === 'visual' ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
