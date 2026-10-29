import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Users, Zap, Flag, ShieldCheck, Search } from 'lucide-react';
import { api } from '../utils/api';
import { useCountUp } from '../hooks/useCountUp';
import { useT } from '../i18n';

// XP curve mirrors backend: level = floor(sqrt(xp/100)) + 1
const levelFromXp = (xp) => Math.floor(Math.sqrt((Number(xp) || 0) / 100)) + 1;
const xpForLevel = (lvl) => 100 * Math.pow(lvl - 1, 2);
function levelProgress(xp, level) {
  const cur = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const pct = next > cur ? Math.min(100, Math.round(((xp - cur) / (next - cur)) * 100)) : 100;
  return { pct, toNext: Math.max(0, next - xp), next };
}

const AVATAR_TONES = ['#EAAA00', '#DDE3E8', '#AA4C9F', '#FFC425', '#C2CBD2', '#7B2271', '#FFE26B'];
const toneFor = (name = '') => AVATAR_TONES[(name.charCodeAt(0) || 0) % AVATAR_TONES.length];
const initials = (name = '?') => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

function Avatar({ name, size = 32, ring }) {
  const c = toneFor(name);
  return (
    <div
      className="grid place-items-center rounded-full font-display font-extrabold shrink-0 select-none shadow-lg tracking-wider"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `radial-gradient(circle at 35% 30%, ${c}40, ${c}15 70%, #0D0F14 100%)`,
        color: c,
        border: `2px solid ${ring || c}66`,
        boxShadow: ring ? `0 0 20px ${ring}44` : `0 0 10px ${c}22`,
      }}
    >
      {initials(name)}
    </div>
  );
}

export default function Leaderboard() {
  const t = useT();
  const [users, setUsers] = useState([]);
  const [badges, setBadges] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const pageSize = 50;

  useEffect(() => {
    api.users
      .leaderboard()
      .then((data) => {
        setUsers(data.map((u, idx) => ({ ...u, rank: idx + 1 })));
      })
      .catch(() => { });
    api.users.badges().then(setBadges).catch(() => { });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, filterTier]);

  const totals = users.reduce(
    (a, u) => ({
      xp: a.xp + (u.xp || 0),
      reports: a.reports + (u.reports || 0),
      verifs: a.verifs + (u.verifications || 0),
    }),
    { xp: 0, reports: 0, verifs: 0 }
  );

  const filteredUsers = users.filter((u) => {
    if (filterTier === 'top10' && u.rank > 10) return false;
    if (filterTier === 'top50' && u.rank > 50) return false;
    if (filterTier === 'veterans' && levelFromXp(u.xp) < 5) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(q) ||
      `#${u.rank}`.includes(q) ||
      String(u.xp).includes(q)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const displayedUsers = showAll
    ? filteredUsers
    : filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const badgeName = (id) => badges.find((b) => b.id === id)?.name || id;

  return (
    <main className="page">
      <div className="page-wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="eyebrow">{t('leaderboard.eyebrow')}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-2 text-white">
            {t('leaderboard.title1')} <span className="gradient-text">{t('leaderboard.title2')}</span>
          </h1>
          <p className="text-slate-400">{t('leaderboard.sub')}</p>
        </motion.div>

        {/* Summary band */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <SummaryStat i={0} icon={<Users className="w-5 h-5 text-marigold-400" />} label="Heroes" value={users.length} accent="feature-card-marigold" />
          <SummaryStat i={1} icon={<Zap className="w-5 h-5 text-aubergine-300" />} label="XP Awarded" value={totals.xp} accent="feature-card-aubergine" />
          <SummaryStat i={2} icon={<Flag className="w-5 h-5 text-silver-200" />} label="Reports Filed" value={totals.reports} accent="feature-card-silver" />
          <SummaryStat i={3} icon={<ShieldCheck className="w-5 h-5 text-marigold-400" />} label="Verifications" value={totals.verifs} accent="feature-card-marigold" />
        </div>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-12 items-end max-w-4xl mx-auto">
          {[1, 0, 2].map((rankIdx) => {
            const u = users[rankIdx];
            const RANK_CONFIG = {
              0: {
                height: 185,
                title: '👑 CHAMPION',
                rankNum: '#1',
                avatarSize: 84,
                accent: 'text-marigold-300',
                ring: '#EAAA00',
                glowStyle: 'border-marigold-400/60 bg-gradient-to-b from-marigold-500/20 via-[#12151D] to-[#08090C] shadow-[0_0_40px_rgba(234,170,0,0.25)] ring-1 ring-marigold-400/40',
                icon: <Trophy className="w-6 h-6 text-marigold-300" />,
                isChamp: true,
              },
              1: {
                height: 135,
                title: '2ND PLACE',
                rankNum: '#2',
                avatarSize: 64,
                accent: 'text-silver-200',
                ring: '#DDE3E8',
                glowStyle: 'border-silver-400/40 bg-gradient-to-b from-silver-400/15 via-[#12151D] to-[#08090C] shadow-[0_0_30px_rgba(221,227,232,0.15)]',
                icon: <Medal className="w-5 h-5 text-silver-100" />,
                isChamp: false,
              },
              2: {
                height: 115,
                title: '3RD PLACE',
                rankNum: '#3',
                avatarSize: 64,
                accent: 'text-aubergine-300',
                ring: '#AA4C9F',
                glowStyle: 'border-aubergine-400/40 bg-gradient-to-b from-aubergine-500/25 via-[#12151D] to-[#08090C] shadow-[0_0_30px_rgba(170,76,159,0.20)]',
                icon: <Award className="w-5 h-5 text-aubergine-300" />,
                isChamp: false,
              },
            };
            const cfg = RANK_CONFIG[rankIdx];
            const lvl = u ? levelFromXp(u.xp) : 1;
            const prog = u ? levelProgress(u.xp, lvl) : { pct: 0 };

            return (
              <motion.div
                key={u ? u.id : rankIdx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + rankIdx * 0.12, type: 'spring', stiffness: 90 }}
                className="flex flex-col items-center w-full"
              >
                <div
                  className={`w-full rounded-2xl border flex flex-col items-center justify-between p-4 relative overflow-hidden backdrop-blur-xl ${cfg.glowStyle}`}
                  style={{ minHeight: cfg.height + 70 }}
                >
                  <div className="flex flex-col items-center w-full pt-1">
                    <div className="relative mb-2.5">
                      {u && <Avatar name={u.name} size={cfg.avatarSize} ring={cfg.ring} />}
                      <span className={`absolute -bottom-1 -right-1 grid place-items-center w-7 h-7 rounded-full bg-[#1c071a] border border-white/20 shadow-lg ${cfg.accent}`}>
                        {cfg.icon}
                      </span>
                      {cfg.isChamp && (
                        <div className="absolute -inset-4 -z-10 rounded-full blur-2xl bg-marigold-400/25 animate-pulse" />
                      )}
                    </div>

                    <div className="font-display font-bold text-sm md:text-base text-center text-silver-100 max-w-full truncate px-1">
                      {u?.name || '—'}
                    </div>

                    <div className="mt-1.5 mb-2 flex items-center gap-1.5 flex-wrap justify-center">
                      {u && (
                        <span className="chip text-[11px] font-mono font-bold bg-[#08090C] border-marigold-500/30 text-marigold-300">
                          {u.xp} XP
                        </span>
                      )}
                      {u && (
                        <span className="chip text-[11px] font-mono bg-[#08090C] border-silver-400/30 text-silver-200">
                          L{lvl}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full flex flex-col items-center pt-2.5 border-t border-white/10 mt-2">
                    <span className={`text-[10px] font-mono font-extrabold uppercase tracking-widest ${cfg.accent} mb-0.5`}>
                      {cfg.title}
                    </span>
                    <span className={`stat-num text-3xl font-black ${cfg.accent} mb-1.5`}>
                      {cfg.rankNum}
                    </span>
                    {u && (
                      <div className="w-full h-1.5 rounded-full bg-[#140513] border border-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: cfg.ring }}
                          initial={{ width: 0 }}
                          animate={{ width: `${prog.pct}%` }}
                          transition={{ delay: 0.3 + rankIdx * 0.1, duration: 0.8 }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search 200 heroes by name or rank (e.g., Arjun, Priya, #42)..."
              className="w-full pl-10 pr-16 py-2.5 bg-[#0D0F14]/90 border border-white/10 rounded-xl text-sm text-silver-100 placeholder-silver-500 focus:outline-none focus:border-marigold-500/60 focus:ring-1 focus:ring-marigold-500/40 transition font-sans"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono uppercase tracking-wider text-silver-400 hover:text-white px-1.5 py-0.5 rounded bg-white/10"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: `All (${users.length})` },
              { id: 'top10', label: 'Top 10' },
              { id: 'top50', label: 'Top 50' },
              { id: 'veterans', label: 'Level 5+' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilterTier(tab.id);
                  setPage(1);
                }}
                className={`chip text-xs px-3 py-1.5 rounded-lg font-mono transition cursor-pointer ${
                  filterTier === tab.id
                    ? 'bg-marigold-500/20 text-marigold-300 border-marigold-400/50 shadow-[0_0_12px_rgba(234,170,0,0.25)]'
                    : 'bg-[#12151D]/70 text-silver-400 border-white/5 hover:text-silver-100 hover:border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <span className="text-xs font-mono text-silver-500 ml-2 hidden lg:inline whitespace-nowrap">
              Showing {filteredUsers.length} of {users.length}
            </span>
          </div>
        </div>

        {/* Full table */}
        <div className="card !p-0 overflow-hidden border border-white/10 bg-[#0D0F14]/90 shadow-2xl backdrop-blur-2xl rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-[#12151D]/90 border-b border-white/10">
              <tr className="text-left text-xs uppercase tracking-wider text-silver-400 font-mono">
                <th className="px-5 py-3.5 font-semibold">Rank</th>
                <th className="px-5 py-3.5 font-semibold">Community Hero</th>
                <th className="px-5 py-3.5 font-semibold">Level &amp; XP Track</th>
                <th className="px-5 py-3.5 font-semibold text-right">Total XP</th>
                <th className="px-5 py-3.5 font-semibold text-right">Reports</th>
                <th className="px-5 py-3.5 font-semibold text-right">Verifications</th>
                <th className="px-5 py-3.5 font-semibold">Honors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayedUsers.map((u, i) => {
                const lvl = levelFromXp(u.xp);
                const prog = levelProgress(u.xp, lvl);
                const medal = u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : null;
                return (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className="hover:bg-marigold-500/[0.04] transition-colors font-sans"
                  >
                    <td className="px-5 py-3.5 font-mono">
                      {medal ? (
                        <span className="text-xl inline-block drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{medal}</span>
                      ) : (
                        <span className="stat-num tabular-nums text-silver-400 font-bold">#{u.rank}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size={34} />
                        <span className="font-semibold text-silver-100 group-hover:text-marigold-300 transition">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 min-w-[170px]">
                      <div className="flex items-center gap-2.5 font-mono text-xs">
                        <span className="chip py-0.5 px-2 bg-[#08090C] border-silver-400/30 text-silver-200 font-bold shrink-0">
                          L{lvl}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-[#08090C] border border-white/10 overflow-hidden min-w-[70px]">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-aubergine-400 via-marigold-400 to-[#FFD12E]"
                            initial={{ width: 0 }}
                            animate={{ width: `${prog.pct}%` }}
                            transition={{ delay: 0.15 + Math.min(i * 0.02, 0.3), duration: 0.6 }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-marigold-400">
                      {u.xp}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-silver-300">
                      {u.reports || 0}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-silver-300">
                      {u.verifications || 0}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {u.badges?.length ? (
                          u.badges.slice(0, 3).map((bId) => (
                            <span key={bId} className="chip !text-[10px] !px-2 bg-aubergine-900/60 text-aubergine-200 border-aubergine-700/50 font-mono">
                              {badgeName(bId)}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-silver-600 font-mono">—</span>
                        )}
                        {u.badges?.length > 3 && (
                          <span className="chip !text-[10px] bg-[#08090C] border-white/10 text-silver-400 font-mono">
                            +{u.badges.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {!displayedUsers.length && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-mono text-xs">
                    {search ? `No heroes matching "${search}"` : 'No community heroes found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {filteredUsers.length > pageSize && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-slate-800/80 bg-slate-900/40 font-mono text-xs">
              <div className="text-slate-400">
                Showing{' '}
                <span className="text-white font-bold">
                  {showAll ? 1 : (page - 1) * pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="text-white font-bold">
                  {showAll ? filteredUsers.length : Math.min(page * pageSize, filteredUsers.length)}
                </span>{' '}
                of <span className="text-cyan-300 font-bold">{filteredUsers.length}</span> Heroes
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  {showAll ? `Paginate (50/page)` : `Show All ${filteredUsers.length}`}
                </button>

                {!showAll && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 transition"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pNum = idx + 1;
                      return (
                        <button
                          key={pNum}
                          onClick={() => setPage(pNum)}
                          className={`w-7 h-7 rounded grid place-items-center transition ${
                            page === pNum
                              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                              : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          {pNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function SummaryStat({ i, icon, label, value, accent = '' }) {
  const n = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06 }}
      whileHover={{ y: -3 }}
      className={`card card-hover border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl relative overflow-hidden ${accent}`}
    >
      <div className="icon-tile mb-3 bg-slate-900/80 border-slate-800">{icon}</div>
      <div className="stat-num text-3xl font-black text-white">{Math.round(n)}</div>
      <div className="text-slate-400 text-xs font-mono uppercase tracking-wider mt-1">{label}</div>
    </motion.div>
  );
}
