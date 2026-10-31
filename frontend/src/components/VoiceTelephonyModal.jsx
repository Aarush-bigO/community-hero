import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneCall, PhoneIncoming, PhoneOutgoing, X, Radio, Activity,
  ShieldAlert, Sparkles, Globe, Wifi, Volume2, Flame, Zap, Droplets
} from 'lucide-react';
import { api } from '../utils/api';
import { useStore } from '../store/useStore';

const PRESET_LOCATIONS = [
  { label: 'Connaught Place Block B (CP)', coords: { lat: 28.6315, lng: 77.2167 }, zone: 'New Delhi Central' },
  { label: 'Barakhamba Road Metro Gate 3', coords: { lat: 28.6297, lng: 77.2285 }, zone: 'New Delhi East' },
  { label: 'Janpath & Tolstoy Marg', coords: { lat: 28.6255, lng: 77.2185 }, zone: 'New Delhi South' },
  { label: 'Lalit Ashok, Kumara Krupa', coords: { lat: 12.9716, lng: 77.5946 }, zone: 'Bengaluru Central' },
  { label: 'MP Nagar Zone 1', coords: { lat: 23.2599, lng: 77.4126 }, zone: 'Bhopal Central' },
];

const PRESET_PHONES = [
  '+91 98710 44821',
  '+91 98112 39012',
  '+91 97110 55123',
  '+91 95988 19219',
];

export default function VoiceTelephonyModal({ isOpen, onClose, onDialSuccess }) {
  const showToast = useStore((s) => s.showToast);
  const setTelephonySession = useStore((s) => s.setTelephonySession);
  const setActiveVoiceCall = useStore((s) => s.setActiveVoiceCall);
  const voicePersona = useStore((s) => s.voicePersona || 'female');
  const setVoicePersona = useStore((s) => s.setVoicePersona);

  const [phone, setPhone] = useState('+91 98710 44821');
  const [selectedLocation, setSelectedLocation] = useState(PRESET_LOCATIONS[0].label);
  const [direction, setDirection] = useState('inbound');
  const [language, setLanguage] = useState('hi');
  const [scenario, setScenario] = useState('gas_leak');
  const [isDialing, setIsDialing] = useState(false);

  if (!isOpen) return null;

  const handleDial = async (e) => {
    e?.preventDefault();
    setIsDialing(true);

    try {
      const res = await api.voice.dial({
        phone,
        location: selectedLocation,
        scenario,
        language,
        direction,
      });

      if (res.session) {
        setTelephonySession(res.session);
        setActiveVoiceCall({
          phone: res.session.caller_phone,
          language: res.session.caller_language,
          urgency_score: 9.6,
          scenario,
        });
      }

      showToast({
        type: 'live',
        message: `📞 [TELEPHONY] Connecting ${direction === 'inbound' ? 'Inbound Call from' : 'Outbound Call to'} ${phone}…`,
      });

      if (onDialSuccess) {
        onDialSuccess(res.session);
      }
      onClose();
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to initiate telephony session: ' + err.message });
    } finally {
      setIsDialing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-slate-950 border border-white/[0.12] rounded-3xl p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                Simulate Telephony Call
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  VoiceStudio SIP/WebRTC
                </span>
              </h3>
              <p className="text-xs text-slate-400">Configure simulated carrier line, caller ID & WebRTC latency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleDial} className="space-y-4">
          {/* Call Direction */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Call Direction</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('inbound')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition ${
                  direction === 'inbound'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:bg-white/[0.06]'
                }`}
              >
                <PhoneIncoming className="w-3.5 h-3.5" /> Inbound (Citizen to 311)
              </button>
              <button
                type="button"
                onClick={() => setDirection('outbound')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition ${
                  direction === 'outbound'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:bg-white/[0.06]'
                }`}
              >
                <PhoneOutgoing className="w-3.5 h-3.5" /> Outbound (CAD to Unit)
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Caller ID Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/[0.1] text-sm text-white font-mono focus:outline-none focus:border-rose-500 transition"
              placeholder="+91 98710 44821"
              required
            />
            <div className="flex items-center gap-1.5 mt-1.5">
              {PRESET_PHONES.map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setPhone(num)}
                  className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 font-mono"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Location Landmark */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Geographic Landmark</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-rose-500 transition"
            >
              {PRESET_LOCATIONS.map((loc) => (
                <option key={loc.label} value={loc.label} className="bg-slate-950 text-white">
                  {loc.label} — [{loc.zone}]
                </option>
              ))}
            </select>
          </div>

          {/* Dispatcher Voice Persona (The Girl / That Boy) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Dispatcher Voice Persona</span>
              <span className="text-[10px] text-marigold-400 font-normal">Natural Human Speech</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVoicePersona('female')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition ${
                  voicePersona === 'female'
                    ? 'bg-rose-500/20 text-rose-200 border-rose-500/40 shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:bg-white/[0.06]'
                }`}
              >
                <span>👩</span> The Girl (Priya)
              </button>
              <button
                type="button"
                onClick={() => setVoicePersona('male')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition ${
                  voicePersona === 'male'
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:bg-white/[0.06]'
                }`}
              >
                <span>👨</span> That Boy (Rahul)
              </button>
            </div>
          </div>

          {/* Language & Voice AI Stack */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="hi" className="bg-slate-950">हिन्दी (Sarvam AI STT/TTS)</option>
                <option value="en" className="bg-slate-950">English (Bolna / Deepgram)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Emergency Preset</label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="gas_leak" className="bg-slate-950">🔥 Gas Leak (CP Block B)</option>
                <option value="fire_hazard" className="bg-slate-950">⚡ Transformer Fire</option>
                <option value="swarm_surge" className="bg-slate-950">🚨 Swarm Surge (14 Callers)</option>
                <option value="water_rupture" className="bg-slate-950">💧 Water Main Rupture</option>
              </select>
            </div>
          </div>

          {/* WebRTC Telemetry Badge */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Wifi className="w-3.5 h-3.5" /> WebRTC Lossless
            </span>
            <span>RTT: ~18ms</span>
            <span>Jitter: 1.9ms</span>
            <span className="text-slate-300">Codec: Opus 48kHz</span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isDialing}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
            >
              {isDialing ? (
                <>
                  <Radio className="w-4 h-4 animate-spin" />
                  Connecting Carrier Line…
                </>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" />
                  Connect Call Line Now
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

