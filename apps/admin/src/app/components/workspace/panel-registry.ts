import type { ComponentType } from 'react';
import type { ItemType } from '@/app/types/workspace-layout';
import { NoteEditorPanel } from '@/app/components/panels/note-editor-panel';
import { SourceViewerPanel } from '@/app/components/panels/source-viewer-panel';
import { MediaGalleryPanel } from '@/app/components/panels/media-gallery-panel';
import { AiChatPanel } from '@/app/components/panels/ai-chat-panel';

export interface PanelComponentProps {
  itemId: string;
}

export const panelRegistry: Record<
  ItemType,
  ComponentType<PanelComponentProps>
> = {
  note: NoteEditorPanel,
  draft: NoteEditorPanel,
  source: SourceViewerPanel,
  media: MediaGalleryPanel,
  'ai-chat': AiChatPanel,
};
