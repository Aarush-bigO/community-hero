import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, MapPin, Clock } from 'lucide-react';
import { api, assetUrl } from '../utils/api';
import { useStore } from '../store/useStore';

const CATEGORY_META = {
  pothole: { emoji: '🕳️' },
  streetlight: { emoji: '💡' },
  water: { emoji: '💧' },
  waste: { emoji: '🗑️' },
  infrastructure: { emoji: '🏗️' },
  other: { emoji: '📍' },
};

const STATUS_COLORS = {
  reported: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  verified: 'text-slate-300',
  in_progress: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  resolved: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-300 border-red-500/20',
};

export default function IssueCard({ issue, index = 0 }) {
  const user = useStore((s) => s.user);
  const showToast = useStore((s) => s.showToast);
  const meta = CATEGORY_META[issue.category] || CATEGORY_META.other;

  const verify = async (vote) => {
    if (!user) return showToast({ icon: '🔒', title: 'Sign in to verify' });
    try {
      await api.issues.verify(issue.id, { user_id: user.id, vote });
      showToast({
        icon: vote > 0 ? '✅' : '⚠️',
        title: vote > 0 ? 'Confirmed!' : 'Disputed',
        message: '+10 XP earned',
      });
    } catch (e) {
      showToast({ icon: '❌', title: 'Failed', message: e.message });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="card card-hover group"
    >
      <div className="flex gap-4">
        {issue.photo_url ? (
          <img
            src={assetUrl(issue.photo_url)}
            alt={issue.title}
            className="w-20 h-20 rounded-xl object-cover ring-1 ring-white/10"
          />
        ) : (
          <div className="icon-tile w-20 h-20 text-3xl">
            {meta.emoji}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display font-semibold text-base leading-tight text-white">{issue.title}</h3>
            <span className={`chip ${STATUS_COLORS[issue.status] || ''}`}>
              {issue.status?.replace('_', ' ')}
            </span>
          </div>
          {issue.ai_summary && (
            <p className="text-sm text-slate-300 mt-1 line-clamp-2">{issue.ai_summary}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
            <span className="chip">{meta.emoji} {issue.category}</span>
            <span className="chip">Severity {issue.severity}/5</span>
            {issue.address && (
              <span className="chip"><MapPin className="w-3 h-3" /> {issue.address}</span>
            )}
            <span className="chip"><Clock className="w-3 h-3" /> {timeAgo(issue.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 hairline">
        <div className="text-xs text-slate-400">
          By <span className="text-slate-200">{issue.reporter_name || 'Anonymous'}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => verify(1)}
            className="btn-ghost text-xs px-3 py-1.5 hover:bg-emerald-500/15 hover:border-emerald-500/30"
          >
            <ThumbsUp className="w-3.5 h-3.5" /> {issue.confirms || 0}
          </button>
          <button
            onClick={() => verify(-1)}
            className="btn-ghost text-xs px-3 py-1.5 hover:bg-red-500/15 hover:border-red-500/30"
          >
            <ThumbsDown className="w-3.5 h-3.5" /> {issue.disputes || 0}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function timeAgo(iso) {
  if (!iso) return 'just now';
  const d = (Date.now() - new Date(iso.replace(' ', 'T') + 'Z').getTime()) / 1000;
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}
