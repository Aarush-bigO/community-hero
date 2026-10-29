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

## Bolna Voice AI & Emergency Command Architecture (v2.0)

Built for the **Bolna Symphony Buildathon**, synthesizing blueprints from Dispatch AI, Aegis, OperatorAI, and BravoDispatch:

```
                                    ┌───────────────────────┐
                                    │ Citizen Voice Call    │
                                    │ (Hindi/English/Hing)  │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ Bolna Voice Engine    │
                                    │ (Sarvam AI STT + TTS) │
                                    └───────────┬───────────┘
                                                │
               Function Calling / Webhook       │ POST /api/bolna-webhook
         ┌──────────────────────────────────────┴──────────────────────────────────────┐
         ▼                                                                             ▼
┌─────────────────────────────────┐                                           ┌─────────────────────────────────┐
│ Swarm-Surge Deduplication       │                                           │ Open311 CAD Ticket Generator    │
│ Spatial Haversine (<500m)       │                                           │ Sub-second Work Order #311-XXXX │
│ Auto-escalate Severity=5, Urg=10│                                           │ Multi-authority Routing         │
└────────────────┬────────────────┘                                           └────────────────┬────────────────┘
                 │                                                                             │
                 ▼                                                                             ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Server-Sent Events (SSE) Bus (/api/stream, /api/events)                                                        │
│ -> NEW_VOICE_DISPATCH -> INCIDENT_CLUSTER_SURGE -> VOICE_TRANSCRIPT_CHUNK -> UNIT_DISPATCH_CONFIRMED          │
└────────────────┬─────────────────────────────────────────────────────────────────────────────┬─────────────────┘
                 │                                                                             │
                 ▼                                                                             ▼
┌─────────────────────────────────┐                                           ┌─────────────────────────────────┐
│ Three.js 3D Earth Cockpit       │                                           │ Closed-Loop Outbound Dispatch   │
│ - Pulsing Emergency Beacons     │                                           │ - POST https://api.bolna.dev/call│
│ - Expanding Shockwave Rings     │                                           │ - Ringing Field Unit (+91 98100)│
│ - Satellite Camera Flight Interpolation                                     │ - POST /api/bolna-dispatch-confirm
└─────────────────────────────────┘                                           └─────────────────────────────────┘
```

### Key Endpoints
- `POST /api/bolna-webhook`: Inbound citizen triage & function call normalizer (`create_open311_ticket`).
- `POST /api/bolna-dispatch-confirm`: Outbound officer verbal confirmation callback.
- `POST /api/simulate-voice-call`: 1-Click high-fidelity multi-scenario simulator with live SSE chunk streaming.
- `GET /api/voice-dispatches`: Active emergency CAD ticket feed.
- `POST /api/voice-dispatch/:id/vision`: Multimodal vision-verification attachment hook.


