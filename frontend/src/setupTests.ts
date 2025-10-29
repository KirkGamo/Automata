import { expect } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

// Integrate jest-dom matchers with Vitest's expect
// Type system for jest-dom matchers doesn't line up perfectly with Vitest's expect here.
// Extend Vitest's expect with jest-dom matchers for runtime assertions.
expect.extend(matchers);
