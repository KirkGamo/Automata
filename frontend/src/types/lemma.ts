/**
 * Type definitions for the Pumping Lemma Visualizer
 */

export type LemmaMode = 'regular' | 'context-free';

export type Language = 'anbn' | 'anbncn' | 'abn' | 'ww' | 'custom';

export interface RegularSegments {
  x: string;
  y: string;
  z: string;
}

export interface CFSegments {
  u: string;
  v: string;
  w: string;
  x: string;
  y: string;
}

export type Segments = RegularSegments | CFSegments;

export interface PumpingState {
  mode: LemmaMode;
  language: Language;
  customLanguage?: string;
  testString: string;
  pumpingLength: number;
  segments: Segments | null;
  pumpCount: number;
  isValid: boolean | null;
  errorMessage?: string;
}

export interface LanguageDefinition {
  id: Language;
  name: string;
  description: string;
  example: string;
  mode: LemmaMode;
}
