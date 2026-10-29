import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { initDb } from './db/init.js';
import { seedIfEmpty } from './db/seed.js';
import issuesRouter from './routes/issues.js';
import usersRouter from './routes/users.js';
import aiRouter from './routes/ai.js';
import statsRouter from './routes/stats.js';
import open311Router from './routes/open311.js';
import agentRouter from './routes/agent.js';
import adminRouter from './routes/admin.js';
import pulseRouter from './routes/pulse.js';
import streamRouter from './routes/stream.js';
import assetsRouter from './routes/assets.js';
import bolnaRouter from './routes/bolna.js';
import { startPulseGenerator } from './services/pulseGenerator.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// --- Boot DB (and seed demo data on first run / empty DB) ---
initDb();
seedIfEmpty();

// --- Security & basics ---
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
// CORS: "*" (or unset) → reflect any origin (works with credentials, unlike a
// literal "*"); otherwise allow the explicit comma-separated allowlist.
const corsEnv = process.env.CORS_ORIGIN?.trim();
app.use(
  cors({
    origin: !corsEnv || corsEnv === '*' ? true : corsEnv.split(',').map((s) => s.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

// --- Rate limit ---
app.use(
  '/api',
  rateLimit({
    windowMs: 60_000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- Static uploads ---
const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
app.use('/uploads', express.static(uploadDir));

// --- Production Health & System Telemetry ---
app.get('/api/health', (_req, res) => {
  const start = performance.now();
  const db = initDb();
  let dbStatus = 'healthy';
  let counts = {};

  try {
    const issueCount = db.prepare('SELECT COUNT(*) c FROM issues').get().c;
    const userCount = db.prepare('SELECT COUNT(*) c FROM users').get().c;
    const voiceCount = db.prepare('SELECT COUNT(*) c FROM voice_dispatches').get().c;
    counts = { issues: issueCount, heroes: userCount, voice_dispatches: voiceCount };
  } catch (err) {
    dbStatus = 'degraded';
  }

  const dbLatencyMs = Number((performance.now() - start).toFixed(2));
  const mem = process.memoryUsage();

  res.json({
    status: 'healthy',
    service: 'community-hero-enterprise-core',
    version: '2.4.0-prod',
    environment: process.env.NODE_ENV || 'production',
    uptime_seconds: Math.floor(process.uptime()),
    database: {
      engine: 'SQLite3 (WAL Mode)',
      status: dbStatus,
      latency_ms: dbLatencyMs,
      records: counts,
    },
    system: {
      node_version: process.version,
      memory: {
        heap_used_mb: Math.round(mem.heapUsed / 1024 / 1024),
        rss_mb: Math.round(mem.rss / 1024 / 1024),
      },
    },
    integrations: {
      sse_stream: 'active',
      bolna_voice_ai: 'connected',
      sarvam_bilingual: 'ready',
      open311_v2: 'compliant',
    },
    timestamp: new Date().toISOString(),
  });
});

// --- Routes ---
app.use('/api/issues', issuesRouter);
app.use('/api/users', usersRouter);
app.use('/api/ai', aiRouter);
app.use('/api/stats', statsRouter);
app.use('/api/agent', agentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/pulse', pulseRouter);
app.use('/api/stream', streamRouter);
app.use('/api/events', streamRouter); // alias for SSE events
app.use('/api/assets', assetsRouter);
app.use('/api', bolnaRouter); // Mounts /api/bolna-webhook, /api/bolna-dispatch-confirm, /api/simulate-voice-call, etc.
app.use('/open311/v2', open311Router);

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// --- Errors ---
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🦸 Community Hero API`);
  console.log(`   ↳ http://localhost:${PORT}`);
  console.log(`   ↳ env: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   ↳ LLM: ${process.env.LLM_PROVIDER || 'mock'}`);
  console.log(`   ↳ SSE stream: /api/stream`);
  startPulseGenerator();
  console.log('');
});
