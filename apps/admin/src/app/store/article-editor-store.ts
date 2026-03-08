/**
 * Стор редактора статей — глобальное состояние, общее для всех вкладок.
 *
 * Управляет: режим редактирования (html/markdown/visual), контент, autosave-статус.
 * Переключение режима требует подтверждения через `requestModeChange` → AlertDialog →
 * `confirmModeChange` (защита от случайной потери форматирования при конвертации).
 *
 * @see ArticleWorkbench — оркестратор, подписывается на watch() и синхронизирует content
 * @see EditorTab — использует editorMode для выбора Monaco vs VisualEditor
 */
import { create } from 'zustand';
import type { EditorMode, AutosaveStatus } from '@/app/types/article-editor';

interface ArticleEditorState {
  articleId: string | null;
  articleSlug: string | null;
  editorMode: EditorMode;
  content: string;
  isDirty: boolean;
  autosaveStatus: AutosaveStatus;
  showConversionWarning: boolean;
  pendingMode: EditorMode | null;

  openArticle: (id: string | null, slug: string, content: string) => void;
  closeArticle: () => void;
  setContent: (content: string) => void;
  requestModeChange: (mode: EditorMode) => void;
  confirmModeChange: () => void;
  cancelModeChange: () => void;
  markSaved: () => void;
  setAutosaveStatus: (status: AutosaveStatus) => void;
}

export const useArticleEditorStore = create<ArticleEditorState>((set, get) => ({
  articleId: null,
  articleSlug: null,
  editorMode: 'html',
  content: '',
  isDirty: false,
  autosaveStatus: 'saved',
  showConversionWarning: false,
  pendingMode: null,

  openArticle: (id, slug, content) =>
    set({
      articleId: id,
      articleSlug: slug,
      content,
      editorMode: 'html',
      isDirty: false,
      autosaveStatus: 'saved',
    }),

  closeArticle: () =>
    set({
      articleId: null,
      articleSlug: null,
      content: '',
      editorMode: 'html',
      isDirty: false,
      autosaveStatus: 'saved',
      showConversionWarning: false,
      pendingMode: null,
    }),

  setContent: content =>
    set({ content, isDirty: true, autosaveStatus: 'syncing' }),

  requestModeChange: mode => {
    const { editorMode } = get();
    if (mode === editorMode) return;
    set({ showConversionWarning: true, pendingMode: mode });
  },

  confirmModeChange: () => {
    const { pendingMode } = get();
    if (pendingMode) {
      set({
        editorMode: pendingMode,
        showConversionWarning: false,
        pendingMode: null,
      });
    }
  },

  cancelModeChange: () =>
    set({ showConversionWarning: false, pendingMode: null }),

  markSaved: () => set({ isDirty: false, autosaveStatus: 'saved' }),

  setAutosaveStatus: status => set({ autosaveStatus: status }),
}));
