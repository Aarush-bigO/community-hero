# Architecture

## High-Level

```
┌─────────────────────────────────┐
│         Browser (Client)        │
│  React + R3F + Three.js + Vite  │
└──────────────┬──────────────────┘
               │ HTTPS / REST
               ▼
┌─────────────────────────────────┐
│     Express API (backend/)      │
│   /api/issues  /api/users       │
│   /api/ai      /api/stats       │
└──────────────┬──────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
  ┌─────────┐     ┌──────────────┐
  │ SQLite  │     │ LLM Service  │
  │ + files │     │ (pluggable)  │
  └─────────┘     └──────────────┘
```

## Frontend
- **Vite + React 18** — fast HMR, instant cold starts.
- **Three.js + React Three Fiber + drei** — declarative 3D.
- **Framer Motion** — page & component motion.
- **Leaflet (react-leaflet)** — 2D mapping with dark tile filter.
- **Recharts** — charts on the dashboard.
- **Zustand** — small, ergonomic state.
- **Tailwind CSS** — utility-first design system.

### Scenes
- `HeroScene` — Canvas wrapper. Camera, lights, fog, post-effects.
- `Globe` — procedural icosphere + wireframe + atmosphere + issue pins (mapped lat/lng → 3D).
- `StarField` — 4k particle background, gentle rotation.

## Backend
- **Express 4** with `helmet`, `cors`, `morgan`, `express-rate-limit`.
- **better-sqlite3** for zero-config persistence (WAL mode, FK on).
- **multer** for image uploads (`/uploads`).
- **zod** for input validation on every POST.

### Routes
- `GET /api/health`
- `GET /api/issues` — list, supports `?category=`, `?status=`, geo radius
- `GET /api/issues/:id`
- `POST /api/issues` (multipart) — runs AI analysis, awards XP
- `POST /api/issues/:id/verify` — community upvote/downvote
- `PATCH /api/issues/:id/status` — admin flow, logs status_updates
- `GET /api/users` / `GET /api/users/leaderboard` / `POST /api/users`
- `GET /api/users/badges`
- `POST /api/ai/analyze` / `GET /api/ai/hotspots`
- `GET /api/stats`

### LLM Service (`services/llm.js`)
Pluggable provider switch: `LLM_PROVIDER=openai|groq|ollama|mock`.
All providers implement the same `analyzeIssue(text) → { category, severity, tags, summary, department }` contract.
Falls back to deterministic `mock` provider so the demo runs with **no API key**.

### Gamification (`services/gamification.js`)
- XP rewards: REPORT 50, VERIFY 10, RESOLVE 100, COMMENT 5
- Levels = `floor(sqrt(xp/100)) + 1`
- Badges: `first_report`, `reporter_10`, `reporter_50`, `verifier_25`, `level_5`

## Data Model

```
users
  id PK, name, email, avatar_url, xp, level, badges[json], created_at

issues
  id PK, title, description, category, severity, status,
  lat, lng, address, photo_url, reporter_id FK→users,
  ai_tags[json], ai_summary, created_at, updated_at

verifications
  id PK, issue_id FK, user_id FK, vote(±1), comment, created_at
  UNIQUE(issue_id, user_id)

status_updates
  id PK, issue_id FK, status, note, author, created_at
```

## Security
- Helmet sets safe headers
- CORS allowlist via `CORS_ORIGIN`
- Rate limit: 120 req/min per IP on `/api`
- Multer file-type & size guards
- Zod schema on every write endpoint

## Deploy
Frontend → Vercel (`vercel.json`).
Backend → Render (`render.yaml`).
Both autodeploy on push to `main`.
