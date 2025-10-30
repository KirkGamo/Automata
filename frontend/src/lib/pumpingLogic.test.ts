import { describe, it, expect } from 'vitest';
import {
  generateTestString,
  pumpRegularString,
  pumpCFString,
  getDefaultPumpingLength,
} from './pumpingLogic';
import type { RegularSegments, CFSegments } from '../types/lemma';

describe('generateTestString', () => {
  it('should generate valid anbn strings', () => {
    const result = generateTestString('anbn', 5);
    expect(result.length).toBeGreaterThanOrEqual(5);
    expect(result).toMatch(/^a+b+$/);
    // Check equal numbers
    const aCount = (result.match(/a/g) || []).length;
    const bCount = (result.match(/b/g) || []).length;
    expect(aCount).toBe(bCount);
  });

  it('should generate valid anbncn strings', () => {
    const result = generateTestString('anbncn', 6);
    expect(result.length).toBeGreaterThanOrEqual(6);
    expect(result).toMatch(/^a+b+c+$/);
    // Check equal numbers
    const aCount = (result.match(/a/g) || []).length;
    const bCount = (result.match(/b/g) || []).length;
    const cCount = (result.match(/c/g) || []).length;
    expect(aCount).toBe(bCount);
    expect(bCount).toBe(cCount);
  });

  it('should generate valid abn strings', () => {
    const result = generateTestString('abn', 5);
    expect(result.length).toBeGreaterThanOrEqual(5);
    expect(result).toMatch(/^(ab)+$/);
  });

  it('should generate valid ww strings', () => {
    const result = generateTestString('ww', 6);
    expect(result.length).toBeGreaterThanOrEqual(6);
    expect(result.length % 2).toBe(0);
    // Check that first half equals second half
    const mid = result.length / 2;
    expect(result.slice(0, mid)).toBe(result.slice(mid));
  });

  it('should return empty string for custom language', () => {
    const result = generateTestString('custom', 5);
    expect(result).toBe('');
  });
});

describe('pumpRegularString', () => {
  const segments: RegularSegments = {
    x: 'aa',
    y: 'a',
    z: 'bbb',
  };

  it('should return xyz when i = 1', () => {
    const result = pumpRegularString(segments, 1);
    expect(result).toBe('aaabbb');
  });

  it('should return xz when i = 0 (pump out y)', () => {
    const result = pumpRegularString(segments, 0);
    expect(result).toBe('aabbb');
  });

  it('should pump y correctly when i = 2', () => {
    const result = pumpRegularString(segments, 2);
    expect(result).toBe('aaaabbb');
  });

  it('should pump y correctly when i = 3', () => {
    const result = pumpRegularString(segments, 3);
    expect(result).toBe('aaaaabbb');
  });

  it('should handle empty x segment', () => {
    const segs: RegularSegments = { x: '', y: 'a', z: 'bbb' };
    expect(pumpRegularString(segs, 2)).toBe('aabbb');
  });

  it('should handle empty z segment', () => {
    const segs: RegularSegments = { x: 'aa', y: 'a', z: '' };
    expect(pumpRegularString(segs, 2)).toBe('aaaa');
  });
});

describe('pumpCFString', () => {
  const segments: CFSegments = {
    u: 'a',
    v: 'a',
    w: 'b',
    x: 'b',
    y: 'c',
  };

  it('should return uvwxy when i = 1', () => {
    const result = pumpCFString(segments, 1);
    expect(result).toBe('aabbc');
  });

  it('should return uwy when i = 0 (pump out v and x)', () => {
    const result = pumpCFString(segments, 0);
    expect(result).toBe('abc');
  });

  it('should pump v and x correctly when i = 2', () => {
    const result = pumpCFString(segments, 2);
    expect(result).toBe('aaabbbc');
  });

  it('should pump v and x correctly when i = 3', () => {
    const result = pumpCFString(segments, 3);
    expect(result).toBe('aaaabbbbc');
  });

  it('should handle empty v segment', () => {
    const segs: CFSegments = { u: 'a', v: '', w: 'b', x: 'b', y: 'c' };
    expect(pumpCFString(segs, 2)).toBe('abbbc');
  });

  it('should handle empty x segment', () => {
    const segs: CFSegments = { u: 'a', v: 'a', w: 'b', x: '', y: 'c' };
    expect(pumpCFString(segs, 2)).toBe('aaabc');
  });

  it('should handle both v and x being pumped', () => {
    const segs: CFSegments = { u: 'aa', v: 'bb', w: 'cc', x: 'dd', y: 'ee' };
    expect(pumpCFString(segs, 2)).toBe('aabbbbccddddee');
  });
});

describe('getDefaultPumpingLength', () => {
  it('should return correct pumping length for anbn', () => {
    expect(getDefaultPumpingLength('anbn')).toBe(5);
  });

  it('should return correct pumping length for anbncn', () => {
    expect(getDefaultPumpingLength('anbncn')).toBe(5);
  });

  it('should return correct pumping length for abn', () => {
    expect(getDefaultPumpingLength('abn')).toBe(4);
  });

  it('should return correct pumping length for ww', () => {
    expect(getDefaultPumpingLength('ww')).toBe(5);
  });

  it('should return default for custom', () => {
    expect(getDefaultPumpingLength('custom')).toBe(5);
  });
});
