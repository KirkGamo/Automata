## Copilot / AI Agent instructions for the Pumping Lemma Visualizer

Purpose: give an AI coding assistant the minimal, high-value context to be immediately productive in this repository.

What this project is (big picture)
- An educational, frontend-heavy web application that visualizes the Pumping Lemma for regular and context-free languages. (See `[PLV] Project Documentation.txt` and `[PVL] Software Requirements Specifications.txt` for scope and examples.)
- Key responsibilities:
  - Accept a language (RE / CFG / built-in examples)
  - Generate test strings s (|s| ≥ p), allow the user to split into x/y/z or u/v/w/x/y, pump, and check membership
  - Render animations (color-coded segments) and provide textual explanations of the lemma conditions

Architecture & important components (where to look)
- Frontend-first: UI, visualization and interaction are in the client (the docs name React or Vue.js + D3.js as the intended stack). Look for frontend code under `src/`, `frontend/`, `components/` or `visualization/` if those folders exist.
- Analysis engine: string generation, split/validation, and membership checks can be either client-side or in an optional backend. If a backend exists, expect files named like `app.py`, `server.py`, `server.js`, or a `backend/` folder. The docs mention Python Flask or Node.js as likely options.
- Data stores & exports: session storage / export features (PDF) are optional — check `data/`, `storage/`, or any `db/` or migration files.

Developer workflows (React + Node with TypeScript - concrete)
- Project layout we recommend and will assume for most tasks:
  - `frontend/` — React + Vite + TypeScript app (entry: `frontend/src/main.tsx`, `frontend/src/App.tsx`).
  - `server/` — Node + Express (or Fastify) + TypeScript API (entry: `server/src/index.ts`).
  - Root `package.json` can contain workspace scripts if you use npm/yarn workspaces.

- Setup (one-time):
  - From repo root (when packages present):
    - Install dependencies for root/workspaces: `npm install`
    - Or install per-package: `cd frontend; npm install` and `cd ../server; npm install`

- Frontend (dev / build / preview):
  - Dev (fast HMR): `cd frontend; npm run dev` (Vite)
  - Build: `cd frontend; npm run build`
  - Preview production build: `cd frontend; npm run preview`
  - Key files to inspect: `frontend/package.json`, `frontend/tsconfig.json`, `frontend/vite.config.ts`, `frontend/src/*`.

- Backend (dev / start):
  - Dev (auto-reload): `cd server; npm run dev` (recommended: `ts-node-dev` or `nodemon` + `tsc`)
  - Build & run: `cd server; npm run build` then `npm start` (or `node dist/index.js`)
  - Key files to inspect: `server/package.json`, `server/tsconfig.json`, `server/src/index.ts`, `server/src/routes/*`.

- Type safety & testing:
  - Use TypeScript across both packages; expect `tsconfig.json` in each package.
  - Frontend tests: `npm run test` (Vitest / Jest) in `frontend/`.
  - Backend tests: `npm run test` (Jest / Mocha) in `server/`.

Note: I updated these instructions to use React + TypeScript (Vite) for the client and Node + TypeScript for the server per your choice. If your repo uses a different layout, I can adapt the commands to match.

Project-specific conventions & patterns (from docs)
- Two lemma modes: Regular and Context-Free — code should keep these modes explicit (e.g., `mode: 'regular'|'context-free'`).
- Visualization uses color-coded substrings: x, y, z (regular) and u, v, w, x, y (context-free). Look for constants or CSS classes named `x-seg`, `y-seg`, `z-seg` or similar.
- Membership checks: small deterministic validators are expected for built-in languages like `a^n b^n`, `a^n b^n c^n`, `(ab)^n`. Search for functions named `isInLanguage`, `validate`, `checkMembership`, or `matchesLanguage`.

Integration points & data flow (how pieces talk)
- User → Parser (RE/CFG) → Analysis Engine → Visualization Renderer → UI
- Optional: UI ↔ Backend for heavy membership checks or saving sessions → DB
- Sanitize and validate all user language inputs before parsing to prevent code injection (the SRS explicitly lists this as a requirement).

Concrete examples to reference in PRs or edits
- Sample scenario in the docs: L={a^n b^n}, s=a^5b^5, split x=aa, y=a, z=abbb, pump i=2 → a^6b^5 (invalid). Use this example for unit tests and UI fixtures.
- Lemma conditions to display/test: `|y|>0` and `|xy| ≤ p` for regular pumping — tests should assert these conditions are enforced and shown in the UI.

How to be helpful as an AI assistant (do these first)
1. Run a quick repo scan for `package.json`, `requirements.txt`, `src/`, `frontend/`, `backend/`, `app.py`, `server.js` and list detected scripts and entry points.
2. If no code yet (docs-only), scaffold minimal developer experience: add README dev sections, create example `frontend/` or `backend/` stubs guarded by a feature branch, and include example fixtures (use the sample scenario above).
3. When changing UI/visualization, supply: the UI snapshot (before), the code change, and a short test (example string + expected pumped output). Prefer small, incremental PRs.

Assumptions & verification steps (call these out before executing commands)
- The repository follows common JS/Python layout (frontend in `src/` with `package.json`, backend with `requirements.txt` or `package.json`). If these files are missing, ask maintainers before adding a full scaffold.

Where to ask for clarification
- If you need to pick the stack (React vs Vue, Flask vs Node) confirm with maintainers — the docs list multiple options.
- Confirm whether membership checks should run client-side for responsiveness or server-side for security/complex grammars.

Files I consulted to create these notes:
- `[PLV] Project Documentation.txt`
- `[PVL] Software Requirements Specifications.txt`

Please review these instructions and tell me if you'd like me to: (A) scan the repo for actual package/script files and update the commands in this file, (B) scaffold a minimal frontend stub using React + Vite and a sample visualization component for `a^n b^n`, or (C) draft unit tests for the sample scenario.
