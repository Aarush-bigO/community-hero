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
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
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

// --- Health ---
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'community-hero-backend',
    version: '1.0.0',
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
app.use('/api/assets', assetsRouter);
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
