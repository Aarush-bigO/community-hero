import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import IssueMap from '../components/IssueMap';
import IssueCard from '../components/IssueCard';
import { api } from '../utils/api';
import { Filter, Activity } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';

const CATEGORIES = ['all', 'pothole', 'streetlight', 'water', 'waste', 'infrastructure'];

export default function MapPage() {
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
          <span className="eyebrow">Live map</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-2 text-white">
            Issue map
          </h1>
          <p className="text-slate-400">All reports across your community, in real time.</p>
        </motion.div>

        <div className="flex items-center gap-2 flex-wrap mb-6">
          <Filter className="w-4 h-4 text-slate-500" />
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`chip capitalize transition ${
                filter === c
                  ? 'bg-white/10 border-white/15 text-white'
                  : 'hover:bg-white/[0.07]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[600px] card !p-0 overflow-hidden">
            <IssueMap issues={issues} />
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            <SidePanelHeader issues={issues} filter={filter} />
            {loading ? (
              <div className="card text-center text-slate-400">Loading...</div>
            ) : issues.length ? (
              issues.map((i, idx) => <IssueCard key={i.id} issue={i} index={idx} />)
            ) : (
              <div className="card text-center text-slate-400">
                No issues yet. Be the first to report!
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
            <span className="flex items-center gap-1 text-[11px] text-emerald-300/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> live
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {filter === 'all' ? 'reports shown' : `${filter} reports`}
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Activity className="w-4 h-4 text-brand-300" />
          <div className="w-24"><Sparkline data={series} /></div>
        </div>
      </div>
    </motion.div>
  );
}

function Sparkline({ data, color = '#2fbbff', height = 30 }) {
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
