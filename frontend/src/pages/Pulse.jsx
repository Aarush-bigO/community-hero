import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Twitter, Newspaper, MessageSquare, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { api } from '../utils/api';

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

  useEffect(() => {
    api.pulse.list({ limit: 200 }).then(setSignals).catch(() => {});
    api.pulse.summary().then(setSummary).catch(() => {});
  }, []);

  return (
    <main className="pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 grid place-items-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              City <span className="gradient-text">Pulse</span>
            </h1>
          </div>
          <p className="text-slate-400">
            Passive listening across social media, news, and forums — sentiment-tagged in real time.
          </p>
        </motion.div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <SummaryTile label="Mentions" value={summary.total} accent="from-brand-400 to-cyan-400" />
            <SummaryTile
              label="Avg Sentiment"
              value={summary.sentiment.avg.toFixed(2)}
              accent={
                summary.sentiment.label === 'negative'
                  ? 'from-red-400 to-orange-500'
                  : summary.sentiment.label === 'positive'
                  ? 'from-emerald-400 to-teal-500'
                  : 'from-slate-400 to-slate-600'
              }
            />
            <SummaryTile label="Negative" value={summary.sentiment.counts.negative} accent="from-red-500 to-rose-700" />
            <SummaryTile label="Positive" value={summary.sentiment.counts.positive} accent="from-emerald-500 to-teal-700" />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {signals.map((s, i) => (
              <Signal key={s.id} s={s} index={i} />
            ))}
            {!signals.length && (
              <div className="card text-center text-slate-400">No pulse signals yet.</div>
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

function SummaryTile({ label, value, accent }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="card">
      <div className={`text-3xl font-bold bg-gradient-to-br ${accent} bg-clip-text text-transparent`}>{value}</div>
      <div className="text-xs uppercase tracking-wide text-slate-400 mt-1">{label}</div>
    </motion.div>
  );
}

function Signal({ s, index }) {
  const Icon = SOURCE_ICON[s.source] || Radio;
  const meta = SENT_META[s.sentiment_label] || SENT_META.neutral;
  const SentIcon = meta.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`card border ${meta.color} bg-gradient-to-br`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/5 grid place-items-center flex-shrink-0">
          <Icon className="w-4 h-4 text-slate-200" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{s.author || 'anonymous'}</span>
              <span className="text-xs text-slate-500 capitalize">· {s.source}</span>
            </div>
            <span className={`chip ${meta.text} bg-white/5`}>
              <SentIcon className="w-3 h-3" />
              {s.sentiment_label}
            </span>
          </div>
          <p className="text-sm text-slate-100 leading-relaxed">{s.text}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            {s.topic && <span className="chip !text-[10px]">#{s.topic}</span>}
            <span>{timeAgo(s.created_at)}</span>
            {s.url && (
              <a href={s.url} target="_blank" rel="noreferrer" className="text-brand-300 hover:underline">
                source ↗
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
