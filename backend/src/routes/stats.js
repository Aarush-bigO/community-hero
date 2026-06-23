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

  // Status funnel
  const statusRows = db.prepare('SELECT status, COUNT(*) c FROM issues GROUP BY status').all();
  const statusMap = Object.fromEntries(statusRows.map((r) => [r.status, r.c]));
  const statusFunnel = ['reported', 'verified', 'in_progress', 'resolved'].map((s) => ({
    status: s,
    c: statusMap[s] || 0,
  }));

  // Daily trend (30d): reported vs resolved per day
  const reportedByDay = db
    .prepare(
      `SELECT date(created_at) AS day, COUNT(*) AS c FROM issues
       WHERE created_at >= date('now','-30 day') GROUP BY day`
    )
    .all();
  const resolvedByDay = db
    .prepare(
      `SELECT date(updated_at) AS day, COUNT(*) AS c FROM issues
       WHERE status='resolved' AND updated_at >= date('now','-30 day') GROUP BY day`
    )
    .all();
  const rMap = Object.fromEntries(reportedByDay.map((r) => [r.day, r.c]));
  const sMap = Object.fromEntries(resolvedByDay.map((r) => [r.day, r.c]));
  const days = [...new Set([...Object.keys(rMap), ...Object.keys(sMap)])].sort();
  const trend = days.map((day) => ({
    day,
    reported: rMap[day] || 0,
    resolved: sMap[day] || 0,
    c: rMap[day] || 0, // backward-compat alias
  }));

  // Avg resolution time (hours)
  const avgRow = db
    .prepare(
      `SELECT AVG((julianday(updated_at) - julianday(created_at)) * 24) AS h
       FROM issues WHERE status='resolved'`
    )
    .get();
  const avgResolutionHours = avgRow?.h ? Number(avgRow.h.toFixed(1)) : 0;

  // SLA compliance = 1 - (open & overdue) / total
  const breaches = db
    .prepare(
      `SELECT COUNT(*) c FROM issues
       WHERE status NOT IN ('resolved','rejected') AND sla_due_at IS NOT NULL
         AND datetime(sla_due_at) < datetime('now')`
    )
    .get().c;
  const slaCompliance = total ? Math.round(((total - breaches) / total) * 100) : 100;

  // Sentiment
  const sRow = db
    .prepare(
      `SELECT AVG(sentiment) avg,
        SUM(CASE WHEN sentiment_label='negative' THEN 1 ELSE 0 END) neg,
        SUM(CASE WHEN sentiment_label='positive' THEN 1 ELSE 0 END) pos,
        SUM(CASE WHEN sentiment_label='neutral' THEN 1 ELSE 0 END) neu
       FROM issues`
    )
    .get();
  const sentiment = {
    avg: sRow?.avg ? Number(sRow.avg.toFixed(2)) : 0,
    negative: sRow?.neg || 0,
    positive: sRow?.pos || 0,
    neutral: sRow?.neu || 0,
  };

  // Week-over-week deltas
  const cnt = (sql) => db.prepare(sql).get().c;
  const reportsLast7 = cnt(`SELECT COUNT(*) c FROM issues WHERE created_at >= datetime('now','-7 day')`);
  const reportsPrev7 = cnt(
    `SELECT COUNT(*) c FROM issues WHERE created_at >= datetime('now','-14 day') AND created_at < datetime('now','-7 day')`
  );
  const resolvedLast7 = cnt(
    `SELECT COUNT(*) c FROM issues WHERE status='resolved' AND updated_at >= datetime('now','-7 day')`
  );
  const resolvedPrev7 = cnt(
    `SELECT COUNT(*) c FROM issues WHERE status='resolved' AND updated_at >= datetime('now','-14 day') AND updated_at < datetime('now','-7 day')`
  );
  const pctDelta = (a, b) => (b ? Math.round(((a - b) / b) * 100) : a > 0 ? 100 : 0);

  res.json({
    total,
    resolved,
    inProgress,
    reporters,
    resolutionRate: total ? Math.round((resolved / total) * 100) : 0,
    avgResolutionHours,
    slaCompliance,
    breaches,
    sentiment,
    statusFunnel,
    byCategory,
    bySeverity,
    trend,
    deltas: {
      reports: pctDelta(reportsLast7, reportsPrev7),
      resolved: pctDelta(resolvedLast7, resolvedPrev7),
      reportsLast7,
      resolvedLast7,
    },
  });
});

export default router;
