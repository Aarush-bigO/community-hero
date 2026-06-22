import { Router } from 'express';
import { getDb } from '../db/init.js';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();
  const total = db.prepare('SELECT COUNT(*) c FROM issues').get().c;
  const resolved = db.prepare("SELECT COUNT(*) c FROM issues WHERE status = 'resolved'").get().c;
  const inProgress = db
    .prepare("SELECT COUNT(*) c FROM issues WHERE status = 'in_progress'")
    .get().c;
  const reporters = db.prepare('SELECT COUNT(DISTINCT reporter_id) c FROM issues').get().c;
  const byCategory = db
    .prepare('SELECT category, COUNT(*) c FROM issues GROUP BY category ORDER BY c DESC')
    .all();
  const bySeverity = db
    .prepare('SELECT severity, COUNT(*) c FROM issues GROUP BY severity ORDER BY severity')
    .all();
  const trend = db
    .prepare(
      `SELECT date(created_at) AS day, COUNT(*) AS c FROM issues
       WHERE created_at >= date('now','-30 day') GROUP BY day ORDER BY day`
    )
    .all();

  res.json({
    total,
    resolved,
    inProgress,
    reporters,
    resolutionRate: total ? Math.round((resolved / total) * 100) : 0,
    byCategory,
    bySeverity,
    trend,
  });
});

export default router;
