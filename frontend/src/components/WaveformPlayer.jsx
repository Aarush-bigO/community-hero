import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Activity, Radio } from 'lucide-react';
import { speakClear, stopClearSpeech, playRadioChime } from '../utils/speech';

/** Format seconds into mm:ss clock */
export function formatClock(seconds) {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

const DEFAULT_SAMPLE_AUDIO =
  'Attention all units: Emergency CAD Work Order 311 logged for Connaught Place Block B. Rapid Hazard Unit 4 is en route with sirens. Stand clear of perimeter.';

/**
 * Interactive Audio Waveform Player with Crystal-Clear Emergency Speech
 * Plays authentic radio chime + crystal clear verbal CAD transmission while animating canvas.
 */
export default function WaveformPlayer({
  duration = 14,
  sampleText = DEFAULT_SAMPLE_AUDIO,
  title = 'Recorded 311 Emergency Audio',
  compact = false,
  className = '',
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const intervalRef = useRef(null);

  // Play / Pause toggle with real clear audio
  const togglePlay = () => {
    if (isPlaying) {
      stopClearSpeech();
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      setCurrentTime(0);

      // Play real crystal-clear emergency audio transmission
      speakClear(sampleText, {
        language: 'en',
        rate: 0.94,
        volume: 1.0,
        playChime: true,
        onEnd: () => {
          setIsPlaying(false);
          clearInterval(intervalRef.current);
          setCurrentTime(duration);
        },
      });

      // Advance timecode clock smoothly
      const start = Date.now();
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - start) / 1000;
        if (elapsed >= duration) {
          clearInterval(intervalRef.current);
          setCurrentTime(duration);
          setIsPlaying(false);
        } else {
          setCurrentTime(elapsed);
        }
      }, 100);
    }
  };

  // Reset
  const handleReset = () => {
    stopClearSpeech();
    setIsPlaying(false);
    clearInterval(intervalRef.current);
    setCurrentTime(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopClearSpeech();
      clearInterval(intervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Canvas Waveform rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = compact ? 26 : 38;
      const barWidth = 2.5;
      const gap = 2;
      const totalWidth = bars * (barWidth + gap) - gap;
      const startX = (canvas.width - totalWidth) / 2;
      const progressRatio = currentTime / (duration || 1);

      for (let i = 0; i < bars; i++) {
        const barRatio = i / bars;
        const isPast = barRatio <= progressRatio;

        let height;
        if (isPlaying) {
          const wave1 = Math.sin(phase + i * 0.45);
          const wave2 = Math.cos(phase * 0.7 + i * 0.3);
          height = Math.max(4, Math.abs(wave1 * wave2) * (canvas.height - 4) + 4);
        } else {
          const staticWave = Math.sin(i * 0.38) * Math.cos(i * 0.22);
          height = Math.max(3, Math.abs(staticWave) * (canvas.height - 8) + 4);
        }

        const x = startX + i * (barWidth + gap);
        const y = (canvas.height - height) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        if (isPlaying) {
          if (isPast) {
            gradient.addColorStop(0, '#f43f5e');
            gradient.addColorStop(0.5, '#fb7185');
            gradient.addColorStop(1, '#e11d48');
          } else {
            gradient.addColorStop(0, 'rgba(251, 113, 133, 0.4)');
            gradient.addColorStop(1, 'rgba(244, 63, 94, 0.15)');
          }
        } else {
          if (isPast) {
            gradient.addColorStop(0, '#38bdf8');
            gradient.addColorStop(1, '#0284c7');
          } else {
            gradient.addColorStop(0, 'rgba(148, 163, 184, 0.45)');
            gradient.addColorStop(1, 'rgba(100, 116, 139, 0.2)');
          }
        }

        ctx.fillStyle = gradient;
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, height, 1.2);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, barWidth, height);
        }
      }

      phase += isPlaying ? 0.18 : 0.02;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, currentTime, duration, compact]);

  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-white/[0.08] backdrop-blur-md shadow-inner select-none ${className}`}
    >
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-md ${
          isPlaying
            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/40 ring-2 ring-rose-400/40'
            : 'bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 border border-white/[0.1]'
        }`}
        title={isPlaying ? 'Pause Audio' : 'Play Clear Dispatch Audio'}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
      </button>

      {/* Waveform Canvas & Seek Bar */}
      <div className="relative flex-1 min-w-0 flex flex-col justify-center">
        <canvas
          ref={canvasRef}
          width={compact ? 130 : 180}
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
          onClick={handleReset}
          className="p-1 rounded text-slate-400 hover:text-white transition"
          title="Rewind to start"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
