import React, { useRef, useState, useEffect } from 'react';
import { Upload, Film, Play, Pause, CheckCircle2, AlertTriangle, Eye, Flame, Disc, Smartphone } from 'lucide-react';
import { PresetDance, SkeletonPose } from '../types';
import { generateChoreographyPose, renderPoseOnCanvas } from '../utils/poseTracker';

interface VideoUploadCardProps {
  videoSrc: string | null;
  videoDuration: number;
  onVideoSelected: (src: string, file?: File, meta?: { duration: number; styleId?: string; bpm?: number }) => void;
  selectedPreset: PresetDance | null;
  onSelectPreset: (preset: PresetDance) => void;
}

const PRESET_DANCES: PresetDance[] = [
  {
    id: 'cyber-kpop',
    title: 'Cyber K-Pop Wave',
    genre: 'K-Pop / Wave',
    duration: 15,
    bpm: 128,
    difficulty: 'Intermediate',
    description: 'Crisp synchronous arm isolations, fluid body wave, and sharp pelvic rhythm accents.',
    signatureMoves: ['Fluid Torso Wave', 'Synchronized Shoulder Snap', 'Cross-Step Glide'],
    cameraStyle: '3D Push-In Zooms & Lateral Tracking Pans',
    expressionStyle: 'Confident Stage Smile & Eyebrow Accents',
    previewColor: '#8b5cf6',
  },
  {
    id: 'urban-hiphop',
    title: 'Urban Street Bounce',
    genre: 'Hip-Hop & Groove',
    duration: 18,
    bpm: 104,
    difficulty: 'Advanced',
    description: 'Dynamic low center-of-gravity chest bounce, rapid foot glides, and stylized isolation freezes.',
    signatureMoves: ['Double Chest Pop', 'Heel-Toe Slide', 'Low Center Poly-Bounce'],
    cameraStyle: 'Low-Angle Tilt & Rhythmic Beat Jars',
    expressionStyle: 'Focused Chin-Up Swagger & Eye Contact',
    previewColor: '#06b6d4',
  },
  {
    id: 'neon-shuffle',
    title: 'Neon Shuffle & Glide',
    genre: 'EDM / Cutting Shapes',
    duration: 14,
    bpm: 132,
    difficulty: 'Intermediate',
    description: 'Fast-paced rhythmic running man footwork, clean T-steps, and weight-shifting spin turns.',
    signatureMoves: ['Running Man Sprint', 'Micro T-Step', '360° Float Spin'],
    cameraStyle: 'Wide Horizon Tracking & Ground Framing',
    expressionStyle: 'High-Energy Smile & Rapid Gaze Tracking',
    previewColor: '#ec4899',
  },
  {
    id: 'electro-popping',
    title: 'Electro Funk Popping',
    genre: 'Funk / Robotic Animation',
    duration: 16,
    bpm: 118,
    difficulty: 'Expert',
    description: 'Precision muscular hits, geometric arm tutting, robotic joint isolation, and clean head snaps.',
    signatureMoves: ['Forearm Tutting Grid', 'Chest Contraction Hit', 'Wave Isolation Pass'],
    cameraStyle: 'Punch-Zooms on Downbeats & Locked Tripod',
    expressionStyle: 'Robotic Eye Isolation & Sharp Snaps',
    previewColor: '#3b82f6',
  },
];

export const VideoUploadCard: React.FC<VideoUploadCardProps> = ({
  videoSrc,
  videoDuration,
  onVideoSelected,
  selectedPreset,
  onSelectPreset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSkeletonOverlay, setShowSkeletonOverlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [warningDuration, setWarningDuration] = useState<string | null>(null);

  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          ctx.clearRect(0, 0, width, height);

          const t = videoRef.current ? videoRef.current.currentTime : currentTime;

          if (!videoSrc) {
            ctx.fillStyle = '#090c16';
            ctx.fillRect(0, 0, width, height);

            const grad = ctx.createRadialGradient(width / 2, height * 0.4, 20, width / 2, height * 0.5, width * 0.5);
            grad.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            const styleId = selectedPreset?.id || 'cyber-kpop';
            const bpm = selectedPreset?.bpm || 120;
            const pose = generateChoreographyPose(t, styleId, bpm, videoDuration || 15);

            renderPoseOnCanvas(ctx, pose, width, height, { showGlow: true, showHands: true, opacity: 0.95 });
          } else if (showSkeletonOverlay) {
            const styleId = selectedPreset?.id || 'cyber-kpop';
            const bpm = selectedPreset?.bpm || 120;
            const pose = generateChoreographyPose(t, styleId, bpm, videoDuration || 15);
            renderPoseOnCanvas(ctx, pose, width, height, { showGlow: true, showHands: true, opacity: 0.9 });
          }
        }
      }

      if (isPlaying) {
        setCurrentTime((prev) => {
          const dur = videoDuration || 15;
          const next = prev + 0.033;
          return next > dur ? 0 : next;
        });
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentTime, videoSrc, showSkeletonOverlay, selectedPreset, videoDuration]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processVideoFile(file);
  };

  const processVideoFile = (file: File) => {
    if (!file.type.match(/^video\//i) && !file.name.match(/\.(mp4|mov|webm)$/i)) {
      alert('Please upload a valid MP4 or MOV dance video.');
      return;
    }

    const url = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = url;

    tempVideo.onloadedmetadata = () => {
      const duration = tempVideo.duration;
      if (duration > 30.5) {
        setWarningDuration(`Reference video is ${duration.toFixed(1)}s. JARVAS AI automatically trims to first 30.0s.`);
      } else {
        setWarningDuration(null);
      }

      onVideoSelected(url, file, {
        duration: Math.min(duration, 30),
      });
    };
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSelectPresetRoutine = (preset: PresetDance) => {
    onSelectPreset(preset);
    setCurrentTime(0);
    setIsPlaying(true);
    setWarningDuration(null);
    onVideoSelected('', undefined, {
      duration: preset.duration,
      styleId: preset.id,
      bpm: preset.bpm,
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col h-full border border-purple-500/20 shadow-xl bg-gradient-to-b from-[#0e111d] to-[#090b14]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
            02
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-sans">
              Dance Reference Video
            </h3>
            <p className="text-xs text-slate-400">
              Upload MP4/MOV from Android gallery or pick preset
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            MAX 30s
          </span>
          <button
            type="button"
            onClick={() => setShowSkeletonOverlay(!showSkeletonOverlay)}
            className={`px-2 py-1 rounded-lg text-[11px] font-mono border transition-colors flex items-center gap-1 min-h-[36px] ${
              showSkeletonOverlay
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle real-time pose tracking skeleton"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pose Mesh</span>
          </button>
        </div>
      </div>

      {warningDuration && (
        <div className="mt-3 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{warningDuration}</span>
        </div>
      )}

      {/* Main Video Viewport / Canvas */}
      <div className="mt-4 flex-1 flex flex-col">
        <div className="relative rounded-xl overflow-hidden bg-black/80 border border-purple-500/30 min-h-[260px] sm:min-h-[300px] max-h-[380px] flex items-center justify-center group">
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              loop
              playsInline
              onTimeUpdate={() => {
                if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
              }}
              className="w-full h-full object-contain max-h-[380px]"
            />
          ) : null}

          {/* Canvas for Skeleton Mesh Overlay or Procedural Dance Demo */}
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${
              videoSrc && !showSkeletonOverlay ? 'hidden' : ''
            }`}
          />

          {/* Top Info Bar */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="truncate max-w-[140px] sm:max-w-none">{selectedPreset?.title || 'Custom Video'}</span>
              <span>·</span>
              <span className="text-cyan-400 font-bold">{selectedPreset?.bpm || 124} BPM</span>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="pointer-events-auto px-3 py-1.5 text-xs text-slate-200 bg-slate-900/90 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors min-h-[36px] flex items-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gallery</span>
            </button>
          </div>

          {/* Bottom Video Controls */}
          <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-lg bg-black/85 backdrop-blur-md border border-slate-800 flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Timecode & Scrubber */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>00:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
                <span className="text-purple-400 font-semibold truncate hidden sm:inline">
                  33-Joint Kinematics Tracking Active
                </span>
                <span>00:{Math.floor(videoDuration || 15).toString().padStart(2, '0')}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-75"
                  style={{ width: `${(currentTime / (videoDuration || 15)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hidden video input for Android gallery */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Preset Dance Routine Selector */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Disc className="w-3.5 h-3.5 text-cyan-400" />
              <span>Or Choose Dance Routine</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">Max 30s</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PRESET_DANCES.map((preset) => {
              const isSelected = selectedPreset?.id === preset.id && !videoSrc;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPresetRoutine(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all min-h-[48px] active:scale-[0.98] ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/30 shadow-sm shadow-cyan-500/20 ring-1 ring-cyan-500/30'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{preset.title}</span>
                    <span className="text-[10px] font-mono text-cyan-400 shrink-0">{preset.bpm} BPM</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">{preset.genre}</div>
                  <div className="flex items-center gap-1 text-[9px] text-slate-500 mt-1 font-mono">
                    <span>{preset.duration}s</span>
                    <span>·</span>
                    <span>{preset.difficulty}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
