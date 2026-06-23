import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = process.env.DB_PATH || './data/community-hero.db';

let db;

export function getDb() {
  if (!db) initDb();
  return db;
}

export function initDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      avatar_url TEXT,
      role TEXT DEFAULT 'citizen',
      municipality_id TEXT DEFAULT 'demo-city',
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      badges TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS municipalities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT,
      bbox TEXT,
      contact_email TEXT,
      open311_jurisdiction_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      municipality_id TEXT NOT NULL,
      name TEXT NOT NULL,
      categories TEXT DEFAULT '[]',
      sla_hours INTEGER DEFAULT 72,
      contact_email TEXT,
      FOREIGN KEY (municipality_id) REFERENCES municipalities(id)
    );

    CREATE TABLE IF NOT EXISTS issues (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      severity INTEGER DEFAULT 3,
      status TEXT DEFAULT 'reported',
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      address TEXT,
      photo_url TEXT,
      reporter_id TEXT,
      municipality_id TEXT DEFAULT 'demo-city',
      department_id TEXT,
      assignee_id TEXT,
      sla_due_at TEXT,
      ai_tags TEXT DEFAULT '[]',
      ai_summary TEXT,
      sentiment REAL DEFAULT 0,
      sentiment_label TEXT DEFAULT 'neutral',
      resolution_photo_url TEXT,
      resolution_note TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (reporter_id) REFERENCES users(id),
      FOREIGN KEY (municipality_id) REFERENCES municipalities(id),
      FOREIGN KEY (department_id) REFERENCES departments(id),
      FOREIGN KEY (assignee_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS verifications (
      id TEXT PRIMARY KEY,
      issue_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      vote INTEGER NOT NULL,
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(issue_id, user_id),
      FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS status_updates (
      id TEXT PRIMARY KEY,
      issue_id TEXT NOT NULL,
      status TEXT NOT NULL,
      note TEXT,
      author TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pulse_signals (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      author TEXT,
      text TEXT NOT NULL,
      url TEXT,
      lat REAL,
      lng REAL,
      municipality_id TEXT DEFAULT 'demo-city',
      sentiment REAL DEFAULT 0,
      sentiment_label TEXT DEFAULT 'neutral',
      topic TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
    CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
    CREATE INDEX IF NOT EXISTS idx_issues_geo ON issues(lat, lng);
    CREATE INDEX IF NOT EXISTS idx_issues_muni ON issues(municipality_id);
    CREATE INDEX IF NOT EXISTS idx_issues_dept ON issues(department_id);
    CREATE INDEX IF NOT EXISTS idx_verifications_issue ON verifications(issue_id);
    CREATE INDEX IF NOT EXISTS idx_pulse_muni ON pulse_signals(municipality_id);
    CREATE INDEX IF NOT EXISTS idx_pulse_topic ON pulse_signals(topic);
  `);

  // --- Additive migrations (GIS asset layer + i18n). Safe to run repeatedly. ---
  ensureColumn(db, 'issues', 'road_type', "TEXT DEFAULT 'unmapped'");
  ensureColumn(db, 'issues', 'nearest_road', 'TEXT');
  ensureColumn(db, 'issues', 'on_private_road', 'INTEGER DEFAULT 0');
  ensureColumn(db, 'issues', 'duplicate_of', 'TEXT');
  ensureColumn(db, 'issues', 'lang', "TEXT DEFAULT 'en'");

  console.log(`📦 SQLite ready at ${DB_PATH}`);
  return db;
}

/** Add a column only if it doesn't already exist (idempotent migration). */
function ensureColumn(db, table, column, definition) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  initDb();
}
