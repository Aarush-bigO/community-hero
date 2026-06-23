import { Link, NavLink } from 'react-router-dom';
import { Globe2, Map, BarChart3, Trophy, Plus, Radio, Briefcase, Languages } from 'lucide-react';
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
      isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto glass-strong rounded-2xl flex items-center justify-between px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 grid place-items-center shadow-lg shadow-brand-500/40">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-text text-lg">Community Hero</span>
          {/* Real-time connection indicator */}
          <span
            title={liveConnected ? 'Live updates connected' : 'Reconnecting…'}
            className={`hidden sm:flex items-center gap-1 ml-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              liveConnected
                ? 'bg-emerald-500/15 text-emerald-300'
                : 'bg-slate-500/15 text-slate-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${liveConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            {t('nav.live')}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
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

        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="hidden sm:flex items-center gap-1.5 chip !py-1">
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-sm text-slate-200 outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900">
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>

          <Link to="/report" className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> {t('nav.report')}
          </Link>
          {user ? (
            <div className="hidden sm:flex items-center gap-2 chip">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-accent-500" />
              <span className="font-medium">{user.name}</span>
              <span className="text-brand-300">L{user.level}</span>
            </div>
          ) : (
            <Link to="/onboard" className="btn-ghost text-sm">
              {t('nav.signin')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
