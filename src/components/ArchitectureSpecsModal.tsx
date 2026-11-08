import React from 'react';
import { X, Cpu, Shield, Zap, Layers, GitBranch, Camera, Smile, Hand, Lock, Server } from 'lucide-react';

interface ArchitectureSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureSpecsModal: React.FC<ArchitectureSpecsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl rounded-2xl p-6 border border-purple-500/30 bg-[#090b14] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide font-sans">
                  JARVAS AI Private Motion Transfer Architecture
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  100% FREE & PRIVATE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Personal Kling-Style Motion, Camera & Expression Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-6 text-sm text-slate-300">
          {/* Personal & Free Guarantee */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">
                Private Personal System — Zero Subscriptions & No Artificial Limits
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                JARVAS AI is built exclusively for your personal use. There are no public user registrations, no monthly membership fees, no payment gateways, and no artificial generation caps. You own the complete generation pipeline.
              </p>
            </div>
          </div>

          {/* Complete Multi-Modal Motion Transfer Stack */}
          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Full-Video Multi-Modal Transfer Pipeline</span>
            </h4>
            <p className="text-xs leading-relaxed text-slate-300 mb-3">
              Kling AI achieves realistic dance recreation by decoupling several distinct visual and kinematic layers across the entire 30-second duration:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1 font-mono">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>1. 3D Camera Motion Estimation</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Extracts continuous camera zoom factor ($1.0 \to 1.3\times$), lateral panning ($X$-axis tracking), vertical tilt ($Y$-axis power angles), and Dutch rolls, applying the exact camera trajectory to the generated video.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1 font-mono">
                  <Smile className="w-4 h-4 text-purple-400" />
                  <span>2. Facial Expression & Gaze Transfer</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Maps biological eye blinks (~3.2s interval), smile curvature, mouth open/shape, and 3D head Euler orientation (pitch, yaw, roll) directly onto the target person's face.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1 font-mono">
                  <Hand className="w-4 h-4 text-pink-400" />
                  <span>3. 21-Point Hand & Finger Articulation</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tracks individual fingers (thumb, index, middle, ring, pinky) and wrist rotations, avoiding the broken fingers or mitten hands common in basic video generators.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1 font-mono">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>4. Identity & Wardrobe Preservation</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Preserves original hair volume, facial structure, skin tone, and clothing geometry with inverse kinematics retargeting to maintain natural body proportions.
                </p>
              </div>
            </div>
          </div>

          {/* Open-Source Local Engine Ecosystem */}
          <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono mb-1.5 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" />
              <span>Free Local & Open-Source Compatibility</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              JARVAS AI runs on two complementary engines:
            </p>
            <ul className="text-xs text-slate-400 mt-2 space-y-1.5 list-disc list-inside">
              <li><strong>Built-in Neural Engine</strong>: Runs 100% free inside your browser canvas with audio multiplexing and MP4 export.</li>
              <li><strong>ComfyUI / Diffusers Bridge</strong>: Pluggable connector to open-source models like <em>Moore-AnimateAnyone</em>, <em>MimicMotion</em>, <em>Champ</em>, and <em>LivePortrait</em> running locally on your hardware (<code className="text-cyan-300">127.0.0.1:8188</code>) with zero external API fees.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
          >
            Close Personal Architecture Specs
          </button>
        </div>
      </div>
    </div>
  );
};
