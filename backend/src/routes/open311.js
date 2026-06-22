/**
 * Open311 v2 GeoReport API — partial reference implementation.
 * Spec: https://wiki.open311.org/GeoReport_v2/
 *
 * Implements the read endpoints + service request creation, which is what
 * 99% of municipal integrations actually use. Returns JSON only (XML is
 * legacy; modern stacks have moved on).
 *
 * Available endpoints:
 *   GET  /open311/v2/services.json
 *   GET  /open311/v2/services/:code.json
 *   GET  /open311/v2/requests.json
 *   GET  /open311/v2/requests/:id.json
 *   POST /open311/v2/requests.json
 */
import { Router } from 'express';
import { nanoid } from 'nanoid';
import { getDb } from '../db/init.js';
import { analyzeIssue } from '../services/llm.js';
import { analyzeSentiment } from '../services/sentiment.js';
import { routeReport, computeSlaDueAt } from '../services/routing.js';

const router = Router();

const SERVICES = [
  { service_code: 'pothole', service_name: 'Pothole Repair', group: 'Streets' },
  { service_code: 'streetlight', service_name: 'Streetlight Out', group: 'Lighting' },
  { service_code: 'water', service_name: 'Water Leak / Drainage', group: 'Water' },
  { service_code: 'waste', service_name: 'Garbage / Sanitation', group: 'Sanitation' },
  { service_code: 'infrastructure', service_name: 'Infrastructure Hazard', group: 'Public Works' },
  { service_code: 'other', service_name: 'Other', group: 'General' },
].map((s) => ({ ...s, description: s.service_name, metadata: false, type: 'realtime' }));

router.get('/services.json', (_req, res) => res.json(SERVICES));

router.get('/services/:code.json', (req, res) => {
  const s = SERVICES.find((x) => x.service_code === req.params.code);
  if (!s) return res.status(404).json([{ code: 404, description: 'service_code not found' }]);
  res.json([s]);
});

router.get('/requests.json', (req, res) => {
  const { service_code, status, start_date, end_date, page = 1, per_page = 50 } = req.query;
  const db = getDb();
  let sql = 'SELECT * FROM issues WHERE 1=1';
  const params = [];
  if (service_code) {
    sql += ' AND category = ?';
    params.push(service_code);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(open311ToInternal(status));
  }
  if (start_date) {
    sql += ' AND created_at >= ?';
    params.push(start_date);
  }
  if (end_date) {
    sql += ' AND created_at <= ?';
    params.push(end_date);
  }
  sql += ` ORDER BY created_at DESC LIMIT ${Number(per_page)} OFFSET ${
    (Number(page) - 1) * Number(per_page)
  }`;
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(toOpen311));
});

router.get('/requests/:id.json', (req, res) => {
  const db = getDb();
  const issue = db.prepare('SELECT * FROM issues WHERE id = ?').get(req.params.id);
  if (!issue) return res.status(404).json([{ code: 404, description: 'service_request not found' }]);
  res.json([toOpen311(issue)]);
});

router.post('/requests.json', async (req, res, next) => {
  try {
    const { service_code, lat, long, address_string, description, email, first_name, last_name } =
      req.body;
    if (!service_code || (!lat && !address_string))
      return res.status(400).json([
        {
          code: 400,
          description: 'service_code and (lat,long) or address_string required',
        },
      ]);

    const latN = Number(lat);
    const lngN = Number(long);
    const text = `${description || service_code}`;

    const ai = await analyzeIssue(text);
    const sent = analyzeSentiment(text);
    const route = routeReport({ lat: latN, lng: lngN, category: service_code });

    const id = nanoid(10);
    const db = getDb();
    db.prepare(
      `INSERT INTO issues
        (id, title, description, category, severity, lat, lng, address,
         municipality_id, department_id, sla_due_at,
         ai_tags, ai_summary, sentiment, sentiment_label)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      `${SERVICES.find((s) => s.service_code === service_code)?.service_name || service_code} report`,
      description || '',
      service_code,
      ai.severity,
      latN,
      lngN,
      address_string || '',
      route.municipality?.id || 'demo-city',
      route.department?.id || null,
      computeSlaDueAt(route.sla_hours),
      JSON.stringify(ai.tags),
      ai.summary,
      sent.score,
      sent.label
    );

    res.status(201).json([
      {
        service_request_id: id,
        token: id,
        service_notice: `Routed to ${route.department?.name || 'General Civic'}`,
        account_id: email || null,
      },
    ]);
  } catch (e) {
    next(e);
  }
});

function toOpen311(i) {
  return {
    service_request_id: i.id,
    status: internalToOpen311(i.status),
    status_notes: i.resolution_note || null,
    service_name: SERVICES.find((s) => s.service_code === i.category)?.service_name || i.category,
    service_code: i.category,
    description: i.description,
    requested_datetime: i.created_at,
    updated_datetime: i.updated_at,
    address: i.address,
    lat: i.lat,
    long: i.lng,
    media_url: i.photo_url || null,
  };
}

function internalToOpen311(s) {
  if (s === 'resolved') return 'closed';
  if (s === 'rejected') return 'closed';
  return 'open';
}
function open311ToInternal(s) {
  if (s === 'closed') return 'resolved';
  return 'reported';
}

export default router;
