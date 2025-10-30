import { describe, it, expect } from 'vitest';
import { checkMembership, validateRegularSegments, validateCFSegments } from './membership';

describe('checkMembership', () => {
  describe('anbn language', () => {
    it('should accept empty string', () => {
      expect(checkMembership('', 'anbn')).toBe(true);
    });

    it('should accept equal numbers of a and b', () => {
      expect(checkMembership('ab', 'anbn')).toBe(true);
      expect(checkMembership('aabb', 'anbn')).toBe(true);
      expect(checkMembership('aaabbb', 'anbn')).toBe(true);
      expect(checkMembership('aaaabbbb', 'anbn')).toBe(true);
    });

    it('should reject unequal numbers', () => {
      expect(checkMembership('aab', 'anbn')).toBe(false);
      expect(checkMembership('abb', 'anbn')).toBe(false);
      expect(checkMembership('aaabb', 'anbn')).toBe(false);
    });

    it('should reject strings with wrong order', () => {
      expect(checkMembership('ba', 'anbn')).toBe(false);
      expect(checkMembership('abab', 'anbn')).toBe(false);
      expect(checkMembership('aabba', 'anbn')).toBe(false);
    });

    it('should reject strings with other characters', () => {
      expect(checkMembership('aacbb', 'anbn')).toBe(false);
      expect(checkMembership('a1b', 'anbn')).toBe(false);
    });
  });

  describe('anbncn language', () => {
    it('should accept empty string', () => {
      expect(checkMembership('', 'anbncn')).toBe(true);
    });

    it('should accept equal numbers of a, b, and c', () => {
      expect(checkMembership('abc', 'anbncn')).toBe(true);
      expect(checkMembership('aabbcc', 'anbncn')).toBe(true);
      expect(checkMembership('aaabbbccc', 'anbncn')).toBe(true);
    });

    it('should reject unequal numbers', () => {
      expect(checkMembership('aabbc', 'anbncn')).toBe(false);
      expect(checkMembership('abbcc', 'anbncn')).toBe(false);
      expect(checkMembership('aabbccc', 'anbncn')).toBe(false);
    });

    it('should reject strings with wrong order', () => {
      expect(checkMembership('abcabc', 'anbncn')).toBe(false);
      expect(checkMembership('acb', 'anbncn')).toBe(false);
    });
  });

  describe('abn language', () => {
    it('should accept empty string', () => {
      expect(checkMembership('', 'abn')).toBe(true);
    });

    it('should accept repetitions of ab', () => {
      expect(checkMembership('ab', 'abn')).toBe(true);
      expect(checkMembership('abab', 'abn')).toBe(true);
      expect(checkMembership('ababab', 'abn')).toBe(true);
    });

    it('should reject incomplete pairs', () => {
      expect(checkMembership('a', 'abn')).toBe(false);
      expect(checkMembership('b', 'abn')).toBe(false);
      expect(checkMembership('aba', 'abn')).toBe(false);
      expect(checkMembership('abb', 'abn')).toBe(false);
    });

    it('should reject wrong patterns', () => {
      expect(checkMembership('aabb', 'abn')).toBe(false);
      expect(checkMembership('ba', 'abn')).toBe(false);
    });
  });

  describe('ww language', () => {
    it('should accept string followed by itself', () => {
      expect(checkMembership('aa', 'ww')).toBe(true);
      expect(checkMembership('bb', 'ww')).toBe(true);
      expect(checkMembership('abab', 'ww')).toBe(true);
      expect(checkMembership('aabbccaabbcc', 'ww')).toBe(true);
    });

    it('should reject odd length strings', () => {
      expect(checkMembership('a', 'ww')).toBe(false);
      expect(checkMembership('abc', 'ww')).toBe(false);
      expect(checkMembership('abcde', 'ww')).toBe(false);
    });

    it('should reject non-matching halves', () => {
      expect(checkMembership('ab', 'ww')).toBe(false);
      expect(checkMembership('abba', 'ww')).toBe(false);
      expect(checkMembership('abcd', 'ww')).toBe(false);
    });
  });

  describe('custom language', () => {
    it('should always return false', () => {
      expect(checkMembership('', 'custom')).toBe(false);
      expect(checkMembership('abc', 'custom')).toBe(false);
    });
  });
});

describe('validateRegularSegments', () => {
  it('should accept valid segments', () => {
    const result = validateRegularSegments('aa', 'a', 'bbb', 5);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject empty y segment', () => {
    const result = validateRegularSegments('aaa', '', 'bbb', 5);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('|y| must be greater than 0');
  });

  it('should reject |xy| > p', () => {
    const result = validateRegularSegments('aaa', 'aaa', 'bbb', 5);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('|xy| must be ≤ pumping length (5)');
  });

  it('should reject both empty y and |xy| > p', () => {
    const result = validateRegularSegments('aaaaaa', '', 'bbb', 5);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should accept segments at boundary (|xy| = p)', () => {
    const result = validateRegularSegments('aaaa', 'a', 'bbb', 5);
    expect(result.isValid).toBe(true);
  });
});

describe('validateCFSegments', () => {
  it('should accept valid segments', () => {
    const result = validateCFSegments('aa', 'a', 'bb', 'b', 'cc', 5);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject when both v and x are empty', () => {
    const result = validateCFSegments('aa', '', 'bb', '', 'cc', 5);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('|vx| must be greater than 0 (at least one of v or x must be non-empty)');
  });

  it('should accept when only v is non-empty', () => {
    const result = validateCFSegments('aa', 'a', 'bb', '', 'cc', 5);
    expect(result.isValid).toBe(true);
  });

  it('should accept when only x is non-empty', () => {
    const result = validateCFSegments('aa', '', 'bb', 'b', 'cc', 5);
    expect(result.isValid).toBe(true);
  });

  it('should reject |vwx| > p', () => {
    const result = validateCFSegments('aa', 'aaa', 'bbb', 'ccc', 'dd', 5);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('|vwx| must be ≤ pumping length (5)');
  });

  it('should accept segments at boundary (|vwx| = p)', () => {
    const result = validateCFSegments('aa', 'a', 'bb', 'b', 'cc', 5);
    expect(result.isValid).toBe(true);
  });
});
