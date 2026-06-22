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

const COLORS = ['#06a0ee', '#a855f7', '#f87171', '#fbbf24', '#a3e635', '#38bdf8'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    api.stats().then(setStats).catch(() => {});
    api.ai.hotspots().then(setHotspots).catch(() => {});
  }, []);

  if (!stats) {
    return (
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="card text-center text-slate-400">Loading dashboard...</div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Impact <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-400">Real-time view of community action.</p>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPI icon={<TrendingUp />} label="Total Reports" value={stats.total} accent="from-brand-400 to-cyan-400" />
          <KPI icon={<CheckCircle2 />} label="Resolution Rate" value={`${stats.resolutionRate}%`} accent="from-emerald-400 to-teal-500" />
          <KPI icon={<Clock />} label="In Progress" value={stats.inProgress} accent="from-purple-400 to-fuchsia-500" />
          <KPI icon={<Users />} label="Active Heroes" value={stats.reporters} accent="from-amber-400 to-orange-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trend */}
          <div className="card lg:col-span-2">
            <h3 className="font-display font-semibold mb-4">Reports Over Time (30d)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={stats.trend}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06a0ee" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06a0ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="c" stroke="#06a0ee" fill="url(#grad1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category breakdown */}
          <div className="card">
            <h3 className="font-display font-semibold mb-4">By Category</h3>
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
            <h3 className="font-display font-semibold mb-4">Severity Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.bySeverity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="severity" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="c" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hotspots */}
          <div className="card lg:col-span-2">
            <h3 className="font-display font-semibold mb-4">🔥 Predictive Hotspots</h3>
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
                          className="h-full bg-gradient-to-r from-amber-400 to-red-500"
                          style={{ width: `${h.risk * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-red-300">
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
  background: 'rgba(10,14,28,0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  fontSize: '12px',
};

function KPI({ icon, label, value, accent }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="card">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accent} grid place-items-center mb-3`}>
        <span className="text-white">{icon}</span>
      </div>
      <div className="text-3xl font-bold gradient-text">{value}</div>
      <div className="text-xs uppercase tracking-wide text-slate-400 mt-1">{label}</div>
    </motion.div>
  );
}
