/**
 * High-Definition Speech Synthesis & Emergency Radio Audio Engine
 * Provides crystal-clear voice articulation, Indic voice selection, role-based acoustics, and tactical radio cues.
 */

let cachedVoices = [];

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

/**
 * Play a professional high-fidelity emergency radio chirp/chime
 * using the Web Audio API. Gives the transmission authentic emergency CAD clarity.
 */
export function playRadioChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Dual-tone frequency chirp (880Hz -> 1320Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.setValueAtTime(660, now + 0.05);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.15);
    osc2.stop(now + 0.15);

    setTimeout(() => {
      try { ctx.close(); } catch {}
    }, 300);
  } catch (err) {
    // Non-blocking fallback
  }
}

/**
 * Select the highest quality, most natural human voice available on the device
 */
export function pickClearVoice(lang = 'en', role = 'agent') {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
  if (!voices || voices.length === 0) return null;

  const isHindi = lang === 'hi' || lang === 'hi-IN';

  // Novelty/robotic/low-quality voices to strictly avoid on all OSes
  const bannedNames = /bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|deranged|albert|fred|junior|ralph/i;

  if (isHindi) {
    // 1. Dedicated natural Hindi voices
    const hindiVoice = voices.find(
      (v) => (v.lang.startsWith('hi') || /hindi|lekha/i.test(v.name)) && !bannedNames.test(v.name)
    );
    if (hindiVoice) return hindiVoice;

    // 2. Indian English voice (Rishi / Aman / Veena) which articulates Indic words naturally
    const indianVoice = voices.find(
      (v) => (v.lang.includes('IN') || /rishi|aman|veena|india/i.test(v.name)) && !bannedNames.test(v.name)
    );
    if (indianVoice) return indianVoice;
  }

  // Role-specific natural voice matching:
  if (role === 'caller') {
    // Citizen Caller: expressive, warm, everyday conversational human voice
    const callerMatches = [
      /rishi/i,
      /daniel/i,
      /karen/i,
      /google uk english male/i,
      /google us english/i,
      /samantha/i,
    ];
    for (const regex of callerMatches) {
      const match = voices.find((v) => regex.test(v.name) && !bannedNames.test(v.name));
      if (match) return match;
    }
  } else if (role === 'operator') {
    // Human Command Center Supervisor: calm, deep, authoritative
    const operatorMatches = [
      /aman/i,
      /daniel/i,
      /reed/i,
      /rocko/i,
      /google uk english male/i,
      /samantha/i,
    ];
    for (const regex of operatorMatches) {
      const match = voices.find((v) => regex.test(v.name) && !bannedNames.test(v.name));
      if (match) return match;
    }
  }

  // Default Agent (CAD AI Dispatcher): crystal-clear, modern high-fidelity voice
  const agentMatches = [
    /google us english/i,
    /google uk english female/i,
    /samantha/i,
    /karen/i,
    /serena/i,
    /victoria/i,
    /rishi/i,
    /natural/i,
  ];

  for (const regex of agentMatches) {
    const match = voices.find((v) => regex.test(v.name) && !bannedNames.test(v.name));
    if (match) return match;
  }

  // Fallback to highest quality English voice available
  return voices.find((v) => v.lang.startsWith('en') && !bannedNames.test(v.name)) || voices[0];
}

/**
 * Speak text with guaranteed clarity, natural pacing, and radio alert chime
 */
export function speakClear(text, {
  language = 'en',
  role = 'agent',
  rate,
  pitch,
  volume = 1.0,
  playChime = true,
  onStart,
  onEnd,
} = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text || !text.trim()) return;

  try {
    window.speechSynthesis.cancel();

    // Only play radio chime for dispatch transmissions (agent and operator)
    if (playChime && role !== 'caller') {
      playRadioChime();
    }

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utter = new SpeechSynthesisUtterance(cleanText);
    const isHindi = language === 'hi' || language === 'hi-IN';

    // Pick best natural voice tailored to role and language
    const bestVoice = pickClearVoice(isHindi ? 'hi' : 'en', role);
    if (bestVoice) {
      utter.voice = bestVoice;
      utter.lang = bestVoice.lang;
    } else {
      utter.lang = isHindi ? 'hi-IN' : 'en-US';
    }

    // Role-tailored natural human acoustics:
    if (role === 'caller') {
      // Citizen in emergency: urgent, expressive
      utter.rate = rate ?? 0.98;
      utter.pitch = pitch ?? 1.02;
    } else if (role === 'operator') {
      // Human Command Dispatcher: calm, authoritative, slightly deeper
      utter.rate = rate ?? 0.92;
      utter.pitch = pitch ?? 0.96;
    } else {
      // AI CAD Dispatcher: articulate, balanced, perfectly paced
      utter.rate = rate ?? 0.94;
      utter.pitch = pitch ?? 1.0;
    }

    utter.volume = Math.max(0.1, Math.min(1.0, volume));

    if (onStart) utter.onstart = onStart;
    if (onEnd) utter.onend = onEnd;

    const delay = (playChime && role !== 'caller') ? 130 : 0;
    setTimeout(() => {
      window.speechSynthesis.speak(utter);
    }, delay);
  } catch (err) {
    console.error('Speech error:', err);
  }
}

/**
 * Cancel any ongoing speech
 */
export function stopClearSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
