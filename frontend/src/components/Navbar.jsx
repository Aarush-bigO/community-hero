import { Link, NavLink } from 'react-router-dom';
import { Globe2, Map, BarChart3, Trophy, Plus, Radio, Briefcase } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Navbar() {
  const user = useStore((s) => s.user);

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
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/map" className={link}>
            <Map className="w-4 h-4" /> Map
          </NavLink>
          <NavLink to="/pulse" className={link}>
            <Radio className="w-4 h-4" /> Pulse
          </NavLink>
          <NavLink to="/dashboard" className={link}>
            <BarChart3 className="w-4 h-4" /> Dashboard
          </NavLink>
          <NavLink to="/leaderboard" className={link}>
            <Trophy className="w-4 h-4" /> Heroes
          </NavLink>
          <NavLink to="/admin" className={link}>
            <Briefcase className="w-4 h-4" /> Admin
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/report" className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Report Issue
          </Link>
          {user ? (
            <div className="hidden sm:flex items-center gap-2 chip">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-accent-500" />
              <span className="font-medium">{user.name}</span>
              <span className="text-brand-300">L{user.level}</span>
            </div>
          ) : (
            <Link to="/onboard" className="btn-ghost text-sm">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
