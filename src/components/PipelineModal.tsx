import React from 'react';
import { Loader2, CheckCircle2, Cpu, Sparkles, Layers, ShieldCheck, Film } from 'lucide-react';
import { PipelineProgress, PipelineStage } from '../types';

interface PipelineModalProps {
  progress: PipelineProgress;
}

const STAGES: { id: PipelineStage; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'extracting_motion',
    label: '1. Biomechanical Pose Extraction',
    icon: <Cpu className="w-4 h-4 text-cyan-400" />,
    desc: 'Extracting 33-point skeletal landmarks, joint angles, and tempo from reference dance',
  },
  {
    id: 'analyzing_identity',
    label: '2. Identity & Silhouette Segmentation',
    icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
    desc: 'Locking facial features, hairstyle flow, skin tone, and clothing boundary geometry',
  },
  {
    id: 'retargeting_kinematics',
    label: '3. Inverse Kinematics Retargeting',
    icon: <Sparkles className="w-4 h-4 text-pink-400" />,
    desc: 'Adapting dancer limb dynamics to target person physical proportions and bone length',
  },
  {
    id: 'synthesizing_frames',
    label: '4. Neural Video Diffusion Synthesis',
    icon: <Film className="w-4 h-4 text-indigo-400" />,
    desc: 'Rendering conditioned frame-by-frame dance movement with stage lighting reflections',
  },
  {
    id: 'encoding_video',
    label: '5. Temporal Coherence & MP4 Export',
    icon: <Layers className="w-4 h-4 text-emerald-400" />,
    desc: 'Multiplexing synchronized audio beat track and applying anti-flicker smoothing',
  },
];

export const PipelineModal: React.FC<PipelineModalProps> = ({ progress }) => {
  const getStageIndex = (stage: PipelineStage) => {
    switch (stage) {
      case 'extracting_motion': return 0;
      case 'analyzing_identity': return 1;
      case 'retargeting_kinematics': return 2;
      case 'synthesizing_frames': return 3;
      case 'encoding_video': return 4;
      case 'completed': return 5;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(progress.stage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-2xl p-6 border border-purple-500/30 bg-[#0a0d18] shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500" />

        {/* Title & Spinner */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide font-sans">
                JARVAS AI Neural Motion Transfer
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Real-time Video Synthesis Pipeline Active
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-extrabold font-mono text-cyan-400 tabular-nums">
              {progress.percent}%
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
              Generation Progress
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress.percent}%` }}
          />
        </div>

        {/* Live Action Status */}
        <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="truncate">{progress.currentAction}</span>
        </div>

        {/* Pipeline Stepper List */}
        <div className="mt-5 space-y-2.5">
          {STAGES.map((step, idx) => {
            const isDone = currentIndex > idx;
            const isCurrent = currentIndex === idx;
            const isPending = currentIndex < idx;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isCurrent
                    ? 'border-purple-500/50 bg-purple-950/20 shadow-sm shadow-purple-500/10'
                    : isDone
                    ? 'border-slate-800/80 bg-slate-900/40 text-slate-400'
                    : 'border-slate-800/40 bg-transparent text-slate-600 opacity-60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-mono text-slate-500">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className={`text-xs font-semibold ${isCurrent ? 'text-white' : isDone ? 'text-slate-200' : 'text-slate-500'}`}>
                    {step.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
