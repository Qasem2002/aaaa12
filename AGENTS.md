# AGENTS.md

## Project overview

This is a **Base44** Vite + React frontend ("National Bank ahli") that talks to a
**hosted Base44 backend**. There is no local backend or database — all data/auth
calls go through the `@base44/vite-plugin` proxy (`/api/...`) to the Base44 cloud.

The repo arrived as a zip with **no `package.json`**; it was reconstructed from the
import graph. If dependency errors appear, re-derive versions from `src/` imports.

## Running locally (Base44 sandbox)

```bash
docker compose -f docker-compose.base44.yml up -d
```

- Node 22 base image, source bind-mounted at `/app`, `node_modules` in a named volume.
- Runs `npm install && npm run dev` (Vite on port 5173, mapped to host 3000).
- Live reload is active; edits appear without rebuilding the image.

## Required credentials (external)

The app needs two `VITE_` env vars to reach the hosted Base44 backend. Without them
the frontend boots but every `/api` call fails (auth, data, public settings):

- `VITE_BASE44_APP_ID` — the Base44 app ID.
- `VITE_BASE44_APP_BASE_URL` — the deployed Base44 app URL the Vite plugin proxies to.

These are delivered via `/run/base44/app.env` (platform-managed, outside the repo).
Placeholders live in `.env.base44-defaults` (listed first so real secrets override).

## Verification

- `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` returns the HTML.
- `/src/main.jsx` returns 200 (confirms live source, not a prebuilt bundle).
- Logs show `VITE ... ready` and, with credentials set, `[base44] Proxy enabled`.

## Stack notes

- React 18, React Router v6, TanStack Query v5, shadcn/ui (Radix), Tailwind v3, RTL Arabic.
- `vite.config.js` sets `server.allowedHosts: true` so the preview proxy hostname is accepted.
- `src/lib/AuthContext.jsx` calls `/api/apps/public/...` on boot; failures there are backend/credential issues, not frontend bugs.
