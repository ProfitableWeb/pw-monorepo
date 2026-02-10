import { create } from "zustand";
import { blogAnalyticsSession, manifestCreationSession, type AISession } from "./ai-sessions";

export interface ThinkingBlock {
  id: string;
  content: string;
  duration?: number;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
  output?: string;
  status: "pending" | "success" | "error";
  duration?: number;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface MessageVariant {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  thinking?: ThinkingBlock[];
  toolCalls?: ToolCall[];
  attachments?: Attachment[];
  model?: string;
}

export interface Message {
  id: string;
  variants: MessageVariant[];
  currentVariantIndex: number;
}

interface AIState {
  sessions: AISession[];
  currentSessionId: string;
  input: string;
  attachments: Attachment[];
  selectedModel: string;
  isStreaming: boolean;
  editingMessageId: string | null;
  initialPrompt: string | null;
  
  // Getters
  getCurrentSession: () => AISession | undefined;
  getMessages: () => Message[];
  
  // Actions
  addMessage: (message: Omit<MessageVariant, "id" | "timestamp">) => void;
  addMessageVariant: (messageId: string, variant: Omit<MessageVariant, "id" | "timestamp">) => void;
  setInput: (input: string) => void;
  addAttachment: (attachment: Attachment) => void;
  removeAttachment: (id: string) => void;
  setAttachments: (attachments: Attachment[]) => void;
  setSelectedModel: (model: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  clearMessages: () => void;
  setCurrentVariant: (messageId: string, variantIndex: number) => void;
  setEditingMessageId: (id: string | null) => void;
  editMessage: (messageId: string, newContent: string, attachments?: Attachment[]) => void;
  setInitialPrompt: (prompt: string | null) => void;
  switchSession: (sessionId: string) => void;
  createNewSession: (title: string, initialMessage?: Omit<MessageVariant, "id" | "timestamp">) => string;
}

export const useAIStore = create<AIState>((set, get) => ({
  sessions: [blogAnalyticsSession, manifestCreationSession],
  currentSessionId: "session-1",
  input: "",
  attachments: [],
  selectedModel: "opus-4.6",
  isStreaming: false,
  editingMessageId: null,
  initialPrompt: null,
  
  getCurrentSession: () => {
    const state = get();
    return state.sessions.find(s => s.id === state.currentSessionId);
  },
  
  getMessages: () => {
    const session = get().getCurrentSession();
    return session?.messages || [];
  },
  
  addMessage: (message) =>
    set((state) => {
      const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
      if (!currentSession) return state;
      return {
        ...state,
        sessions: state.sessions.map(s => 
          s.id === state.currentSessionId
          ? {
            ...s,
            messages: [
              ...s.messages,
              {
                id: Math.random().toString(36).substr(2, 9),
                variants: [
                  {
                    ...message,
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: new Date(),
                  },
                ],
                currentVariantIndex: 0,
              },
            ],
          }
          : s
        ),
      };
    }),
  
  addMessageVariant: (messageId, variant) =>
    set((state) => {
      const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
      if (!currentSession) return state;
      return {
        ...state,
        sessions: state.sessions.map(s => 
          s.id === state.currentSessionId
          ? {
            ...s,
            messages: s.messages.map((message) =>
              message.id === messageId
                ? {
                    ...message,
                    variants: [
                      ...message.variants,
                      {
                        ...variant,
                        id: Math.random().toString(36).substr(2, 9),
                        timestamp: new Date(),
                      },
                    ],
                  }
                : message
            ),
          }
          : s
        ),
      };
    }),
  
  setInput: (input) => set({ input }),
  
  addAttachment: (attachment) =>
    set((state) => ({
      attachments: [...state.attachments, attachment],
    })),
  
  removeAttachment: (id) =>
    set((state) => ({
      attachments: state.attachments.filter((a) => a.id !== id),
    })),
  
  setAttachments: (attachments) => set({ attachments }),
  
  setSelectedModel: (model) => set({ selectedModel: model }),
  
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  
  clearMessages: () =>
    set((state) => ({
      sessions: state.sessions.map(s => 
        s.id === state.currentSessionId
        ? {
          ...s,
          messages: [
            {
              id: "1",
              variants: [
                {
                  id: "v1",
                  role: "assistant",
                  content: "Привет! Я AI ассистент для управления блогом. Чем могу помочь?",
                  timestamp: new Date(),
                },
              ],
              currentVariantIndex: 0,
            },
          ],
        }
        : s
      ),
    })),
  
  setCurrentVariant: (messageId, variantIndex) =>
    set((state) => {
      const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
      if (!currentSession) return state;
      return {
        ...state,
        sessions: state.sessions.map(s => 
          s.id === state.currentSessionId
          ? {
            ...s,
            messages: s.messages.map((message) =>
              message.id === messageId
                ? {
                    ...message,
                    currentVariantIndex: variantIndex,
                  }
                : message
            ),
          }
          : s
        ),
      };
    }),
  
  setEditingMessageId: (id) => set({ editingMessageId: id }),
  
  editMessage: (messageId, newContent, attachments) =>
    set((state) => {
      const currentSession = state.sessions.find(s => s.id === state.currentSessionId);
      if (!currentSession) return state;
      return {
        ...state,
        sessions: state.sessions.map(s => 
          s.id === state.currentSessionId
          ? {
            ...s,
            messages: s.messages.map((message) =>
              message.id === messageId
                ? {
                    ...message,
                    variants: message.variants.map((variant) =>
                      variant.id === message.variants[message.currentVariantIndex].id
                        ? {
                            ...variant,
                            content: newContent,
                            attachments: attachments || [],
                          }
                        : variant
                    ),
                  }
                : message
            ),
          }
          : s
        ),
      };
    }),
  
  setInitialPrompt: (prompt) => set({ initialPrompt: prompt }),
  
  switchSession: (sessionId) => set({ currentSessionId: sessionId }),
  
  createNewSession: (title, initialMessage) => {
    const newSessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    set((state) => ({
      sessions: [
        ...state.sessions,
        {
          id: newSessionId,
          title,
          createdAt: now,
          updatedAt: now,
          messages: initialMessage
            ? [
              {
                id: Math.random().toString(36).substr(2, 9),
                variants: [
                  {
                    ...initialMessage,
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: new Date(),
                  },
                ],
                currentVariantIndex: 0,
              },
            ]
            : [],
        },
      ],
      currentSessionId: newSessionId,
    }));
    return newSessionId;
  },
}));