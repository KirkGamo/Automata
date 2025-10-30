/**
 * Pumping logic for string manipulation
 */

import type { Language, RegularSegments, CFSegments } from '../types/lemma';

/**
 * Generate a test string for the given language with length ≥ pumping length
 */
export function generateTestString(lang: Language, pumpingLength: number): string {
  const n = Math.max(pumpingLength, 5); // At least 5 to make it interesting

  switch (lang) {
    case 'anbn':
      // Generate aⁿbⁿ
      return 'a'.repeat(n) + 'b'.repeat(n);

    case 'anbncn':
      // Generate aⁿbⁿcⁿ
      return 'a'.repeat(n) + 'b'.repeat(n) + 'c'.repeat(n);

    case 'abn':
      // Generate (ab)ⁿ
      return 'ab'.repeat(n);

    case 'ww':
      // Generate ww where w = aⁿ
      const w = 'a'.repeat(Math.floor(n / 2));
      return w + w;

    default:
      return '';
  }
}

/**
 * Apply pumping to regular segments: xyⁱz
 */
export function pumpRegularString(segments: RegularSegments, i: number): string {
  return segments.x + segments.y.repeat(i) + segments.z;
}

/**
 * Apply pumping to context-free segments: uvⁱwxⁱy
 */
export function pumpCFString(segments: CFSegments, i: number): string {
  return (
    segments.u +
    segments.v.repeat(i) +
    segments.w +
    segments.x.repeat(i) +
    segments.y
  );
}

/**
 * Get default pumping length for a language
 */
export function getDefaultPumpingLength(lang: Language): number {
  switch (lang) {
    case 'anbn':
    case 'anbncn':
    case 'ww':
      return 5;
    case 'abn':
      return 4;
    default:
      return 5;
  }
}

/**
 * Suggest a split for demonstration purposes
 */
export function suggestRegularSplit(
  testString: string,
  pumpingLength: number
): RegularSegments | null {
  if (testString.length < pumpingLength) return null;

  // Simple heuristic: split at 1/3 of pumping length
  const splitPoint = Math.min(Math.floor(pumpingLength / 3), testString.length - 2);
  
  return {
    x: testString.slice(0, splitPoint),
    y: testString.slice(splitPoint, splitPoint + 1),
    z: testString.slice(splitPoint + 1),
  };
}

/**
 * Suggest a CF split for demonstration purposes
 */
export function suggestCFSplit(
  testString: string,
  pumpingLength: number
): CFSegments | null {
  if (testString.length < pumpingLength) return null;

  const len = testString.length;
  const quarterLen = Math.floor(len / 4);

  return {
    u: testString.slice(0, quarterLen),
    v: testString.slice(quarterLen, quarterLen + 1),
    w: testString.slice(quarterLen + 1, len - quarterLen - 1),
    x: testString.slice(len - quarterLen - 1, len - quarterLen),
    y: testString.slice(len - quarterLen),
  };
}
