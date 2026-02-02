import { create } from 'zustand';
import type { ContextType, AIProvider, CaptionChunk, User, Meeting, Category } from '@/types';

interface ExtensionState {
  // Session
  isCapturing: boolean;
  sessionId: string;
  startTime: number | null;

  // Configuration
  context: ContextType;
  aiProvider: AIProvider;
  apiKey: string | null;

  // User & Auth
  isAuthenticated: boolean;
  user: User | null;

  // Cloud Sync
  isSyncing: boolean;
  lastSyncTime: number | null;
  offlineMode: boolean;

  // Meeting History
  meetings: Meeting[];
  categories: Category[];
  selectedMeeting: Meeting | null;

  // Content
  transcript: CaptionChunk[];
  currentSummary: string;
  cumulativeSummary: string; // Added for cumulative summaries
  actionItems: string[];
  suggestions: string[];
  isGeneratingSummary: boolean; // Added for loading state

  // Actions
  startCapture: () => void;
  stopCapture: () => void;
  setContext: (ctx: ContextType) => void;
  setAiProvider: (provider: AIProvider) => void;
  setApiKey: (key: string) => void;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuth: boolean) => void;
  addCaption: (chunk: CaptionChunk) => void;
  updateSummary: (summary: string) => void;
  updateCumulativeSummary: (summary: string) => void; // Added
  setActionItems: (items: string[]) => void;
  setSuggestions: (suggestions: string[]) => void;
  clearSession: () => void;
  setMeetings: (meetings: Meeting[]) => void;
  setCategories: (categories: Category[]) => void;
  setSelectedMeeting: (meeting: Meeting | null) => void;
  setIsSyncing: (syncing: boolean) => void;
  setLastSyncTime: (time: number | null) => void;
  setOfflineMode: (offline: boolean) => void;
  setIsGeneratingSummary: (generating: boolean) => void; // Added
}

export const useExtensionStore = create<ExtensionState>((set) => ({
  // Initial State
  isCapturing: false,
  sessionId: '',
  startTime: null,
  context: 'technical',
  aiProvider: 'glm',
  apiKey: null,
  isAuthenticated: false,
  user: null,
  isSyncing: false,
  lastSyncTime: null,
  offlineMode: false,
  meetings: [],
  categories: [],
  selectedMeeting: null,
  transcript: [],
  currentSummary: '',
  cumulativeSummary: '', // Added
  actionItems: [],
  suggestions: [],
  isGeneratingSummary: false, // Added

  // Actions
  startCapture: () => set({
    isCapturing: true,
    sessionId: crypto.randomUUID(),
    startTime: Date.now(),
    transcript: [],
    currentSummary: '',
    cumulativeSummary: '', // Reset cumulative summary
    actionItems: [],
    suggestions: [],
  }),

  stopCapture: () => set({ isCapturing: false }),

  setContext: (ctx) => set({ context: ctx }),

  setAiProvider: (provider) => set({ aiProvider: provider }),

  setApiKey: (key) => set({ apiKey: key }),

  setUser: (user) => set({ user }),

  setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),

  addCaption: (chunk) => set((state) => ({
    transcript: [...state.transcript, chunk],
  })),

  updateSummary: (summary) => set({ currentSummary: summary }),

  updateCumulativeSummary: (summary) => set({ cumulativeSummary: summary }), // Added

  setActionItems: (items) => set({ actionItems: items }),

  setSuggestions: (suggestions) => set({ suggestions }),

  clearSession: () => set({
    isCapturing: false,
    sessionId: '',
    startTime: null,
    transcript: [],
    currentSummary: '',
    cumulativeSummary: '', // Reset cumulative summary
    actionItems: [],
    suggestions: [],
  }),

  setMeetings: (meetings) => set({ meetings }),

  setCategories: (categories) => set({ categories }),

  setSelectedMeeting: (meeting) => set({ selectedMeeting: meeting }),

  setIsSyncing: (syncing) => set({ isSyncing: syncing }),

  setLastSyncTime: (time) => set({ lastSyncTime: time }),

  setOfflineMode: (offline) => set({ offlineMode: offline }),

  setIsGeneratingSummary: (generating) => set({ isGeneratingSummary: generating }), // Added
}));

