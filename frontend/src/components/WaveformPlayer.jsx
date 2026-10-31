import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Activity } from 'lucide-react';

/** Format seconds into mm:ss clock */
export function formatClock(seconds) {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Interactive Audio Waveform Player
 * Extracted & adapted from VoiceStudio (waveform-player.tsx & audio-preview-button.tsx)
 * Features dynamic canvas frequency bars, scrub seeking, timecode display, and audio feedback.
 */
export default function WaveformPlayer({
  duration = 24,
  isPlaying: externalIsPlaying,
  onPlayToggle,
  title = 'Recorded 311 Emergency Audio',
  compact = false,
  className = '',
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);

  const activePlaying = externalIsPlaying !== undefined ? externalIsPlaying : isPlaying;

  // Toggle playback
  const togglePlay = () => {
    if (onPlayToggle) {
      onPlayToggle(!activePlaying);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  // Playback timer ticker
  useEffect(() => {
    let interval;
    if (activePlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            if (onPlayToggle) onPlayToggle(false);
            return 0;
          }
          return Math.min(duration, prev + 0.1);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activePlaying, duration, onPlayToggle]);

  // Canvas Waveform rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = compact ? 24 : 38;
      const barWidth = 2.5;
      const gap = 2;
      const totalWidth = bars * (barWidth + gap) - gap;
      const startX = (canvas.width - totalWidth) / 2;
      const progressRatio = currentTime / (duration || 1);

      for (let i = 0; i < bars; i++) {
        const barRatio = i / bars;
        const isPast = barRatio <= progressRatio;

        let height;
        if (activePlaying) {
          const wave1 = Math.sin(phase + i * 0.45);
          const wave2 = Math.cos(phase * 0.7 + i * 0.3);
          height = Math.max(3, Math.abs(wave1 * wave2) * (canvas.height - 4) + 4);
        } else {
          // Static pre-rendered waveform profile
          const staticWave = Math.sin(i * 0.38) * Math.cos(i * 0.22);
          height = Math.max(3, Math.abs(staticWave) * (canvas.height - 8) + 4);
        }

        const x = startX + i * (barWidth + gap);
        const y = (canvas.height - height) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        if (activePlaying) {
          if (isPast) {
            gradient.addColorStop(0, '#f43f5e');
            gradient.addColorStop(0.5, '#fb7185');
            gradient.addColorStop(1, '#e11d48');
          } else {
            gradient.addColorStop(0, 'rgba(251, 113, 133, 0.3)');
            gradient.addColorStop(1, 'rgba(244, 63, 94, 0.15)');
          }
        } else {
          if (isPast) {
            gradient.addColorStop(0, '#38bdf8');
            gradient.addColorStop(1, '#0284c7');
          } else {
            gradient.addColorStop(0, 'rgba(148, 163, 184, 0.4)');
            gradient.addColorStop(1, 'rgba(100, 116, 139, 0.2)');
          }
        }

        ctx.fillStyle = gradient;
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, height, 1);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, barWidth, height);
        }
      }

      phase += activePlaying ? 0.16 : 0.02;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [activePlaying, currentTime, duration, compact]);

  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-md shadow-inner select-none ${className}`}
    >
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-md ${
          activePlaying
            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/40 ring-2 ring-rose-400/40'
            : 'bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 border border-white/[0.1]'
        }`}
        title={activePlaying ? 'Pause Audio' : 'Play Audio Recording'}
      >
        {activePlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
      </button>

      {/* Waveform Canvas & Seek Bar */}
      <div className="relative flex-1 min-w-0 flex flex-col justify-center">
        <canvas
          ref={canvasRef}
          width={compact ? 120 : 180}
          height={26}
          className="w-full h-[26px] pointer-events-none"
        />
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={currentTime}
          onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          title={`Seek: ${formatClock(currentTime)}`}
        />
      </div>

      {/* Timecode Clock */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="font-mono text-[11px] text-slate-300 tabular-nums">
          {formatClock(currentTime)}
          <span className="text-slate-500 font-normal"> / {formatClock(duration)}</span>
        </span>

        {/* Reset */}
        <button
          type="button"
          onClick={() => setCurrentTime(0)}
          className="p-1 rounded text-slate-400 hover:text-white transition"
          title="Rewind to start"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
