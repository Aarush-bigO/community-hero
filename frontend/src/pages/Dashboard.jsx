import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, CheckCircle2, Clock, Users } from 'lucide-react';
import { api } from '../utils/api';

const COLORS = ['#2fbbff', '#7cc7ff', '#0080cc', '#38bdf8', '#1e6f9f', '#9fe0ff'];

const SEVERITY_COLORS = { low: '#34d399', mid: '#fbbf24', high: '#f87171' };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    api.stats().then(setStats).catch(() => {});
    api.ai.hotspots().then(setHotspots).catch(() => {});
  }, []);

  if (!stats) {
    return (
      <main className="page">
        <div className="page-wrap">
          <div className="card text-center text-slate-400">Loading dashboard...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="eyebrow">ANALYTICS</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 text-white">
            Impact <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-400">Real-time view of community action.</p>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <KPI icon={<TrendingUp />} label="Total Reports" value={stats.total} />
          <KPI icon={<CheckCircle2 />} label="Resolution Rate" value={`${stats.resolutionRate}%`} />
          <KPI icon={<Clock />} label="In Progress" value={stats.inProgress} />
          <KPI icon={<Users />} label="Active Heroes" value={stats.reporters} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trend */}
          <div className="card lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-5">Reports Over Time (30d)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={stats.trend}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2fbbff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2fbbff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="c" stroke="#2fbbff" strokeWidth={2} fill="url(#grad1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category breakdown */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-5">By Category</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.byCategory}
                  dataKey="c"
                  nameKey="category"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {stats.byCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Severity */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-5">Severity Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.bySeverity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="severity" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="c" radius={[6, 6, 0, 0]}>
                  {stats.bySeverity.map((s, i) => (
                    <Cell
                      key={i}
                      fill={SEVERITY_COLORS[String(s.severity).toLowerCase()] || '#2fbbff'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hotspots */}
          <div className="card lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-5">Predictive Hotspots</h3>
            {hotspots.length === 0 ? (
              <p className="text-sm text-slate-400">
                Not enough data yet. Hotspots appear when 2+ issues cluster in an area.
              </p>
            ) : (
              <div className="space-y-2">
                {hotspots.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div>
                      <div className="font-mono text-xs text-slate-300">
                        {h.lat.toFixed(3)}, {h.lng.toFixed(3)}
                      </div>
                      <div className="text-xs text-slate-500">{h.count} reports clustered</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-brand-400"
                          style={{ width: `${h.risk * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-slate-300">
                        {Math.round(h.risk * 100)}%
                      </span>
                    </div>
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

const tooltipStyle = {
  background: '#0a0f1e',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '12px',
};

function KPI({ icon, label, value }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="card">
      <div className="icon-tile mb-3">{icon}</div>
      <div className="stat-num">{value}</div>
      <div className="text-slate-400 text-xs uppercase tracking-wide mt-1">{label}</div>
    </motion.div>
  );
}
