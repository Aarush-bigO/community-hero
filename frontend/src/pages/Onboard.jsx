import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { api } from '../utils/api';
import { useStore } from '../store/useStore';

export default function Onboard() {
  const navigate = useNavigate();
  const setUser = useStore((s) => s.setUser);
  const showToast = useStore((s) => s.showToast);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const u = await api.users.create({ name, email: email || undefined });
      setUser(u);
      showToast({ icon: '🦸', title: `Welcome, ${u.name}!`, message: 'You are now a Community Hero.' });
      navigate('/');
    } catch (e) {
      showToast({ icon: '❌', title: 'Failed', message: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-32 pb-12 px-6 max-w-md mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div className="mb-6">
          <div className="icon-tile mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="eyebrow">GET STARTED</p>
          <h1 className="font-display text-2xl font-bold mt-2 mb-1 text-white">Become a Hero</h1>
          <p className="text-sm text-slate-400">Quick sign-in. No password. No spam.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Name</label>
            <input className="input" placeholder="Aarush Bharti" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Email (optional)</label>
            <input
              type="email"
              className="input"
              placeholder="hero@city.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Joining...' : 'Join the cause'}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
