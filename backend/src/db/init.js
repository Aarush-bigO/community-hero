import Database from 'better-sqlite3';
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

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      avatar_url TEXT,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      badges TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
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
      ai_tags TEXT DEFAULT '[]',
      ai_summary TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (reporter_id) REFERENCES users(id)
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

    CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
    CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
    CREATE INDEX IF NOT EXISTS idx_issues_geo ON issues(lat, lng);
    CREATE INDEX IF NOT EXISTS idx_verifications_issue ON verifications(issue_id);
  `);

  console.log(`📦 SQLite ready at ${DB_PATH}`);
  return db;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  initDb();
}
