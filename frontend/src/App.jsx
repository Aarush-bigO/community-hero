import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AssistantWidget from './components/AssistantWidget';
import ScrollToTop from './components/ScrollToTop';
import Landing from './pages/Landing';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Onboard from './pages/Onboard';
import Pulse from './pages/Pulse';
import Admin from './pages/Admin';
import VoiceCockpitPage from './pages/VoiceCockpitPage';
import { useEventStream } from './hooks/useEventStream';
import { useStore } from './store/useStore';

// Maps a server event to a human toast. Live notifications across the app.
const TOAST_FOR = {
  'issue.created': (e) => `🆕 New report: ${e.payload.title} → ${e.payload.routed_to || 'routing…'}`,
  'issue.resolved': () => `✅ An issue was marked resolved`,
  'issue.assigned': () => `👷 Issue assigned to a crew`,
  'issue.duplicate': (e) => `🔁 Possible duplicate (${e.payload.distance_m}m away)`,
  'sla.breach': () => `⏰ SLA breach detected`,
  'NEW_VOICE_DISPATCH': (e) => `🎙️ [VOICE AI 311] Ticket #${e.payload.ticket_id} created: ${e.payload.incident_type}`,
  'INCIDENT_CLUSTER_SURGE': (e) => `🚨 [SWARM SURGE] ${e.payload.surge_badge} at ${e.payload.location}`,
  'UNIT_DISPATCH_CONFIRMED': (e) => `🚓 [UNIT DISPATCHED] ${e.payload.officer_name} en route (${e.payload.eta})`,
  'VISION_VERIFIED': (e) => `📸 [VISION VERIFIED] Photo matches hazard with ${e.payload.vision_confidence}% confidence`,
};

export default function App() {
  const showToast = useStore((s) => s.showToast);
  const setLiveConnected = useStore((s) => s.setLiveConnected);
  const pushLiveSignal = useStore((s) => s.pushLiveSignal);
  const addVoiceDispatch = useStore((s) => s.addVoiceDispatch);
  const updateVoiceDispatch = useStore((s) => s.updateVoiceDispatch);
  const appendTranscriptChunk = useStore((s) => s.appendTranscriptChunk);
  const setActiveVoiceCall = useStore((s) => s.setActiveVoiceCall);
  const setFocusCoords = useStore((s) => s.setFocusCoords);
  const setTelephonySession = useStore((s) => s.setTelephonySession);
  const setTakeover = useStore((s) => s.setTakeover);

  const { connected } = useEventStream((event) => {
    // 1. Voice AI events
    if (event.type === 'NEW_VOICE_DISPATCH') {
      addVoiceDispatch(event.payload);
      if (event.payload.lat && event.payload.lng) {
        setFocusCoords({ lat: event.payload.lat, lng: event.payload.lng });
      }
      showToast({ type: 'live', message: TOAST_FOR[event.type](event) });
      return;
    }

    if (event.type === 'INCIDENT_CLUSTER_SURGE') {
      updateVoiceDispatch(event.payload.ticket_id, {
        report_count: event.payload.report_count,
        severity: 'CRITICAL',
        urgency_score: 10,
      });
      if (event.payload.lat && event.payload.lng) {
        setFocusCoords({ lat: event.payload.lat, lng: event.payload.lng });
      }
      showToast({ type: 'live', message: TOAST_FOR[event.type](event) });
      return;
    }

    if (event.type === 'UNIT_DISPATCH_ALERT') {
      updateVoiceDispatch(event.payload.ticket_id, {
        dispatch_status: 'CALLING_FIELD_UNIT',
      });
      return;
    }

    if (event.type === 'UNIT_DISPATCH_CONFIRMED') {
      updateVoiceDispatch(event.payload.ticket_id, {
        dispatch_status: event.payload.dispatch_status || 'UNIT_EN_ROUTE (ETA 4 MIN)',
      });
      showToast({ type: 'live', message: TOAST_FOR[event.type](event) });
      return;
    }

    if (event.type === 'VOICE_TRANSCRIPT_CHUNK') {
      appendTranscriptChunk(event.payload);
      setActiveVoiceCall({
        phone: event.payload.caller_phone || '+91 98710 44821',
        language: event.payload.caller_language || 'Hinglish (Sarvam AI)',
        urgency_score: event.payload.urgency_score || 9.2,
      });
      return;
    }

    if (event.type === 'VISION_VERIFIED') {
      updateVoiceDispatch(event.payload.ticket_id, {
        vision_verified: 1,
        vision_confidence: event.payload.vision_confidence || 98.4,
      });
      showToast({ type: 'live', message: TOAST_FOR[event.type](event) });
      return;
    }

    if (event.type === 'VOICE_TAKEOVER_UPDATE') {
      setTakeover(event.payload.takeover);
      showToast({
        type: 'live',
        message: event.payload.takeover
          ? '🚨 [INTERCOM] Operator Takeover engaged'
          : '🤖 [AI CAD] Autonomous agent resumed',
      });
      return;
    }

    if (event.type === 'VOICE_CALL_ENDED') {
      setTelephonySession({ status: 'ended' });
      showToast({ type: 'live', message: '📞 Call finalized & logged in CAD records' });
      return;
    }

    if (event.type === 'VOICE_SESSION_UPDATE') {
      if (event.payload.session) {
        setTelephonySession(event.payload.session);
      }
      return;
    }

    // 2. Pulse signals
    if (event.type === 'pulse.signal') {
      pushLiveSignal(event.payload);
      return;
    }

    // 3. General issues
    const fn = TOAST_FOR[event.type];
    if (fn) showToast({ type: 'live', message: fn(event) });
  });

  // keep the navbar LIVE indicator in sync (effect, not during render)
  useEffect(() => {
    setLiveConnected(connected);
  }, [connected, setLiveConnected]);

  return (
    <>
      <ScrollToTop />
      <div className="app-bg-mesh" aria-hidden="true" />
      <div className="app-bg-grid" aria-hidden="true" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dispatch" element={<VoiceCockpitPage />} />
        <Route path="/cockpit" element={<VoiceCockpitPage />} />
        <Route path="/voice" element={<VoiceCockpitPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/heroes" element={<Leaderboard />} />
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/pulse" element={<Pulse />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
      <Toast />
      <AssistantWidget />
    </>
  );
}
