/**
 * Membership validation functions for built-in languages
 */

import type { Language } from '../types/lemma';

/**
 * Check if a string belongs to the specified language
 */
export function checkMembership(s: string, lang: Language): boolean {
  switch (lang) {
    case 'anbn': {
      // L = {aⁿbⁿ | n ≥ 0}
      if (s === '') return true; // ε is valid
      const match = s.match(/^(a+)(b+)$/);
      if (!match) return false;
      return match[1].length === match[2].length;
    }

    case 'anbncn': {
      // L = {aⁿbⁿcⁿ | n ≥ 0}
      if (s === '') return true; // ε is valid
      const match = s.match(/^(a+)(b+)(c+)$/);
      if (!match) return false;
      const [, as, bs, cs] = match;
      return as.length === bs.length && bs.length === cs.length;
    }

    case 'abn': {
      // L = {(ab)ⁿ | n ≥ 0}
      if (s === '') return true; // ε is valid
      return /^(ab)+$/.test(s);
    }

    case 'ww': {
      // L = {ww | w ∈ {a,b}*}
      if (s.length % 2 !== 0) return false;
      const mid = s.length / 2;
      return s.slice(0, mid) === s.slice(mid);
    }

    case 'custom':
      // Custom language validation should be handled separately
      return false;

    default:
      return false;
  }
}

/**
 * Validate if segments satisfy pumping lemma conditions for regular languages
 */
export function validateRegularSegments(
  x: string,
  y: string,
  z: string,
  pumpingLength: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Condition 1: |y| > 0
  if (y.length === 0) {
    errors.push('|y| must be greater than 0');
  }

  // Condition 2: |xy| ≤ p
  if ((x + y).length > pumpingLength) {
    errors.push(`|xy| must be ≤ pumping length (${pumpingLength})`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate if segments satisfy pumping lemma conditions for context-free languages
 */
export function validateCFSegments(
  u: string,
  v: string,
  w: string,
  x: string,
  y: string,
  pumpingLength: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Condition 1: |vx| > 0
  if (v.length === 0 && x.length === 0) {
    errors.push('|vx| must be greater than 0 (at least one of v or x must be non-empty)');
  }

  // Condition 2: |vwx| ≤ p
  if ((v + w + x).length > pumpingLength) {
    errors.push(`|vwx| must be ≤ pumping length (${pumpingLength})`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
