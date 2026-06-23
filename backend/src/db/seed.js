import 'dotenv/config';
import { initDb, getDb } from './init.js';
import { nanoid } from 'nanoid';
import { analyzeSentiment } from '../services/sentiment.js';

/** Seed the database with demo data (wipes existing rows first). */
export function seed() {
  initDb();
  const db = getDb();

// Wipe so reseeds are deterministic
db.exec(`
  DELETE FROM verifications;
  DELETE FROM status_updates;
  DELETE FROM pulse_signals;
  DELETE FROM issues;
  DELETE FROM departments;
  DELETE FROM municipalities;
  DELETE FROM users;
`);

// --- Municipalities ---
const munis = [
  {
    id: 'new-delhi',
    name: 'New Delhi',
    country: 'IN',
    bbox: { south: 28.4, north: 28.9, west: 76.9, east: 77.4 },
    contact_email: 'civic@newdelhi.gov.in',
  },
  {
    id: 'demo-city',
    name: 'Demo City',
    country: 'IN',
    bbox: { south: -90, north: 90, west: -180, east: 180 },
    contact_email: 'demo@example.com',
  },
];
munis.forEach((m) =>
  db
    .prepare(
      'INSERT INTO municipalities (id, name, country, bbox, contact_email, open311_jurisdiction_id) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(m.id, m.name, m.country, JSON.stringify(m.bbox), m.contact_email, m.id)
);

// --- Departments ---
const depts = [
  { id: 'd-roads', muni: 'new-delhi', name: 'Roads & Highways', cats: ['pothole'], sla: 48 },
  { id: 'd-elec', muni: 'new-delhi', name: 'Electrical', cats: ['streetlight'], sla: 72 },
  { id: 'd-water', muni: 'new-delhi', name: 'Water & Sewerage', cats: ['water'], sla: 36 },
  { id: 'd-sani', muni: 'new-delhi', name: 'Sanitation', cats: ['waste'], sla: 24 },
  { id: 'd-pw', muni: 'new-delhi', name: 'Public Works', cats: ['infrastructure'], sla: 96 },
  { id: 'd-gen', muni: 'new-delhi', name: 'General Civic', cats: ['other'], sla: 120 },
  { id: 'd-demo', muni: 'demo-city', name: 'General', cats: ['pothole','streetlight','water','waste','infrastructure','other'], sla: 72 },
];
depts.forEach((d) =>
  db
    .prepare(
      'INSERT INTO departments (id, municipality_id, name, categories, sla_hours, contact_email) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(d.id, d.muni, d.name, JSON.stringify(d.cats), d.sla, `${d.id}@gov.example`)
);

// --- Users (citizens + 2 staff + 1 admin) ---
const users = [
  { name: 'Aarush Bharti', email: 'aarush@example.com', role: 'citizen' },
  { name: 'Priya Sharma', email: 'priya@example.com', role: 'citizen' },
  { name: 'Rohan Mehta', email: 'rohan@example.com', role: 'citizen' },
  { name: 'Sara Kapoor', email: 'sara@example.com', role: 'citizen' },
  { name: 'Inspector Verma', email: 'verma@gov.in', role: 'staff' },
  { name: 'Engineer Iyer', email: 'iyer@gov.in', role: 'staff' },
  { name: 'Admin Khan', email: 'khan@gov.in', role: 'admin' },
];
const userIds = users.map((u) => {
  const id = nanoid(10);
  db.prepare(
    'INSERT INTO users (id, name, email, role, municipality_id, xp, level) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, u.name, u.email, u.role, 'new-delhi', Math.floor(Math.random() * 1500), 1);
  return { id, ...u };
});
const citizens = userIds.filter((u) => u.role === 'citizen');
const staff = userIds.filter((u) => u.role === 'staff');

// --- Issues ---
const samples = [
  { t: 'Massive pothole on MG Road — dangerous for bikes', cat: 'pothole', dept: 'd-roads', lat: 28.6139, lng: 77.209, sev: 4, st: 'in_progress' },
  { t: 'Streetlight out at Sector 14, dark and unsafe', cat: 'streetlight', dept: 'd-elec', lat: 28.6219, lng: 77.215, sev: 3, st: 'reported' },
  { t: 'Major water leak near park gate, flooding sidewalk', cat: 'water', dept: 'd-water', lat: 28.6079, lng: 77.219, sev: 5, st: 'in_progress' },
  { t: 'Garbage piling at corner — terrible smell', cat: 'waste', dept: 'd-sani', lat: 28.6159, lng: 77.205, sev: 3, st: 'resolved' },
  { t: 'Cracked pavement, hazard for pedestrians', cat: 'infrastructure', dept: 'd-pw', lat: 28.6189, lng: 77.211, sev: 4, st: 'reported' },
  { t: 'Open manhole — DANGER, child almost fell', cat: 'infrastructure', dept: 'd-pw', lat: 28.6109, lng: 77.221, sev: 5, st: 'in_progress' },
  { t: 'Pothole getting worse on Ring Road', cat: 'pothole', dept: 'd-roads', lat: 28.6149, lng: 77.214, sev: 4, st: 'reported' },
  { t: 'Streetlight flickers, then goes out', cat: 'streetlight', dept: 'd-elec', lat: 28.6199, lng: 77.218, sev: 2, st: 'resolved' },
  { t: 'Overflowing dumpster, foul smell, residents furious', cat: 'waste', dept: 'd-sani', lat: 28.6129, lng: 77.207, sev: 4, st: 'reported' },
  { t: 'Burst water main on Connaught Place', cat: 'water', dept: 'd-water', lat: 28.6328, lng: 77.2197, sev: 5, st: 'reported' },
];

samples.forEach((s, i) => {
  const id = nanoid(10);
  const sent = analyzeSentiment(s.t);
  const slaHours = depts.find((d) => d.id === s.dept)?.sla || 72;
  // SLA due dates spread for realism — 2 of them are breached on purpose
  const offset = i === 4 || i === 6 ? -1 * 3600 * 24 : slaHours * 3600 * 1000;
  const sla = new Date(Date.now() + offset).toISOString().replace('T', ' ').slice(0, 19);

  db.prepare(
    `INSERT INTO issues
      (id, title, description, category, severity, status, lat, lng, address,
       reporter_id, municipality_id, department_id, assignee_id, sla_due_at,
       ai_summary, sentiment, sentiment_label, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?), datetime('now', ?))`
  ).run(
    id,
    s.t,
    `${s.t}. Reported by community. Needs urgent attention.`,
    s.cat,
    s.sev,
    s.st,
    s.lat,
    s.lng,
    'New Delhi, India',
    citizens[i % citizens.length].id,
    'new-delhi',
    s.dept,
    s.st === 'in_progress' || s.st === 'resolved' ? staff[i % staff.length].id : null,
    sla,
    `AI-flagged ${s.cat} — recommended action: dispatch civic team.`,
    sent.score,
    sent.label,
    `-${i * 6} hours`,
    s.st === 'resolved' ? `-${(i * 6) - 2} hours` : `-${i * 6} hours`
  );
});

// --- City Pulse signals (mock social/news mentions) ---
const pulse = [
  { source: 'twitter', author: '@delhicitizen', text: 'Yet another pothole sent my Activa flying. @MCD when?', topic: 'pothole' },
  { source: 'twitter', author: '@nityamehta', text: 'Streetlight outage on my street for FIVE days now. Dangerous.', topic: 'streetlight' },
  { source: 'news', author: 'Times of India', text: 'Residents furious over garbage piling up in central Delhi neighborhoods.', topic: 'waste', url: 'https://example.com/news/1' },
  { source: 'reddit', author: 'u/delhi_resident', text: 'Honestly the new sanitation pickup schedule has been great.', topic: 'waste' },
  { source: 'twitter', author: '@aravindrk', text: 'Water leak near my house finally fixed. Thanks @DJB!', topic: 'water' },
  { source: 'news', author: 'Hindustan Times', text: 'Civic body announces emergency repairs on flood-prone roads.', topic: 'infrastructure', url: 'https://example.com/news/2' },
  { source: 'twitter', author: '@kavya_d', text: 'Open manhole nearly killed my dog tonight. UNACCEPTABLE.', topic: 'infrastructure' },
  { source: 'reddit', author: 'u/citydweller', text: 'Honestly delhi roads are getting worse every monsoon.', topic: 'pothole' },
];
pulse.forEach((p) => {
  const sent = analyzeSentiment(p.text);
  db.prepare(
    `INSERT INTO pulse_signals (id, source, author, text, url, topic, sentiment, sentiment_label, municipality_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))`
  ).run(nanoid(10), p.source, p.author, p.text, p.url || null, p.topic, sent.score, sent.label, 'new-delhi', `-${Math.floor(Math.random() * 24)} hours`);
});

  console.log(
    `✅ Seeded ${munis.length} municipalities, ${depts.length} departments, ${users.length} users, ${samples.length} issues, ${pulse.length} pulse signals`
  );
}

/** Seed only when the database is empty — safe to call on every boot. */
export function seedIfEmpty() {
  initDb();
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) c FROM users').get().c;
  if (!count) {
    console.log('🌱 Empty database detected — seeding demo data…');
    seed();
  }
}

// Run as a CLI script: `node src/db/seed.js`
if (import.meta.url === `file://${process.argv[1]}`) {
  seed();
}
