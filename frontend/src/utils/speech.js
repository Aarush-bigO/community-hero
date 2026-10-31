/**
 * High-Definition Speech Synthesis & Emergency Radio Audio Engine
 * Provides crystal-clear human voice articulation, dual-persona (The Girl / That Boy)
 * voice selection, Indic bilingual support, natural phrasing, and tactical radio cues.
 */

let cachedVoices = [];
let voicesLoadedPromise = null;

// Novelty/robotic/low-quality voices to strictly ban on all OSes
const BANNED_VOICES = /bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|deranged|albert|fred|junior|ralph|pipe organ/i;

/**
 * Ensure the browser's speech synthesis voices are loaded asynchronously
 */
export function ensureVoicesLoaded() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([]);
  }

  const current = window.speechSynthesis.getVoices();
  if (current && current.length > 0) {
    cachedVoices = current;
    return Promise.resolve(current);
  }

  if (voicesLoadedPromise) return voicesLoadedPromise;

  voicesLoadedPromise = new Promise((resolve) => {
    let resolved = false;

    const finalize = () => {
      if (resolved) return;
      resolved = true;
      const voices = window.speechSynthesis.getVoices() || [];
      cachedVoices = voices;
      resolve(voices);
    };

    // Safety timeout in case onvoiceschanged never fires
    const timer = setTimeout(finalize, 1200);

    window.speechSynthesis.onvoiceschanged = () => {
      clearTimeout(timer);
      finalize();
    };

    // Trigger dummy call to wake up voices in WebKit/Blink
    try {
      window.speechSynthesis.getVoices();
    } catch {}
  });

  return voicesLoadedPromise;
}

// Initial eager load
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  ensureVoicesLoaded();
}

/**
 * Play a high-fidelity emergency radio chirp/chime using Web Audio API.
 * Gives the transmission authentic emergency CAD clarity.
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
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.14);
    osc2.stop(now + 0.14);

    setTimeout(() => {
      try { ctx.close(); } catch {}
    }, 250);
  } catch (err) {
    // Non-blocking fallback
  }
}

/**
 * Convert technical acronyms, hashes, and markdown into natural human phrasing
 */
export function humanizeSpokenText(text) {
  if (!text) return '';
  let s = String(text);

  // Remove markdown formatting
  s = s.replace(/[*_#`~>]/g, ' ');

  // Replace #<ticket> with "number <ticket>" so TTS doesn't say "hashtag" or "pound"
  s = s.replace(/#(\d+)/g, 'number $1');

  // Emergency CAD acronym expansions for natural speech
  s = s.replace(/\bCAD\b/g, 'C.A.D.');
  s = s.replace(/\bLPG\b/g, 'L.P.G.');
  s = s.replace(/\b11kV\b/gi, '11 kilo volt');
  s = s.replace(/\bCP Block B\b/gi, 'Connaught Place Block B');
  s = s.replace(/\bCP\b/g, 'Connaught Place');
  s = s.replace(/\bms\b/g, 'milliseconds');
  s = s.replace(/\bRTT\b/g, 'round trip time');
  s = s.replace(/\bNDMC\b/g, 'N.D.M.C.');
  s = s.replace(/\bAI\b/g, 'A.I.');

  // Clean extra whitespace
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * High-definition female voices ("The Girl") ranked by human realism
 */
const FEMALE_VOICE_PATTERNS = [
  /google us english/i,
  /google uk english female/i,
  /samantha \(premium\)/i,
  /samantha \(enhanced\)/i,
  /samantha/i,
  /karen \(premium\)/i,
  /karen \(enhanced\)/i,
  /karen/i,
  /ava \(premium\)/i,
  /ava \(enhanced\)/i,
  /ava/i,
  /zoe \(premium\)/i,
  /zoe \(enhanced\)/i,
  /zoe/i,
  /tara/i,
  /veena/i,
  /lekha/i,
  /victoria/i,
  /serena/i,
  /moira/i,
  /fiona/i,
  /sandy \(english/i,
  /shelley \(english/i,
  /female/i,
];

/**
 * High-definition male voices ("That Boy") ranked by human realism
 */
const MALE_VOICE_PATTERNS = [
  /google uk english male/i,
  /daniel \(premium\)/i,
  /daniel \(enhanced\)/i,
  /daniel/i,
  /rishi/i,
  /aman/i,
  /oliver \(premium\)/i,
  /oliver \(enhanced\)/i,
  /oliver/i,
  /tom \(premium\)/i,
  /tom \(enhanced\)/i,
  /tom/i,
  /alex/i,
  /reed \(english/i,
  /rocko \(english/i,
  /eddy \(english/i,
  /male/i,
];

/**
 * Pick the highest quality, most natural human voice for the selected persona
 * @param {Object} options
 * @param {string} options.persona - 'female' ("The Girl") or 'male' ("That Boy")
 * @param {string} options.lang - 'en' | 'hi' | 'hi-IN'
 * @param {string} options.role - 'agent' | 'operator' | 'caller'
 */
export function pickHumanVoice({ persona = 'female', lang = 'en', role = 'agent' } = {}) {
  const isBrowser = typeof window !== 'undefined' && 'speechSynthesis' in window;
  if (!isBrowser) return null;

  const voices = (cachedVoices && cachedVoices.length > 0)
    ? cachedVoices
    : window.speechSynthesis.getVoices();

  if (!voices || voices.length === 0) return null;

  // Filter out all robotic/novelty voices
  const naturalVoices = voices.filter((v) => !BANNED_VOICES.test(v.name));
  const pool = naturalVoices.length > 0 ? naturalVoices : voices;

  const isHindi = lang === 'hi' || lang === 'hi-IN';

  // 1. Dedicated Hindi / Indic voices if in Hindi mode
  if (isHindi) {
    if (persona === 'female') {
      const hiFemale = pool.find((v) => /lekha|veena|tara/i.test(v.name) || (v.lang.startsWith('hi') && !/male/i.test(v.name)));
      if (hiFemale) return hiFemale;
    } else {
      const hiMale = pool.find((v) => /rishi|aman/i.test(v.name) || (v.lang.startsWith('hi') && /male/i.test(v.name)));
      if (hiMale) return hiMale;
    }
    const genericHi = pool.find((v) => v.lang.startsWith('hi'));
    if (genericHi) return genericHi;
  }

  // 2. Select by requested persona (Female "The Girl" vs Male "That Boy")
  const targetPatterns = persona === 'female' ? FEMALE_VOICE_PATTERNS : MALE_VOICE_PATTERNS;

  for (const regex of targetPatterns) {
    const match = pool.find((v) => regex.test(v.name));
    if (match) return match;
  }

  // 3. Fallback: find any voice matching the gender cue
  if (persona === 'female') {
    const fallbackFemale = pool.find((v) => /female|woman|girl/i.test(v.name));
    if (fallbackFemale) return fallbackFemale;
  } else {
    const fallbackMale = pool.find((v) => /male|man|boy/i.test(v.name));
    if (fallbackMale) return fallbackMale;
  }

  // 4. Safe English natural voice (never Albert or Fred)
  const englishVoice = pool.find((v) => v.lang.startsWith('en'));
  if (englishVoice) return englishVoice;

  return pool[0] || null;
}

/**
 * Backward compatibility helper
 */
export function pickClearVoice(lang = 'en', role = 'agent') {
  return pickHumanVoice({ persona: 'female', lang, role });
}

/**
 * Speak text with guaranteed crystal-clear human voice, natural pacing, and radio alert chime
 */
export function speakClear(text, {
  persona = 'female', // 'female' ("The Girl") | 'male' ("That Boy")
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
  if (!text || !String(text).trim()) return;

  try {
    window.speechSynthesis.cancel();

    // Only play radio chime for dispatch transmissions (agent and operator)
    if (playChime && role !== 'caller') {
      playRadioChime();
    }

    const cleanText = humanizeSpokenText(text);
    const utter = new SpeechSynthesisUtterance(cleanText);
    const isHindi = language === 'hi' || language === 'hi-IN';

    // Pick human voice tailored to persona ('female' or 'male')
    const bestVoice = pickHumanVoice({ persona, lang: isHindi ? 'hi' : 'en', role });
    if (bestVoice) {
      utter.voice = bestVoice;
      utter.lang = bestVoice.lang;
    } else {
      utter.lang = isHindi ? 'hi-IN' : 'en-US';
    }

    // Role- & Persona-calibrated natural human acoustics (relaxed human cadence)
    if (persona === 'female') {
      // "The Girl" (Dispatcher Priya / Samantha): warm, reassuring, crystal clear
      utter.rate = rate ?? (role === 'caller' ? 0.98 : 0.94);
      utter.pitch = pitch ?? (role === 'caller' ? 1.05 : 1.03);
    } else {
      // "That Boy" (Officer Rahul / Daniel / Rishi): calm, grounded, authoritative
      utter.rate = rate ?? (role === 'caller' ? 0.96 : 0.92);
      utter.pitch = pitch ?? (role === 'caller' ? 0.98 : 0.95);
    }

    utter.volume = Math.max(0.1, Math.min(1.0, volume));

    if (onStart) utter.onstart = onStart;
    if (onEnd) utter.onend = onEnd;

    const delay = (playChime && role !== 'caller') ? 130 : 0;
    setTimeout(() => {
      window.speechSynthesis.speak(utter);
    }, delay);
  } catch (err) {
    console.error('Speech synthesis error:', err);
  }
}

/**
 * Quick preview function allowing the user to hear the chosen voice persona
 */
export function previewVoicePersona(persona = 'female', lang = 'en') {
  const isHindi = lang === 'hi' || lang === 'hi-IN';
  let sampleText;

  if (isHindi) {
    sampleText = persona === 'female'
      ? 'नमस्ते, मैं आपातकालीन कमांड केंद्र से बोल रही हूँ। आपका संदेश प्राप्त हो गया है और राहत दस्ता रवाना कर दिया गया है।'
      : 'नमस्ते, मैं कमांड ऑफिसर राहुल बोल रहा हूँ। आपातकालीन दस्ता सायरन के साथ रवाना हो चुका है।';
  } else {
    sampleText = persona === 'female'
      ? 'Emergency Command Center, Dispatcher Priya. Your report is confirmed and rapid response hazard units are mobilized.'
      : 'Emergency Command Center, Officer Rahul. CAD transmission verified, all response units are en route with sirens.';
  }

  speakClear(sampleText, {
    persona,
    language: isHindi ? 'hi' : 'en',
    role: 'agent',
    playChime: true,
  });
}

/**
 * Cancel any ongoing speech
 */
export function stopClearSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
