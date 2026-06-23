/**
 * Live passive-listening simulator.
 *
 * Zencity-style platforms ingest ~1M social/news items a day, score sentiment,
 * and surface topic trends. We obviously can't hit real firehoses in a demo, so
 * this generator emits realistic, sentiment-varied civic chatter on an interval,
 * scores it with the same sentiment engine the rest of the app uses, persists it
 * to `pulse_signals`, and pushes it live over the event bus. Enable with
 * PULSE_LIVE=true; tune cadence with PULSE_INTERVAL_MS.
 */
import { nanoid } from 'nanoid';
import { getDb } from '../db/init.js';
import { analyzeSentiment } from './sentiment.js';
import { publish, EVENTS } from './events.js';

const SOURCES = ['twitter', 'news', 'reddit'];
const AUTHORS = [
  '@delhi_commuter', '@mumbai_local', 'CivicWatch', 'r/india', '@road_safety_in',
  'LocalTimes', '@green_citizen', 'NeighbourhoodWatch', '@ward_42', 'CityDeskBot',
];

const TEMPLATES = [
  { topic: 'pothole', neg: 'Another massive pothole on {road} — my bike almost flipped. This is dangerous!', pos: 'Credit where due: the {road} pothole got fixed within a day. Great response!' },
  { topic: 'streetlight', neg: 'Whole stretch of {road} is pitch dark again. Streetlights out for a week now.', pos: 'Streetlights back on near {road}. Feels so much safer walking home.' },
  { topic: 'water', neg: 'Sewage overflowing near {road}, unbearable smell and totally unsafe.', pos: 'Water leak on {road} repaired fast, thanks to the crew.' },
  { topic: 'waste', neg: 'Garbage hasn’t been collected on {road} in days. Overflowing bins everywhere.', pos: 'Sanitation team cleaned up {road} this morning — spotless now.' },
  { topic: 'transport', neg: 'Traffic signal at {road} broken again, complete chaos at rush hour.', pos: 'New pedestrian crossing at {road} is a game changer.' },
  { topic: 'parks', neg: 'The park near {road} is filthy and the swings are broken.', pos: 'Loved the cleanup drive at the {road} park this weekend!' },
];

const ROADS = ['MG Road', 'Ring Road', 'Nehru Place', 'Marine Drive', 'Sector 18', 'Linking Road', 'Old Airport Rd'];
const MUNIS = ['demo-city', 'demo-city-2'];

function pick(arr, i) {
  return arr[Math.abs(i) % arr.length];
}

let tick = 0;

function makeSignal() {
  tick += 1;
  const tpl = pick(TEMPLATES, tick * 7);
  const road = pick(ROADS, tick * 3);
  // ~60% negative skew — civic chatter trends critical, like the real world.
  const negative = tick % 5 !== 0 && tick % 3 !== 0 ? true : tick % 2 === 0;
  const text = (negative ? tpl.neg : tpl.pos).replace('{road}', road);
  const sent = analyzeSentiment(text);
  return {
    id: nanoid(10),
    source: pick(SOURCES, tick * 2),
    author: pick(AUTHORS, tick * 5),
    text,
    url: null,
    lat: null,
    lng: null,
    municipality_id: pick(MUNIS, tick),
    topic: tpl.topic,
    sentiment: sent.score,
    sentiment_label: sent.label,
  };
}

export function injectSignal() {
  const s = makeSignal();
  const db = getDb();
  db.prepare(
    `INSERT INTO pulse_signals
      (id, source, author, text, url, lat, lng, municipality_id, topic, sentiment, sentiment_label)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(s.id, s.source, s.author, s.text, s.url, s.lat, s.lng, s.municipality_id, s.topic, s.sentiment, s.sentiment_label);
  publish(EVENTS.PULSE_SIGNAL, s);
  return s;
}

let timer = null;

export function startPulseGenerator() {
  if (process.env.PULSE_LIVE !== 'true') return;
  if (timer) return;
  const interval = Number(process.env.PULSE_INTERVAL_MS || 12_000);
  timer = setInterval(injectSignal, interval);
  if (timer.unref) timer.unref();
  console.log(`   ↳ City Pulse live feed ON (every ${interval}ms)`);
}

export function stopPulseGenerator() {
  if (timer) clearInterval(timer);
  timer = null;
}
