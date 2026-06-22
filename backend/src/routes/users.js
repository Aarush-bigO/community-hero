import { Router } from 'express';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { getDb } from '../db/init.js';
import { checkBadges, BADGES } from '../services/gamification.js';

const router = Router();

const CreateSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().optional(),
  avatar_url: z.string().url().optional(),
});

router.get('/', (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM users ORDER BY xp DESC LIMIT 200').all();
  res.json(rows.map(decodeUser));
});

router.get('/leaderboard', (_req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT u.id, u.name, u.avatar_url, u.xp, u.level, u.badges,
       (SELECT COUNT(*) FROM issues WHERE reporter_id = u.id) AS reports,
       (SELECT COUNT(*) FROM verifications WHERE user_id = u.id) AS verifications
       FROM users u ORDER BY u.xp DESC LIMIT 50`
    )
    .all();
  res.json(rows.map(decodeUser));
});

router.get('/badges', (_req, res) => res.json(BADGES));

router.get('/:id', (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(decodeUser(user));
});

router.post('/', (req, res, next) => {
  try {
    const parsed = CreateSchema.parse(req.body);
    const id = nanoid(10);
    const db = getDb();
    db.prepare('INSERT INTO users (id, name, email, avatar_url) VALUES (?, ?, ?, ?)').run(
      id,
      parsed.name,
      parsed.email || null,
      parsed.avatar_url || null
    );
    checkBadges(id);
    res.status(201).json({ id, ...parsed, xp: 0, level: 1, badges: [] });
  } catch (e) {
    if (e.issues) return res.status(400).json({ error: 'Validation failed', issues: e.issues });
    next(e);
  }
});

function decodeUser(row) {
  return { ...row, badges: safeJson(row.badges, []) };
}
function safeJson(s, fallback) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

export default router;
