/**
 * Global state management using Zustand
 */

import { create } from 'zustand';
import type { PumpingState, Language, LemmaMode, Segments } from '../types/lemma';
import { generateTestString, getDefaultPumpingLength } from '../lib/pumpingLogic';

interface PumpingStore extends PumpingState {
  setMode: (mode: LemmaMode) => void;
  setLanguage: (language: Language) => void;
  setTestString: (testString: string) => void;
  setPumpingLength: (pumpingLength: number) => void;
  setSegments: (segments: Segments | null) => void;
  setPumpCount: (pumpCount: number) => void;
  setIsValid: (isValid: boolean | null) => void;
  setErrorMessage: (errorMessage: string | undefined) => void;
  reset: () => void;
  generateString: () => void;
}

const initialState: PumpingState = {
  mode: 'regular',
  language: 'anbn',
  testString: '',
  pumpingLength: 5,
  segments: null,
  pumpCount: 1,
  isValid: null,
  errorMessage: undefined,
};

export const usePumpingStore = create<PumpingStore>((set, get) => ({
  ...initialState,

  setMode: (mode) => set({ mode, segments: null, isValid: null }),

  setLanguage: (language) => {
    const pumpingLength = getDefaultPumpingLength(language);
    const testString = generateTestString(language, pumpingLength);
    set({
      language,
      pumpingLength,
      testString,
      segments: null,
      isValid: null,
      errorMessage: undefined,
    });
  },

  setTestString: (testString) => set({ testString, segments: null, isValid: null }),

  setPumpingLength: (pumpingLength) => set({ pumpingLength }),

  setSegments: (segments) => set({ segments, isValid: null }),

  setPumpCount: (pumpCount) => set({ pumpCount, isValid: null }),

  setIsValid: (isValid) => set({ isValid }),

  setErrorMessage: (errorMessage) => set({ errorMessage }),

  reset: () => set(initialState),

  generateString: () => {
    const { language, pumpingLength } = get();
    const testString = generateTestString(language, pumpingLength);
    set({ testString, segments: null, isValid: null, errorMessage: undefined });
  },
}));
