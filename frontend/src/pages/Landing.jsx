import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, Zap, Users, Trophy, Shield,
  Globe2, Languages, Radio, Layers, Building2, CheckCircle2,
  Mail, Linkedin, Compass, Eye, Cpu, BellRing,
} from 'lucide-react';
import HeroScene from '../scenes/HeroScene';
import VoiceDispatchCockpit from '../components/VoiceDispatchCockpit';
import { api } from '../utils/api';
import { useStore } from '../store/useStore';
import { useT, useLang, LANGUAGES } from '../i18n';

export default function Landing() {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
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
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        {/* 3D scene fills viewport */}
        <div className="absolute inset-0">
          <HeroScene issues={issues} />
        </div>

        {/* Ambient radial glow mesh */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#08090C]/50 to-[#08090C] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-marigold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Holographic Hero Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 shine bg-gradient-to-r from-marigold-500/15 via-aubergine-500/25 to-marigold-400/15 border border-marigold-400/40 text-marigold-300 text-xs font-semibold shadow-[0_0_20px_-3px_rgba(234,170,0,0.35)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marigold-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-marigold-400" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-marigold-300" />
              <span>{t('landing.badge')}</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.04] tracking-tight mb-6">
              {t('landing.hero.headline1')}{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-silver-300 via-silver-100 to-marigold-400 drop-shadow-[0_0_35px_rgba(234,170,0,0.35)]">
                {t('landing.hero.headline2')}
              </span>
            </h1>

            <p className="text-lg text-silver-300/90 mb-8 max-w-lg leading-relaxed">
              {t('landing.hero.sub')}
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                to="/dispatch"
                className="btn-primary !bg-gradient-to-r !from-[#FFC425] !via-[#EAAA00] !to-[#C79000] !text-[#08090C] shadow-[0_4px_25px_rgba(234,170,0,0.45)] hover:shadow-[0_6px_35px_rgba(234,170,0,0.65)] hover:scale-[1.02] !py-3 !px-6 text-sm font-bold transition-all"
              >
                {t('landing.cta.cockpit')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/report"
                className="btn-ghost !border-silver-300/20 !bg-silver-300/[0.04] hover:!bg-silver-300/[0.09] hover:!border-marigold-400/50 !py-3 !px-5 text-sm font-semibold transition-all"
              >
                {t('landing.cta.hero')}
              </Link>
              <Link
                to="/map"
                className="btn-ghost !border-silver-300/20 !bg-silver-300/[0.04] hover:!bg-silver-300/[0.09] hover:!border-marigold-400/50 !py-3 !px-5 text-sm font-semibold transition-all"
              >
                {t('landing.cta.map')}
              </Link>
            </div>

            {stats && (
              <div className="grid grid-cols-3 gap-3.5 mt-10 max-w-lg">
                <Stat
                  label={t('landing.stat.issues')}
                  value={stats.total}
                  trend="+18% sync"
                  accent="#EAAA00"
                />
                <Stat
                  label={t('landing.stat.resolved')}
                  value={`${stats.resolutionRate}%`}
                  trend="94% in SLA"
                  accent="#DDE3E8"
                />
                <Stat
                  label={t('landing.stat.heroes')}
                  value={stats.reporters}
                  trend="Active swarm"
                  accent="#AA4C9F"
                />
              </div>
            )}
          </motion.div>
          <div /> {/* right column reserved for the 3D background */}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 text-xs flex items-center gap-1.5 animate-bounce">
          <span>{t('landing.scroll')}</span>
        </div>
      </section>

      {/* BOLNA VOICE AI DISPATCH COCKPIT SECTION */}
      <section id="cockpit" className="relative z-10 py-20 px-6 bg-gradient-to-b from-[#08090C] via-[#0D0F14] to-[#08090C] border-t border-white/[0.06] scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-marigold-500/10 border border-marigold-500/30 text-marigold-300 mb-3">
                <Radio className="w-3.5 h-3.5 text-marigold-400 animate-pulse" />
                <span>{t('landing.cockpit.badge')}</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-silver-100">
                {t('landing.cockpit.title1')} <span className="gradient-text">{t('landing.cockpit.title2')}</span>
              </h2>
              <p className="text-silver-400 text-sm mt-1.5 max-w-2xl leading-relaxed">
                {t('landing.cockpit.sub')}
              </p>
            </div>
            <Link
              to="/dispatch"
              className="group inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-semibold text-silver-100 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-marigold-400/50 transition-all duration-200 shadow-xl shadow-black/40 hover:shadow-[0_0_20px_rgba(234,170,0,0.25)]"
            >
              <span>{t('landing.cockpit.launch')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-marigold-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="rounded-3xl bg-[#0D0F14]/90 border border-white/[0.08] p-2 md:p-3 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.95)] backdrop-blur-2xl relative overflow-hidden">
            <VoiceDispatchCockpit />
          </div>
        </div>
      </section>

      {/* STANDARDS / CREDIBILITY STRIP */}
      <section className="relative hairline border-x-0 bg-white/[0.015] py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow text-center mb-6">
            {t('landing.standards.label')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-slate-300">
            <Standard icon={<Building2 className="w-4 h-4 text-cyan-400" />} label="Open311 v2" />
            <Standard icon={<Layers className="w-4 h-4 text-indigo-400" />} label="GIS Asset Layer" />
            <Standard icon={<Radio className="w-4 h-4 text-emerald-400" />} label="Real-time SSE" />
            <Standard icon={<Shield className="w-4 h-4 text-amber-400" />} label="SLA Tracking" />
            <Standard icon={<Languages className="w-4 h-4 text-sky-400" />} label="4 Languages (Bilingual)" />
            <Standard icon={<Globe2 className="w-4 h-4 text-violet-400" />} label="Multi-tenant Civic Protocol" />
          </div>
        </div>
      </section>

      {/* FEATURES BENTO GRID */}
      <section className="relative py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">{t('landing.features.eyebrow')}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">
              {t('landing.features.title1')} <span className="gradient-text">{t('landing.features.title2')}</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
              {t('landing.features.sub')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature
              accent="cyan"
              icon={<Zap className="w-5 h-5" />}
              title={t('feature.snap.title')}
              text={t('feature.snap.text')}
            />
            <Feature
              accent="violet"
              icon={<Cpu className="w-5 h-5" />}
              title={t('feature.triage.title')}
              text={t('feature.triage.text')}
            />
            <Feature
              accent="emerald"
              icon={<Users className="w-5 h-5" />}
              title={t('feature.community.title')}
              text={t('feature.community.text')}
            />
            <Feature
              accent="amber"
              icon={<Shield className="w-5 h-5" />}
              title={t('feature.tracking.title')}
              text={t('feature.tracking.text')}
            />
            <Feature
              accent="yellow"
              icon={<Trophy className="w-5 h-5" />}
              title={t('feature.xp.title')}
              text={t('feature.xp.text')}
            />
            <Feature
              accent="sky"
              icon={<Compass className="w-5 h-5" />}
              title={t('feature.insights.title')}
              text={t('feature.insights.text')}
            />
            <Feature
              accent="indigo"
              icon={<Sparkles className="w-5 h-5" />}
              title={t('feature.assistant.title')}
              text={t('feature.assistant.text')}
            />
            <Feature
              accent="rose"
              icon={<Radio className="w-5 h-5" />}
              title={t('feature.pulse.title')}
              text={t('feature.pulse.text')}
            />
            <Feature
              accent="teal"
              icon={<Eye className="w-5 h-5" />}
              title={t('feature.open311.title')}
              text={t('feature.open311.text')}
            />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto card text-center py-16 px-8 relative overflow-hidden border border-marigold-400/35 shadow-[0_0_50px_-10px_rgba(234,170,0,0.25)] bg-gradient-to-b from-[#12151D]/90 to-[#08090C]">
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-marigold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-aubergine-500/20 rounded-full blur-3xl pointer-events-none" />

          <p className="eyebrow mb-3">{t('landing.cta2.eyebrow')}</p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4 text-silver-100">
            {t('landing.cta2.title1')} <span className="gradient-text">{t('landing.cta2.title2')}</span>
          </h2>
          <p className="text-silver-300 mb-8 max-w-lg mx-auto text-sm md:text-base">
            {t('landing.cta2.sub')}
          </p>
          <Link
            to="/report"
            className="btn-primary text-base !py-3.5 !px-8 !bg-gradient-to-r !from-[#FFC425] !via-[#EAAA00] !to-[#C79000] !text-[#08090C] font-bold shadow-[0_0_30px_rgba(234,170,0,0.55)] hover:scale-[1.03] transition-all"
          >
            {t('landing.cta2.btn')} <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Standard({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-silver-300 hover:text-white transition group cursor-default">
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function Stat({ label, value, trend, accent = '#EAAA00' }) {
  return (
    <div className="card !p-4 border-t-2" style={{ borderTopColor: accent }}>
      <div className="stat-num text-3xl font-extrabold tracking-tight drop-shadow-[0_0_15px_rgba(234,170,0,0.35)]">
        {value}
      </div>
      <div className="text-[11px] font-semibold text-silver-400 uppercase tracking-wider mt-1">{label}</div>
      {trend && (
        <div className="mt-2 text-[10px] font-mono text-marigold-300 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-marigold-400 animate-pulse" />
          {trend}
        </div>
      )}
    </div>
  );
}

const ACCENT_STYLES = {
  cyan: { border: 'border-t-2 !border-marigold-400/80', iconBg: 'bg-marigold-500/10 border-marigold-400/30 text-marigold-300', glow: '#EAAA00' },
  violet: { border: 'border-t-2 !border-aubergine-400/80', iconBg: 'bg-aubergine-500/15 border-aubergine-400/30 text-aubergine-300', glow: '#AA4C9F' },
  emerald: { border: 'border-t-2 !border-silver-300/80', iconBg: 'bg-silver-400/10 border-silver-300/30 text-silver-200', glow: '#DDE3E8' },
  amber: { border: 'border-t-2 !border-marigold-400/80', iconBg: 'bg-marigold-500/10 border-marigold-400/30 text-marigold-300', glow: '#EAAA00' },
  yellow: { border: 'border-t-2 !border-marigold-400/80', iconBg: 'bg-marigold-500/10 border-marigold-400/30 text-marigold-300', glow: '#EAAA00' },
  sky: { border: 'border-t-2 !border-silver-300/80', iconBg: 'bg-silver-400/10 border-silver-300/30 text-silver-200', glow: '#DDE3E8' },
  indigo: { border: 'border-t-2 !border-aubergine-400/80', iconBg: 'bg-aubergine-500/15 border-aubergine-400/30 text-aubergine-300', glow: '#AA4C9F' },
  rose: { border: 'border-t-2 !border-aubergine-400/80', iconBg: 'bg-aubergine-500/15 border-aubergine-400/30 text-aubergine-300', glow: '#AA4C9F' },
  teal: { border: 'border-t-2 !border-marigold-400/80', iconBg: 'bg-marigold-500/10 border-marigold-400/30 text-marigold-300', glow: '#EAAA00' },
};

function Feature({ icon, title, text, accent = 'cyan' }) {
  const conf = ACCENT_STYLES[accent] || ACCENT_STYLES.cyan;
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`card card-hover group cursor-default relative overflow-hidden ${conf.border}`}
    >
      <div
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{ background: conf.glow }}
      />
      <div className={`grid place-items-center w-11 h-11 rounded-xl mb-4 border transition-transform group-hover:scale-110 ${conf.iconBg}`}>
        {icon}
      </div>
      <h3 className="font-display font-bold text-lg mb-2 text-silver-100 group-hover:text-marigold-300 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-silver-400 leading-relaxed">{text}</p>
    </motion.div>
  );
}
