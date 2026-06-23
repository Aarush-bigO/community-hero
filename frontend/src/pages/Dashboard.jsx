import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area, CartesianGrid,
  RadialBarChart, RadialBar,
} from 'recharts';
import {
  TrendingUp, CheckCircle2, Clock, Users, ShieldCheck,
  ArrowUpRight, ArrowDownRight, Activity, MapPin, RefreshCw,
} from 'lucide-react';
import { api } from '../utils/api';
import { useCountUp } from '../hooks/useCountUp';

const COLORS = ['#2fbbff', '#7cc7ff', '#0080cc', '#38bdf8', '#1e6f9f', '#9fe0ff'];
const CATEGORY_COLORS = {
  pothole: '#ff5a5a', streetlight: '#ffc43d', water: '#3bc9ff',
  waste: '#a3e635', infrastructure: '#c084fc', other: '#22d3ee',
};
const catColor = (c, i) => CATEGORY_COLORS[c] || COLORS[i % COLORS.length];
const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);
const SEVERITY_COLORS = { 1: '#34d399', 2: '#a3e635', 3: '#fbbf24', 4: '#fb923c', 5: '#f87171' };
const STATUS_META = {
  reported: { label: 'Reported', color: '#2fbbff' },
  verified: { label: 'Verified', color: '#38bdf8' },
  in_progress: { label: 'In Progress', color: '#fbbf24' },
  resolved: { label: 'Resolved', color: '#34d399' },
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [range, setRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  const load = (silent) => {
    if (!silent) setRefreshing(true);
    Promise.all([api.stats(), api.ai.hotspots()])
      .then(([s, h]) => { setStats(s); setHotspots(h); })
      .catch(() => {})
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    load();
    const t = setInterval(() => load(true), 15000); // live auto-refresh
    return () => clearInterval(t);
  }, []);

  if (!stats) {
    return (
      <main className="page">
        <div className="page-wrap grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-28 animate-pulse bg-white/[0.03]" />
          ))}
        </div>
      </main>
    );
  }

  const catTotal = stats.byCategory.reduce((a, b) => a + b.c, 0);
  const trend = range === '7d' ? stats.trend.slice(-7) : stats.trend;
  const sparkReported = stats.trend.map((d) => d.reported);
  const sparkResolved = stats.trend.map((d) => d.resolved);
  const funnelMax = Math.max(...stats.statusFunnel.map((s) => s.c), 1);

  return (
    <main className="page">
      <div className="page-wrap">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="eyebrow">ANALYTICS</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 text-white">
              Impact <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-slate-400">Real-time view of community action.</p>
          </div>
          <div className="flex items-center gap-2 chip">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-brand-300' : 'text-emerald-300'}`} />
            <span className="text-xs">{refreshing ? 'Syncing…' : 'Live · auto-refresh'}</span>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPI i={0} icon={<TrendingUp className="w-5 h-5" />} label="Total Reports"
            value={stats.total} delta={stats.deltas.reports} spark={sparkReported} sparkColor="#2fbbff" />
          <KPI i={1} icon={<CheckCircle2 className="w-5 h-5" />} label="Resolution Rate"
            value={stats.resolutionRate} suffix="%" delta={stats.deltas.resolved} spark={sparkResolved} sparkColor="#34d399" />
          <KPI i={2} icon={<Clock className="w-5 h-5" />} label="Avg Resolution"
            value={stats.avgResolutionHours} suffix="h" decimals={1} />
          <KPI i={3} icon={<ShieldCheck className="w-5 h-5" />} label="SLA Compliance"
            value={stats.slaCompliance} suffix="%" tone={stats.slaCompliance >= 80 ? 'good' : 'warn'} />
        </div>

        {/* Trend + Category */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-white">Reports vs Resolutions</h3>
              <div className="flex items-center gap-3">
                <Legend2 color="#2fbbff" label="Reported" />
                <Legend2 color="#34d399" label="Resolved" />
                <div className="flex bg-white/[0.04] rounded-lg p-0.5 ml-2">
                  {['7d', '30d'].map((r) => (
                    <button key={r} onClick={() => setRange(r)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${range === r ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="gRep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2fbbff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2fbbff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickFormatter={(d) => d?.slice(5)} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="reported" stroke="#2fbbff" strokeWidth={2} fill="url(#gRep)" />
                <Area type="monotone" dataKey="resolved" stroke="#34d399" strokeWidth={2} fill="url(#gRes)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category donut */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
            <h3 className="text-sm font-semibold text-white mb-5">By Category</h3>
            <div className="relative">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={stats.byCategory} dataKey="c" nameKey="category" innerRadius={54} outerRadius={80} paddingAngle={2} stroke="none">
                    {stats.byCategory.map((d, i) => <Cell key={i} fill={catColor(d.category, i)} />)}
                  </Pie>
                  <Tooltip content={<CatTooltip total={catTotal} />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="stat-num text-2xl leading-none">{catTotal}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Reports</span>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {stats.byCategory.map((d, i) => {
                const pct = catTotal ? Math.round((d.c / catTotal) * 100) : 0;
                return (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: catColor(d.category, i) }} />
                    <span className="text-slate-300 flex-1 truncate">{cap(d.category)}</span>
                    <span className="text-white tabular-nums font-medium">{d.c}</span>
                    <span className="text-slate-500 tabular-nums w-9 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Funnel + Severity + Health */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Status funnel */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
            <h3 className="text-sm font-semibold text-white mb-5">Resolution Funnel</h3>
            <div className="space-y-4">
              {stats.statusFunnel.map((s, i) => {
                const meta = STATUS_META[s.status] || { label: s.status, color: '#2fbbff' };
                const pct = Math.round((s.c / funnelMax) * 100);
                return (
                  <div key={s.status}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-slate-300">{meta.label}</span>
                      <span className="stat-num text-sm">{s.c}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: meta.color }}
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: 'easeOut' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Severity */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card">
            <h3 className="text-sm font-semibold text-white mb-5">Severity Distribution</h3>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={stats.bySeverity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="severity" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="c" radius={[6, 6, 0, 0]} animationDuration={800}>
                  {stats.bySeverity.map((s, i) => <Cell key={i} fill={SEVERITY_COLORS[s.severity] || '#2fbbff'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Operations health */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
            <h3 className="text-sm font-semibold text-white mb-3">Operations Health</h3>
            <div className="relative">
              <ResponsiveContainer width="100%" height={150}>
                <RadialBarChart innerRadius="72%" outerRadius="100%" data={[{ value: stats.slaCompliance, fill: stats.slaCompliance >= 80 ? '#34d399' : '#fbbf24' }]}
                  startAngle={220} endAngle={-40}>
                  <RadialBar dataKey="value" cornerRadius={12} background={{ fill: 'rgba(255,255,255,0.06)' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="stat-num text-2xl">{stats.slaCompliance}%</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">SLA met</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              <Mini label="Breaches" value={stats.breaches} tone={stats.breaches ? 'warn' : 'good'} />
              <Mini label="Sentiment" value={stats.sentiment.avg} tone={stats.sentiment.avg < 0 ? 'warn' : 'good'} />
              <Mini label="Heroes" value={stats.reporters} />
            </div>
          </motion.div>
        </div>

        {/* Hotspots */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-300" /> Predictive Hotspots
          </h3>
          {hotspots.length === 0 ? (
            <p className="text-sm text-slate-400">Not enough data yet. Hotspots appear when 2+ issues cluster in an area.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {hotspots.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <div className="font-mono text-xs text-slate-300">{h.lat.toFixed(3)}, {h.lng.toFixed(3)}</div>
                    <div className="text-xs text-slate-500">{h.count} reports clustered</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-28 h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-brand-400 to-brand-600"
                        initial={{ width: 0 }} animate={{ width: `${h.risk * 100}%` }}
                        transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }} />
                    </div>
                    <span className="text-xs font-mono text-slate-300 w-9 text-right">{Math.round(h.risk * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

const tooltipStyle = {
  background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', color: '#e2e8f0', fontSize: '12px',
};

function CatTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const pct = total ? Math.round((p.value / total) * 100) : 0;
  return (
    <div style={{ ...tooltipStyle, padding: '8px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: p.payload.fill }} />
        <strong style={{ color: '#fff' }}>{cap(p.name)}</strong>
        <span style={{ color: '#94a3b8' }}>· {p.value} reports · {pct}%</span>
      </div>
    </div>
  );
}

function Legend2({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-slate-400">
      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} /> {label}
    </span>
  );
}

function Sparkline({ data, color = '#2fbbff', height = 34 }) {
  if (!data?.length) return <div style={{ height }} />;
  const max = Math.max(...data, 1);
  const w = 100;
  const step = data.length > 1 ? w / (data.length - 1) : w;
  const pts = data.map((v, i) => `${(i * step).toFixed(1)},${(height - (v / max) * (height - 4) - 2).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <polyline points={`0,${height} ${pts} ${w},${height}`} fill={`${color}1f`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function KPI({ i, icon, label, value, suffix = '', decimals = 0, delta, spark, sparkColor, tone }) {
  const n = useCountUp(value, { decimals });
  const display = decimals ? n.toFixed(decimals) : Math.round(n);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
      whileHover={{ y: -3 }} className="card card-hover overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="icon-tile mb-3">{icon}</div>
        {typeof delta === 'number' && <Delta v={delta} />}
        {tone && !delta && (
          <span className={`text-xs font-medium ${tone === 'good' ? 'text-emerald-300' : 'text-amber-300'}`}>
            {tone === 'good' ? 'Healthy' : 'Watch'}
          </span>
        )}
      </div>
      <div className="stat-num text-3xl">{display}<span className="text-xl text-slate-400">{suffix}</span></div>
      <div className="text-slate-400 text-xs uppercase tracking-wide mt-1">{label}</div>
      {spark && <div className="mt-3 -mx-1"><Sparkline data={spark} color={sparkColor} /></div>}
    </motion.div>
  );
}

function Delta({ v }) {
  const up = v >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? 'text-emerald-300' : 'text-red-300'}`}>
      {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
      {Math.abs(v)}%
    </span>
  );
}

function Mini({ label, value, tone }) {
  const color = tone === 'good' ? 'text-emerald-300' : tone === 'warn' ? 'text-amber-300' : 'text-white';
  return (
    <div className="rounded-lg bg-white/[0.03] py-2">
      <div className={`stat-num text-base ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}
