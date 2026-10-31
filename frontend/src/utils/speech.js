/**
 * High-Definition Speech Synthesis & Emergency Radio Audio Engine
 * Provides crystal-clear voice articulation, Indic voice selection, and tactical radio cues.
 */

// Global voice cache
let cachedVoices = [];

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
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
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
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
 * Select the highest quality, most natural voice available on the device
 */
export function pickClearVoice(lang = 'en') {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
  if (!voices || voices.length === 0) return null;

  const isHindi = lang === 'hi' || lang === 'hi-IN';

  // Novelty/low-quality robotic voices to avoid on macOS/Windows
  const bannedNames = /bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|deranged/i;

  if (isHindi) {
    // 1. Look for native Hindi voices (Lekha, Google हिन्दी, etc.)
    const hindiVoice = voices.find(
      (v) => (v.lang.startsWith('hi') || /hindi|lekha/i.test(v.name)) && !bannedNames.test(v.name)
    );
    if (hindiVoice) return hindiVoice;

    // 2. Look for Indian English voice (Rishi, Aman, Google en-IN) which handles Indic phrasing cleanly
    const indianVoice = voices.find(
      (v) => (v.lang.includes('IN') || /rishi|aman|veena|india/i.test(v.name)) && !bannedNames.test(v.name)
    );
    if (indianVoice) return indianVoice;
  }

  // English: Look for premium natural/enhanced voices
  const preferredEnglishNames = [
    /samantha/i,
    /rishi/i,
    /daniel/i,
    /karen/i,
    /serena/i,
    /google.*us.*english/i,
    /google.*uk.*english/i,
    /natural/i,
    /flo/i,
    /reed/i,
    /rocko/i,
  ];

  for (const regex of preferredEnglishNames) {
    const match = voices.find((v) => regex.test(v.name) && !bannedNames.test(v.name));
    if (match) return match;
  }

  // Fallback to first decent English voice
  return voices.find((v) => v.lang.startsWith('en') && !bannedNames.test(v.name)) || voices[0];
}

/**
 * Speak text with guaranteed clarity, natural pacing, and radio alert chime
 */
export function speakClear(text, {
  language = 'en',
  rate = 0.95,
  pitch = 1.0,
  volume = 1.0,
  playChime = true,
  onStart,
  onEnd,
} = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text || !text.trim()) return;

  try {
    window.speechSynthesis.cancel();

    if (playChime) {
      playRadioChime();
    }

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utter = new SpeechSynthesisUtterance(cleanText);
    const isHindi = language === 'hi' || language === 'hi-IN';

    // Pick best voice
    const bestVoice = pickClearVoice(isHindi ? 'hi' : 'en');
    if (bestVoice) {
      utter.voice = bestVoice;
      utter.lang = bestVoice.lang;
    } else {
      utter.lang = isHindi ? 'hi-IN' : 'en-US';
    }

    // Pacing tuned for maximum clarity and articulation
    utter.rate = Math.max(0.85, Math.min(1.05, rate));
    utter.pitch = Math.max(0.9, Math.min(1.1, pitch));
    utter.volume = Math.max(0.1, Math.min(1.0, volume));

    if (onStart) utter.onstart = onStart;
    if (onEnd) utter.onend = onEnd;

    // Small delay allows radio chime to ring first
    setTimeout(() => {
      window.speechSynthesis.speak(utter);
    }, playChime ? 120 : 0);
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
