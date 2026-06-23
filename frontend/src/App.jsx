import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import AssistantWidget from './components/AssistantWidget';
import Landing from './pages/Landing';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Onboard from './pages/Onboard';
import Pulse from './pages/Pulse';
import Admin from './pages/Admin';
import { useEventStream } from './hooks/useEventStream';
import { useStore } from './store/useStore';

// Maps a server event to a human toast. Live notifications across the app.
const TOAST_FOR = {
  'issue.created': (e) => `🆕 New report: ${e.payload.title} → ${e.payload.routed_to || 'routing…'}`,
  'issue.resolved': () => `✅ An issue was marked resolved`,
  'issue.assigned': () => `👷 Issue assigned to a crew`,
  'issue.duplicate': (e) => `🔁 Possible duplicate (${e.payload.distance_m}m away)`,
  'sla.breach': () => `⏰ SLA breach detected`,
};

export default function App() {
  const showToast = useStore((s) => s.showToast);
  const setLiveConnected = useStore((s) => s.setLiveConnected);
  const pushLiveSignal = useStore((s) => s.pushLiveSignal);

  const { connected } = useEventStream((event) => {
    if (event.type === 'pulse.signal') {
      pushLiveSignal(event.payload);
      return;
    }
    const fn = TOAST_FOR[event.type];
    if (fn) showToast({ type: 'live', message: fn(event) });
  });

  // keep the navbar LIVE indicator in sync (effect, not during render)
  useEffect(() => {
    setLiveConnected(connected);
  }, [connected, setLiveConnected]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/pulse" element={<Pulse />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Toast />
      <AssistantWidget />
    </>
  );
}
