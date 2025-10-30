import { describe, it, expect } from 'vitest';
import {
  generateTestString,
  pumpRegularString,
  pumpCFString,
  getDefaultPumpingLength,
  suggestRegularSplit,
  suggestCFSplit,
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

describe('suggestRegularSplit', () => {
  it('returns null for strings shorter than pumping length', () => {
    const result = suggestRegularSplit('aabb', 5);
    expect(result).toBeNull();
  });

  it('returns a valid split for strings equal to pumping length', () => {
    const result = suggestRegularSplit('aaaaa', 5);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('x');
    expect(result).toHaveProperty('y');
    expect(result).toHaveProperty('z');
  });

  it('returns a valid split for strings longer than pumping length', () => {
    const result = suggestRegularSplit('aaaaaabbbbbb', 5);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('x');
    expect(result).toHaveProperty('y');
    expect(result).toHaveProperty('z');
  });

  it('splits at 1/3 of pumping length when possible', () => {
    const result = suggestRegularSplit('aaaaaabbbbbb', 6);
    expect(result).not.toBeNull();
    // Split point = floor(6/3) = 2
    expect(result?.x).toBe('aa');
    expect(result?.y).toBe('a');
    expect(result?.z).toBe('aaabbbbbb');
  });

  it('ensures y has length 1 (|y| > 0)', () => {
    const result = suggestRegularSplit('abcdefgh', 5);
    expect(result).not.toBeNull();
    expect(result?.y.length).toBe(1);
    expect(result?.y.length).toBeGreaterThan(0);
  });

  it('ensures |xy| <= pumping length', () => {
    const pumpingLength = 6;
    const result = suggestRegularSplit('aaaaaabbbbbb', pumpingLength);
    expect(result).not.toBeNull();
    const xyLength = (result?.x.length ?? 0) + (result?.y.length ?? 0);
    expect(xyLength).toBeLessThanOrEqual(pumpingLength);
  });

  it('handles small pumping lengths correctly', () => {
    const result = suggestRegularSplit('abcde', 3);
    expect(result).not.toBeNull();
    // Split point = min(floor(3/3), 5-2) = min(1, 3) = 1
    expect(result?.x).toBe('a');
    expect(result?.y).toBe('b');
    expect(result?.z).toBe('cde');
  });

  it('handles large strings correctly', () => {
    const longString = 'a'.repeat(50) + 'b'.repeat(50);
    const result = suggestRegularSplit(longString, 10);
    expect(result).not.toBeNull();
    expect(result?.x).toBeTruthy();
    expect(result?.y).toBeTruthy();
    expect(result?.z).toBeTruthy();
    // Verify concatenation equals original
    if (result) {
      expect(result.x + result.y + result.z).toBe(longString);
    }
  });
});

describe('suggestCFSplit', () => {
  it('returns null for strings shorter than pumping length', () => {
    const result = suggestCFSplit('aabb', 5);
    expect(result).toBeNull();
  });

  it('returns a valid split for strings equal to pumping length', () => {
    const result = suggestCFSplit('aaaaa', 5);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('u');
    expect(result).toHaveProperty('v');
    expect(result).toHaveProperty('w');
    expect(result).toHaveProperty('x');
    expect(result).toHaveProperty('y');
  });

  it('returns a valid split for strings longer than pumping length', () => {
    const result = suggestCFSplit('aaaaaabbbbbb', 5);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('u');
    expect(result).toHaveProperty('v');
    expect(result).toHaveProperty('w');
    expect(result).toHaveProperty('x');
    expect(result).toHaveProperty('y');
  });

  it('splits into five segments correctly', () => {
    const result = suggestCFSplit('abcdefghijkl', 5); // length 12
    expect(result).not.toBeNull();
    // quarterLen = floor(12/4) = 3
    expect(result?.u).toBe('abc');
    expect(result?.v).toBe('d');
    expect(result?.w).toBe('efgh');
    expect(result?.x).toBe('i');
    expect(result?.y).toBe('jkl');
  });

  it('ensures v and x have length 1 each (|vx| > 0)', () => {
    const result = suggestCFSplit('abcdefghijkl', 5);
    expect(result).not.toBeNull();
    expect(result?.v.length).toBe(1);
    expect(result?.x.length).toBe(1);
    const vxLength = (result?.v.length ?? 0) + (result?.x.length ?? 0);
    expect(vxLength).toBeGreaterThan(0);
  });

  it('concatenation equals original string', () => {
    const original = 'aaabbbcccddd';
    const result = suggestCFSplit(original, 5);
    expect(result).not.toBeNull();
    if (result) {
      const concatenated = result.u + result.v + result.w + result.x + result.y;
      expect(concatenated).toBe(original);
    }
  });

  it('handles small strings correctly', () => {
    const result = suggestCFSplit('abcdefgh', 5); // length 8
    expect(result).not.toBeNull();
    // quarterLen = floor(8/4) = 2
    expect(result?.u).toBe('ab');
    expect(result?.v).toBe('c');
    expect(result?.w).toBe('de');
    expect(result?.x).toBe('f');
    expect(result?.y).toBe('gh');
  });

  it('handles large strings correctly', () => {
    const longString = 'a'.repeat(25) + 'b'.repeat(25) + 'c'.repeat(25) + 'd'.repeat(25);
    const result = suggestCFSplit(longString, 10);
    expect(result).not.toBeNull();
    expect(result?.u).toBeTruthy();
    expect(result?.v).toBeTruthy();
    expect(result?.w).toBeTruthy();
    expect(result?.x).toBeTruthy();
    expect(result?.y).toBeTruthy();
    // Verify concatenation
    if (result) {
      const concatenated = result.u + result.v + result.w + result.x + result.y;
      expect(concatenated).toBe(longString);
    }
  });

  it('ensures segments are non-empty where expected', () => {
    const result = suggestCFSplit('abcdefghijklmnop', 5); // length 16
    expect(result).not.toBeNull();
    // All segments should be non-empty
    expect(result?.u.length).toBeGreaterThan(0);
    expect(result?.v.length).toBeGreaterThan(0);
    expect(result?.w.length).toBeGreaterThan(0);
    expect(result?.x.length).toBeGreaterThan(0);
    expect(result?.y.length).toBeGreaterThan(0);
  });
});
