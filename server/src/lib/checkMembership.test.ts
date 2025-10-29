import { checkMembership } from './checkMembership'

describe('checkMembership', () => {
  test('a^n b^n returns true for equal counts', () => {
    expect(checkMembership('a^n b^n', 'aaaaabbbbb')).toBe(true)
    expect(checkMembership('a^n b^n', 'aaabbb')).toBe(true)
    expect(checkMembership('a^n b^n', 'aaaabbb')).toBe(false)
    expect(checkMembership('a^n b^n', 'ab')).toBe(true)
    expect(checkMembership('a^n b^n', 'aab')).toBe(false)
  })

  test('a^n b^n c^n returns true only when all counts equal', () => {
    expect(checkMembership('a^n b^n c^n', 'aaabbbccc')).toBe(true)
    expect(checkMembership('a^n b^n c^n', 'aabbcc')).toBe(true)
    expect(checkMembership('a^n b^n c^n', 'aaabbbcc')).toBe(false)
  })

  test('(ab)^n pattern', () => {
    expect(checkMembership('(ab)^n', 'abab')).toBe(true)
    expect(checkMembership('(ab)^n', 'ab')).toBe(true)
    expect(checkMembership('(ab)^n', 'aba')).toBe(false)
  })

  test('regex-like languages', () => {
    expect(checkMembership('/^a+b+$/', 'aaaaabbbbb')).toBe(true)
    expect(checkMembership('/^a+b+$/', 'ab')).toBe(true)
    expect(checkMembership('/^a+b+$/', 'ba')).toBe(false)
  })
})
