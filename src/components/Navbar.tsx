import React from 'react';
import { Sparkles, RefreshCw, Video, Smartphone } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onQuickDemo: () => void;
  onReset: () => void;
  hasActiveProject: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onQuickDemo, onReset, hasActiveProject }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-500/15 bg-[#07080d]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Wordmark & Android PWA Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-purple-400/30">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white font-sans flex items-center gap-1">
                JARVAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-mono bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                ANDROID PWA
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-wider uppercase -mt-0.5">
              Motion Transfer Studio
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (hidden on mobile, in bottom bar) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#studio" className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-white font-semibold">
            Motion Studio
          </a>
          <a href="#reference-library" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Dance Library
          </a>
          <a href="#advanced-motion" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Camera & Face Specs
          </a>
          <a href="#fastapi-backend" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            FastAPI Backend
          </a>
        </nav>

        {/* Zone 3: Primary Actions & PWA Install Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <PWAInstallButton />

          {hasActiveProject && (
            <button
              onClick={onReset}
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[44px]"
              title="Reset current project"
              aria-label="Reset"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={onQuickDemo}
            className="px-3 sm:px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-xl shadow-md shadow-purple-600/25 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95 min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
