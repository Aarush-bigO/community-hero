import { getDb } from '../db/init.js';

const ACTIONS = {
  REPORT: 50,
  VERIFY: 10,
  RESOLVE: 100,
  COMMENT: 5,
};

const BADGES = [
  { id: 'first_report', name: 'First Responder', threshold: 1, type: 'reports' },
  { id: 'reporter_10', name: 'Civic Sentinel', threshold: 10, type: 'reports' },
  { id: 'reporter_50', name: 'Community Hero', threshold: 50, type: 'reports' },
  { id: 'verifier_25', name: 'Truth Seeker', threshold: 25, type: 'verifications' },
  { id: 'level_5', name: 'Rising Star', threshold: 5, type: 'level' },
];

export function awardXp(userId, action) {
  if (!userId) return;
  const xp = ACTIONS[action] || 0;
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) return;

  const newXp = (user.xp || 0) + xp;
  const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;

  db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?').run(newXp, newLevel, userId);

  return { xp: newXp, level: newLevel, gained: xp };
}

export function checkBadges(userId) {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) return [];

  const reports =
    db.prepare('SELECT COUNT(*) as c FROM issues WHERE reporter_id = ?').get(userId)?.c || 0;
  const verifications =
    db.prepare('SELECT COUNT(*) as c FROM verifications WHERE user_id = ?').get(userId)?.c || 0;

  const earned = BADGES.filter((b) => {
    if (b.type === 'reports') return reports >= b.threshold;
    if (b.type === 'verifications') return verifications >= b.threshold;
    if (b.type === 'level') return user.level >= b.threshold;
    return false;
  });

  db.prepare('UPDATE users SET badges = ? WHERE id = ?').run(
    JSON.stringify(earned.map((b) => b.id)),
    userId
  );

  return earned;
}

export { BADGES, ACTIONS };
