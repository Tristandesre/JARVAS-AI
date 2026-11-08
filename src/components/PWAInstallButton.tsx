import React, { useState } from 'react';
import { DownloadCloud, Smartphone, Check, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-400 font-mono">
        <Check className="w-3.5 h-3.5" />
        <span>Installed App</span>
      </div>
    );
  }

  return (
    <>
      {isInstallable ? (
        <button
          onClick={install}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 rounded-xl shadow-md shadow-emerald-600/25 transition-all active:scale-95 whitespace-nowrap shrink-0 min-h-[44px]"
          title="Install JARVAS AI on your Android Home Screen"
        >
          <Smartphone className="w-4 h-4" />
          <span>Install Android App</span>
        </button>
      ) : (
        <button
          onClick={() => setShowAndroidGuide(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
          title="How to install on Android Chrome"
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Add to Home Screen</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {/* Android Installation Modal Guide */}
      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-6 border border-purple-500/30 bg-[#0c0e18] shadow-2xl relative">
            <button
              onClick={() => setShowAndroidGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-cyan-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Install on Android Chrome</h3>
                <p className="text-xs text-slate-400">Launch from your phone home screen</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="font-mono text-purple-400 font-bold">1.</span>
                <span>Open this link in <strong>Google Chrome</strong> on your Android phone.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="font-mono text-purple-400 font-bold">2.</span>
                <span>Tap the <strong>three dots menu (⋮)</strong> at the top right of Chrome.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="font-mono text-purple-400 font-bold">3.</span>
                <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => setShowAndroidGuide(false)}
              className="mt-5 w-full py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors min-h-[44px]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
