/**
 * City Pulse — passive listening signals (mock social/news mentions).
 * Endpoints to read the feed and (for demos) inject new signals.
 */
import { Router } from 'express';
import { nanoid } from 'nanoid';
import { getDb } from '../db/init.js';
import { analyzeSentiment, aggregateSentiment } from '../services/sentiment.js';
import { injectSignal } from '../services/pulseGenerator.js';
import { publish, EVENTS } from '../services/events.js';

const router = Router();

// POST /api/pulse/simulate — inject one synthetic live signal on demand (demo).
router.post('/simulate', (_req, res) => {
  res.status(201).json(injectSignal());
});

router.get('/', (req, res) => {
  const { topic, source, limit = 100 } = req.query;
  const db = getDb();
  let sql = 'SELECT * FROM pulse_signals WHERE 1=1';
  const params = [];
  if (topic) {
    sql += ' AND topic = ?';
    params.push(topic);
  }
  if (source) {
    sql += ' AND source = ?';
    params.push(source);
  }
  sql += ' ORDER BY created_at DESC LIMIT ?';
  params.push(Number(limit));
  res.json(db.prepare(sql).all(...params));
});

router.get('/summary', (_req, res) => {
  const db = getDb();
  const all = db.prepare('SELECT * FROM pulse_signals').all();
  const sent = aggregateSentiment(all);
  const byTopic = db
    .prepare('SELECT topic, COUNT(*) c FROM pulse_signals GROUP BY topic ORDER BY c DESC')
    .all();
  const bySource = db
    .prepare('SELECT source, COUNT(*) c FROM pulse_signals GROUP BY source ORDER BY c DESC')
    .all();
  res.json({ total: all.length, sentiment: sent, byTopic, bySource });
});

router.post('/', (req, res) => {
  const { source, author, text, url, lat, lng, topic } = req.body;
  if (!source || !text) return res.status(400).json({ error: 'source and text required' });
  const sent = analyzeSentiment(text);
  const id = nanoid(10);
  const db = getDb();
  db.prepare(
    `INSERT INTO pulse_signals (id, source, author, text, url, lat, lng, topic, sentiment, sentiment_label)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, source, author || null, text, url || null, lat || null, lng || null, topic || null, sent.score, sent.label);
  publish(EVENTS.PULSE_SIGNAL, { id, source, author, text, topic, sentiment: sent.score, sentiment_label: sent.label });
  res.status(201).json({ id, sentiment: sent });
});

export default router;
