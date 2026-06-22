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
    <main className="pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Report an <span className="gradient-text">Issue</span>
          </h1>
          <p className="text-slate-400">
            Snap a photo, drop a pin, hit submit. AI does the rest.
          </p>
        </motion.div>

        <form onSubmit={submit} className="card space-y-5">
          <div>
            <label className="text-sm font-medium block mb-2">Title</label>
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
            <label className="text-sm font-medium block mb-2">Description</label>
            <textarea
              className="input min-h-[100px] resize-y"
              placeholder="What's wrong? When did you notice it? Any safety risks?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={previewAI}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Photo (optional)</label>
            <label className="card cursor-pointer flex items-center gap-3 hover:border-brand-400/40 transition !p-3">
              {photoPreview ? (
                <img src={photoPreview} alt="" className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-white/5 grid place-items-center">
                  <Camera className="w-6 h-6 text-slate-300" />
                </div>
              )}
              <div>
                <div className="font-medium text-sm">
                  {photo ? photo.name : 'Tap to choose a photo'}
                </div>
                <div className="text-xs text-slate-400">JPG, PNG, WEBP — up to 10MB</div>
              </div>
              <input type="file" accept="image/*" capture="environment" onChange={onPhoto} className="hidden" />
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Address (optional)</label>
              <input
                className="input"
                placeholder="MG Road, Sector 14..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Location</label>
              <div className="input flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-brand-400" />
                {coords
                  ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                  : 'Detecting...'}
              </div>
            </div>
          </div>

          {aiPreview && (
            <div className="card !p-4 border-brand-400/30 bg-brand-500/5">
              <div className="flex items-center gap-2 text-sm font-medium text-brand-300 mb-2">
                <Sparkles className="w-4 h-4" /> AI preview
              </div>
              <div className="text-sm text-slate-200">
                Category: <strong>{aiPreview.category}</strong> · Severity:{' '}
                <strong>{aiPreview.severity}/5</strong> · Routed to:{' '}
                <strong>{aiPreview.department}</strong>
              </div>
              <div className="text-xs text-slate-400 mt-1">{aiPreview.summary}</div>
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
