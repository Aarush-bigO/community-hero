import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import { api } from '../utils/api';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    api.users.leaderboard().then(setUsers).catch(() => {});
    api.users.badges().then(setBadges).catch(() => {});
  }, []);

  return (
    <main className="page">
      <div className="page-wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="eyebrow">COMMUNITY</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-2 text-white">
            Community <span className="gradient-text">Heroes</span>
          </h1>
          <p className="text-slate-400">The most active citizens making cities better.</p>
        </motion.div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 items-end">
          {[1, 0, 2].map((rankIdx) => {
            const u = users[rankIdx];
            const heights = [120, 160, 100];
            const icons = [<Medal className="w-5 h-5" />, <Trophy className="w-5 h-5" />, <Award className="w-5 h-5" />];
            // Restrained metallic accent for ranks 1/2/3 only — thin ring + text.
            const accents = [
              'ring-slate-300/40 text-slate-300',
              'ring-amber-300/50 text-amber-300',
              'ring-orange-300/40 text-orange-300',
            ];
            return (
              <motion.div
                key={rankIdx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rankIdx * 0.15 }}
                className="flex flex-col items-center"
              >
                <div className={`icon-tile w-16 h-16 md:w-20 md:h-20 rounded-full ring-2 ${accents[rankIdx]} mb-3`}>
                  {icons[rankIdx]}
                </div>
                <div className="font-display font-bold truncate max-w-full text-center text-white">
                  {u?.name || '—'}
                </div>
                <div className="mb-3 flex items-center gap-1.5">
                  {u && <span className="chip">{u.xp} XP</span>}
                  {u && <span className="chip">L{u.level}</span>}
                </div>
                <div
                  className="w-full card !p-0 rounded-t-xl rounded-b-none flex items-end justify-center pb-3"
                  style={{ height: heights[rankIdx] }}
                >
                  <span className={`stat-num text-2xl ${accents[rankIdx]}`}>#{rankIdx + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full table */}
        <div className="card !p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03]">
              <tr className="text-left">
                <th className="px-5 py-3 font-medium text-slate-400">#</th>
                <th className="px-5 py-3 font-medium text-slate-400">Hero</th>
                <th className="px-5 py-3 font-medium text-slate-400">Level</th>
                <th className="px-5 py-3 font-medium text-slate-400">XP</th>
                <th className="px-5 py-3 font-medium text-slate-400">Reports</th>
                <th className="px-5 py-3 font-medium text-slate-400">Verifications</th>
                <th className="px-5 py-3 font-medium text-slate-400">Badges</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className="hairline hover:bg-white/[0.03] transition-colors">
                  <td className="px-5 py-3"><span className="stat-num tabular-nums">{i + 1}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="icon-tile w-8 h-8 rounded-full" />
                      <span className="font-medium text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="chip">L{u.level}</span>
                  </td>
                  <td className="px-5 py-3 font-mono tabular-nums text-slate-300">{u.xp}</td>
                  <td className="px-5 py-3 text-slate-300">{u.reports}</td>
                  <td className="px-5 py-3 text-slate-300">{u.verifications}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {u.badges?.length ? (
                        u.badges.map((bId) => {
                          const b = badges.find((x) => x.id === bId);
                          return (
                            <span key={bId} title={b?.name} className="text-base">
                              🏅
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    No heroes yet. Be the first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
