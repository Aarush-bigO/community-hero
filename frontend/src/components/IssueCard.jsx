import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api, assetUrl } from '../utils/api';
import { useStore } from '../store/useStore';

const CATEGORY_META = {
  pothole: { emoji: '🕳️', label: 'Pothole', color: 'from-rose-500/20 to-orange-500/20 border-rose-500/40 text-rose-300' },
  streetlight: { emoji: '💡', label: 'Streetlight', color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300' },
  water: { emoji: '💧', label: 'Water Leak', color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300' },
  waste: { emoji: '🗑️', label: 'Waste Disposal', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300' },
  infrastructure: { emoji: '🏗️', label: 'Infrastructure', color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-300' },
  other: { emoji: '📍', label: 'Civic Issue', color: 'from-sky-500/20 to-cyan-500/20 border-sky-500/40 text-sky-300' },
};

const CATEGORY_DEFAULT_IMAGES = {
  pothole: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
  streetlight: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
  water: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
  waste: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
  infrastructure: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
  other: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
};

const STATUS_BADGES = {
  reported: { label: 'Reported', className: 'bg-marigold-500/15 text-marigold-300 border-marigold-500/30' },
  verified: { label: 'Verified', className: 'bg-silver-400/15 text-silver-200 border-silver-400/30' },
  in_progress: { label: 'In Progress', className: 'bg-aubergine-500/25 text-aubergine-200 border-aubergine-500/40' },
  resolved: { label: 'Resolved', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  rejected: { label: 'Rejected', className: 'bg-silver-600/15 text-silver-400 border-silver-600/30' },
};

export default function IssueCard({ issue, index = 0 }) {
  const user = useStore((s) => s.user);
  const showToast = useStore((s) => s.showToast);
  const [imageError, setImageError] = useState(false);
  const meta = CATEGORY_META[issue.category] || CATEGORY_META.other;
  const statusInfo = STATUS_BADGES[issue.status] || STATUS_BADGES.reported;

  const fallbackUrl = CATEGORY_DEFAULT_IMAGES[issue.category] || CATEGORY_DEFAULT_IMAGES.other;
  const photoSrc = (!imageError && issue.photo_url) ? assetUrl(issue.photo_url) : fallbackUrl;

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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="card card-hover group border border-white/10 hover:border-marigold-400/50 bg-[#0D0F14]/90 backdrop-blur-xl relative overflow-hidden"
    >
      <div className="flex gap-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10 group-hover:ring-marigold-400/50 transition shadow-md bg-[#08090C]">
          <img
            src={photoSrc}
            onError={() => setImageError(true)}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-base leading-snug text-silver-100 group-hover:text-marigold-300 transition-colors line-clamp-1">
              {issue.title}
            </h3>
            <span className={`chip text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          </div>

          {issue.ai_summary && (
            <p className="text-xs text-silver-300 mt-1 line-clamp-2 leading-relaxed font-sans">
              {issue.ai_summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px] text-silver-400">
            <span className="chip py-0.5 px-2 bg-[#12151D] border-white/10 text-silver-300 font-mono">
              {meta.emoji} {issue.category}
            </span>
            <span className={`chip py-0.5 px-2 font-mono font-bold ${
              issue.severity >= 4 ? 'bg-aubergine-500/20 text-aubergine-200 border-aubergine-500/40' : 'bg-[#12151D] border-white/10 text-silver-300'
            }`}>
              Sev {issue.severity}/5
            </span>
            {issue.address && (
              <span className="chip py-0.5 px-2 bg-[#12151D] border-white/10 text-silver-300 max-w-[180px] truncate font-mono">
                <MapPin className="w-3 h-3 text-marigold-400 shrink-0" /> {issue.address}
              </span>
            )}
            <span className="chip py-0.5 px-2 bg-[#12151D] border-white/10 text-silver-400 font-mono">
              <Clock className="w-3 h-3 shrink-0" /> {timeAgo(issue.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-white/10">
        <div className="text-[11px] text-silver-400 font-mono flex items-center gap-1.5">
          <span>By</span>
          <span className="text-marigold-300 font-medium">{issue.reporter_name || 'Civic Hero'}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => verify(1)}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-marigold-500/10 border border-marigold-500/30 text-marigold-300 hover:bg-marigold-500/20 hover:border-marigold-400/50 transition font-mono"
            title="Confirm this issue is accurate (+10 XP)"
          >
            <ThumbsUp className="w-3 h-3" /> {issue.confirms || 0}
          </button>
          <button
            onClick={() => verify(-1)}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#12151D] border border-white/10 text-silver-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 transition font-mono"
            title="Dispute this issue"
          >
            <ThumbsDown className="w-3 h-3" /> {issue.disputes || 0}
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

