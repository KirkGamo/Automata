import { describe, it, expect, beforeEach } from 'vitest';
import { usePumpingStore } from './store';
import type { RegularSegments } from '../types/lemma';

describe('usePumpingStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    usePumpingStore.getState().reset();
  });

  describe('initial state', () => {
    it('should have correct default values', () => {
      const state = usePumpingStore.getState();
      expect(state.mode).toBe('regular');
      expect(state.language).toBe('anbn');
      expect(state.testString).toBe('');
      expect(state.pumpingLength).toBe(5);
      expect(state.segments).toBeNull();
      expect(state.pumpCount).toBe(1);
      expect(state.isValid).toBeNull();
      expect(state.errorMessage).toBeUndefined();
    });
  });

  describe('setMode', () => {
    it('should update mode and reset segments', () => {
      const store = usePumpingStore.getState();
      
      // Set some segments first
      const segments: RegularSegments = { x: 'a', y: 'a', z: 'b' };
      store.setSegments(segments);
      
      // Get fresh state to check segments were set
      let state = usePumpingStore.getState();
      expect(state.segments).toBeTruthy();

      // Change mode should reset segments
      store.setMode('context-free');
      
      // Get fresh state to check mode change
      state = usePumpingStore.getState();
      expect(state.mode).toBe('context-free');
      expect(state.segments).toBeNull();
      expect(state.isValid).toBeNull();
    });
  });

  describe('setLanguage', () => {
    it('should update language and generate test string', () => {
      const store = usePumpingStore.getState();
      store.setLanguage('anbncn');
      
      const state = usePumpingStore.getState();
      expect(state.language).toBe('anbncn');
      expect(state.testString).not.toBe('');
      expect(state.testString.length).toBeGreaterThanOrEqual(state.pumpingLength);
      expect(state.segments).toBeNull();
      expect(state.isValid).toBeNull();
    });

    it('should update pumping length based on language', () => {
      const store = usePumpingStore.getState();
      store.setLanguage('anbncn');
      
      const state = usePumpingStore.getState();
      expect(state.pumpingLength).toBe(5);
    });
  });

  describe('setTestString', () => {
    it('should update test string and reset validation', () => {
      const store = usePumpingStore.getState();
      store.setTestString('aabbcc');
      
      const state = usePumpingStore.getState();
      expect(state.testString).toBe('aabbcc');
      expect(state.segments).toBeNull();
      expect(state.isValid).toBeNull();
    });
  });

  describe('setPumpingLength', () => {
    it('should update pumping length', () => {
      const store = usePumpingStore.getState();
      store.setPumpingLength(10);
      
      const state = usePumpingStore.getState();
      expect(state.pumpingLength).toBe(10);
    });
  });

  describe('setSegments', () => {
    it('should update segments and reset isValid', () => {
      const store = usePumpingStore.getState();
      const segments: RegularSegments = { x: 'aa', y: 'a', z: 'bbb' };
      
      store.setIsValid(true);
      store.setSegments(segments);
      
      const state = usePumpingStore.getState();
      expect(state.segments).toEqual(segments);
      expect(state.isValid).toBeNull();
    });

    it('should allow setting segments to null', () => {
      const store = usePumpingStore.getState();
      const segments: RegularSegments = { x: 'aa', y: 'a', z: 'bbb' };
      
      store.setSegments(segments);
      expect(usePumpingStore.getState().segments).toBeTruthy();
      
      store.setSegments(null);
      expect(usePumpingStore.getState().segments).toBeNull();
    });
  });

  describe('setPumpCount', () => {
    it('should update pump count and reset isValid', () => {
      const store = usePumpingStore.getState();
      
      store.setIsValid(true);
      store.setPumpCount(3);
      
      const state = usePumpingStore.getState();
      expect(state.pumpCount).toBe(3);
      expect(state.isValid).toBeNull();
    });
  });

  describe('setIsValid', () => {
    it('should update isValid', () => {
      const store = usePumpingStore.getState();
      
      store.setIsValid(true);
      expect(usePumpingStore.getState().isValid).toBe(true);
      
      store.setIsValid(false);
      expect(usePumpingStore.getState().isValid).toBe(false);
      
      store.setIsValid(null);
      expect(usePumpingStore.getState().isValid).toBeNull();
    });
  });

  describe('setErrorMessage', () => {
    it('should update error message', () => {
      const store = usePumpingStore.getState();
      
      store.setErrorMessage('Test error');
      expect(usePumpingStore.getState().errorMessage).toBe('Test error');
      
      store.setErrorMessage(undefined);
      expect(usePumpingStore.getState().errorMessage).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const store = usePumpingStore.getState();
      
      // Modify state
      store.setMode('context-free');
      store.setLanguage('anbncn');
      store.setPumpCount(5);
      store.setIsValid(true);
      
      // Reset
      store.reset();
      
      const state = usePumpingStore.getState();
      expect(state.mode).toBe('regular');
      expect(state.language).toBe('anbn');
      expect(state.testString).toBe('');
      expect(state.pumpingLength).toBe(5);
      expect(state.segments).toBeNull();
      expect(state.pumpCount).toBe(1);
      expect(state.isValid).toBeNull();
    });
  });

  describe('generateString', () => {
    it('should generate a new test string', () => {
      const store = usePumpingStore.getState();
      store.setLanguage('anbn'); // This generates a string
      
      const firstString = usePumpingStore.getState().testString;
      expect(firstString).not.toBe('');
      
      store.generateString();
      
      const secondString = usePumpingStore.getState().testString;
      expect(secondString).not.toBe('');
      // Strings should be valid for the language
      expect(secondString.length).toBeGreaterThanOrEqual(store.pumpingLength);
    });

    it('should reset segments and validation when generating new string', () => {
      const store = usePumpingStore.getState();
      
      store.setLanguage('anbn');
      const segments: RegularSegments = { x: 'aa', y: 'a', z: 'bbb' };
      store.setSegments(segments);
      store.setIsValid(true);
      
      store.generateString();
      
      const state = usePumpingStore.getState();
      expect(state.segments).toBeNull();
      expect(state.isValid).toBeNull();
      expect(state.errorMessage).toBeUndefined();
    });
  });
});
