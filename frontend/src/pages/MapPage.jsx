import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import IssueMap from '../components/IssueMap';
import IssueCard from '../components/IssueCard';
import { api } from '../utils/api';
import { Filter, Activity } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';
import { useT } from '../i18n';

const CATEGORIES = ['all', 'pothole', 'streetlight', 'water', 'waste', 'infrastructure'];

export default function MapPage() {
  const t = useT();
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.issues
      .list(filter !== 'all' ? { category: filter } : {})
      .then((data) => {
        setIssues(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  return (
    <main className="page">
      <div className="page-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <span className="eyebrow">{t('map.eyebrow')}</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-2 text-white">
            {t('map.title')}
          </h1>
          <p className="text-slate-400">{t('map.sub')}</p>
        </motion.div>

        <div className="flex items-center gap-2 flex-wrap mb-6">
          <div className="flex items-center gap-1.5 text-xs text-silver-400 font-mono mr-1">
            <Filter className="w-3.5 h-3.5 text-marigold-400" />
            <span>FILTER:</span>
          </div>
          {[
            { id: 'all', label: 'All Reports', icon: '🌐' },
            { id: 'pothole', label: 'Potholes', icon: '🕳️' },
            { id: 'streetlight', label: 'Streetlights', icon: '💡' },
            { id: 'water', label: 'Water Leaks', icon: '💧' },
            { id: 'waste', label: 'Waste', icon: '🗑️' },
            { id: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 select-none ${
                filter === c.id
                  ? 'bg-marigold-500/20 border border-marigold-400/60 text-marigold-200 shadow-[0_0_15px_rgba(234,170,0,0.3)] scale-[1.02]'
                  : 'bg-[#12151D]/80 border border-white/10 text-silver-400 hover:text-silver-200 hover:border-white/20'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[640px] rounded-2xl border border-marigold-500/30 shadow-2xl shadow-black/70 overflow-hidden relative isolate z-0">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-marigold-400 to-transparent z-10 animate-pulse pointer-events-none" />
            <IssueMap issues={issues} />
          </div>
          <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2">
            <SidePanelHeader issues={issues} filter={filter} />
            {loading ? (
              <div className="card text-center text-silver-400 py-12 font-mono text-xs">
                <span className="w-4 h-4 rounded-full border-2 border-marigold-400 border-t-transparent animate-spin inline-block mr-2" />
                Querying live geospatial records…
              </div>
            ) : issues.length ? (
              issues.map((i, idx) => <IssueCard key={i.id} issue={i} index={idx} />)
            ) : (
              <div className="card text-center text-silver-400 py-12 font-mono text-xs border border-dashed border-white/10">
                No civic issues match this category filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Live side-panel header: count-up + 7-day activity sparkline -------------
function dailySeries(issues, days = 7) {
  const now = Date.now();
  const buckets = Array.from({ length: days }, () => 0);
  for (const i of issues) {
    const t = new Date((i.created_at || '').replace(' ', 'T') + 'Z').getTime();
    if (Number.isNaN(t)) continue;
    const diff = Math.floor((now - t) / 86400000);
    if (diff >= 0 && diff < days) buckets[days - 1 - diff]++;
  }
  return buckets;
}

function SidePanelHeader({ issues, filter }) {
  const n = useCountUp(issues.length);
  const series = dailySeries(issues);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="card sticky top-0 z-10 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="stat-num text-2xl">{Math.round(n)}</span>
            <span className="flex items-center gap-1 text-[11px] text-marigold-300/90">
              <span className="w-1.5 h-1.5 rounded-full bg-marigold-400 animate-pulse" /> live
            </span>
          </div>
          <div className="text-xs text-silver-400 mt-0.5">
            {filter === 'all' ? 'reports shown' : `${filter} reports`}
          </div>
        </div>
        <div className="flex items-center gap-2 text-silver-500">
          <Activity className="w-4 h-4 text-marigold-400" />
          <div className="w-24"><Sparkline data={series} /></div>
        </div>
      </div>
    </motion.div>
  );
}

function Sparkline({ data, color = '#EAAA00', height = 30 }) {
  if (!data?.length) return <div style={{ height }} />;
  const max = Math.max(...data, 1);
  const w = 100;
  const step = data.length > 1 ? w / (data.length - 1) : w;
  const pts = data
    .map((v, i) => `${(i * step).toFixed(1)},${(height - (v / max) * (height - 4) - 2).toFixed(1)}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <polyline points={`0,${height} ${pts} ${w},${height}`} fill={`${color}1f`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
