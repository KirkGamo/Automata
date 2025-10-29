# Pumping Lemma Visualizer — scaffold

This repository currently contains project documentation and a minimal scaffold for a React + Vite + TypeScript frontend and a Node + Express + TypeScript backend.

Quick start (npm):

1. Install dependencies for both packages from the repo root:

```powershell
cd frontend; npm install
cd ..\server; npm install
```

2. Run frontend dev server:

```powershell
cd frontend; npm run dev
```

3. Run backend dev server:

```powershell
cd server; npm run dev
```

The frontend will call `/api/check` for membership checks. During local development the Vite dev server is already configured to proxy `/api/*` to the backend (http://localhost:4000), so you can simply run both servers and call `/api` without CORS.

Development proxy
-----------------

- Backend default: `http://localhost:4000` (see `server/src/index.ts`)
- Frontend dev server: `http://localhost:5173` (Vite)
- Vite dev proxy is configured in `frontend/vite.config.ts` to forward `/api` to the backend. Example call from the app:

```ts
fetch('/api/check', { method: 'POST', body: JSON.stringify({ language, string }), headers: { 'Content-Type': 'application/json' } })
```

Run both servers in separate terminals (PowerShell):

```powershell
cd server
npm run dev

cd ..\frontend
npm run dev
```

If you prefer to run the backend on a different port, update `frontend/vite.config.ts` proxy target accordingly.

Frontend lint & tests
---------------------

To run the frontend unit tests and lint locally (after installing deps):

```powershell
cd frontend
npm install
npm run test    # runs Vitest in watch mode
npm run test:ci # run tests once (CI style)
npm run lint    # runs ESLint over `src/`
```

