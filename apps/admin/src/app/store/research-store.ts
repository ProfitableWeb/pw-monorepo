import { create } from 'zustand';
import type {
  Research,
  ResearchNote,
  ResearchSource,
  ResearchDraft,
  ResearchMedia,
  ResearchPublication,
  ResearchStatus,
} from '@/app/types/research';
import {
  mockResearches,
  mockNotes,
  mockSources,
  mockDrafts,
  mockMedia,
  mockPublications,
} from '@/app/mock/research-mock';

interface ResearchStore {
  // Data
  researches: Research[];
  notes: ResearchNote[];
  sources: ResearchSource[];
  drafts: ResearchDraft[];
  media: ResearchMedia[];
  publications: ResearchPublication[];

  // State
  currentResearchId: string | null;
  statusFilter: ResearchStatus | 'all';
  searchQuery: string;

  // Navigation
  setCurrentResearch: (id: string | null) => void;
  setStatusFilter: (status: ResearchStatus | 'all') => void;
  setSearchQuery: (query: string) => void;

  // Research CRUD
  createResearch: (title: string, description: string) => Research;
  updateResearch: (
    id: string,
    updates: Partial<
      Pick<Research, 'title' | 'description' | 'status' | 'categoryId'>
    >
  ) => void;
  deleteResearch: (id: string) => void;

  // Content CRUD
  updateNote: (
    id: string,
    updates: Partial<Pick<ResearchNote, 'title' | 'content'>>
  ) => void;
  updateDraft: (
    id: string,
    updates: Partial<Pick<ResearchDraft, 'title' | 'content'>>
  ) => void;

  // Getters
  getCurrentResearch: () => Research | undefined;
  getResearchNotes: (researchId: string) => ResearchNote[];
  getResearchSources: (researchId: string) => ResearchSource[];
  getResearchDrafts: (researchId: string) => ResearchDraft[];
  getResearchMedia: (researchId: string) => ResearchMedia[];
  getResearchPublications: (researchId: string) => ResearchPublication[];
  getFilteredResearches: () => Research[];

  // Content counts for list view
  getResearchCounts: (researchId: string) => {
    notes: number;
    sources: number;
    drafts: number;
    media: number;
    publications: number;
  };
}

export const useResearchStore = create<ResearchStore>((set, get) => ({
  researches: mockResearches,
  notes: mockNotes,
  sources: mockSources,
  drafts: mockDrafts,
  media: mockMedia,
  publications: mockPublications,

  currentResearchId: null,
  statusFilter: 'all',
  searchQuery: '',

  setCurrentResearch: id => set({ currentResearchId: id }),
  setStatusFilter: status => set({ statusFilter: status }),
  setSearchQuery: query => set({ searchQuery: query }),

  createResearch: (title, description) => {
    const now = new Date().toISOString();
    const research: Research = {
      id: `research-${Date.now()}`,
      title,
      description,
      status: 'idea',
      createdAt: now,
      updatedAt: now,
      members: [
        {
          userId: 'user-1',
          role: 'owner',
          user: { id: 'user-1', name: 'Николай' },
        },
      ],
    };
    set(state => ({ researches: [research, ...state.researches] }));
    return research;
  },

  updateResearch: (id, updates) => {
    set(state => ({
      researches: state.researches.map(r =>
        r.id === id
          ? { ...r, ...updates, updatedAt: new Date().toISOString() }
          : r
      ),
    }));
  },

  deleteResearch: id => {
    set(state => ({
      researches: state.researches.filter(r => r.id !== id),
      notes: state.notes.filter(n => n.researchId !== id),
      sources: state.sources.filter(s => s.researchId !== id),
      drafts: state.drafts.filter(d => d.researchId !== id),
      media: state.media.filter(m => m.researchId !== id),
      publications: state.publications.filter(p => p.researchId !== id),
      currentResearchId:
        state.currentResearchId === id ? null : state.currentResearchId,
    }));
  },

  updateNote: (id, updates) => {
    set(state => ({
      notes: state.notes.map(n =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      ),
    }));
  },

  updateDraft: (id, updates) => {
    set(state => ({
      drafts: state.drafts.map(d =>
        d.id === id
          ? { ...d, ...updates, updatedAt: new Date().toISOString() }
          : d
      ),
    }));
  },

  getCurrentResearch: () => {
    const { researches, currentResearchId } = get();
    return researches.find(r => r.id === currentResearchId);
  },

  getResearchNotes: researchId =>
    get().notes.filter(n => n.researchId === researchId),

  getResearchSources: researchId =>
    get().sources.filter(s => s.researchId === researchId),

  getResearchDrafts: researchId =>
    get().drafts.filter(d => d.researchId === researchId),

  getResearchMedia: researchId =>
    get().media.filter(m => m.researchId === researchId),

  getResearchPublications: researchId =>
    get().publications.filter(p => p.researchId === researchId),

  getFilteredResearches: () => {
    const { researches, statusFilter, searchQuery } = get();
    return researches.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (
        searchQuery &&
        !r.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !r.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  },

  getResearchCounts: researchId => ({
    notes: get().notes.filter(n => n.researchId === researchId).length,
    sources: get().sources.filter(s => s.researchId === researchId).length,
    drafts: get().drafts.filter(d => d.researchId === researchId).length,
    media: get().media.filter(m => m.researchId === researchId).length,
    publications: get().publications.filter(p => p.researchId === researchId)
      .length,
  }),
}));
