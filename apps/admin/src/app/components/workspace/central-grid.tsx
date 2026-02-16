import { useRef, useCallback } from 'react';
import { cn } from '@/app/components/ui/utils';
import type { LayoutNode } from '@/app/types/workspace-layout';
import { useWorkspaceLayoutStore } from '@/app/store/workspace-layout-store';
import { WorkspacePanel } from '@/app/components/workspace/workspace-panel';
import { FlaskConical } from 'lucide-react';

interface CentralGridProps {
  researchId: string;
}

export function CentralGrid({ researchId }: CentralGridProps) {
  const layout = useWorkspaceLayoutStore(s => s.getLayout(researchId));

  if (!layout) {
    return (
      <div className='flex items-center justify-center h-full text-muted-foreground'>
        <div className='text-center'>
          <FlaskConical className='h-10 w-10 mx-auto mb-3 opacity-15' />
          <p className='text-sm'>Загрузка layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full'>
      <LayoutNodeRenderer node={layout} researchId={researchId} />
    </div>
  );
}

function LayoutNodeRenderer({
  node,
  researchId,
}: {
  node: LayoutNode;
  researchId: string;
}) {
  if (node.type === 'panel') {
    return <WorkspacePanel panel={node} researchId={researchId} />;
  }

  const isHorizontal = node.direction === 'horizontal';
  const firstPercent = node.ratio * 100;
  const secondPercent = 100 - firstPercent;

  return (
    <div className={cn('flex h-full', isHorizontal ? 'flex-row' : 'flex-col')}>
      <div
        style={
          isHorizontal
            ? { width: `${firstPercent}%` }
            : { height: `${firstPercent}%` }
        }
        className='min-w-0 min-h-0'
      >
        <LayoutNodeRenderer node={node.first} researchId={researchId} />
      </div>

      <SplitHandle
        splitId={node.id}
        direction={node.direction}
        researchId={researchId}
      />

      <div
        style={
          isHorizontal
            ? { width: `${secondPercent}%` }
            : { height: `${secondPercent}%` }
        }
        className='min-w-0 min-h-0'
      >
        <LayoutNodeRenderer node={node.second} researchId={researchId} />
      </div>
    </div>
  );
}

function SplitHandle({
  splitId,
  direction,
  researchId,
}: {
  splitId: string;
  direction: 'horizontal' | 'vertical';
  researchId: string;
}) {
  const { updateSplitRatio } = useWorkspaceLayoutStore();
  const isDragging = useRef(false);
  const containerRect = useRef<DOMRect | null>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const isHorizontal = direction === 'horizontal';

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDragging.current = true;

      // Get the parent container rect for ratio calculation
      const parent = e.currentTarget.parentElement;
      if (parent) {
        containerRect.current = parent.getBoundingClientRect();
      }
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
    },
    [isHorizontal]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || !containerRect.current) return;

      const rect = containerRect.current;
      let ratio: number;

      if (isHorizontal) {
        ratio = (e.clientX - rect.left) / rect.width;
      } else {
        ratio = (e.clientY - rect.top) / rect.height;
      }

      // Clamp ratio between 0.15 and 0.85 to prevent tiny panels
      ratio = Math.min(Math.max(ratio, 0.15), 0.85);
      updateSplitRatio(researchId, splitId, ratio);
    },
    [isHorizontal, researchId, splitId, updateSplitRatio]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDragging.current = false;
    containerRect.current = null;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  return (
    <div
      ref={handleRef}
      className={cn(
        'flex-shrink-0 transition-colors z-10',
        'hover:bg-primary/20 active:bg-primary/40',
        isHorizontal ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  );
}
