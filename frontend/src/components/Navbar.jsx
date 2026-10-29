import { Link, NavLink } from 'react-router-dom';
import { Map, BarChart3, Trophy, Plus, Radio, Briefcase, Languages, LogIn } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useStore } from '../store/useStore';
import { useT, useLang, LANGUAGES } from '../i18n';

export default function Navbar() {
  const user = useStore((s) => s.user);
  const liveConnected = useStore((s) => s.liveConnected);
  const t = useT();
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);

  const link = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
      isActive
        ? 'bg-white/[0.08] text-marigold-300 border border-marigold-400/40 shadow-sm'
        : 'text-silver-300 hover:bg-white/5 hover:text-silver-100'
    }`;

  return (
    <nav className="fixed top-0 inset-x-0 z-[10000] px-6 py-3">
      <div className="max-w-7xl mx-auto glass-strong rounded-2xl flex items-center justify-between px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold group">
          <BrandLogo size={36} />
          <span className="gradient-text text-lg tracking-tight">Community Hero</span>
          {/* Real-time connection indicator */}
          <span
            title={liveConnected ? 'Live updates connected' : 'Reconnecting…'}
            className={`hidden sm:flex items-center gap-1 ml-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              liveConnected
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-silver-500/15 text-silver-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${liveConnected ? 'bg-emerald-400 animate-pulse' : 'bg-silver-500'}`} />
            {t('nav.live')}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/dispatch" className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition ${
              isActive
                ? 'bg-aubergine-700/80 text-marigold-300 border border-marigold-500/40 shadow-sm'
                : 'text-silver-300 hover:bg-white/[0.06] hover:text-silver-100 border border-transparent'
            }`
          }>
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marigold-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-marigold-400" />
            </span>
            {t('nav.cockpit')}
          </NavLink>
          <NavLink to="/map" className={link}>
            <Map className="w-4 h-4" /> {t('nav.map')}
          </NavLink>
          <NavLink to="/pulse" className={link}>
            <Radio className="w-4 h-4" /> {t('nav.pulse')}
          </NavLink>
          <NavLink to="/dashboard" className={link}>
            <BarChart3 className="w-4 h-4" /> {t('nav.dashboard')}
          </NavLink>
          <NavLink to="/leaderboard" className={link}>
            <Trophy className="w-4 h-4" /> {t('nav.heroes')}
          </NavLink>
          <NavLink to="/admin" className={link}>
            <Briefcase className="w-4 h-4" /> {t('nav.admin')}
          </NavLink>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language switcher */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-marigold-400/40 transition">
            <Languages className="w-3.5 h-3.5 text-marigold-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-xs font-semibold text-silver-200 outline-none cursor-pointer pr-1"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#12151D] text-silver-100">
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/report"
            className="btn-primary text-xs font-bold shrink-0 !py-2 !px-4"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" /> <span>{t('nav.report')}</span>
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-marigold-400 to-aubergine-600 shadow-sm" />
              <span className="font-semibold text-xs text-silver-100">{user.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-marigold-500/20 text-marigold-300 border border-marigold-400/30">
                L{user.level}
              </span>
            </div>
          ) : (
            <Link
              to="/onboard"
              className="hidden sm:inline-flex shrink-0 items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                         bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/[0.12] text-silver-200
                         hover:text-white hover:border-marigold-400/40 hover:bg-white/[0.09] hover:shadow-[0_0_18px_rgba(234,170,0,0.25)]
                         active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 text-marigold-400" />
              <span>{t('nav.signin')}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
