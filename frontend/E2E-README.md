# Running Playwright E2E tests (local)

This file explains how to run the Playwright end-to-end tests locally on Windows (PowerShell). The project uses a Vite dev server for the frontend and an Express backend on port 4000.

Quick summary
- Start the backend and frontend dev servers in separate terminals.
- Install Playwright browsers (once): `npx playwright install --with-deps`.
- Run the E2E tests: `npm run e2e` (in `frontend`).

Detailed steps

1) Install dependencies (if not already installed)

```powershell
cd frontend
npm install
```

2) Install Playwright browsers (only once per machine or after lockfile changes)

```powershell
npx playwright install --with-deps
```

3) Start servers (two terminals)

# Terminal A — start backend (from repo root)
```powershell
cd server
npm run dev    # or `node dist/index.js` if you built the server
# server should listen on http://localhost:4000
```

# Terminal B — start frontend dev server
```powershell
cd frontend
npm run dev
# frontend available at http://localhost:5173
```

4) Run E2E tests

In a third terminal (or after the servers are up):

```powershell
cd frontend
npm run e2e
```

Notes & alternatives
- If you prefer a single command that starts the frontend and runs tests when the page is ready, you can use `start-server-and-test` or `concurrently` via `npx`. Example (requires installing `start-server-and-test`):

```powershell
npx start-server-and-test 'npm:dev' http://localhost:5173 'npx playwright test'
```

- In CI the workflow already installs Playwright browsers and runs `npx playwright test`.

- If you run into permission or environment issues on Windows, run PowerShell as Administrator or try `npx playwright install` without `--with-deps`.

If you'd like, I can add a `frontend` npm script that runs `start-server-and-test` for you and add the required devDependency.
