import { create } from 'zustand';
import type { User, AnalysisResult, AnalysisHistory } from './api';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;

  // Analysis
  currentAnalysisType: string;
  setCurrentAnalysisType: (type: string) => void;
  analysisAnswers: Record<string, unknown>;
  setAnalysisAnswer: (key: string, value: unknown) => void;
  clearAnalysisAnswers: () => void;

  // Results
  currentResult: AnalysisResult | null;
  setCurrentResult: (result: AnalysisResult | null) => void;

  // History
  history: AnalysisHistory[];
  setHistory: (history: AnalysisHistory[]) => void;

  // Onboarding
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user }),
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null, onboardingComplete: false }),

  currentAnalysisType: '',
  setCurrentAnalysisType: (type) => set({ currentAnalysisType: type }),
  analysisAnswers: {},
  setAnalysisAnswer: (key, value) =>
    set((state) => ({ analysisAnswers: { ...state.analysisAnswers, [key]: value } })),
  clearAnalysisAnswers: () => set({ analysisAnswers: {} }),

  currentResult: null,
  setCurrentResult: (result) => set({ currentResult: result }),

  history: [],
  setHistory: (history) => set({ history }),

  onboardingComplete: false,
  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
}));
