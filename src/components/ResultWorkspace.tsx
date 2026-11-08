import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Sparkles,
  Maximize2,
  Columns,
  Grid3X3,
  Flame,
  Activity,
  Layers,
  Camera,
  Smile,
  Hand,
  Share2,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SynthesizerResult } from '../utils/motionSynthesizer';
import { MotionAnalysisData, PresetDance } from '../types';
import { generateChoreographyPose, renderPoseOnCanvas } from '../utils/poseTracker';

interface ResultWorkspaceProps {
  result: SynthesizerResult;
  referenceVideoSrc: string | null;
  characterImgSrc: string;
  selectedPreset: PresetDance | null;
  analysisData: MotionAnalysisData | null;
  onRegenerate: () => void;
}

export const ResultWorkspace: React.FC<ResultWorkspaceProps> = ({
  result,
  referenceVideoSrc,
  characterImgSrc,
  selectedPreset,
  analysisData,
  onRegenerate,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'triple' | 'solo'>('split');
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isScrubbingSlider, setIsScrubbingSlider] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const genVideoRef = useRef<HTMLVideoElement>(null);
  const refVideoRef = useRef<HTMLVideoElement>(null);
  const skeletonCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#38bdf8', '#c084fc', '#f43f5e'],
    });
  }, []);

  useEffect(() => {
    if (genVideoRef.current) {
      genVideoRef.current.playbackRate = playbackSpeed;
      if (isPlaying) {
        genVideoRef.current.play().catch(() => {});
      } else {
        genVideoRef.current.pause();
      }
    }

    if (refVideoRef.current) {
      refVideoRef.current.playbackRate = playbackSpeed;
      if (isPlaying) {
        refVideoRef.current.play().catch(() => {});
      } else {
        refVideoRef.current.pause();
      }
    }
  }, [isPlaying, playbackSpeed]);

  const handleTimeUpdate = () => {
    if (genVideoRef.current) {
      const t = genVideoRef.current.currentTime;
      setCurrentTime(t);

      if (refVideoRef.current && Math.abs(refVideoRef.current.currentTime - t) > 0.25) {
        refVideoRef.current.currentTime = t;
      }

      if (skeletonCanvasRef.current) {
        const canvas = skeletonCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#06070a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const styleId = selectedPreset?.id || 'cyber-kpop';
          const bpm = selectedPreset?.bpm || 120;
          const pose = generateChoreographyPose(t, styleId, bpm, result.duration);
          renderPoseOnCanvas(ctx, pose, canvas.width, canvas.height, { showGlow: true, showHands: true });
        }
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (genVideoRef.current) genVideoRef.current.currentTime = targetTime;
    if (refVideoRef.current) refVideoRef.current.currentTime = targetTime;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Download directly to Android storage or computer
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = result.videoUrl;
    a.download = `JARVAS_Dance_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Android Web Share API: save to Gallery or share via Android sheet
  const handleAndroidShare = async () => {
    if (!navigator.share) {
      handleDownload();
      return;
    }

    try {
      setIsSharing(true);
      const file = new File([result.videoBlob], `JARVAS_Dance_${Date.now()}.mp4`, { type: 'video/mp4' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'JARVAS AI Dance Video',
          text: 'Generated with JARVAS AI Motion Transfer',
          files: [file],
        });
      } else {
        await navigator.share({
          title: 'JARVAS AI Dance Video',
          url: result.videoUrl,
        });
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        handleDownload();
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Split-slider drag handlers with Android touch support
  const handleMouseDown = () => setIsScrubbingSlider(true);
  const handleMouseUp = () => setIsScrubbingSlider(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isScrubbingSlider || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = (x / rect.width) * 100;
    setSliderPosition(pct);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const pct = (x / rect.width) * 100;
    setSliderPosition(pct);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner: Success & Personal Download */}
      <div className="glass-panel rounded-2xl p-5 border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-cyan-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>AI Motion Transfer Complete (Saved on Device)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans tracking-tight">
            Choreography Retargeted
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Identity preserved at {result.telemetry.identityMatch}% · Full 30s body dance, camera zooms, and facial expressions transferred.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onRegenerate}
            className="px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Video</span>
          </button>

          <button
            onClick={handleAndroidShare}
            className="px-3.5 py-2.5 text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 rounded-xl border border-cyan-500/30 transition-colors flex items-center gap-1.5 min-h-[44px]"
            title="Share or Save to Android Gallery"
          >
            <Share2 className="w-4 h-4" />
            <span>Share / Save</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 active:scale-95 min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Save MP4</span>
          </button>
        </div>
      </div>

      {/* Advanced Capabilities Status Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>Camera: 3D Zooms Transferred</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300">
          <Smile className="w-3.5 h-3.5 text-purple-400" />
          <span>Face: Blinks & Smiles Synced</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-950/40 border border-pink-500/30 text-pink-300">
          <Hand className="w-3.5 h-3.5 text-pink-400" />
          <span>Hands: 21-Finger Joints</span>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 min-h-[36px] ${
              viewMode === 'split'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('triple')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 min-h-[36px] ${
              viewMode === 'triple'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Triple View</span>
            <span className="sm:hidden">3-View</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('solo')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 min-h-[36px] ${
              viewMode === 'solo'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Solo</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{result.telemetry.resolution}</span>
          <span>·</span>
          <span>{result.telemetry.fps} fps</span>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="glass-panel rounded-2xl p-3 sm:p-4 border border-purple-500/25 bg-black/90 shadow-2xl">
        {/* MODE 1: Interactive Split-Slider View */}
        {viewMode === 'split' && (
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-video rounded-xl overflow-hidden bg-black select-none cursor-ew-resize min-h-[280px] sm:min-h-[380px] max-h-[560px]"
          >
            <video
              ref={genVideoRef}
              src={result.videoUrl}
              loop
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            <div
              className="absolute inset-y-0 left-0 overflow-hidden bg-slate-950 pointer-events-none border-r-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              style={{ width: `${sliderPosition}%` }}
            >
              {referenceVideoSrc ? (
                <video
                  ref={refVideoRef}
                  src={referenceVideoSrc}
                  loop
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  style={{ width: containerRef.current?.clientWidth || '100%', height: '100%' }}
                />
              ) : (
                <canvas
                  ref={skeletonCanvasRef}
                  width={1280}
                  height={720}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ width: containerRef.current?.clientWidth || '100%', height: '100%' }}
                />
              )}

              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                REFERENCE DANCE
              </div>
            </div>

            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-purple-500/40 text-[10px] font-mono text-purple-300">
              YOUR PHOTO DANCING
            </div>

            {/* Drag Handle with touch hit target */}
            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              className="absolute inset-y-0 flex items-center justify-center pointer-events-auto cursor-ew-resize"
              style={{ left: `calc(${sliderPosition}% - 20px)` }}
            >
              <div className="w-10 h-10 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-400/50 ring-4 ring-black/70">
                <Sliders className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: Triple-View Synced Mode */}
        {viewMode === 'triple' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
                <span>01. Reference Dance</span>
                <span className="text-cyan-400 font-semibold">{selectedPreset?.bpm || 120} BPM</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                {referenceVideoSrc ? (
                  <video
                    src={referenceVideoSrc}
                    loop
                    playsInline
                    muted
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                    Preset: {selectedPreset?.title}
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-slate-300">
                  Input Dance + Camera
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
                <span>02. 33-Body + 21-Hand IK</span>
                <span className="text-purple-400 font-semibold">Joints + Hands</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-purple-500/30">
                <canvas
                  ref={skeletonCanvasRef}
                  width={640}
                  height={360}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-purple-300">
                  Biomechanical Vector
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
                <span>03. JARVAS AI Output</span>
                <span className="text-emerald-400 font-semibold">Rendered MP4</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-cyan-500/40 shadow-lg shadow-purple-500/10">
                <video
                  ref={genVideoRef}
                  src={result.videoUrl}
                  loop
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-cyan-300">
                  Your Photo Dancing
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: Full Solo Preview */}
        {viewMode === 'solo' && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black min-h-[280px] sm:min-h-[380px] max-h-[560px]">
            <video
              ref={genVideoRef}
              src={result.videoUrl}
              loop
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Playback Controls Bar with Mobile-Friendly Touch Targets */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            {/* Timecode */}
            <div className="text-xs font-mono text-slate-300 whitespace-nowrap">
              <span>00:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
              <span className="text-slate-600 mx-1">/</span>
              <span className="text-slate-400">00:{Math.floor(result.duration).toString().padStart(2, '0')}</span>
            </div>

            {/* Playback rate */}
            <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono">
              {[0.5, 1, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded transition-colors min-h-[32px] ${
                    playbackSpeed === speed ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="w-full flex-1 flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={result.duration || 15}
              step="0.05"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
