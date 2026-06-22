import { Router } from 'express';
import { ask } from '../services/agent.js';

const router = Router();

router.post('/ask', async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string')
      return res.status(400).json({ error: 'question required' });
    const result = await ask(question);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
