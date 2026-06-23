# 🌍 Community Hero — Hyperlocal Problem Solver

> A jaw-dropping, AI-powered, **3D** civic-tech platform that lets citizens report, verify, track, and resolve local issues — together.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-20+-43853d.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-000000.svg)](https://threejs.org/)

---

## ✨ The Vision

Potholes. Broken streetlights. Water leaks. Overflowing dumpsters. They don't fix themselves — and the systems we have for reporting them are **fragmented, opaque, and frustrating**.

**Community Hero** turns every citizen into a sensor and every neighbourhood into a feedback loop. Snap a photo, drop a pin, and the AI does the rest. The community verifies. The dashboard shows progress. Heroes earn badges. Cities get smarter.

---

## 🎬 What Makes It Jaw-Dropping

This isn't a CRUD app dressed up. The frontend is a **living 3D world**:

- 🌐 **Animated 3D Globe** of all reported issues (Three.js + React Three Fiber)
- 🌌 **Particle starfield** background that reacts to scroll
- 💎 **Glassmorphism UI** with frosted panels, gradients, and motion
- 🪄 **Smooth scene transitions** powered by Framer Motion
- 🗺️ **Live Leaflet map** integration for hyperlocal precision
- 📊 **Animated impact dashboards** with Recharts
- 🏆 **Gamified leaderboard** with badge animations

---

## 🧠 AI Features

| Feature | How |
|---|---|
| **Auto-categorization** | LLM tags each report (pothole, streetlight, water, waste, infrastructure, other) |
| **Severity scoring** | AI rates urgency 1–5 from photo + description |
| **Sentiment analysis** | Every report + social signal scored on a -1..1 scale |
| **Predictive insights** | Hotspot forecasting from historical data |
| **AI Civic Assistant** | Floating chat that answers natural-language questions about the data, with citations |
| **City Pulse** | Passive listening on social/news/forums, sentiment-tagged |
| **Smart routing** | Multi-authority engine routes each report to the correct municipality + department |

> Backend ships with a pluggable LLM service. Drop in OpenAI, Anthropic, Groq, or run local with Ollama.

## 🏢 Built for Real Cities

Community Hero isn't just a demo — it speaks the same protocols as production civic platforms:

- **Open311 v2 GeoReport API** — drop-in compatible with any city using the standard (Chicago, San Francisco, D.C., …). Endpoints: `/open311/v2/services.json`, `/open311/v2/requests.json` (GET/POST), `/open311/v2/requests/:id.json`.
- **Multi-authority routing** — geographic boundary detection picks the correct municipality; per-department category mapping picks the correct team; per-department SLAs.
- **Work-order portal** — `/admin` route gives staff a queue with assignment, SLA countdowns, breach alerts, resolution proof photos, and per-department metrics.
- **Multi-tenant ready** — every record carries `municipality_id`. Add more cities by inserting rows into the `municipalities` table.

---

## ⚡ Advanced Platform Parity (v1.1)

Features that close the gap with SeeClickFix, FixMyStreet, and Zencity:

- **Real-time notifications (SSE)** — an in-process event bus (`services/events.js`) fans every state change (new report, status change, assignment, resolution, duplicate, new pulse signal) to browsers over `GET /api/stream`. The navbar shows a live ● indicator; toasts pop the moment a report lands anywhere in the system.
- **Live passive listening** — `services/pulseGenerator.js` simulates a Zencity-style firehose: it injects sentiment-scored social/news chatter on an interval (`PULSE_LIVE=true`, `PULSE_INTERVAL_MS`) and streams it to the City Pulse page, which flashes each new signal with a `NEW` badge. Also exposed on demand via `POST /api/pulse/simulate`.
- **GIS asset layer + road detection** — `services/assets.js` carries a road network and does exact point-to-segment geometry to classify any report as **public / private / off-network road** (FixMyStreet-style private-road detection), plus spatial **duplicate detection** (same category within ~75 m → linked as `duplicate_of`). Endpoints: `GET /api/assets/roads.json` (GeoJSON overlay), `/api/assets/classify`, `/api/assets/duplicates`. Every new issue is auto-tagged with `road_type`, `nearest_road`, `on_private_road`, and `duplicate_of`.
- **Multi-language UI** — dependency-free i18n (`frontend/src/i18n`) with English, हिन्दी, Español, and Français, persisted per-resident and switchable from the navbar.

---

## 🏗️ Architecture

```
┌────────────────────┐         ┌──────────────────┐         ┌──────────────┐
│   React + Three.js │ ◄─────► │  Express API     │ ◄─────► │   SQLite DB  │
│   (frontend/)      │  REST   │  (backend/)      │         │  + uploads/  │
└────────────────────┘         └──────────────────┘         └──────────────┘
        │                              │
        ▼                              ▼
   Leaflet maps                   LLM service
   3D globe                       (OpenAI/Groq/Ollama)
```

Two clean apps in one repo. Frontend talks to backend over REST. Backend persists to SQLite (zero-config) and proxies AI calls.

---

## 🚀 Quick Start

### 1. Clone & install
```bash
git clone https://github.com/Aarush-bigO/community-hero.git
cd community-hero

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 2. Configure
Copy `.env.example` to `.env` in **both** `backend/` and `frontend/`:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Add your LLM API key to `backend/.env`:
```
OPENAI_API_KEY=sk-...
# OR run fully local with Ollama — no key needed
LLM_PROVIDER=ollama
```

### 3. Run
```bash
# Terminal 1 — backend on :4000
cd backend && npm run dev

# Terminal 2 — frontend on :5173
cd frontend && npm run dev
```

Open **http://localhost:5173** and witness the 3D goodness. 🚀

---

## 📦 Deploy

### Frontend → Vercel
1. Import this repo on [vercel.com/new](https://vercel.com/new)
2. Set **Root Directory** to `frontend`
3. Add env var: `VITE_API_URL=https://your-backend-url`
4. Deploy ✨

### Backend → Render
1. New Web Service on [render.com](https://render.com)
2. Connect this repo, set **Root Directory** to `backend`
3. Build: `npm install` · Start: `node src/server.js`
4. Add `OPENAI_API_KEY` env var
5. Deploy 🚀

`render.yaml` and `vercel.json` are pre-configured for one-click deploys.

---

## 🗂️ Repo Layout

```
community-hero/
├── frontend/              # React + Vite + Three.js
│   ├── src/
│   │   ├── scenes/        # 3D scenes (Globe, Particles, Hero)
│   │   ├── components/    # UI components
│   │   ├── pages/         # Route pages
│   │   ├── store/         # Zustand state
│   │   └── utils/         # API client, helpers
│   └── public/
├── backend/               # Node + Express + SQLite
│   ├── src/
│   │   ├── routes/        # /api/issues, /api/users, /api/ai
│   │   ├── db/            # SQLite schema + migrations
│   │   ├── services/      # LLM service, scoring
│   │   └── middleware/    # auth, upload, error handling
│   └── uploads/           # photos (gitignored)
├── docs/                  # screenshots, architecture
└── .github/workflows/     # CI
```

---

## 🛣️ Roadmap

- [x] 3D landing page with animated globe
- [x] Issue reporting with photo + geolocation
- [x] AI categorization & severity scoring
- [x] Community verification (upvotes / confirms)
- [x] Real-time issue map
- [x] Impact dashboard
- [x] Gamification (XP, badges, leaderboard)
- [ ] Push notifications
- [ ] Municipality admin portal
- [ ] Predictive hotspot forecasting v2
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

PRs welcome! Pick an open issue, fork, and submit. Be a hero. 🦸

---

## 📄 License

MIT © 2026 Aarush Bharti

---

<p align="center">Built with ❤️ for stronger communities.</p>
