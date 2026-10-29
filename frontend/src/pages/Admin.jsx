import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, UserCheck, Building2 } from 'lucide-react';
import { api } from '../utils/api';
import { useStore } from '../store/useStore';
import { useCountUp } from '../hooks/useCountUp';
import { useT } from '../i18n';

export default function Admin() {
  const t = useT();
  const [queue, setQueue] = useState([]);
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [filter, setFilter] = useState('open');
  const [loading, setLoading] = useState(true);
  const showToast = useStore((s) => s.showToast);

  const refresh = () => {
    setLoading(true);
    Promise.all([
      api.admin.queue(filter === 'breach' ? {} : filter !== 'all' ? { status: internal(filter) } : {}),
      api.admin.staff(),
      api.admin.departments(),
      api.admin.deptMetrics(),
    ])
      .then(([q, s, d, m]) => {
        setQueue(filter === 'breach' ? q.filter((i) => (i.hours_remaining ?? 0) < 0 && i.status !== 'resolved') : q);
        setStaff(s);
        setDepartments(d);
        setMetrics(m);
      })
      .finally(() => setLoading(false));
  };

  useEffect(refresh, [filter]); // eslint-disable-line

  const assign = async (issue, assigneeId) => {
    try {
      await api.admin.assign(issue.id, { assignee_id: assigneeId });
      showToast({ icon: '✅', title: 'Assigned' });
      refresh();
    } catch (e) {
      showToast({ icon: '❌', title: 'Failed', message: e.message });
    }
  };

  const resolve = async (issue) => {
    const note = prompt('Resolution note?', 'Fixed and verified.');
    if (note === null) return;
    try {
      const fd = new FormData();
      fd.append('note', note);
      await api.admin.resolve(issue.id, fd);
      showToast({ icon: '🎉', title: 'Resolved!' });
      refresh();
    } catch (e) {
      showToast({ icon: '❌', title: 'Failed', message: e.message });
    }
  };

  return (
    <main className="page">
      <div className="page-wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="eyebrow">{t('admin.eyebrow')}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-white">
            {t('admin.title')}
          </h1>
          <p className="text-slate-400 mt-2">{t('admin.sub')}</p>
        </motion.div>

        {/* Department metrics row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.slice(0, 4).map((m, i) => (
            <DeptCard key={m.id} m={m} i={i} />
          ))}
        </div>

        {/* Filters — segmented control */}
        <div className="inline-flex flex-wrap gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl mb-6">
          {[
            { id: 'open', label: 'Open Queue' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' },
            { id: 'breach', label: 'SLA Breaches' },
            { id: 'all', label: 'All Records' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filter === f.id
                  ? 'bg-marigold-500/20 text-marigold-300 border border-marigold-400/60 shadow-[0_0_15px_rgba(234,170,0,0.3)]'
                  : 'text-silver-400 hover:text-white border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Queue — enterprise data table */}
        <div className="card !p-0 overflow-hidden border border-white/10 bg-[#0D0F14]/90 shadow-2xl backdrop-blur-2xl rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-[#12151D]/90 border-b border-white/10">
              <tr className="text-left text-xs uppercase tracking-wider text-silver-400 font-mono">
                <th className="px-5 py-3.5 font-semibold">Incident &amp; AI Triage</th>
                <th className="px-5 py-3.5 font-semibold">Department</th>
                <th className="px-5 py-3.5 font-semibold">SLA Window</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Assignee</th>
                <th className="px-5 py-3.5 font-semibold">Triage Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">Loading...</td>
                </tr>
              ) : queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    {filter === 'breach' ? 'No SLA breaches.' : 'Queue empty.'}
                  </td>
                </tr>
              ) : (
                queue.map((i, idx) => {
                  const breaching = (i.hours_remaining ?? 0) < 0 && i.status !== 'resolved';
                  return (
                    <motion.tr key={i.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                      className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-white">{i.title}</div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="chip text-xs">sev {i.severity}/5</span>
                          <span className="chip text-xs">{i.category}</span>
                          <span
                            className={`chip text-xs ${
                              i.sentiment_label === 'negative'
                                ? 'bg-red-500/10 border-red-500/20 text-red-300'
                                : i.sentiment_label === 'positive'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                : ''
                            }`}
                          >
                            {i.sentiment_label}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">{i.department_name || '—'}</td>
                      <td className="px-5 py-4">
                        {i.hours_remaining != null ? (
                          <span
                            className={`chip text-xs ${
                              breaching ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'text-slate-300'
                            }`}
                          >
                            {breaching ? 'overdue' : `${Math.max(0, i.hours_remaining).toFixed(1)}h left`}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`chip text-xs ${
                            i.status === 'resolved'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                              : i.status === 'in_progress'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                              : ''
                          }`}
                        >
                          {i.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {i.assignee_name ? (
                          <span className="chip"><UserCheck className="w-3 h-3" /> {i.assignee_name}</span>
                        ) : (
                          <select
                            defaultValue=""
                            onChange={(e) => e.target.value && assign(i, e.target.value)}
                            className="input !py-1.5 !px-2.5 text-xs max-w-[10rem]"
                          >
                            <option value="">Assign...</option>
                            {staff.map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {i.status !== 'resolved' && (
                          <button onClick={() => resolve(i)} className="btn-ghost text-xs !px-3 !py-1.5">
                            <CheckCircle2 className="w-3 h-3" /> Resolve
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function DeptCard({ m, i }) {
  const resolved = useCountUp(m.resolved || 0);
  const total = useCountUp(m.total || 0);
  const pct = m.total ? Math.round((m.resolved / m.total) * 100) : 0;
  const accents = ['feature-card-marigold', 'feature-card-aubergine', 'feature-card-silver', 'feature-card-marigold'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06 }}
      whileHover={{ y: -3 }}
      className={`card card-hover border border-white/10 bg-[#0D0F14]/90 backdrop-blur-xl relative overflow-hidden ${accents[i % accents.length]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="icon-tile w-9 h-9 bg-[#12151D] border-white/10 text-marigold-400">
          <Building2 className="w-4 h-4" />
        </div>
        <span
          className={`chip text-[11px] font-mono font-bold ${
            m.breaches > 0
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
          }`}
        >
          {m.breaches} breach{m.breaches === 1 ? '' : 'es'}
        </span>
      </div>
      <div className="text-xs text-silver-400 font-mono uppercase tracking-wider truncate">{m.name}</div>
      <div className="stat-num text-2xl font-black text-silver-100 mt-1">
        {Math.round(resolved)}
        <span className="text-silver-500 text-lg font-normal">/{Math.round(total)}</span>
      </div>
      <div className="text-[11px] text-silver-400 font-mono mb-2.5">
        resolved{m.avg_resolve_hours != null ? ` · ${m.avg_resolve_hours.toFixed(1)}h SLA avg` : ''}
      </div>
      <div className="h-2 rounded-full bg-[#08090C] border border-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-aubergine-400 via-marigold-400 to-[#FFD12E]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.2 + i * 0.06, duration: 0.7 }}
        />
      </div>
    </motion.div>
  );
}

function internal(s) {
  return s === 'open' ? 'reported' : s;
}
