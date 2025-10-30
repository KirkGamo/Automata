/**
 * Predefined language definitions
 */

import type { LanguageDefinition } from '../types/lemma';

export const LANGUAGES: LanguageDefinition[] = [
  {
    id: 'anbn',
    name: 'L = {aⁿbⁿ | n ≥ 0}',
    description: 'Equal numbers of a\'s followed by equal numbers of b\'s',
    example: 'aabb, aaabbb, aaaabbbb',
    mode: 'regular',
  },
  {
    id: 'anbncn',
    name: 'L = {aⁿbⁿcⁿ | n ≥ 0}',
    description: 'Equal numbers of a\'s, b\'s, and c\'s in order',
    example: 'abc, aabbcc, aaabbbccc',
    mode: 'context-free',
  },
  {
    id: 'abn',
    name: 'L = {(ab)ⁿ | n ≥ 0}',
    description: 'Repetitions of "ab"',
    example: 'ab, abab, ababab',
    mode: 'regular',
  },
  {
    id: 'ww',
    name: 'L = {ww | w ∈ {a,b}*}',
    description: 'A string followed by itself',
    example: 'aa, abab, aabbaa bb',
    mode: 'context-free',
  },
];

export function getLanguageById(id: string): LanguageDefinition | undefined {
  return LANGUAGES.find((lang) => lang.id === id);
}
