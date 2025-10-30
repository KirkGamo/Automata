# Copilot Instructions: Pumping Lemma Visualizer

## Project Overview

An **educational web application** that visualizes the Pumping Lemma for both regular and context-free languages. The system helps computer science students understand this abstract theoretical concept through interactive visual demonstrations.

**Key Value Proposition:** Transform symbolic proofs into concrete, interactive experiences by letting users experiment with string decomposition, pumping, and membership checking.

---

## Core Functionality

### What the System Does
1. **Language Input**: Users select preset languages (e.g., {aⁿbⁿ}, {aⁿbⁿcⁿ}, {(ab)ⁿ}) or input custom regular expressions
2. **String Generation**: Automatically generates test strings where |s| ≥ pumping length p
3. **Interactive Decomposition**: Users split strings into:
   - **Regular mode**: x, y, z (where |y| > 0, |xy| ≤ p)
   - **Context-Free mode**: u, v, w, x, y (where |vwx| ≤ p, |vx| > 0)
4. **Pumping Simulation**: Users select iteration count i (0, 1, 2, 3...) and see the pumped result
5. **Membership Validation**: System checks if pumped string still belongs to the language
6. **Visual Feedback**: Color-coded segments, animations, and step-by-step explanations

### Sample Scenario (from docs)
```
Language: L = {aⁿbⁿ | n ≥ 1}
Mode: Regular Pumping Lemma
String: s = a⁵b⁵ (length 10, p = 5)
Split: x = "aa", y = "a", z = "abbb"
Pump: i = 2 → "aa" + "aa" + "abbb" = "aaaabbb" (a⁴b³)
Result: ❌ Invalid (violates aⁿbⁿ pattern) → Proves L is not regular
```

---

## Tech Stack & Architecture

### Frontend-Heavy Design
**Primary Stack:** React + TypeScript + Vite + D3.js
- `frontend/` — Main application
  - Entry: `frontend/src/main.tsx` → `App.tsx`
  - Visualization: D3.js for animations
  - State: React Context or Zustand for lemma mode, splits, pump count
  - Styling: CSS modules or Tailwind

### Backend (Optional)
**Stack:** Node.js + Express + TypeScript
- `server/` — API for complex tasks
  - Entry: `server/src/index.ts`
  - Routes: `/api/check-membership`, `/api/parse-language`
  - Use cases: Custom regex parsing, session storage, PDF export

### Key Design Decisions
- **Client-first validation**: Built-in languages ({aⁿbⁿ}, {(ab)ⁿ}) validated in frontend for speed
- **Backend for extensions**: Custom user-defined languages may require server-side parsing
- **No database required initially**: LocalStorage for session persistence (MongoDB optional for analytics)

---

## Project Structure & Conventions

### Directory Layout
```
frontend/
  src/
    components/
      LanguageSelector.tsx      # Preset languages dropdown
      StringDisplay.tsx          # Shows s with color-coded x/y/z segments
      DecompositionControl.tsx   # Drag/click interface for splits
      PumpingControl.tsx         # Slider/input for i value
      ResultPanel.tsx            # Shows validation + explanation
      VisualizationCanvas.tsx    # D3.js animation container
    lib/
      membership.ts              # Validators: isInLanguage(s, lang)
      generators.ts              # generateString(lang, p)
      pumpingLogic.ts            # applyPumping(x, y, z, i)
    types/
      lemma.ts                   # Type definitions
    App.tsx                      # Main routing + state
    main.tsx                     # Vite entry

server/ (optional)
  src/
    routes/
      membership.ts              # POST /api/check-membership
    lib/
      parser.ts                  # Parse custom regex/CFG
    index.ts                     # Express server
```

### Naming Conventions
- **Lemma modes**: Use literal types `'regular' | 'context-free'`
- **Segments**: 
  - Regular: `x`, `y`, `z` (variables and CSS classes)
  - Context-Free: `u`, `v`, `w`, `x`, `y`
- **Color coding**: 
  - x/u: blue (`#3b82f6`)
  - y/v: red (`#ef4444`) — the pumped segment
  - z/w: green (`#10b981`)
- **Functions**:
  - Membership: `checkMembership(s: string, lang: Language): boolean`
  - Generation: `generateTestString(lang: Language, pumpingLength: number): string`
  - Pumping: `pumpString(segments: Segments, i: number): string`

---

## Critical Requirements (from SRS)

### Functional
1. **Performance**: Render visual proofs in < 5 seconds
2. **Language Support**: Minimum set:
   - {aⁿbⁿ | n ≥ 0}
   - {aⁿbⁿcⁿ | n ≥ 0}
   - {(ab)ⁿ | n ≥ 0}
   - {ww | w ∈ {a,b}*} (context-free)
3. **Lemma Conditions**: Display and validate:
   - Regular: |y| > 0, |xy| ≤ p, for all i ≥ 0: xyⁱz ∈ L
   - CF: |vx| > 0, |vwx| ≤ p, for all i ≥ 0: uvⁱwxⁱy ∈ L

### Non-Functional
1. **Security**: Sanitize all language inputs to prevent code injection
2. **Reliability**: Handle invalid splits gracefully (show warnings, not crashes)
3. **Maintainability**: Modular architecture for easy addition of new languages
4. **Portability**: Works on Chrome, Firefox, Edge (latest 2 versions)

---

## Developer Workflows

### Initial Setup
```powershell
# Clone and install
git clone <repo-url>
cd Automata

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies (if needed)
cd ../server
npm install
```

### Development
```powershell
# Frontend dev server (http://localhost:5173)
cd frontend
npm run dev

# Backend dev server (http://localhost:3000)
cd server
npm run dev

# Run tests
cd frontend
npm test              # Vitest unit tests
npm run test:e2e      # Playwright E2E tests

cd ../server
npm test              # Jest tests
```

### Build & Deploy
```powershell
# Frontend production build
cd frontend
npm run build         # Output: dist/
npm run preview       # Preview production build

# Backend build
cd server
npm run build         # Output: dist/
npm start             # Run production server
```

---

## Key Implementation Patterns

### State Management Example
```typescript
// types/lemma.ts
export type LemmaMode = 'regular' | 'context-free';
export type Language = 'anbn' | 'anbncn' | 'abn' | 'custom';

export interface PumpingState {
  mode: LemmaMode;
  language: Language;
  testString: string;
  pumpingLength: number;
  segments: RegularSegments | CFSegments;
  pumpCount: number;
}

export interface RegularSegments {
  x: string;
  y: string;
  z: string;
}
```

### Membership Check Pattern
```typescript
// lib/membership.ts
export function checkMembership(s: string, lang: Language): boolean {
  switch (lang) {
    case 'anbn': {
      const match = s.match(/^(a+)(b+)$/);
      if (!match) return false;
      return match[1].length === match[2].length;
    }
    case 'anbncn': {
      const match = s.match(/^(a+)(b+)(c+)$/);
      if (!match) return false;
      const [_, as, bs, cs] = match;
      return as.length === bs.length && bs.length === cs.length;
    }
    // ... more languages
  }
}
```

### Visualization Pattern (D3.js)
```typescript
// components/VisualizationCanvas.tsx
import * as d3 from 'd3';

function animatePumping(segments: RegularSegments, i: number) {
  const svg = d3.select('#viz-canvas');
  
  // Show original string
  svg.selectAll('.segment')
    .data([segments.x, segments.y, segments.z])
    .enter()
    .append('text')
    .attr('class', (d, i) => `segment segment-${['x', 'y', 'z'][i]}`)
    .style('fill', (d, i) => ['#3b82f6', '#ef4444', '#10b981'][i]);
  
  // Animate pumping y segment i times
  // ... animation logic
}
```

---

## Testing Strategy

### Unit Tests (Vitest)
```typescript
// lib/membership.test.ts
import { checkMembership } from './membership';

describe('checkMembership', () => {
  it('validates anbn correctly', () => {
    expect(checkMembership('aabb', 'anbn')).toBe(true);
    expect(checkMembership('aaabbb', 'anbn')).toBe(true);
    expect(checkMembership('aabbb', 'anbn')).toBe(false);
  });
});
```

### E2E Tests (Playwright)
```typescript
// e2e/pumping-lemma.spec.ts
test('pumping anbn with i=2 fails lemma', async ({ page }) => {
  await page.goto('/');
  await page.selectOption('[data-testid="language-select"]', 'anbn');
  await page.click('[data-testid="generate-string"]');
  
  // Set splits: x='aa', y='a', z='abbb'
  await page.fill('[data-testid="x-input"]', 'aa');
  await page.fill('[data-testid="y-input"]', 'a');
  await page.fill('[data-testid="z-input"]', 'abbb');
  
  // Pump with i=2
  await page.fill('[data-testid="pump-count"]', '2');
  await page.click('[data-testid="pump-button"]');
  
  // Assert result
  await expect(page.locator('[data-testid="result"]')).toContainText('Invalid');
});
```

---

## Common Tasks for AI Assistants

### When User Asks to Add a New Language
1. **Add language identifier** to `types/lemma.ts`:
   ```typescript
   export type Language = 'anbn' | 'anbncn' | 'abn' | 'ww' | 'NEW_LANG';
   ```

2. **Implement membership check** in `lib/membership.ts`:
   ```typescript
   case 'NEW_LANG': {
     // Add validation logic
   }
   ```

3. **Add string generator** in `lib/generators.ts`:
   ```typescript
   case 'NEW_LANG': {
     // Generate valid string with length ≥ p
   }
   ```

4. **Update UI selector** in `LanguageSelector.tsx`:
   ```tsx
   <option value="NEW_LANG">Description</option>
   ```

5. **Add test cases** in `lib/membership.test.ts`

### When User Reports a Bug
1. Check validation logic in `lib/membership.ts`
2. Verify segment constraints (|y| > 0, |xy| ≤ p)
3. Review state updates in components
4. Test with the canonical example: {aⁿbⁿ}, s="aaaaabbbbb", x="aa", y="a", z="aabbbbb"

### When Scaffolding from Scratch
1. Use `npm create vite@latest frontend -- --template react-ts`
2. Install deps: `npm install d3 @types/d3 zustand`
3. Create directory structure as shown above
4. Implement membership validators first (easiest to test)
5. Build StringDisplay component with static data
6. Add interactivity (decomposition controls)
7. Integrate D3.js animations last

---

## Reference Documentation

- **Full specs**: See `[PLV] Project Documentation.txt` and `[PVL] Software Requirements Specifications.txt`
- **Pumping Lemma (Regular)**: For language L, if regular, ∃p: ∀s ∈ L where |s| ≥ p, ∃x,y,z: s=xyz ∧ |y|>0 ∧ |xy|≤p ∧ ∀i≥0: xyⁱz ∈ L
- **Pumping Lemma (CF)**: For language L, if CF, ∃p: ∀s ∈ L where |s| ≥ p, ∃u,v,w,x,y: s=uvwxy ∧ |vx|>0 ∧ |vwx|≤p ∧ ∀i≥0: uvⁱwxⁱy ∈ L

---

## Validation Checklist Before PR

- [ ] All lemma conditions enforced in code (|y| > 0, etc.)
- [ ] Membership checks return correct boolean for built-in languages
- [ ] UI shows color-coded segments clearly
- [ ] Explanation panel displays which conditions are violated
- [ ] No crashes on invalid splits (graceful error messages)
- [ ] Input sanitization in place for custom languages
- [ ] Tests pass: `npm test` in both frontend and server
- [ ] Build succeeds: `npm run build`
- [ ] Performance: < 5s for visualization render

---

## Questions to Ask Before Implementing

1. **Which lemma mode**: Regular or Context-Free? (Changes segment count and conditions)
2. **Language location**: Built-in preset or user-defined? (Affects validation strategy)
3. **Visualization detail**: Static display or animated transitions? (D3.js complexity)
4. **Backend needed**: For this feature, can it run client-side? (Most can for built-ins)

---

**Last Updated**: October 2025  
**Source Files**: `[PLV] Project Documentation.txt`, `[PVL] Software Requirements Specifications.txt`
