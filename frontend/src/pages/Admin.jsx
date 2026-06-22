import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, AlertTriangle, CheckCircle2, Clock, UserCheck, Loader2 } from 'lucide-react';
import { api } from '../utils/api';
import { useStore } from '../store/useStore';

export default function Admin() {
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
    <main className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-red-500 grid place-items-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Admin <span className="gradient-text">Portal</span>
            </h1>
          </div>
          <p className="text-slate-400">Work-order queue, SLA tracking, department metrics.</p>
        </motion.div>

        {/* Department metrics row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {metrics.slice(0, 4).map((m) => (
            <div key={m.id} className="card !p-4">
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">{m.name}</div>
              <div className="flex items-end gap-3">
                <div>
                  <div className="text-2xl font-bold">{m.resolved}/{m.total}</div>
                  <div className="text-xs text-slate-500">resolved</div>
                </div>
                <div className="ml-auto text-right">
                  <div className={`text-sm font-mono ${m.breaches > 0 ? 'text-red-300' : 'text-emerald-300'}`}>
                    {m.breaches} ⚠
                  </div>
                  {m.avg_resolve_hours != null && (
                    <div className="text-xs text-slate-500">{m.avg_resolve_hours?.toFixed(1)}h avg</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-4">
          {[
            { id: 'open', label: 'Open', icon: Clock },
            { id: 'in_progress', label: 'In Progress', icon: Loader2 },
            { id: 'resolved', label: 'Resolved', icon: CheckCircle2 },
            { id: 'breach', label: 'SLA Breach', icon: AlertTriangle },
            { id: 'all', label: 'All', icon: null },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`chip transition ${
                filter === f.id ? 'bg-brand-500/30 border-brand-400/50 text-white' : 'hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Queue */}
        <div className="card !p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-300">Issue</th>
                <th className="px-4 py-3 font-medium text-slate-300">Dept</th>
                <th className="px-4 py-3 font-medium text-slate-300">SLA</th>
                <th className="px-4 py-3 font-medium text-slate-300">Status</th>
                <th className="px-4 py-3 font-medium text-slate-300">Assignee</th>
                <th className="px-4 py-3 font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">Loading...</td>
                </tr>
              ) : queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    {filter === 'breach' ? '🎉 No SLA breaches!' : 'Queue empty.'}
                  </td>
                </tr>
              ) : (
                queue.map((i) => {
                  const breaching = (i.hours_remaining ?? 0) < 0 && i.status !== 'resolved';
                  return (
                    <tr key={i.id} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="font-medium">{i.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          sev {i.severity}/5 · {i.category} ·{' '}
                          <span className={
                            i.sentiment_label === 'negative' ? 'text-red-300'
                              : i.sentiment_label === 'positive' ? 'text-emerald-300'
                              : 'text-slate-400'
                          }>
                            {i.sentiment_label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">{i.department_name || '—'}</td>
                      <td className="px-4 py-3">
                        {i.hours_remaining != null ? (
                          <span className={`chip text-xs ${breaching ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-white/5'}`}>
                            {breaching ? '⚠ overdue' : `${Math.max(0, i.hours_remaining).toFixed(1)}h left`}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="chip text-xs">{i.status?.replace('_', ' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {i.assignee_name ? (
                          <span className="chip"><UserCheck className="w-3 h-3" /> {i.assignee_name}</span>
                        ) : (
                          <select
                            defaultValue=""
                            onChange={(e) => e.target.value && assign(i, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs"
                          >
                            <option value="">Assign...</option>
                            {staff.map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {i.status !== 'resolved' && (
                          <button onClick={() => resolve(i)} className="text-xs btn-ghost !px-2 !py-1">
                            <CheckCircle2 className="w-3 h-3" /> Resolve
                          </button>
                        )}
                      </td>
                    </tr>
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

function internal(s) {
  return s === 'open' ? 'reported' : s;
}
