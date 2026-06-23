import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, Zap, Users, Trophy, Shield,
  Globe2, Languages, Radio, Layers, Building2, CheckCircle2,
} from 'lucide-react';
import HeroScene from '../scenes/HeroScene';
import { api } from '../utils/api';
import { useStore } from '../store/useStore';

export default function Landing() {
  const issues = useStore((s) => s.issues);
  const setIssues = useStore((s) => s.setIssues);
  const stats = useStore((s) => s.stats);
  const setStats = useStore((s) => s.setStats);

  useEffect(() => {
    api.issues.list().then(setIssues).catch(() => {});
    api.stats().then(setStats).catch(() => {});
  }, [setIssues, setStats]);

  return (
    <main className="relative">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24">
        {/* 3D scene fills viewport */}
        <div className="absolute inset-0">
          <HeroScene issues={issues} />
        </div>

        {/* Gradient overlay so text reads */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070b18]/30 to-[#070b18] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="chip mb-6 shine">
              <Sparkles className="w-3.5 h-3.5 text-brand-300" />
              <span>AI-powered civic platform</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
              Your city,{' '}
              <span className="gradient-text">in your hands.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-lg">
              Report potholes, broken streetlights, and water leaks with a tap. AI categorizes them, the community verifies them, and the city fixes them — transparently.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/report" className="btn-primary">
                Become a Hero <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/map" className="btn-ghost">
                Explore the Map
              </Link>
            </div>

            {stats && (
              <div className="grid grid-cols-3 gap-3 mt-10 max-w-md">
                <Stat label="Issues" value={stats.total} />
                <Stat label="Resolved" value={`${stats.resolutionRate}%`} />
                <Stat label="Heroes" value={stats.reporters} />
              </div>
            )}
          </motion.div>
          <div /> {/* right column reserved for the 3D background */}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 text-xs animate-bounce">
          ↓ Scroll to explore
        </div>
      </section>

      {/* STANDARDS / CREDIBILITY STRIP */}
      <section className="relative border-y border-white/5 bg-white/[0.015] py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-6">
            Speaks the protocols of production civic platforms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-slate-400">
            <Standard icon={<Building2 className="w-4 h-4" />} label="Open311 v2" />
            <Standard icon={<Layers className="w-4 h-4" />} label="GIS Asset Layer" />
            <Standard icon={<Radio className="w-4 h-4" />} label="Real-time SSE" />
            <Standard icon={<Shield className="w-4 h-4" />} label="SLA Tracking" />
            <Standard icon={<Languages className="w-4 h-4" />} label="4 Languages" />
            <Standard icon={<Globe2 className="w-4 h-4" />} label="Multi-tenant" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Built for <span className="gradient-text">action.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Six superpowers that turn citizens into agents of change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature
              icon={<Zap />}
              title="Snap & Report"
              text="Photo + GPS + voice = instant report. AI categorizes in under a second."
              gradient="from-brand-400 to-cyan-400"
            />
            <Feature
              icon={<Sparkles />}
              title="AI Triage"
              text="Severity scoring, duplicate detection, and smart routing to the right department."
              gradient="from-accent-400 to-pink-500"
            />
            <Feature
              icon={<Users />}
              title="Community Verify"
              text="Neighbours upvote and confirm. No spam, no noise — just signal."
              gradient="from-emerald-400 to-teal-500"
            />
            <Feature
              icon={<Shield />}
              title="Transparent Tracking"
              text="Every status update is public. From reported to resolved, in plain sight."
              gradient="from-amber-400 to-orange-500"
            />
            <Feature
              icon={<Trophy />}
              title="Earn XP & Badges"
              text="Rise through the ranks. The most active heroes get city-wide recognition."
              gradient="from-yellow-400 to-red-500"
            />
            <Feature
              icon={<Sparkles />}
              title="Predictive Insights"
              text="Hotspot forecasting helps cities stay ahead of problems, not behind them."
              gradient="from-indigo-400 to-fuchsia-500"
            />
            <Feature
              icon={<Sparkles />}
              title="AI Civic Assistant"
              text={'Ask "how many SLA breaches?" or "what is the sentiment trend?" — answers with cited sources.'}
              gradient="from-fuchsia-400 to-purple-600"
            />
            <Feature
              icon={<Sparkles />}
              title="City Pulse"
              text="Passive listening on social, news, and forums — sentiment-tagged in real time."
              gradient="from-rose-400 to-orange-500"
            />
            <Feature
              icon={<Sparkles />}
              title="Open311 Compatible"
              text="Drop-in for any city already speaking the Open311 standard. Multi-authority routing built in."
              gradient="from-cyan-400 to-blue-500"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto card text-center py-16 px-8 shine">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Be the change. <span className="gradient-text">Literally.</span>
          </h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            Every great city was built by people who refused to walk past the problem. Join them.
          </p>
          <Link to="/report" className="btn-primary text-base">
            Report your first issue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-white/5 bg-[#070b18]/60 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 grid place-items-center">
                  <Globe2 className="w-5 h-5 text-white" />
                </div>
                <span className="gradient-text font-display font-bold text-lg">Community Hero</span>
              </div>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                A hyperlocal civic platform that turns citizen reports into resolved
                work orders — with AI triage, community verification, and full transparency.
              </p>
              <div className="flex items-center gap-2 mt-4 text-xs text-emerald-300/80">
                <CheckCircle2 className="w-3.5 h-3.5" /> Open311-compatible · Multi-tenant
              </div>
            </div>

            <FooterCol
              title="Product"
              links={[
                ['Live Map', '/map'], ['City Pulse', '/pulse'],
                ['Dashboard', '/dashboard'], ['Report an Issue', '/report'],
              ]}
            />
            <FooterCol
              title="Platform"
              links={[
                ['Admin Portal', '/admin'], ['Leaderboard', '/leaderboard'],
                ['Open311 API', '/map'], ['Asset Layer', '/map'],
              ]}
            />
            <FooterCol
              title="Resources"
              links={[
                ['GitHub', 'https://github.com/Aarush-bigO/community-hero'],
                ['Architecture', 'https://github.com/Aarush-bigO/community-hero/blob/main/docs/ARCHITECTURE.md'],
                ['Open311 Spec', 'https://wiki.open311.org/GeoReport_v2/'],
              ]}
            />
          </div>

          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 Community Hero. Released under the MIT License.</p>
            <p className="flex items-center gap-4">
              <span>Built for stronger communities</span>
              <span className="flex items-center gap-1.5 text-emerald-300/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Systems operational
              </span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Standard({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-slate-300/80 hover:text-white transition">
      <span className="text-brand-300/80">{icon}</span>
      {label}
    </div>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            {href.startsWith('http') ? (
              <a href={href} target="_blank" rel="noreferrer" className="text-sm text-slate-400 hover:text-brand-300 transition">
                {label}
              </a>
            ) : (
              <Link to={href} className="text-sm text-slate-400 hover:text-brand-300 transition">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card !p-4">
      <div className="text-2xl font-bold gradient-text">{value}</div>
      <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function Feature({ icon, title, text, gradient }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card group cursor-default"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} grid place-items-center mb-4 shadow-lg`}>
        <span className="text-white">{icon}</span>
      </div>
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{text}</p>
    </motion.div>
  );
}
