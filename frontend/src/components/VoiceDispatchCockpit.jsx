import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio, PhoneCall, PhoneIncoming, AlertTriangle, ShieldAlert,
  Flame, Droplets, Zap, Activity, CheckCircle2, Clock, Users,
  Compass, Volume2, Eye, Play, RefreshCw, Sparkles, ChevronRight,
  Maximize2, Minimize2, ExternalLink, ShieldCheck, Waves, MessageSquare,
  Mic, MicOff, Send, VolumeX, CornerDownLeft, Hand, PhoneOff,
  Ear, Brain, AudioLines, Settings2, Sliders, Wifi, Check
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useLang } from '../i18n';
import { api, assetUrl } from '../utils/api';
import WaveformPlayer from './WaveformPlayer';
import VoiceTelephonyModal from './VoiceTelephonyModal';
import { speakClear, stopClearSpeech } from '../utils/speech';

const SCENARIOS = [
  {
    id: 'gas_leak',
    label: 'Major Gas Leak (CP Block B)',
    shortLabel: 'Gas Leak',
    icon: Flame,
    color: 'text-rose-400',
  },
  {
    id: 'fire_hazard',
    label: 'Transformer Fire (Barakhamba)',
    shortLabel: 'Fire Hazard',
    icon: Zap,
    color: 'text-amber-400',
  },
  {
    id: 'swarm_surge',
    label: 'Swarm Surge (14 Callers)',
    shortLabel: 'Swarm Surge',
    icon: Users,
    color: 'text-rose-400',
  },
  {
    id: 'water_rupture',
    label: 'Water Main Burst (Janpath)',
    shortLabel: 'Water Main',
    icon: Droplets,
    color: 'text-cyan-400',
  },
];

const DEFAULT_PHOTOS = {
  gas_leak: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
  fire_hazard: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&auto=format&fit=crop&q=80',
  water_rupture: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop&q=80',
  water_main_rupture: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop&q=80',
  water: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
  pothole: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
  streetlight: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
  waste: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
  infrastructure: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
  other: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
};

const SCENARIO_DEFAULTS = {
  gas_leak: 'Major commercial LPG gas leak detected at Connaught Place Block B. High explosion and fire hazard in pedestrian zone.',
  fire_hazard: 'High voltage electrical transformer exploded near Barakhamba metro station gate 3 with live sparks on road.',
  swarm_surge: 'Repeat citizen call: Connaught Place Block B shops evacuating due to intense gas leak fumes.',
  water_rupture: 'Massive drinking water pipe burst at Janpath crossing road is flooded.',
};

const SCENARIO_DEFAULTS_HI = {
  gas_leak: 'कनॉट प्लेस ब्लॉक B में बहुत बड़ा कमर्शियल गैस लीक हो गया है, तुरंत इमरजेंसी टीम भेजो।',
  fire_hazard: 'बाराखंभा मेट्रो स्टेशन गेट 3 के पास 11kV ट्रांसफॉर्मर में भयंकर स्पार्किंग और आग लग गई है।',
  swarm_surge: 'कनॉट प्लेस ब्लॉक B में गैस की तेज बदबू से सभी दुकानें खाली कराई जा रही हैं।',
  water_rupture: 'जनपथ क्रॉसिंग पर मुख्य पेयजल पाइपलाइन फट गई है और पूरी सड़क पर पानी भर गया है।',
};

// VoiceStudio Call Phase Stepper
const CALL_PHASES = ['dialing', 'ringing', 'in_call', 'ended'];
const PHASE_LABELS = {
  dialing: 'Carrier Dial',
  ringing: 'Ringing Line',
  in_call: 'In Call (Live)',
  ended: 'Resolved CAD',
};

function StatusTimeline({ status = 'in_call' }) {
  const currentIdx = CALL_PHASES.indexOf(status) !== -1 ? CALL_PHASES.indexOf(status) : 2;
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-mono select-none">
      {CALL_PHASES.map((phase, idx) => {
        const isDone = idx < currentIdx || (idx === currentIdx && phase === 'ended');
        const isActive = idx === currentIdx;
        return (
          <div key={phase} className="flex items-center gap-1.5">
            {idx > 0 && (
              <span className={`h-px w-2.5 sm:w-4 transition-colors ${idx <= currentIdx ? 'bg-rose-500' : 'bg-white/10'}`} />
            )}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border transition-all ${
                isActive && !isDone
                  ? 'bg-rose-500/20 border-rose-500/50 text-white shadow-sm'
                  : isDone
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-500'
              }`}
            >
              {isActive && !isDone && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              )}
              {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              {PHASE_LABELS[phase]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// VoiceStudio Agent State Indicator (Listening / Thinking / Speaking)
function AgentStateIndicator({ state = 'listening' }) {
  const config = {
    listening: { label: 'Listening to Citizen', icon: Ear, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    thinking: { label: 'NLP Triage & Geocoding', icon: Brain, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    speaking: { label: 'Transmitting Speech', icon: AudioLines, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    idle: { label: 'Operator Override', icon: Radio, color: 'text-slate-400 bg-white/[0.03] border-white/[0.08]' },
  }[state] || { label: 'Standby', icon: Radio, color: 'text-slate-400 bg-white/[0.03] border-white/[0.08]' };

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium font-mono ${config.color}`}>
      <Icon className="w-3.5 h-3.5 animate-pulse" />
      {config.label}
    </span>
  );
}

export default function VoiceDispatchCockpit({ isStandalone = false, onToggleStandalone }) {
  const voiceDispatches = useStore((s) => s.voiceDispatches);
  const setVoiceDispatches = useStore((s) => s.setVoiceDispatches);
  const addVoiceDispatch = useStore((s) => s.addVoiceDispatch);
  const updateVoiceDispatch = useStore((s) => s.updateVoiceDispatch);
  const liveTranscript = useStore((s) => s.liveTranscript);
  const activeVoiceCall = useStore((s) => s.activeVoiceCall);
  const setActiveVoiceCall = useStore((s) => s.setActiveVoiceCall);
  const clearLiveTranscript = useStore((s) => s.clearLiveTranscript);
  const setFocusCoords = useStore((s) => s.setFocusCoords);
  const showToast = useStore((s) => s.showToast);
  const lang = useLang((s) => s.lang);
  const isHindi = lang === 'hi';

  // VoiceStudio Telephony Session State from Store
  const telephonySession = useStore((s) => s.telephonySession);
  const setTelephonySession = useStore((s) => s.setTelephonySession);
  const setTakeover = useStore((s) => s.setTakeover);
  const setAgentState = useStore((s) => s.setAgentState);

  const [simulating, setSimulating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('gas_leak');
  const [minimized, setMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveSpokenText, setLiveSpokenText] = useState('');
  const [isProcessingLiveCall, setIsProcessingLiveCall] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [audioFeedbackOn, setAudioFeedbackOn] = useState(true);

  // Operator Takeover & Say-on-call State
  const [operatorSpeechInput, setOperatorSpeechInput] = useState('');
  const [isSendingOperatorSpeech, setIsSendingOperatorSpeech] = useState(false);
  const [isTelephonyModalOpen, setIsTelephonyModalOpen] = useState(false);

  const canvasRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    api.voice.dispatches()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVoiceDispatches(data);
        }
      })
      .catch(() => {});

    api.voice.telephonySession()
      .then((data) => {
        if (data?.session) setTelephonySession(data.session);
      })
      .catch(() => {});
  }, [setVoiceDispatches, setTelephonySession]);

  useEffect(() => {
    if (liveTranscript && liveTranscript.length > 0) {
      transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [liveTranscript]);

  const stopMicStream = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  const startMicRecording = async () => {
    // 1. Audio stream for real visualizer & volume meter
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;
      }
    } catch (err) {
      console.warn('Microphone hardware access notice:', err);
    }

    // Default emergency draft in case browser speech-to-text is blocked (Brave Shields, Safari, etc.)
    const defaultText = isHindi
      ? (SCENARIO_DEFAULTS_HI[selectedScenario] || 'कनॉट प्लेस ब्लॉक B में बहुत बड़ा गैस लीक')
      : (SCENARIO_DEFAULTS[selectedScenario] || 'Major commercial LPG gas leak detected at Connaught Place Block B');

    // 2. Speech recognition with multi-browser tolerance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = isHindi ? 'hi-IN' : (navigator.language || 'en-US');
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onresult = (event) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + ' ';
          }
          if (current.trim()) {
            setLiveSpokenText(current.trim());
          }
        };

        recognition.onerror = (err) => {
          console.warn('Speech recognition warning/block (e.g. Brave shields):', err.error);
          // If browser speech-to-text is blocked, ensure the input is pre-populated with active scenario
          setLiveSpokenText((prev) => prev || defaultText);
        };

        recognition.onend = () => {
          // Finished listening
        };

        recognition.start();
      } catch (e) {
        console.warn('Recognition start exception:', e);
        setLiveSpokenText(defaultText);
      }
    } else {
      // Browser without SpeechRecognition API
      setLiveSpokenText(defaultText);
    }

    setIsListening(true);
    setAgentState('listening');
    clearLiveTranscript();
    setActiveVoiceCall({
      phone: '+91 95988 19219 (Live Mic)',
      language: isHindi ? 'हिन्दी (Live Mic)' : 'English (Live Mic)',
      urgency_score: 9.6,
      scenario: 'Live Voice Intake',
      startedAt: Date.now(),
    });
    setTelephonySession({ status: 'in_call', agent_state: 'listening' });
    showToast({
      type: 'live',
      message: isHindi ? '🎙️ माइक्रोफ़ोन सक्रिय: अपनी आपातकालीन स्थिति बोलें!' : '🎙️ Microphone listening... Speak your emergency!',
    });
  };

  const handleStopAndDispatch = async (customSpeech) => {
    const fallbackText = isHindi
      ? (SCENARIO_DEFAULTS_HI[selectedScenario] || 'कनॉट प्लेस ब्लॉक B में बहुत बड़ा गैस लीक')
      : (SCENARIO_DEFAULTS[selectedScenario] || 'Major commercial LPG gas leak detected at Connaught Place Block B');

    const speech = (customSpeech || liveSpokenText || customInput || fallbackText).trim();

    setIsListening(false);
    stopMicStream();
    setIsProcessingLiveCall(true);
    setAgentState('thinking');

    try {
      const res = await api.voice.liveCall({
        speech_text: speech,
        language: isHindi ? 'hi' : 'en',
        caller_phone: '+91 95988 19219',
      });

      setAgentState('speaking');

      // Real Audible Voice Response via Crystal-Clear Speech Engine
      if (audioFeedbackOn && res.agent_response) {
        speakClear(res.agent_response, {
          language: res.language || (isHindi ? 'hi' : 'en'),
          role: 'agent',
          volume: 1.0,
          playChime: true,
          onEnd: () => setAgentState('listening'),
        });
      } else {
        setTimeout(() => setAgentState('listening'), 2500);
      }

      if (res.event?.lat && res.event?.lng) {
        setFocusCoords({ lat: res.event.lat, lng: res.event.lng });
      }

      showToast({
        type: 'live',
        message: res.status === 'clustered'
          ? `🚨 Swarm Surge Clustered under #${res.ticket_id}!`
          : `🎙️ Emergency Work Order #${res.ticket_id} Dispatched!`,
      });
    } catch (err) {
      showToast({ type: 'error', message: 'Dispatch failed: ' + err.message });
      setAgentState('listening');
    } finally {
      setIsProcessingLiveCall(false);
      setLiveSpokenText('');
      setCustomInput('');
    }
  };

  // Human Operator Takeover Handlers (VoiceStudio Intercom)
  const handleToggleTakeover = async (enabled) => {
    setTakeover(enabled);
    if (enabled) {
      setAgentState('idle');
      showToast({ type: 'live', message: '🚨 Human Operator Takeover engaged. AI autonomous speech suspended.' });
    } else {
      setAgentState('listening');
      showToast({ type: 'live', message: '🤖 Human Operator disengaged. AI autonomous dispatcher resumed.' });
    }
    try {
      await api.voice.takeover({ takeover: enabled });
    } catch {}
  };

  const handleSayOnCall = async (e, customText) => {
    e?.preventDefault();
    const text = (customText || operatorSpeechInput || '').trim();
    if (!text) return;
    setIsSendingOperatorSpeech(true);
    setOperatorSpeechInput('');

    // Audible speech synthesis for operator's voice
    if (audioFeedbackOn) {
      speakClear(text, {
        language: isHindi ? 'hi' : 'en',
        role: 'operator',
        volume: 1.0,
        playChime: true,
      });
    }

    try {
      await api.voice.sayOnCall({ text, language: isHindi ? 'hi' : 'en' });
      showToast({ type: 'live', message: '📢 Transmitted verbal order to caller' });
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to speak on call: ' + err.message });
    } finally {
      setIsSendingOperatorSpeech(false);
    }
  };

  const handleHangupCall = async () => {
    try {
      await api.voice.hangup({ reason: 'Concluded by operator' });
      setTelephonySession({ status: 'ended' });
      showToast({ type: 'live', message: '📞 Telephony call concluded & archived in CAD records' });
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to hang up: ' + err.message });
    }
  };

  // Audio Waveform Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isLive = activeVoiceCall || simulating || isListening;
      const bars = 22;
      const barWidth = 3;
      const gap = 3;
      const totalWidth = bars * (barWidth + gap) - gap;
      const startX = (canvas.width - totalWidth) / 2;

      let realAudioData = null;
      if (analyserRef.current && isListening) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        realAudioData = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(realAudioData);
      }

      for (let i = 0; i < bars; i++) {
        let height;
        if (realAudioData) {
          const dataIndex = Math.min(realAudioData.length - 1, Math.floor((i / bars) * realAudioData.length));
          const value = realAudioData[dataIndex] || 0;
          height = Math.max(3, (value / 255) * 24 + 4);
        } else if (isLive) {
          const wave1 = Math.sin(phase + i * 0.45);
          const wave2 = Math.cos(phase * 0.8 + i * 0.25);
          height = Math.max(4, Math.abs(wave1 * wave2) * 22 + 4);
        } else {
          const ambientWave = Math.sin(phase * 0.6 + i * 0.3);
          height = Math.max(3, (ambientWave + 1) * 3.5 + 3);
        }

        const x = startX + i * (barWidth + gap);
        const y = (canvas.height - height) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        if (isListening) {
          gradient.addColorStop(0, '#f43f5e');
          gradient.addColorStop(0.5, '#fb7185');
          gradient.addColorStop(1, '#e11d48');
        } else if (isLive) {
          gradient.addColorStop(0, '#f43f5e');
          gradient.addColorStop(0.5, '#38bdf8');
          gradient.addColorStop(1, '#06b6d4');
        } else {
          gradient.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.25)');
        }

        ctx.fillStyle = gradient;
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, height, 1.5);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, barWidth, height);
        }
      }

      phase += isLive ? 0.14 : 0.04;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [activeVoiceCall, simulating, isListening]);

  const handleSimulate = async (scenarioId) => {
    setSimulating(true);
    clearLiveTranscript();
    setAgentState('thinking');

    const selected = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
    setActiveVoiceCall({
      phone: '+91 98710 44821',
      language: isHindi ? 'हिन्दी (Sarvam AI)' : 'English (Bolna AI)',
      urgency_score: scenarioId === 'swarm_surge' ? 10.0 : 9.5,
      scenario: selected.shortLabel,
      startedAt: Date.now(),
    });

    setTelephonySession({ status: 'in_call', agent_state: 'speaking' });

    try {
      await api.voice.simulate(scenarioId, lang);
      showToast({
        type: 'live',
        message: isHindi
          ? `🎙️ वॉयस डिस्पैच: ${selected.shortLabel}`
          : `🎙️ Voice Dispatch: ${selected.shortLabel}`,
      });

      // Crystal-clear audible voice response for simulation
      if (audioFeedbackOn) {
        const spokenSim = isHindi
          ? `आपातकालीन कार्य आदेश दर्ज कर लिया गया है। नजदीकी त्वरित प्रतिक्रिया टीम को तुरंत रवाना कर दिया गया है।`
          : `Emergency Work Order logged for ${selected.shortLabel}. Rapid Response Hazard Unit 4 has been dispatched with sirens.`;

        setTimeout(() => {
          speakClear(spokenSim, {
            language: isHindi ? 'hi' : 'en',
            role: 'agent',
            volume: 1.0,
            playChime: true,
            onEnd: () => setAgentState('listening'),
          });
        }, 1200);
      }
    } catch {
      showToast({ type: 'live', message: 'Simulation triggered' });
    } finally {
      setTimeout(() => {
        setSimulating(false);
        setAgentState('listening');
      }, 3500);
    }
  };

  const handleFocusIncident = (incident) => {
    if (incident.lat && incident.lng) {
      setFocusCoords({ lat: incident.lat, lng: incident.lng });
      showToast({
        type: 'live',
        message: `🛰️ Camera locked onto target`,
      });
    }
  };

  const activeUrgency = activeVoiceCall?.urgency_score || (voiceDispatches[0]?.urgency_score || 8.5);
  const takeoverActive = telephonySession?.takeover || false;

  return (
    <div className={`pointer-events-auto transition-all duration-300 ${
      isStandalone
        ? 'w-full h-full max-h-[calc(100vh-5.5rem)] max-w-[1720px] mx-auto px-4 md:px-6 flex flex-col min-h-0'
        : 'w-full max-w-7xl mx-auto'
    }`}>
      {/* 1. TOP TACTICAL COMMAND BAR — VOICE STUDIO ENHANCED */}
      <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-3 md:p-3.5 mb-4 shadow-xl relative overflow-hidden shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Engine Status & Timeline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <h3 className="font-display text-sm md:text-base font-bold text-white tracking-tight">
                Voice AI Dispatch
              </h3>
            </div>

            {/* VoiceStudio Agent State Indicator */}
            <AgentStateIndicator state={telephonySession?.agent_state || (isListening ? 'listening' : isProcessingLiveCall ? 'thinking' : 'listening')} />

            {/* VoiceStudio Status Timeline */}
            <div className="hidden xl:block pl-2 border-l border-white/[0.08]">
              <StatusTimeline status={telephonySession?.status || 'in_call'} />
            </div>
          </div>

          {/* Quick Telemetry & WebRTC indicators */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-emerald-400 font-mono text-[11px]">
              <Wifi className="w-3 h-3" />
              {telephonySession?.latency_ms || 18}ms RTT
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-amber-300 font-mono text-[11px]">
              <Users className="w-3 h-3 text-amber-400" />
              &lt;500m Radar
            </span>
          </div>

          {/* Preset Pills & Simulator Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-0.5 bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-x-auto">
              {SCENARIOS.map((sc) => {
                const Icon = sc.icon;
                const isSelected = selectedScenario === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenario(sc.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-marigold-500/20 text-marigold-200 border border-marigold-400/40 shadow-sm'
                        : 'text-silver-400 hover:text-silver-200 hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? sc.color : 'text-silver-500'}`} />
                    <span>{sc.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* REAL LIVE MICROPHONE CALL BUTTON */}
            <button
              onClick={isListening ? () => handleStopAndDispatch() : startMicRecording}
              disabled={isProcessingLiveCall}
              className={`font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-lg active:scale-95 disabled:opacity-50 ${
                isListening
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-rose-500/40 ring-2 ring-rose-400/50'
                  : 'bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-rose-500/30'
              }`}
              title={isListening ? 'Click to finish speaking and dispatch' : 'Click to talk live with your microphone'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 animate-bounce" />
                  <span>Stop & Dispatch</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-rose-200" />
                  <span>Talk Live (Mic)</span>
                </>
              )}
            </button>

            {/* VoiceStudio Telephony Modal Trigger */}
            <button
              onClick={() => setIsTelephonyModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition shadow-sm"
              title="Configure Simulated Carrier Telephony Line"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span>Carrier Line</span>
            </button>

            {/* TTS Audio Mute/Unmute Toggle */}
            <button
              onClick={() => {
                if (audioFeedbackOn) stopClearSpeech();
                setAudioFeedbackOn(!audioFeedbackOn);
              }}
              className={`p-1.5 rounded-xl border transition ${
                audioFeedbackOn
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-white/[0.08]'
              }`}
              title={audioFeedbackOn ? 'Voice Response Audio: ON' : 'Voice Response Audio: MUTED'}
            >
              {audioFeedbackOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Simulate Button */}
            <button
              onClick={() => handleSimulate(selectedScenario)}
              disabled={simulating || isListening}
              className="bg-gradient-to-r from-[#FFC425] via-[#EAAA00] to-[#C79000] hover:from-[#FFD12E] hover:to-[#EAAA00] text-[#08090C] font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-marigold-500/30 active:scale-95 disabled:opacity-50"
            >
              {simulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Calling…
                </>
              ) : (
                <>
                  <PhoneIncoming className="w-3.5 h-3.5" /> Simulate
                </>
              )}
            </button>

            {onToggleStandalone && (
              <button
                onClick={onToggleStandalone}
                className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 transition"
              >
                {isStandalone ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 transition md:hidden"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${minimized ? 'rotate-90' : '-rotate-90'}`} />
            </button>
          </div>
        </div>

        {/* LIVE MICROPHONE SPEECH BAR */}
        {(isListening || liveSpokenText || isProcessingLiveCall) && (
          <div className="mt-3 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2.5 bg-rose-950/25 p-2.5 rounded-xl border border-rose-500/30 shadow-lg">
            <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
              <span className="text-xs font-bold text-rose-300 shrink-0">
                {isProcessingLiveCall
                  ? 'Transmitting to CAD Triage Engine…'
                  : isListening
                  ? '🎙️ Listening (Speak or edit):'
                  : 'Emergency Description:'}
              </span>
              <input
                type="text"
                value={liveSpokenText}
                onChange={(e) => setLiveSpokenText(e.target.value)}
                placeholder={isListening ? (isHindi ? 'सुन रहे हैं... या यहाँ टाइप करें' : 'Listening to mic... or type emergency here') : 'Enter emergency…'}
                className="text-xs text-white bg-black/60 px-3 py-1.5 rounded-xl border border-rose-500/30 flex-1 min-w-[240px] focus:outline-none focus:border-rose-400 font-mono shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleStopAndDispatch()}
                disabled={isProcessingLiveCall}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5" /> Dispatch Now
              </button>
              <button
                onClick={() => {
                  stopMicStream();
                  setIsListening(false);
                  setLiveSpokenText('');
                }}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* QUICK LIVE SPEECH TEST CHIPS */}
        <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-marigold-400" /> Quick Live Speech:
          </span>
          {[
            { label: '🔥 Gas leak CP Block B', text: 'Connaught Place Block B mein bahut bada commercial gas leak ho gaya hai, jaldi emergency team bhejo' },
            { label: '⚡ Transformer fire Barakhamba', text: 'High voltage transformer exploded near Barakhamba metro station gate 3 live sparks on road' },
            { label: '🚨 Swarm duplicate (CP)', text: 'Repeat call: Connaught Place Block B shops evacuating due to intense gas leak fumes' },
            { label: '💧 Janpath water rupture', text: 'Massive drinking water pipe burst at Janpath crossing road is flooded' },
            { label: '🏢 Lalit Ashok Bengaluru', text: 'Electrical hazard and snapped cable near Lalit Ashok Bengaluru entrance' },
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleStopAndDispatch(prompt.text)}
              disabled={isProcessingLiveCall || isListening}
              className="px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] transition text-[10.5px] truncate max-w-[200px]"
              title={`Click to simulate speech: "${prompt.text}"`}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN COCKPIT WORKSPACE */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 ${minimized ? 'hidden md:grid' : ''} ${
        isStandalone ? 'flex-1 min-h-0 overflow-hidden' : ''
      }`}>
        {/* LEFT DRAWER: TELEPHONY SESSION, TAKE OVER & STREAM */}
        <div className={`lg:col-span-5 flex flex-col gap-4 min-h-0 ${isStandalone ? 'h-full' : ''}`}>
          {/* Active Call & Telephony Carrier Card */}
          <div className="bg-slate-950/70 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-xl space-y-3 shrink-0">
            {/* Caller row with VoiceStudio details */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    {activeVoiceCall?.phone || telephonySession?.caller_phone || '+91 98710 44821'}
                    <span className="text-[10px] font-sans font-medium px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      HD Voice
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>{telephonySession?.caller_location || 'Connaught Place Block B'}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-mono">18ms RTT</span>
                  </div>
                </div>
              </div>

              {/* Audio waveform */}
              <canvas ref={canvasRef} width={90} height={24} className="w-[90px] h-[24px]" />
            </div>

            {/* Urgency Progress Bar */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Urgency Rating
                </span>
                <span className="text-sm font-bold font-mono text-rose-400">
                  {activeUrgency.toFixed(1)} <span className="text-xs text-slate-500 font-normal">/ 10</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/[0.05]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (activeUrgency / 10) * 100)}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* VoiceStudio Human Operator Takeover Switch */}
            <div className={`p-3 rounded-xl border transition-all ${
              takeoverActive
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-white/[0.02] border-white/[0.06]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hand className={`w-4 h-4 ${takeoverActive ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      Human Operator Takeover
                      {takeoverActive && (
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black">
                          Active Override
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {takeoverActive
                        ? 'AI autonomous speech paused · Command Center is on the line'
                        : 'Engage manual intercom to inject verbal orders directly'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleTakeover(!takeoverActive)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm ${
                      takeoverActive
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                        : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 border border-white/[0.1]'
                    }`}
                  >
                    {takeoverActive ? 'Disengage' : 'Take Over'}
                  </button>

                  <button
                    type="button"
                    onClick={handleHangupCall}
                    className="p-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                    title="Terminate / Conclude Call"
                  >
                    <PhoneOff className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* VoiceStudio "Say on Call" Form (Active when Takeover is on) */}
              {takeoverActive && (
                <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-2">
                  <form onSubmit={handleSayOnCall} className="flex gap-2">
                    <input
                      type="text"
                      value={operatorSpeechInput}
                      onChange={(e) => setOperatorSpeechInput(e.target.value)}
                      placeholder="Type verbal command (e.g. Unit 4 is 90s away, evacuate 50m)…"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-white focus:outline-none focus:border-amber-400 font-sans placeholder:text-slate-500"
                    />
                    <button
                      type="submit"
                      disabled={isSendingOperatorSpeech || !operatorSpeechInput.trim()}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1 transition disabled:opacity-50"
                    >
                      <Send className="w-3 h-3" /> Say
                    </button>
                  </form>

                  {/* Quick Tactical Order Chips */}
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {[
                      'Fire Unit 4 is 90s away. Evacuate 100m north!',
                      'Delhi Jal Board mainline team en route with sirens.',
                      'Substation power cut requested. Stay clear of cables!',
                    ].map((order, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => handleSayOnCall(e, order)}
                        className="px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 border border-amber-500/30 text-amber-200 text-[10px] transition"
                      >
                        📢 {order}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* VoiceStudio Interactive Waveform Player */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 px-0.5">
                <span className="flex items-center gap-1 font-medium">
                  <Waves className="w-3 h-3 text-rose-400" /> Audio Dispatch Playback
                </span>
                <span className="text-[10px] text-slate-500 font-mono">48kHz Opus · WebRTC</span>
              </div>
              <WaveformPlayer duration={24} compact={true} />
            </div>
          </div>

          {/* Transcript Drawer */}
          <div className={`bg-[#0D0F14]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 flex flex-col shadow-xl min-h-0 ${
            isStandalone
              ? 'flex-1 overflow-hidden'
              : 'min-h-[260px] max-h-[360px] overflow-hidden'
          }`}>
            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06] mb-2.5 shrink-0">
              <span className="text-xs font-semibold text-silver-200 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-marigold-400" /> {isHindi ? 'लाइव ट्रांसक्रिप्ट' : 'Live Transcript'}
              </span>
              <span className="text-[10px] text-silver-500 font-mono">
                {liveTranscript.length > 0 ? `${liveTranscript.length} chunks` : (isHindi ? 'स्टैंडबाय' : 'Standby')}
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1.5 text-xs custom-scrollbar">
              {liveTranscript.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-silver-500">
                  <Radio className="w-6 h-6 text-marigold-400 opacity-40 mb-2 animate-pulse" />
                  <p className="text-xs text-silver-400">{isHindi ? 'आने वाली कॉल की प्रतीक्षा में…' : 'Ready for incoming call…'}</p>
                </div>
              ) : (
                liveTranscript.map((chunk, idx) => {
                  const isCaller = chunk.speaker === 'caller';
                  const isOperator = chunk.speaker === 'operator';
                  const isAgent = chunk.speaker === 'agent';

                  const chunkText = isHindi
                    ? (chunk.text_hi || chunk.text)
                    : (chunk.text_en || chunk.text);

                  let speakerLabel = isCaller
                    ? (isHindi ? 'नागरिक' : 'Citizen')
                    : isOperator
                    ? (isHindi ? 'कमांड ऑपरेटर' : 'Command Center Operator')
                    : (isHindi ? 'एआई डिस्पैच' : 'AI Dispatcher (Bolna)');

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-2.5 rounded-xl border text-xs transition-all ${
                        isOperator
                          ? 'bg-amber-500/[0.1] border-amber-500/30'
                          : isCaller
                          ? 'bg-rose-500/[0.06] border-rose-500/20'
                          : 'bg-marigold-500/[0.08] border-marigold-500/25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 text-[10px]">
                        <span className={`font-semibold flex items-center gap-1 ${
                          isOperator
                            ? 'text-amber-300'
                            : isCaller
                            ? 'text-rose-300'
                            : 'text-marigold-300'
                        }`}>
                          {isOperator && <Hand className="w-3 h-3 text-amber-400" />}
                          {isCaller && <PhoneCall className="w-3 h-3 text-rose-400" />}
                          {isAgent && <Radio className="w-3 h-3 text-marigold-400" />}
                          {speakerLabel}
                        </span>
                        <span className="text-slate-500 font-mono text-[9px]">
                          {chunk.timestamp ? new Date(chunk.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Live'}
                        </span>
                      </div>
                      <p className="text-silver-200 leading-snug">{chunkText}</p>
                    </motion.div>
                  );
                })
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Concise Incident Tags */}
            <div className="pt-2.5 border-t border-white/[0.06] mt-2 flex items-center gap-1.5 text-[11px] text-silver-400 shrink-0">
              <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-marigold-300">
                📍 {telephonySession?.caller_location || 'CP Block B'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-rose-300">
                ⚠️ Critical Hazard
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-emerald-300">
                ⚡ 4h SLA
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT DRAWER: HIGH-SIGNAL PHOTO-RICH CAD WORK ORDERS */}
        <div className={`lg:col-span-7 flex flex-col min-h-0 ${isStandalone ? 'h-full' : ''}`}>
          <div className={`bg-[#0D0F14]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 flex flex-col shadow-xl min-h-0 ${
            isStandalone ? 'flex-1 overflow-hidden' : 'h-[580px] max-h-[640px] overflow-hidden'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-marigold-400" />
                <h3 className="text-xs font-semibold text-silver-100 tracking-wide uppercase">
                  CAD Emergency Work Orders
                </h3>
              </div>
              <span className="bg-white/[0.04] text-marigold-300 border border-marigold-500/25 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {voiceDispatches.length} Active Tickets
              </span>
            </div>

            {/* Ticket Cards Stream with Real Photo Thumbnails */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {voiceDispatches.length === 0 ? (
                <div className="h-44 flex flex-col items-center justify-center text-silver-500 text-xs">
                  <ShieldAlert className="w-8 h-8 mb-2 opacity-30 text-silver-400" />
                  No active voice dispatch tickets.
                </div>
              ) : (
                voiceDispatches.map((ticket) => {
                  const isCritical = ticket.severity === 5 || ticket.severity === 'CRITICAL' || ticket.urgency_score >= 8.5;
                  const isEnRoute = String(ticket.dispatch_status || '').includes('EN_ROUTE');
                  const isSurge = (ticket.report_count || 1) > 1;

                  const photoSrc =
                    ticket.photo_url && !ticket.photo_url.includes('vision_hazard_proof')
                      ? assetUrl(ticket.photo_url)
                      : DEFAULT_PHOTOS[ticket.incident_type] || DEFAULT_PHOTOS[ticket.category] || DEFAULT_PHOTOS.other;

                  return (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`bg-[#12151D]/80 hover:bg-[#171B26] rounded-xl p-3 border transition-all duration-200 shadow-lg relative overflow-hidden group ${
                        isSurge
                          ? 'border-rose-500/40'
                          : isEnRoute
                          ? 'border-marigold-500/40'
                          : 'border-white/[0.07] hover:border-white/[0.12]'
                      }`}
                    >
                      {/* Left Status Glow Accent */}
                      <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                        isSurge ? 'bg-rose-500' : isEnRoute ? 'bg-marigold-400' : 'bg-silver-700'
                      }`} />

                      <div className="flex gap-3 pl-1.5">
                        {/* Real Photo Thumbnail */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10 bg-[#08090C]">
                          <img
                            src={photoSrc}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        {/* Card Info */}
                        <div className="flex-1 min-w-0">
                          {/* Header: Ticket ID & Badges */}
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-mono text-[11px] text-marigold-300 font-semibold">
                                #{ticket.id || '311'}
                              </span>
                              <span className="text-xs font-bold text-silver-100 truncate uppercase">
                                {ticket.incident_type || ticket.category || 'HAZARD'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {isSurge && (
                                <span className="bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                  🚨 {ticket.report_count} Callers
                                </span>
                              )}
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                isCritical ? 'bg-rose-500/10 text-rose-300' : 'bg-marigold-500/15 text-marigold-300'
                              }`}>
                                {Number(ticket.urgency_score || 8.5).toFixed(1)}
                              </span>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="text-[11px] text-silver-300 flex items-center gap-1 truncate mb-1">
                            <Compass className="w-3 h-3 text-marigold-400 shrink-0" />
                            <span className="truncate">{ticket.address || ticket.location}</span>
                          </div>

                          {/* Concise Summary */}
                          <p className="text-silver-400 text-xs line-clamp-1 mb-2">
                            {ticket.description || ticket.summary}
                          </p>

                          {/* Dispatch Strip */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[11px]">
                            <span className="flex items-center gap-1.5 text-marigold-300 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-marigold-400" />
                              Unit En Route (4m)
                            </span>

                            <button
                              onClick={() => handleFocusIncident(ticket)}
                              className="bg-white/[0.04] hover:bg-white/[0.08] text-silver-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                            >
                              <Compass className="w-3 h-3 text-marigold-400" /> Focus Pin
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VoiceStudio Telephony Carrier Simulation Modal */}
      <VoiceTelephonyModal
        isOpen={isTelephonyModalOpen}
        onClose={() => setIsTelephonyModalOpen(false)}
        onDialSuccess={(session) => {
          if (session?.scenario) {
            handleSimulate(session.scenario);
          }
        }}
      />
    </div>
  );
}
