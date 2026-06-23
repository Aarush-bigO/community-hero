import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Users, Zap, Flag, ShieldCheck } from 'lucide-react';
import { api } from '../utils/api';
import { useCountUp } from '../hooks/useCountUp';

// XP curve mirrors backend: level = floor(sqrt(xp/100)) + 1
const levelFromXp = (xp) => Math.floor(Math.sqrt((Number(xp) || 0) / 100)) + 1;
const xpForLevel = (lvl) => 100 * Math.pow(lvl - 1, 2);
function levelProgress(xp, level) {
  const cur = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const pct = next > cur ? Math.min(100, Math.round(((xp - cur) / (next - cur)) * 100)) : 100;
  return { pct, toNext: Math.max(0, next - xp), next };
}

const AVATAR_TONES = ['#2fbbff', '#22d3ee', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#fb923c'];
const toneFor = (name = '') => AVATAR_TONES[(name.charCodeAt(0) || 0) % AVATAR_TONES.length];
const initials = (name = '?') => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

function Avatar({ name, size = 32, ring }) {
  const c = toneFor(name);
  return (
    <div className="grid place-items-center rounded-full font-display font-bold shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.4,
        background: `${c}22`, color: c, border: `1.5px solid ${ring || c}55`,
      }}>
      {initials(name)}
    </div>
  );
}

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    api.users.leaderboard().then(setUsers).catch(() => {});
    api.users.badges().then(setBadges).catch(() => {});
  }, []);

  const totals = users.reduce(
    (a, u) => ({
      xp: a.xp + (u.xp || 0),
      reports: a.reports + (u.reports || 0),
      verifs: a.verifs + (u.verifications || 0),
    }),
    { xp: 0, reports: 0, verifs: 0 }
  );
  const badgeName = (id) => badges.find((b) => b.id === id)?.name || id;

  return (
    <main className="page">
      <div className="page-wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="eyebrow">COMMUNITY</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-2 text-white">
            Community <span className="gradient-text">Heroes</span>
          </h1>
          <p className="text-slate-400">The most active citizens making cities better.</p>
        </motion.div>

        {/* Summary band */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <SummaryStat i={0} icon={<Users className="w-5 h-5" />} label="Heroes" value={users.length} />
          <SummaryStat i={1} icon={<Zap className="w-5 h-5" />} label="XP Awarded" value={totals.xp} />
          <SummaryStat i={2} icon={<Flag className="w-5 h-5" />} label="Reports Filed" value={totals.reports} />
          <SummaryStat i={3} icon={<ShieldCheck className="w-5 h-5" />} label="Verifications" value={totals.verifs} />
        </div>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 items-end">
          {[1, 0, 2].map((rankIdx) => {
            const u = users[rankIdx];
            const heights = [128, 168, 108];
            const icons = [<Medal className="w-5 h-5" />, <Trophy className="w-6 h-6" />, <Award className="w-5 h-5" />];
            const accents = ['text-slate-300', 'text-amber-300', 'text-orange-300'];
            const ring = ['#cbd5e1', '#fcd34d', '#fdba74'];
            const topBar = ['bg-slate-300/50', 'bg-amber-300/70', 'bg-orange-300/50'];
            const lvl = u ? levelFromXp(u.xp) : 1;
            const prog = u ? levelProgress(u.xp, lvl) : { pct: 0 };
            return (
              <motion.div key={rankIdx}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + rankIdx * 0.12, type: 'spring', stiffness: 90 }}
                className="flex flex-col items-center">
                <div className="relative mb-3">
                  {u && <Avatar name={u.name} size={rankIdx === 1 ? 76 : 60} ring={ring[rankIdx]} />}
                  <span className={`absolute -bottom-1 -right-1 grid place-items-center w-7 h-7 rounded-full bg-[#0a0f1e] border border-white/10 ${accents[rankIdx]}`}>
                    {icons[rankIdx]}
                  </span>
                  {rankIdx === 1 && (
                    <div className="absolute -inset-3 -z-10 rounded-full blur-2xl" style={{ background: 'rgba(252,211,77,0.18)' }} />
                  )}
                </div>
                <div className="font-display font-bold truncate max-w-full text-center text-white">{u?.name || '—'}</div>
                <div className="mb-3 flex items-center gap-1.5">
                  {u && <span className="chip">{u.xp} XP</span>}
                  {u && <span className="chip">L{lvl}</span>}
                </div>
                <div className="w-full rounded-t-xl border border-b-0 border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.01] flex flex-col items-center justify-end pb-3 relative overflow-hidden"
                  style={{ height: heights[rankIdx] }}>
                  <div className={`absolute top-0 inset-x-0 h-1 ${topBar[rankIdx]}`} />
                  <span className={`stat-num text-2xl ${accents[rankIdx]} mb-2`}>#{rankIdx + 1}</span>
                  {u && (
                    <div className="w-3/4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: ring[rankIdx] }}
                        initial={{ width: 0 }} animate={{ width: `${prog.pct}%` }}
                        transition={{ delay: 0.5 + rankIdx * 0.1, duration: 0.8 }} />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full table */}
        <div className="card !p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03]">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">#</th>
                <th className="px-5 py-3 font-medium">Hero</th>
                <th className="px-5 py-3 font-medium">Level &amp; Progress</th>
                <th className="px-5 py-3 font-medium text-right">XP</th>
                <th className="px-5 py-3 font-medium text-right">Reports</th>
                <th className="px-5 py-3 font-medium text-right">Verifs</th>
                <th className="px-5 py-3 font-medium">Badges</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const lvl = levelFromXp(u.xp);
                const prog = levelProgress(u.xp, lvl);
                const medal = ['🥇', '🥈', '🥉'][i];
                return (
                  <motion.tr key={u.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.5) }}
                    className="hairline hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3">
                      {medal ? <span className="text-lg">{medal}</span> : <span className="stat-num tabular-nums text-slate-400">{i + 1}</span>}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.name} size={32} />
                        <span className="font-medium text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <span className="chip shrink-0">L{lvl}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden min-w-[60px]">
                          <motion.div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                            initial={{ width: 0 }} animate={{ width: `${prog.pct}%` }}
                            transition={{ delay: 0.2 + Math.min(i * 0.04, 0.5), duration: 0.7 }} />
                        </div>
                        <span className="text-[10px] text-slate-500 tabular-nums w-16">{prog.toNext} to L{lvl + 1}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-mono tabular-nums text-white">{u.xp}</td>
                    <td className="px-5 py-3 text-right text-slate-300 tabular-nums">{u.reports}</td>
                    <td className="px-5 py-3 text-right text-slate-300 tabular-nums">{u.verifications}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {u.badges?.length ? (
                          u.badges.slice(0, 3).map((bId) => (
                            <span key={bId} className="chip !text-[10px] !px-2 text-brand-300 border-brand-400/20">
                              {badgeName(bId)}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                        {u.badges?.length > 3 && <span className="chip !text-[10px]">+{u.badges.length - 3}</span>}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {!users.length && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">No heroes yet. Be the first.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function SummaryStat({ i, icon, label, value }) {
  const n = useCountUp(value);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
      whileHover={{ y: -3 }} className="card card-hover">
      <div className="icon-tile mb-3">{icon}</div>
      <div className="stat-num text-3xl">{Math.round(n)}</div>
      <div className="text-slate-400 text-xs uppercase tracking-wide mt-1">{label}</div>
    </motion.div>
  );
}
