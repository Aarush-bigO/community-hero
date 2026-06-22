import { Router } from 'express';
import { getDb } from '../db/init.js';
import { analyzeIssue, predictHotspots } from '../services/llm.js';

const router = Router();

router.post('/analyze', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    const result = await analyzeIssue(text);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get('/hotspots', async (_req, res, next) => {
  try {
    const db = getDb();
    const issues = db.prepare('SELECT lat, lng FROM issues').all();
    const hotspots = await predictHotspots(issues);
    res.json(hotspots);
  } catch (e) {
    next(e);
  }
});

export default router;
