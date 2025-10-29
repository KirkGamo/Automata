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

The frontend will try to call `/api/check` on the same host; during local development you can proxy requests from Vite to the server or run the server on a separate terminal.
