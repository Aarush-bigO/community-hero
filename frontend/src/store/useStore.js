import { create } from 'zustand';

const loadInitialUser = () => {
  try {
    const raw = localStorage.getItem('ch_user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.name || parsed.name.toLowerCase().includes('aarush')) {
      localStorage.removeItem('ch_user');
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const useStore = create((set, get) => ({
  user: loadInitialUser(),
  setUser: (user) => {
    if (user) localStorage.setItem('ch_user', JSON.stringify(user));
    else localStorage.removeItem('ch_user');
    set({ user });
  },

  issues: [],
  setIssues: (issues) => set({ issues }),
  addIssue: (issue) => set({ issues: [issue, ...get().issues] }),

  stats: null,
  setStats: (stats) => set({ stats }),

  toast: null,
  showToast: (toast) => {
    set({ toast });
    setTimeout(() => set({ toast: null }), 3500);
  },

  // --- Real-time (SSE) state ---
  liveConnected: false,
  setLiveConnected: (liveConnected) => set({ liveConnected }),

  // Buffer of pulse signals pushed live; Pulse page drains/prepends these.
  liveSignals: [],
  pushLiveSignal: (sig) => set({ liveSignals: [sig, ...get().liveSignals].slice(0, 200) }),

  // --- Bolna Voice AI & Emergency Command Center State ---
  voiceDispatches: [],
  setVoiceDispatches: (voiceDispatches) => set({ voiceDispatches }),
  addVoiceDispatch: (dispatch) => {
    const existing = get().voiceDispatches.find((d) => d.id === dispatch.ticket_id || d.id === dispatch.id);
    if (existing) {
      set({
        voiceDispatches: get().voiceDispatches.map((d) =>
          d.id === (dispatch.ticket_id || dispatch.id) ? { ...d, ...dispatch } : d
        ),
      });
    } else {
      set({ voiceDispatches: [dispatch, ...get().voiceDispatches] });
    }
  },
  updateVoiceDispatch: (id, updates) =>
    set({
      voiceDispatches: get().voiceDispatches.map((d) =>
        d.id === id || d.ticket_id === id ? { ...d, ...updates } : d
      ),
    }),

  activeVoiceCall: null,
  setActiveVoiceCall: (activeVoiceCall) => set({ activeVoiceCall }),

  liveTranscript: [],
  setLiveTranscript: (liveTranscript) => set({ liveTranscript }),
  appendTranscriptChunk: (chunk) =>
    set({ liveTranscript: [...get().liveTranscript, chunk] }),
  clearLiveTranscript: () => set({ liveTranscript: [] }),

  selectedIncident: null,
  setSelectedIncident: (selectedIncident) => set({ selectedIncident }),

  // VoiceStudio Telephony State
  telephonySession: {
    call_id: 'CALL-INIT-104',
    status: 'idle',
    direction: 'inbound',
    caller_phone: '+91 98710 44821',
    caller_location: 'Connaught Place Block B',
    caller_language: 'हिन्दी / English',
    takeover: false,
    operator_name: 'Municipal Command Lead (Group 104)',
    agent_state: 'listening',
    latency_ms: 18,
    jitter_ms: 1.9,
    packet_loss: '0.0%',
  },
  setTelephonySession: (updates) =>
    set({ telephonySession: { ...get().telephonySession, ...updates } }),
  setTakeover: (takeover) =>
    set({ telephonySession: { ...get().telephonySession, takeover } }),
  setAgentState: (agent_state) =>
    set({ telephonySession: { ...get().telephonySession, agent_state } }),

  // Camera flight coordinates for 3D Globe: { lat, lng }
  focusCoords: null,
  setFocusCoords: (focusCoords) => set({ focusCoords }),
}));

