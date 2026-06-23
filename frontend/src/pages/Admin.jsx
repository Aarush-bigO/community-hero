import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, UserCheck } from 'lucide-react';
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
    <main className="page">
      <div className="page-wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="eyebrow">OPERATIONS</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-white">
            Admin <span className="gradient-text">Portal</span>
          </h1>
          <p className="text-slate-400 mt-2">Work-order queue, SLA tracking, department metrics.</p>
        </motion.div>

        {/* Department metrics row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.slice(0, 4).map((m) => (
            <div key={m.id} className="card">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-3">{m.name}</div>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="stat-num text-2xl">{m.resolved}/{m.total}</div>
                  <div className="text-xs text-slate-500 mt-0.5">resolved</div>
                </div>
                <div className="text-right">
                  <span
                    className={`chip text-xs ${
                      m.breaches > 0
                        ? 'bg-red-500/10 border-red-500/20 text-red-300'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {m.breaches} breach{m.breaches === 1 ? '' : 'es'}
                  </span>
                  {m.avg_resolve_hours != null && (
                    <div className="text-xs text-slate-500 mt-1.5">{m.avg_resolve_hours?.toFixed(1)}h avg</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters — segmented control */}
        <div className="inline-flex flex-wrap gap-1 bg-white/[0.03] p-1 rounded-xl mb-5">
          {[
            { id: 'open', label: 'Open' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' },
            { id: 'breach', label: 'SLA Breach' },
            { id: 'all', label: 'All' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === f.id
                  ? 'bg-white/10 text-white border border-white/15'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Queue — enterprise data table */}
        <div className="card !p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3.5 font-medium">Issue</th>
                <th className="px-5 py-3.5 font-medium">Dept</th>
                <th className="px-5 py-3.5 font-medium">SLA</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium">Assignee</th>
                <th className="px-5 py-3.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
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
                queue.map((i) => {
                  const breaching = (i.hours_remaining ?? 0) < 0 && i.status !== 'resolved';
                  return (
                    <tr key={i.id} className="hover:bg-white/[0.03] transition-colors">
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
