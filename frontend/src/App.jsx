import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Landing from './pages/Landing';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Onboard from './pages/Onboard';

export default function App() {
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
      </Routes>
      <Toast />
    </>
  );
}
