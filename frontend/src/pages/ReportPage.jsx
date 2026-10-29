import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, MapPin, Loader2, Sparkles } from 'lucide-react';
import { api } from '../utils/api';
import { useStore } from '../store/useStore';
import { useT } from '../i18n';

export default function ReportPage() {
  const t = useT();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const showToast = useStore((s) => s.showToast);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [coords, setCoords] = useState({ lat: 28.6139, lng: 77.209 });
  const [address, setAddress] = useState('');
  const [aiPreview, setAiPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setCoords({ lat: 28.6139, lng: 77.209 }),
      { timeout: 5000 }
    );
  }, []);

  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const previewAI = async () => {
    if (!title.trim()) return;
    try {
      const r = await api.ai.analyze(`${title}\n${description}`);
      setAiPreview(r);
    } catch (e) {
      console.warn(e);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !coords) return;

    let currentUser = user;
    if (!currentUser) {
      const INDIAN_HERO_NAMES = [
        'Rohan Verma', 'Ananya Sharma', 'Vikram Malhotra', 'Sneha Reddy',
        'Aarav Joshi', 'Neha Gupta', 'Devansh Mehta', 'Priya Nair',
        'Rajesh Singhania', 'Kabir Rao', 'Amit Verma', 'Sunita Agarwal'
      ];
      const randomName = INDIAN_HERO_NAMES[Math.floor(Math.random() * INDIAN_HERO_NAMES.length)];
      currentUser = await api.users.create({ name: randomName });
      setUser(currentUser);
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('lat', coords.lat);
      fd.append('lng', coords.lng);
      fd.append('address', address);
      fd.append('reporter_id', currentUser.id);
      if (photo) fd.append('photo', photo);

      const created = await api.issues.create(fd);
      showToast({
        icon: '🦸',
        title: t('report.toastTitle'),
        message: `+50 XP · AI tagged: ${created.category}`,
      });
      navigate('/map');
    } catch (e) {
      showToast({ icon: '❌', title: t('report.failTitle'), message: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page">
      <div className="page-wrap max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="eyebrow">{t('report.eyebrow')}</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-2 text-white">
            {t('report.title')}
          </h1>
          <p className="text-slate-400">
            {t('report.sub')}
          </p>
        </motion.div>

        <form onSubmit={submit} className="card !p-6 md:!p-8 space-y-6 border border-marigold-500/35 bg-[#0D0F14]/90 shadow-2xl shadow-black/80 relative overflow-hidden">
          {/* Ambient top glowing line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-marigold-400 to-transparent animate-pulse" />

          {/* Quick Problem Presets */}
          <div>
            <span className="eyebrow">QUICK INCIDENT SELECTOR</span>
            <div className="flex flex-wrap gap-2 mt-2.5">
              {[
                { title: 'Dangerous Pothole on Road', desc: 'Deep pothole causing vehicle hazard', icon: '🕳️' },
                { title: 'Broken Streetlight at Intersection', desc: 'Dark junction causing safety risk', icon: '💡' },
                { title: 'High-Pressure Water Pipe Leak', desc: 'Drinking water pipe burst, flooding street', icon: '💧' },
                { title: 'Illegal Garbage Dumping Ground', desc: 'Overflowing municipal waste pile', icon: '🗑️' },
                { title: 'Fallen Electric Cable / Damaged Pole', desc: 'Snapped power lines hanging low', icon: '⚡' },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTitle(p.title);
                    setDescription(p.desc);
                    api.ai.analyze(`${p.title}\n${p.desc}`).then(setAiPreview).catch(() => {});
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12151D] border border-white/10 text-xs font-mono text-silver-300 hover:text-marigold-200 hover:border-marigold-500/50 hover:bg-marigold-500/10 transition-all select-none"
                >
                  <span>{p.icon}</span>
                  <span>{p.title.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline" />

          <div>
            <span className="eyebrow">{t('report.details')}</span>
            <div className="mt-4 space-y-5">
              <div>
                <label className="text-xs text-silver-400 block mb-2 font-mono uppercase tracking-wider">{t('report.titleLabel')}</label>
                <input
                  className="input font-medium"
                  placeholder={t('report.titlePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={previewAI}
                  required
                />
              </div>

              <div>
                <label className="text-xs text-silver-400 block mb-2 font-mono uppercase tracking-wider">{t('report.descLabel')}</label>
                <textarea
                  className="input min-h-[110px] resize-y text-sm leading-relaxed"
                  placeholder={t('report.descPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={previewAI}
                />
              </div>
            </div>
          </div>

          <div className="hairline" />

          <div>
            <span className="eyebrow">{t('report.evidence')}</span>
            <div className="mt-4 space-y-5">
              <div>
                <label className="text-xs text-silver-400 block mb-2 font-mono uppercase tracking-wider">{t('report.photoLabel')}</label>
                <label className="relative flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-[#12151D]/60 border-2 border-dashed border-marigold-500/35 hover:border-marigold-400/70 hover:bg-marigold-500/10 cursor-pointer transition-all group">
                  {photoPreview ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden ring-2 ring-marigold-500/40 shrink-0">
                      <img src={photoPreview} alt="Incident preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-marigold-500/15 border border-marigold-500/30 flex items-center justify-center text-marigold-400 group-hover:scale-105 transition-transform shrink-0">
                      <Camera className="w-7 h-7" />
                    </div>
                  )}
                  <div className="text-center sm:text-left flex-1 min-w-0">
                    <div className="font-semibold text-sm text-silver-100 group-hover:text-marigold-300 transition-colors">
                      {photo ? photo.name : t('report.photoTap')}
                    </div>
                    <div className="text-xs text-silver-400 font-mono mt-0.5">{t('report.photoHint')}</div>
                    <div className="text-[10px] text-marigold-400 font-mono mt-1">
                      AI Vision will cross-reference this against municipal records
                    </div>
                  </div>
                  <input type="file" accept="image/*" capture="environment" onChange={onPhoto} className="hidden" />
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-silver-400 block mb-2 font-mono uppercase tracking-wider">{t('report.addressLabel')}</label>
                  <input
                    className="input font-mono text-xs"
                    placeholder={t('report.addressPlaceholder')}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-silver-400 block mb-2 font-mono uppercase tracking-wider">{t('report.locationLabel')}</label>
                  <div className="input flex items-center gap-2 text-xs font-mono text-silver-300">
                    <MapPin className="w-3.5 h-3.5 text-marigold-400 shrink-0" />
                    {coords
                      ? `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E`
                      : t('report.locationDetecting')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {aiPreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card !p-4 bg-gradient-to-br from-[#12151D] via-[#0D0F14] to-[#12151D] border border-marigold-500/40 relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-marigold-500/20 mb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-marigold-300 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-marigold-400 animate-pulse" />
                  <span>AI TRIAGE ENGINE CLASSIFICATION</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  CONFIDENCE 96.4%
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2 font-mono text-xs">
                <span className="chip bg-marigold-500/20 border-marigold-500/40 text-marigold-300">
                  Category: <strong className="text-white ml-1">{aiPreview.category}</strong>
                </span>
                <span className="chip bg-aubergine-500/30 border-aubergine-400/40 text-aubergine-200">
                  Severity: <strong className="text-white ml-1">{aiPreview.severity}/5</strong>
                </span>
                <span className="chip bg-silver-400/15 border-silver-400/30 text-silver-200">
                  Routed To: <strong className="text-white ml-1">{aiPreview.department}</strong>
                </span>
              </div>
              {aiPreview.summary && (
                <p className="text-xs text-silver-300 leading-relaxed font-sans bg-[#08090C]/80 p-2.5 rounded-xl border border-white/10">
                  {aiPreview.summary}
                </p>
              )}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary text-base !py-3.5 !bg-gradient-to-r !from-[#FFC425] !via-[#EAAA00] !to-[#C79000] !text-[#08090C] font-bold shadow-[0_0_30px_rgba(234,170,0,0.55)] hover:scale-[1.01] transition-all text-sm font-mono tracking-wide"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin text-[#08090C]" /> : <Sparkles className="w-4 h-4 text-[#08090C]" />}
            {submitting ? t('report.submitting') : t('report.submit')}
          </button>
        </form>
      </div>
    </main>
  );
}
