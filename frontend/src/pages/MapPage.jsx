import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import IssueMap from '../components/IssueMap';
import IssueCard from '../components/IssueCard';
import { api } from '../utils/api';
import { Filter } from 'lucide-react';

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
    <main className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Live <span className="gradient-text">Issue Map</span>
          </h1>
          <p className="text-slate-400">All reports across your community, in real time.</p>
        </motion.div>

        <div className="flex items-center gap-2 flex-wrap mb-6">
          <Filter className="w-4 h-4 text-slate-400" />
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`chip transition ${
                filter === c ? 'bg-brand-500/30 border-brand-400/50 text-white' : 'hover:bg-white/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[600px] glass rounded-2xl overflow-hidden">
            <IssueMap issues={issues} />
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
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
