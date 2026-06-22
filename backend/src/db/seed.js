import 'dotenv/config';
import { initDb, getDb } from './init.js';
import { nanoid } from 'nanoid';

initDb();
const db = getDb();

const users = [
  { name: 'Aarush Bharti', email: 'aarush@example.com' },
  { name: 'Priya Sharma', email: 'priya@example.com' },
  { name: 'Rohan Mehta', email: 'rohan@example.com' },
  { name: 'Sara Kapoor', email: 'sara@example.com' },
];

const userIds = users.map((u) => {
  const id = nanoid(10);
  db.prepare(
    'INSERT OR IGNORE INTO users (id, name, email, xp, level) VALUES (?, ?, ?, ?, ?)'
  ).run(id, u.name, u.email, Math.floor(Math.random() * 1500), 1);
  return id;
});

const cats = ['pothole', 'streetlight', 'water', 'waste', 'infrastructure'];
const samples = [
  { title: 'Massive pothole on MG Road', cat: 'pothole', lat: 28.6139, lng: 77.209 },
  { title: 'Streetlight out at Sector 14', cat: 'streetlight', lat: 28.6219, lng: 77.215 },
  { title: 'Water leak near park gate', cat: 'water', lat: 28.6079, lng: 77.219 },
  { title: 'Garbage piling at corner', cat: 'waste', lat: 28.6159, lng: 77.205 },
  { title: 'Cracked pavement, hazard', cat: 'infrastructure', lat: 28.6189, lng: 77.211 },
  { title: 'Open manhole — DANGER', cat: 'infrastructure', lat: 28.6109, lng: 77.221 },
];

samples.forEach((s, i) => {
  const id = nanoid(10);
  db.prepare(
    `INSERT INTO issues (id, title, description, category, severity, lat, lng, address, reporter_id, ai_summary)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    s.title,
    `Reported by community member. Needs attention.`,
    s.cat,
    Math.ceil(Math.random() * 5),
    s.lat,
    s.lng,
    'New Delhi, India',
    userIds[i % userIds.length],
    `AI-flagged ${s.cat} issue. Recommended action: dispatch civic team.`
  );
});

console.log(`✅ Seeded ${users.length} users and ${samples.length} issues`);
