import { Router } from 'express';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { getDb } from '../db/init.js';
import { upload } from '../middleware/upload.js';
import { analyzeIssue } from '../services/llm.js';
import { analyzeSentiment } from '../services/sentiment.js';
import { routeReport, computeSlaDueAt } from '../services/routing.js';
import { awardXp, checkBadges } from '../services/gamification.js';
import { classifyLocation, findDuplicates } from '../services/assets.js';
import { publish, EVENTS } from '../services/events.js';

const router = Router();

const CreateSchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().max(2000).optional(),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  address: z.string().max(280).optional(),
  reporter_id: z.string().optional(),
});

// GET /api/issues — list with filters
router.get('/', (req, res) => {
  const db = getDb();
  const { category, status, near_lat, near_lng, radius_km } = req.query;

  let sql = `SELECT i.*, u.name AS reporter_name, u.avatar_url AS reporter_avatar,
    (SELECT COUNT(*) FROM verifications v WHERE v.issue_id = i.id AND v.vote > 0) AS confirms,
    (SELECT COUNT(*) FROM verifications v WHERE v.issue_id = i.id AND v.vote < 0) AS disputes
    FROM issues i LEFT JOIN users u ON u.id = i.reporter_id WHERE 1=1`;
  const params = [];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC LIMIT 500';

  let rows = db.prepare(sql).all(...params);

  // Optional naive radius filter
  if (near_lat && near_lng && radius_km) {
    const lat = Number(near_lat);
    const lng = Number(near_lng);
    const r = Number(radius_km);
    rows = rows.filter((i) => {
      const dLat = (i.lat - lat) * 111;
      const dLng = (i.lng - lng) * 111 * Math.cos((lat * Math.PI) / 180);
      return Math.sqrt(dLat * dLat + dLng * dLng) <= r;
    });
  }

  res.json(rows.map(decodeIssue));
});

// GET /api/issues/geojson — Standard GIS GeoJSON FeatureCollection
router.get('/geojson', (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM issues ORDER BY created_at DESC').all();
  const featureCollection = {
    type: 'FeatureCollection',
    metadata: {
      generated_at: new Date().toISOString(),
      count: rows.length,
      crs: 'urn:ogc:def:crs:OGC:1.3:CRS84',
    },
    features: rows.map((i) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [i.lng, i.lat],
      },
      properties: {
        id: i.id,
        title: i.title,
        description: i.description,
        category: i.category,
        severity: i.severity,
        status: i.status,
        address: i.address,
        photo_url: i.photo_url,
        urgency_score: i.urgency_score,
        created_at: i.created_at,
        sla_due_at: i.sla_due_at,
      },
    })),
  };
  res.json(featureCollection);
});

// GET /api/issues/:id
router.get('/:id', (req, res) => {
  const db = getDb();
  const issue = db.prepare('SELECT * FROM issues WHERE id = ?').get(req.params.id);
  if (!issue) return res.status(404).json({ error: 'Not found' });

  const updates = db
    .prepare('SELECT * FROM status_updates WHERE issue_id = ? ORDER BY created_at')
    .all(req.params.id);
  const verifications = db
    .prepare(
      `SELECT v.*, u.name as user_name FROM verifications v
       LEFT JOIN users u ON u.id = v.user_id WHERE v.issue_id = ?`
    )
    .all(req.params.id);

  res.json({ ...decodeIssue(issue), status_updates: updates, verifications });
});

// POST /api/issues — create
router.post('/', upload.single('photo'), async (req, res, next) => {
  try {
    const parsed = CreateSchema.parse(req.body);
    const id = nanoid(10);

    const text = `${parsed.title}\n\n${parsed.description || ''}`;
    const ai = await analyzeIssue(text);
    const sent = analyzeSentiment(text);
    const route = routeReport({ lat: parsed.lat, lng: parsed.lng, category: ai.category });

    // GIS asset layer: classify location + detect nearby duplicate reports.
    const geo = classifyLocation(parsed.lat, parsed.lng);
    const dupes = findDuplicates(parsed.lat, parsed.lng, ai.category);
    const duplicate_of = (dupes && dupes.length > 0) ? dupes[0].id : null;
    const DEFAULT_CATEGORY_PHOTOS = {
      pothole: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
      streetlight: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
      water: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
      waste: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
      infrastructure: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80',
      other: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    };

    const photo_url = req.file ? `/uploads/${req.file.filename}` : (DEFAULT_CATEGORY_PHOTOS[ai.category] || DEFAULT_CATEGORY_PHOTOS.other);

    const db = getDb();
    db.prepare(
      `INSERT INTO issues
       (id, title, description, category, severity, lat, lng, address, photo_url, reporter_id,
        municipality_id, department_id, sla_due_at,
        ai_tags, ai_summary, sentiment, sentiment_label,
        road_type, nearest_road, on_private_road, duplicate_of, lang)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      parsed.title,
      parsed.description || '',
      ai.category,
      ai.severity,
      parsed.lat,
      parsed.lng,
      parsed.address || '',
      photo_url,
      parsed.reporter_id || null,
      route.municipality?.id || 'demo-city',
      route.department?.id || null,
      computeSlaDueAt(route.sla_hours),
      JSON.stringify(ai.tags),
      ai.summary,
      sent.score,
      sent.label,
      geo.road_type,
      geo.nearest_road_name,
      geo.on_private_road ? 1 : 0,
      duplicate_of,
      req.body.lang || 'en'
    );

    if (parsed.reporter_id) {
      awardXp(parsed.reporter_id, 'REPORT');
      checkBadges(parsed.reporter_id);
    }

    const created = db.prepare('SELECT * FROM issues WHERE id = ?').get(id);

    // Real-time push: new issue (and a duplicate hint if we found one).
    publish(EVENTS.ISSUE_CREATED, {
      id,
      title: created.title,
      category: created.category,
      severity: created.severity,
      municipality_id: created.municipality_id,
      lat: created.lat,
      lng: created.lng,
      routed_to: route.department?.name || null,
    });
    if (duplicate_of) {
      publish(EVENTS.ISSUE_DUPLICATE, { id, duplicate_of, distance_m: dupes[0].distance_m });
    }

    res.status(201).json({
      ...decodeIssue(created),
      ai,
      sentiment: sent,
      routed_to: route.department?.name || null,
      geo,
      duplicates: dupes,
    });
  } catch (e) {
    if (e.issues) return res.status(400).json({ error: 'Validation failed', issues: e.issues });
    next(e);
  }
});

// POST /api/issues/:id/verify
router.post('/:id/verify', (req, res, next) => {
  try {
    const { user_id, vote, comment } = req.body;
    if (!user_id || ![1, -1].includes(vote))
      return res.status(400).json({ error: 'user_id and vote (1 or -1) required' });

    const db = getDb();
    const id = nanoid(10);
    db.prepare(
      `INSERT INTO verifications (id, issue_id, user_id, vote, comment)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(issue_id, user_id) DO UPDATE SET vote = excluded.vote, comment = excluded.comment`
    ).run(id, req.params.id, user_id, vote, comment || '');

    awardXp(user_id, 'VERIFY');
    checkBadges(user_id);

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/issues/:id/status
router.patch('/:id/status', (req, res) => {
  const { status, note, author } = req.body;
  const allowed = ['reported', 'verified', 'in_progress', 'resolved', 'rejected'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const db = getDb();
  db.prepare("UPDATE issues SET status = ?, updated_at = datetime('now') WHERE id = ?").run(
    status,
    req.params.id
  );
  db.prepare(
    'INSERT INTO status_updates (id, issue_id, status, note, author) VALUES (?, ?, ?, ?, ?)'
  ).run(nanoid(10), req.params.id, status, note || '', author || 'system');

  if (status === 'resolved') {
    const issue = db.prepare('SELECT reporter_id FROM issues WHERE id = ?').get(req.params.id);
    if (issue?.reporter_id) awardXp(issue.reporter_id, 'RESOLVE');
  }

  publish(status === 'resolved' ? EVENTS.ISSUE_RESOLVED : EVENTS.ISSUE_STATUS, {
    id: req.params.id,
    status,
    note: note || '',
  });

  res.json({ ok: true });
});

function decodeIssue(row) {
  return {
    ...row,
    ai_tags: safeJson(row.ai_tags, []),
  };
}

function safeJson(s, fallback) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

export default router;
