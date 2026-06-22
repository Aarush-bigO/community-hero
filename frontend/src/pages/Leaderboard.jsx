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
    <main className="pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Community <span className="gradient-text">Heroes</span>
          </h1>
          <p className="text-slate-400">The most active citizens making cities better.</p>
        </motion.div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
          {[1, 0, 2].map((rankIdx) => {
            const u = users[rankIdx];
            const heights = [120, 160, 100];
            const icons = [<Medal />, <Trophy />, <Award />];
            const colors = [
              'from-slate-300 to-slate-500',
              'from-amber-300 to-yellow-500',
              'from-orange-400 to-amber-700',
            ];
            return (
              <motion.div
                key={rankIdx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rankIdx * 0.15 }}
                className="flex flex-col items-center"
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${colors[rankIdx]} grid place-items-center text-white shadow-2xl mb-3`}>
                  {icons[rankIdx]}
                </div>
                <div className="font-display font-bold truncate max-w-full text-center">
                  {u?.name || '—'}
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  {u ? `${u.xp} XP · L${u.level}` : ''}
                </div>
                <div
                  className={`w-full bg-gradient-to-t ${colors[rankIdx]} opacity-60 rounded-t-2xl flex items-end justify-center pb-3 font-display font-bold text-white text-2xl`}
                  style={{ height: heights[rankIdx] }}
                >
                  #{rankIdx + 1}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full table */}
        <div className="card !p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr className="text-left">
                <th className="px-5 py-3 font-medium text-slate-300">#</th>
                <th className="px-5 py-3 font-medium text-slate-300">Hero</th>
                <th className="px-5 py-3 font-medium text-slate-300">Level</th>
                <th className="px-5 py-3 font-medium text-slate-300">XP</th>
                <th className="px-5 py-3 font-medium text-slate-300">Reports</th>
                <th className="px-5 py-3 font-medium text-slate-300">Verifications</th>
                <th className="px-5 py-3 font-medium text-slate-300">Badges</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className="border-t border-white/5 hover:bg-white/5 transition">
                  <td className="px-5 py-3 font-mono text-slate-400">{i + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-500" />
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="chip bg-brand-500/15 border-brand-500/30 text-brand-200">L{u.level}</span>
                  </td>
                  <td className="px-5 py-3 font-mono">{u.xp}</td>
                  <td className="px-5 py-3">{u.reports}</td>
                  <td className="px-5 py-3">{u.verifications}</td>
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
