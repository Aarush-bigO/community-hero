/**
 * Admin / work-order routes — assignment, SLA tracking, dept metrics.
 * Auth-light for the demo; in production gate by role middleware.
 */
import { Router } from 'express';
import { getDb } from '../db/init.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/queue', (req, res) => {
  const { department_id, status } = req.query;
  const db = getDb();
  let sql = `SELECT i.*,
      d.name AS department_name, d.sla_hours,
      u.name AS assignee_name,
      r.name AS reporter_name,
      CAST((julianday(i.sla_due_at) - julianday('now')) * 24 AS REAL) AS hours_remaining
    FROM issues i
    LEFT JOIN departments d ON d.id = i.department_id
    LEFT JOIN users u ON u.id = i.assignee_id
    LEFT JOIN users r ON r.id = i.reporter_id
    WHERE 1=1`;
  const params = [];
  if (department_id) {
    sql += ' AND i.department_id = ?';
    params.push(department_id);
  }
  if (status) {
    sql += ' AND i.status = ?';
    params.push(status);
  }
  sql += " ORDER BY CASE WHEN i.status IN ('resolved','rejected') THEN 1 ELSE 0 END, i.sla_due_at ASC LIMIT 200";
  const rows = db.prepare(sql).all(...params);
  res.json(rows);
});

router.get('/breaches', (_req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT i.*, d.name AS department_name FROM issues i
       LEFT JOIN departments d ON d.id = i.department_id
       WHERE i.status NOT IN ('resolved','rejected')
         AND i.sla_due_at IS NOT NULL
         AND datetime(i.sla_due_at) < datetime('now')
       ORDER BY i.sla_due_at ASC`
    )
    .all();
  res.json(rows);
});

router.post('/issues/:id/assign', (req, res) => {
  const { assignee_id, department_id } = req.body;
  const db = getDb();
  db.prepare(
    `UPDATE issues SET assignee_id = ?, department_id = COALESCE(?, department_id),
       status = CASE WHEN status = 'reported' THEN 'in_progress' ELSE status END,
       updated_at = datetime('now') WHERE id = ?`
  ).run(assignee_id || null, department_id || null, req.params.id);
  res.json({ ok: true });
});

router.post('/issues/:id/resolve', upload.single('proof'), (req, res) => {
  const { note } = req.body;
  const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
  const db = getDb();
  db.prepare(
    `UPDATE issues SET status='resolved', resolution_note=?, resolution_photo_url=?,
       updated_at=datetime('now') WHERE id=?`
  ).run(note || '', photo_url, req.params.id);
  res.json({ ok: true, photo_url });
});

router.get('/dept-metrics', (_req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT d.id, d.name, d.sla_hours,
        COUNT(i.id) AS total,
        SUM(CASE WHEN i.status='resolved' THEN 1 ELSE 0 END) AS resolved,
        SUM(CASE WHEN i.status NOT IN ('resolved','rejected')
                 AND datetime(i.sla_due_at) < datetime('now') THEN 1 ELSE 0 END) AS breaches,
        AVG(CASE WHEN i.status='resolved'
                 THEN (julianday(i.updated_at) - julianday(i.created_at)) * 24 END) AS avg_resolve_hours
      FROM departments d
      LEFT JOIN issues i ON i.department_id = d.id
      GROUP BY d.id ORDER BY total DESC`
    )
    .all();
  res.json(rows);
});

router.get('/departments', (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM departments').all();
  res.json(
    rows.map((d) => ({ ...d, categories: safeJson(d.categories, []) }))
  );
});

router.get('/staff', (_req, res) => {
  const db = getDb();
  const rows = db.prepare("SELECT id, name, role FROM users WHERE role IN ('staff','admin')").all();
  res.json(rows);
});

function safeJson(s, fb) {
  try {
    return JSON.parse(s);
  } catch {
    return fb;
  }
}

export default router;
