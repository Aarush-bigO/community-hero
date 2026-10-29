import { useEffect } from 'react';
import HeroScene from '../scenes/HeroScene';
import VoiceDispatchCockpit from '../components/VoiceDispatchCockpit';
import { useStore } from '../store/useStore';
import { api } from '../utils/api';

export default function VoiceCockpitPage() {
  const issues = useStore((s) => s.issues);
  const setIssues = useStore((s) => s.setIssues);
  const voiceDispatches = useStore((s) => s.voiceDispatches);
  const setVoiceDispatches = useStore((s) => s.setVoiceDispatches);

  useEffect(() => {
    api.issues.list().then(setIssues).catch(() => {});
    api.voice.dispatches().then((data) => {
      if (Array.isArray(data)) setVoiceDispatches(data);
    }).catch(() => {});
  }, [setIssues, setVoiceDispatches]);

  // Merge regular issues and voice dispatches for the 3D globe (deduplicated by ID)
  const allSceneIssues = Array.from(
    new Map([...issues, ...voiceDispatches].map((i) => [i.id || i.ticket_id, i])).values()
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#08090C]">
      {/* 3D Earth Globe Scene with Emergency Beacons & Shockwaves */}
      <div className="absolute inset-0 z-0">
        <HeroScene issues={allSceneIssues} />
      </div>

      {/* Subtle tactical vignette & radar grid scan overlay */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none z-10 opacity-60" />

      {/* Layered Tactical Voice AI Cockpit Overlay */}
      <div className="relative z-20 w-full h-full pt-20 pb-3 flex flex-col min-h-0 pointer-events-none">
        <VoiceDispatchCockpit isStandalone={true} />
      </div>
    </div>
  );
}
