import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Twitter, Newspaper, MessageSquare, TrendingDown, TrendingUp, Minus, Zap, Plus } from 'lucide-react';
import { api } from '../utils/api';
import { useStore } from '../store/useStore';
import { useT } from '../i18n';
import { useCountUp } from '../hooks/useCountUp';

const SOURCE_ICON = {
  twitter: Twitter,
  news: Newspaper,
  reddit: MessageSquare,
};

const SENT_META = {
  negative: { color: 'from-red-500/30 to-red-700/30 border-red-500/30', icon: TrendingDown, text: 'text-red-300' },
  neutral: { color: 'from-slate-500/20 to-slate-700/20 border-white/10', icon: Minus, text: 'text-slate-300' },
  positive: { color: 'from-emerald-500/30 to-emerald-700/30 border-emerald-500/30', icon: TrendingUp, text: 'text-emerald-300' },
};

export default function Pulse() {
  const [signals, setSignals] = useState([]);
  const [summary, setSummary] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const liveSignals = useStore((s) => s.liveSignals);
  const liveConnected = useStore((s) => s.liveConnected);
  const t = useT();

  useEffect(() => {
    api.pulse.list({ limit: 200 }).then(setSignals).catch(() => {});
    api.pulse.summary().then(setSummary).catch(() => {});
  }, []);

  // Drain live SSE signals into the visible feed, newest first, de-duplicated.
  useEffect(() => {
    if (!liveSignals.length) return;
    setSignals((prev) => {
      const seen = new Set(prev.map((s) => s.id));
      const fresh = liveSignals.filter((s) => !seen.has(s.id));
      if (fresh.length) setFlashId(fresh[0].id);
      return [...fresh, ...prev].slice(0, 300);
    });
  }, [liveSignals]);

  const simulate = () => api.pulse.simulate().catch(() => {});

  return (
    <main className="pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="icon-tile">
                <Radio className="w-5 h-5" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold">
                <span className="gradient-text">{t('pulse.title')}</span>
              </h1>
              <span
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  liveConnected ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-500/15 text-slate-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${liveConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                {liveConnected ? t('common.liveOn') : '…'}
              </span>
            </div>
            <button onClick={simulate} className="btn-ghost text-sm">
              <Zap className="w-4 h-4" /> {t('pulse.simulate')}
            </button>
          </div>
          <p className="text-slate-400">{t('pulse.subtitle')}</p>
        </motion.div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <SummaryTile label={t('pulse.mentions')} value={summary.total} />
            <SummaryTile label={t('pulse.avg')} value={summary.sentiment.avg} tone={summary.sentiment.label} />
            <SummaryTile label={t('pulse.negative')} value={summary.sentiment.counts.negative} tone="negative" />
            <SummaryTile label={t('pulse.positive')} value={summary.sentiment.counts.positive} tone="positive" />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {signals.map((s, i) => (
              <Signal key={s.id} s={s} index={i} flash={s.id === flashId} />
            ))}
            {!signals.length && (
              <div className="card text-center text-slate-400">{t('pulse.empty')}</div>
            )}
          </div>

          <div className="space-y-4 lg:sticky lg:top-24 self-start">
            {summary?.byTopic?.length > 0 && (
              <div className="card">
                <h3 className="font-display font-semibold mb-3">By Topic</h3>
                {summary.byTopic.map((t) => (
                  <div key={t.topic} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-slate-300">{t.topic || 'untagged'}</span>
                    <span className="font-mono text-brand-300">{t.c}</span>
                  </div>
                ))}
              </div>
            )}
            {summary?.bySource?.length > 0 && (
              <div className="card">
                <h3 className="font-display font-semibold mb-3">By Source</h3>
                {summary.bySource.map((s) => (
                  <div key={s.source} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-slate-300 capitalize">{s.source}</span>
                    <span className="font-mono text-accent-400">{s.c}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function SummaryTile({ label, value, tone = 'neutral' }) {
  const toneClass =
    tone === 'negative' ? 'text-rose-400' : tone === 'positive' ? 'text-emerald-400' : 'text-marigold-300';
  const isFloat = typeof value === 'number' && !Number.isInteger(value);
  const n = useCountUp(typeof value === 'number' ? value : 0, { decimals: isFloat ? 2 : 0 });
  const display = typeof value === 'number' ? (isFloat ? n.toFixed(2) : Math.round(n)) : value;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="card card-hover border border-white/10 bg-[#0D0F14]/90 backdrop-blur-xl relative overflow-hidden"
    >
      <div className={`stat-num text-3xl font-black ${toneClass}`}>{display}</div>
      <div className="text-xs uppercase tracking-wider font-mono text-silver-400 mt-1">{label}</div>
    </motion.div>
  );
}

function Signal({ s, index, flash }) {
  const Icon = SOURCE_ICON[s.source] || Radio;
  const meta = SENT_META[s.sentiment_label] || SENT_META.neutral;
  const SentIcon = meta.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: flash ? -10 : 10, scale: flash ? 0.98 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: flash ? 0 : Math.min(index * 0.03, 0.4) }}
      className={`card border ${meta.color} bg-[#0D0F14]/90 backdrop-blur-xl relative overflow-hidden ${
        flash ? 'ring-2 ring-marigold-400/80 shadow-[0_0_25px_rgba(234,170,0,0.4)]' : ''
      }`}
    >
      {flash && (
        <span className="absolute -top-2 -right-2 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-marigold-400 text-[#08090C] shadow-lg animate-pulse">
          LIVE SIGNAL
        </span>
      )}
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#12151D] border border-white/10 grid place-items-center flex-shrink-0 text-marigold-400">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-1.5 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-silver-100">{s.author || 'Civic Observer'}</span>
              <span className="text-xs text-silver-500 font-mono capitalize">· {s.source}</span>
            </div>
            <span className={`chip py-0.5 px-2 font-mono text-[11px] font-bold ${meta.text} bg-[#12151D] border-white/10`}>
              <SentIcon className="w-3 h-3" />
              {s.sentiment_label}
            </span>
          </div>
          <p className="text-sm text-silver-200 leading-relaxed font-sans">{s.text}</p>
          <div className="flex items-center gap-2 mt-2.5 text-xs text-silver-500 font-mono">
            {s.topic && <span className="chip !text-[10px] py-0.5 px-2 bg-[#12151D] border-white/10 text-marigold-300">#{s.topic}</span>}
            <span>{timeAgo(s.created_at)}</span>
            {s.url && (
              <a href={s.url} target="_blank" rel="noreferrer" className="text-marigold-400 hover:text-marigold-300 hover:underline">
                verify source ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function timeAgo(iso) {
  if (!iso) return '';
  const d = (Date.now() - new Date(iso.replace(' ', 'T') + 'Z').getTime()) / 1000;
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}
