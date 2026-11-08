import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Zap,
  Monitor,
  Clock,
  Image as ImageIcon,
  ShieldCheck,
  Camera,
  Smile,
  Hand,
  Cpu,
  Lock,
  Server,
  Volume2,
  VolumeX,
  Compass,
  FileText,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Film,
  Sparkles,
  Layers,
  Ratio
} from 'lucide-react';
import { GenerationSettings, KlingGenerationType } from '../types';

interface SettingsPanelProps {
  settings: GenerationSettings;
  onChange: (updated: Partial<GenerationSettings>) => void;
  referenceDuration: number;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onChange,
  referenceDuration,
}) => {
  const [showAdvancedEngine, setShowAdvancedEngine] = useState(false);
  const [showNegativePrompt, setShowNegativePrompt] = useState(false);
  const [klingStatus, setKlingStatus] = useState<{ configured: boolean; authType?: string; baseUrl?: string } | null>(null);

  // Check Kling API configuration on backend
  useEffect(() => {
    fetch('/api/kling/status')
      .then((res) => res.json())
      .then((data) => {
        setKlingStatus({ configured: data.configured, authType: data.authType, baseUrl: data.baseUrl });
      })
      .catch(() => {
        setKlingStatus({ configured: false });
      });
  }, []);

  const isMotionControl = settings.generationType === 'motion-control';
  const isText2Video = settings.generationType === 'text2video';
  const isImage2Video = settings.generationType === 'image2video';

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-purple-500/25 shadow-xl bg-gradient-to-b from-[#0e111d] to-[#090b14] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/40 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase font-sans">
                Official Kling AI Video Engine
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                API SINGAPORE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Motion Control 2.6 · Text-to-Video · Image-to-Video · 1080p Cinematic Generation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {klingStatus?.configured ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Kling API Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-purple-300 font-mono bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Kling / Local Hybrid</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAdvancedEngine(!showAdvancedEngine)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline ml-1"
          >
            {showAdvancedEngine ? 'Hide Setup' : 'API & Models'}
          </button>
        </div>
      </div>

      {/* Kling Generation Mode Selector Tabs */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-cyan-400" />
          <span>Kling AI Generation Mode</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          <button
            type="button"
            onClick={() => onChange({ generationType: 'motion-control', klingModel: 'kling-v2-6' })}
            className={`py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 min-h-[42px] ${
              isMotionControl
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
            <div className="text-left">
              <div className="leading-tight">Motion Control 2.6</div>
              <div className="text-[10px] text-purple-200/80 font-normal">Dance & Pose Transfer</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ generationType: 'image2video', klingModel: 'kling-v1-6', duration: 5 })}
            className={`py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 min-h-[42px] ${
              isImage2Video
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
            <div className="text-left">
              <div className="leading-tight">Image to Video</div>
              <div className="text-[10px] text-cyan-200/80 font-normal">Animate Photo / Portrait</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ generationType: 'text2video', klingModel: 'kling-v1-6', duration: 5 })}
            className={`py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 min-h-[42px] ${
              isText2Video
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-pink-300 shrink-0" />
            <div className="text-left">
              <div className="leading-tight">Text to Video</div>
              <div className="text-[10px] text-pink-200/80 font-normal">Prompt to High-Def Video</div>
            </div>
          </button>
        </div>
      </div>

      {/* Kling AI Video Prompt */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>
              {isMotionControl
                ? 'Creative Motion Guidance Prompt (Kling 2.6)'
                : isImage2Video
                ? 'Image Animation & Motion Prompt (Kling AI)'
                : 'Creative Text-to-Video Prompt (Kling AI)'}
            </span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {isText2Video ? 'Required' : 'Optional styling & atmosphere'}
          </span>
        </label>
        <textarea
          rows={isText2Video ? 3 : 2}
          value={settings.prompt}
          onChange={(e) => onChange({ prompt: e.target.value })}
          placeholder={
            isText2Video
              ? 'e.g. A cybernetic dancer executing precise choreography under neon rain in Tokyo, volumetric purple spotlights, cinematic lighting, photorealistic 8k render, high detail, masterpiece'
              : isImage2Video
              ? 'e.g. Animate the person smiling naturally, subtle head turns, gentle wind blowing hair, cinematic lens blur, realistic motion'
              : 'e.g. Masterpiece dance performance, cinematic stage lighting, ultra-realistic body movement, photorealistic skin and hair dynamics, 8k resolution'
          }
          className="w-full p-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder:text-slate-600 font-sans"
        />

        {/* Negative Prompt Toggle */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setShowNegativePrompt(!showNegativePrompt)}
            className="text-[11px] text-slate-400 hover:text-slate-300 font-mono flex items-center gap-1"
          >
            <span>{showNegativePrompt ? '− Hide Negative Prompt' : '+ Negative Prompt & CFG Tuning'}</span>
          </button>
          <span className="text-[10px] text-slate-500 font-mono">
            Model: <strong className="text-cyan-400">{settings.klingModel || (isMotionControl ? 'kling-v2-6' : 'kling-v1-6')}</strong>
          </span>
        </div>

        {showNegativePrompt && (
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 animate-fadeIn">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Negative Prompt (unwanted artifacts)
              </label>
              <input
                type="text"
                value={settings.negativePrompt || ''}
                onChange={(e) => onChange({ negativePrompt: e.target.value })}
                placeholder="low quality, blurry, distorted face, extra limbs, deformed fingers"
                className="w-full p-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <span>CFG Guidance Scale: <strong className="text-purple-400 font-mono">{settings.cfgScale ?? 0.5}</strong></span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={settings.cfgScale ?? 0.5}
                onChange={(e) => onChange({ cfgScale: parseFloat(e.target.value) })}
                className="w-32 accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Primary Video Settings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* 1. Kling Model Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kling AI Model</span>
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            {isMotionControl ? (
              <button
                type="button"
                onClick={() => onChange({ klingModel: 'kling-v2-6' })}
                className="col-span-3 py-1.5 text-xs font-bold rounded-lg bg-purple-600 text-white min-h-[36px]"
              >
                kling-v2-6 (Motion Control)
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onChange({ klingModel: 'kling-v2-6' })}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all min-h-[36px] ${
                    settings.klingModel === 'kling-v2-6' || !settings.klingModel
                      ? 'bg-purple-600 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  kling-v2-6
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ klingModel: 'kling-v3' })}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all min-h-[36px] ${
                    settings.klingModel === 'kling-v3'
                      ? 'bg-purple-600 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  kling-v3
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ klingModel: 'kling-4.0-flash' })}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all min-h-[36px] ${
                    settings.klingModel === 'kling-4.0-flash'
                      ? 'bg-purple-600 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  kling-4.0
                </button>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {isMotionControl ? 'Kling 2.6 Kinematic retargeting' : 'Official Singapore generation model'}
          </span>
        </div>

        {/* 2. Aspect Ratio (16:9 / 9:16 / 1:1) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Ratio className="w-3.5 h-3.5 text-purple-400" />
            <span>Aspect Ratio</span>
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <button
              type="button"
              onClick={() => onChange({ aspectRatio: '16:9' })}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all min-h-[36px] ${
                settings.aspectRatio === '16:9' || !settings.aspectRatio
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              16:9
            </button>
            <button
              type="button"
              onClick={() => onChange({ aspectRatio: '9:16' })}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all min-h-[36px] ${
                settings.aspectRatio === '9:16'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              9:16
            </button>
            <button
              type="button"
              onClick={() => onChange({ aspectRatio: '1:1' })}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all min-h-[36px] ${
                settings.aspectRatio === '1:1'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1:1
            </button>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {settings.aspectRatio === '9:16' ? 'Mobile vertical format' : settings.aspectRatio === '1:1' ? 'Square feed format' : 'Cinema widescreen format'}
          </span>
        </div>

        {/* 3. Output Resolution (720p / 1080p) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-purple-400" />
            <span>Output Resolution</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <button
              type="button"
              onClick={() => onChange({ quality: '720p', mode: 'std' })}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all min-h-[36px] ${
                settings.quality === '720p'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              720p (std)
            </button>
            <button
              type="button"
              onClick={() => onChange({ quality: '1080p', mode: 'pro' })}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all min-h-[36px] ${
                settings.quality === '1080p'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1080p (pro)
            </button>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {settings.quality === '1080p' ? 'Full HD 1920x1080 (Kling Pro)' : 'HD 1280x720 (Kling Standard)'}
          </span>
        </div>

        {/* 4. Target Duration (5s, 10s, or synced) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            <span>Target Duration</span>
          </label>
          {isMotionControl ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 min-h-[44px]">
              <span className="font-mono text-purple-300 font-bold">{settings.duration}s</span>
              <span className="text-[11px] text-slate-400">
                Synced (max 30s)
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
              <button
                type="button"
                onClick={() => onChange({ duration: 5 })}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all min-h-[36px] ${
                  settings.duration === 5
                    ? 'bg-pink-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                5s (Standard)
              </button>
              <button
                type="button"
                onClick={() => onChange({ duration: 10 })}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all min-h-[36px] ${
                  settings.duration === 10
                    ? 'bg-pink-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                10s (Extended)
              </button>
            </div>
          )}
          <span className="text-[10px] text-slate-500 font-mono">
            {isMotionControl ? 'Choreography duration' : 'Kling AI video length'}
          </span>
        </div>
      </div>

      {/* Official Kling Motion Transfer Toggles (Shown when Motion Control or Image to Video is selected) */}
      {(isMotionControl || isImage2Video) && (
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Toggle 1: Body Movement Transfer */}
          <button
            type="button"
            onClick={() => onChange({ bodyMotion: !settings.bodyMotion })}
            className={`p-2.5 rounded-xl border text-left transition-all min-h-[48px] ${
              settings.bodyMotion
                ? 'border-purple-500/50 bg-purple-950/30 shadow-sm'
                : 'border-slate-800 bg-slate-900/40 opacity-70'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Body Motion</span>
              <span className={`text-[10px] font-mono ${settings.bodyMotion ? 'text-purple-400' : 'text-slate-500'}`}>
                {settings.bodyMotion ? 'ON' : 'OFF'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">
              Choreography & jumps
            </p>
          </button>

          {/* Toggle 2: Facial Expressions */}
          <button
            type="button"
            onClick={() => onChange({ faceMotion: !settings.faceMotion })}
            className={`p-2.5 rounded-xl border text-left transition-all min-h-[48px] ${
              settings.faceMotion
                ? 'border-cyan-500/50 bg-cyan-950/30 shadow-sm'
                : 'border-slate-800 bg-slate-900/40 opacity-70'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Facial Expressions</span>
              <span className={`text-[10px] font-mono ${settings.faceMotion ? 'text-cyan-400' : 'text-slate-500'}`}>
                {settings.faceMotion ? 'ON' : 'OFF'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">
              Smiles & eye blinks
            </p>
          </button>

          {/* Toggle 3: Head Movement */}
          <button
            type="button"
            onClick={() => onChange({ headMotion: !settings.headMotion })}
            className={`p-2.5 rounded-xl border text-left transition-all min-h-[48px] ${
              settings.headMotion
                ? 'border-indigo-500/50 bg-indigo-950/30 shadow-sm'
                : 'border-slate-800 bg-slate-900/40 opacity-70'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Head Direction</span>
              <span className={`text-[10px] font-mono ${settings.headMotion ? 'text-indigo-400' : 'text-slate-500'}`}>
                {settings.headMotion ? 'ON' : 'OFF'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">
              3D Yaw, pitch, roll
            </p>
          </button>

          {/* Toggle 4: Camera Movement */}
          <button
            type="button"
            onClick={() => onChange({ cameraMotion: !settings.cameraMotion })}
            className={`p-2.5 rounded-xl border text-left transition-all min-h-[48px] ${
              settings.cameraMotion
                ? 'border-pink-500/50 bg-pink-950/30 shadow-sm'
                : 'border-slate-800 bg-slate-900/40 opacity-70'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Camera Movement</span>
              <span className={`text-[10px] font-mono ${settings.cameraMotion ? 'text-pink-400' : 'text-slate-500'}`}>
                {settings.cameraMotion ? 'ON' : 'OFF'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">
              3D Zooms, pans, tilts
            </p>
          </button>
        </div>
      )}

      {/* Advanced API & Engine Setup Drawer */}
      {showAdvancedEngine && (
        <div className="mt-4 p-4 rounded-xl border border-purple-500/30 bg-slate-950/90 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Official Kling AI Engine & Authentication
              </span>
            </div>
            <a
              href="https://kling.ai/document-api/api/video/motion-control/2-6"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              <span>Official Kling Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <p className="leading-relaxed">
              <strong>API Base:</strong> <code className="text-cyan-300 font-mono">https://api-singapore.klingai.com</code>
            </p>
            <p className="leading-relaxed text-slate-400 text-[11px]">
              API credentials are kept strictly secure on the backend. Read from <code className="text-slate-200 font-mono">KLING_API_KEY</code> environment variable as a Bearer token.
            </p>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex flex-wrap gap-3">
              <span>Text-to-Video: <code className="text-pink-300">/v1/videos/text2video</code></span>
              <span>Image-to-Video: <code className="text-cyan-300">/v1/videos/image2video</code></span>
              <span>Motion Control: <code className="text-purple-300">/motion-control/kling-2.6</code></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onChange({ engineMode: 'kling_official' })}
              className={`p-2.5 rounded-lg border text-left text-xs transition-colors min-h-[44px] ${
                settings.engineMode === 'kling_official'
                  ? 'border-cyan-500 bg-cyan-950/40 text-white'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400'
              }`}
            >
              <div className="font-bold text-cyan-300">Official Kling AI (Primary)</div>
              <div className="text-[10px] text-slate-400">Singapore API with automatic task polling.</div>
            </button>

            <button
              type="button"
              onClick={() => onChange({ engineMode: 'local_browser' })}
              className={`p-2.5 rounded-lg border text-left text-xs transition-colors min-h-[44px] ${
                settings.engineMode === 'local_browser'
                  ? 'border-purple-500 bg-purple-950/40 text-white'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400'
              }`}
            >
              <div className="font-bold text-purple-300">Built-in Neural Fallback</div>
              <div className="text-[10px] text-slate-400">100% Free instant generation on device.</div>
            </button>

            <button
              type="button"
              onClick={() => onChange({ engineMode: 'local_comfyui' })}
              className={`p-2.5 rounded-lg border text-left text-xs transition-colors min-h-[44px] ${
                settings.engineMode === 'local_comfyui'
                  ? 'border-indigo-500 bg-indigo-950/40 text-white'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400'
              }`}
            >
              <div className="font-bold text-indigo-300">Python FastAPI Backend</div>
              <div className="text-[10px] text-slate-400">Connect to backend/main.py on port 8000.</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
