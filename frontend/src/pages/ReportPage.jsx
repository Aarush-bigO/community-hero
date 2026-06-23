import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, MapPin, Loader2, Sparkles } from 'lucide-react';
import { api } from '../utils/api';
import { useStore } from '../store/useStore';

export default function ReportPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const showToast = useStore((s) => s.showToast);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [coords, setCoords] = useState(null);
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
      currentUser = await api.users.create({ name: 'Hero ' + Math.floor(Math.random() * 9999) });
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
        title: 'Reported!',
        message: `+50 XP · AI tagged: ${created.category}`,
      });
      navigate('/map');
    } catch (e) {
      showToast({ icon: '❌', title: 'Failed', message: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page">
      <div className="page-wrap max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="eyebrow">Report</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-2 text-white">
            Report an issue
          </h1>
          <p className="text-slate-400">
            Add a photo and location. Our AI categorizes and routes it for you.
          </p>
        </motion.div>

        <form onSubmit={submit} className="card !p-6 md:!p-8 space-y-6">
          <div>
            <span className="eyebrow">Details</span>
            <div className="mt-4 space-y-5">
              <div>
                <label className="text-xs text-slate-400 block mb-2">Title</label>
                <input
                  className="input"
                  placeholder="e.g. Massive pothole on MG Road"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={previewAI}
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-2">Description</label>
                <textarea
                  className="input min-h-[100px] resize-y"
                  placeholder="What's wrong? When did you notice it? Any safety risks?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={previewAI}
                />
              </div>
            </div>
          </div>

          <div className="hairline" />

          <div>
            <span className="eyebrow">Evidence &amp; location</span>
            <div className="mt-4 space-y-5">
              <div>
                <label className="text-xs text-slate-400 block mb-2">Photo (optional)</label>
                <label className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.04] border border-white/10 cursor-pointer hover:border-white/20 hover:bg-white/[0.06] transition">
                  {photoPreview ? (
                    <img src={photoPreview} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="icon-tile w-16 h-16 rounded-lg">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-sm text-white">
                      {photo ? photo.name : 'Tap to choose a photo'}
                    </div>
                    <div className="text-xs text-slate-400">JPG, PNG, WEBP — up to 10MB</div>
                  </div>
                  <input type="file" accept="image/*" capture="environment" onChange={onPhoto} className="hidden" />
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-2">Address (optional)</label>
                  <input
                    className="input"
                    placeholder="MG Road, Sector 14..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-2">Location</label>
                  <div className="input flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-brand-300" />
                    {coords
                      ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                      : 'Detecting...'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {aiPreview && (
            <div className="card !p-4 border-brand-400/25">
              <div className="flex items-center gap-2 text-xs font-medium text-brand-300 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> AI analysis
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="chip">Category: {aiPreview.category}</span>
                <span className="chip">Severity: {aiPreview.severity}/5</span>
                <span className="chip">Routed to: {aiPreview.department}</span>
              </div>
              {aiPreview.summary && (
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">{aiPreview.summary}</p>
              )}
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full text-base">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </main>
  );
}
