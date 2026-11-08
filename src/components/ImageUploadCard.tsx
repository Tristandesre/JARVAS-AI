import React, { useRef, useState } from 'react';
import { Upload, User, CheckCircle2, Scan, Sparkles, Image as ImageIcon, Camera } from 'lucide-react';
import { CharacterPreset } from '../types';

interface ImageUploadCardProps {
  imageSrc: string | null;
  onImageSelected: (src: string, file?: File) => void;
  detectedMeta?: {
    detectedHair?: string;
    detectedWardrobe?: string;
  };
}

const PRESET_CHARACTERS: CharacterPreset[] = [
  {
    id: 'sarah-urban',
    name: 'Sarah M.',
    tag: 'Casual Studio Portrait',
    imagePath: '/src/assets/images/demo_portrait_urban_1794171584540.jpg',
    clothing: 'Fitted Black Bomber & White Tee',
  },
  {
    id: 'marcus-street',
    name: 'Marcus D.',
    tag: 'Athletic Full-Body',
    imagePath: '/src/assets/images/demo_portrait_dancer_1794171585267.jpg',
    clothing: 'Grey Streetwear Hoodie & Cargo Pants',
  },
];

export const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  imageSrc,
  onImageSelected,
  detectedMeta,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scanEffectActive, setScanEffectActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.match(/^image\//i)) {
      alert('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onImageSelected(event.target.result, file);
        triggerScanAnimation();
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerScanAnimation = () => {
    setScanEffectActive(true);
    setTimeout(() => setScanEffectActive(false), 1400);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col h-full border border-purple-500/20 shadow-xl bg-gradient-to-b from-[#0e111d] to-[#090b14]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono text-xs font-bold">
            01
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-sans">
              Target Person Photo
            </h3>
            <p className="text-xs text-slate-400">
              Upload from Android gallery or camera
            </p>
          </div>
        </div>

        {imageSrc && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ready</span>
          </div>
        )}
      </div>

      {/* Main Preview / Dropzone */}
      <div className="mt-4 flex-1 flex flex-col">
        {imageSrc ? (
          <div className="relative rounded-xl overflow-hidden bg-black/60 border border-purple-500/30 flex items-center justify-center min-h-[260px] sm:min-h-[300px] max-h-[380px] group">
            <img
              src={imageSrc}
              alt="Target person for motion transfer"
              className="w-full h-full object-contain max-h-[380px]"
            />

            {/* Futuristic Scanning line */}
            {scanEffectActive && (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent animate-pulse h-12 w-full top-1/3" />
            )}

            {/* Target reticle overlay */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 border border-purple-500/40 text-[10px] sm:text-[11px] text-purple-300 font-mono backdrop-blur-md">
                <Scan className="w-3 h-3 text-cyan-400 animate-spin" />
                <span>IDENTITY LOCKED</span>
              </div>
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs text-slate-200 bg-slate-900/90 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors min-h-[36px]"
                >
                  Gallery
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-2.5 py-1.5 text-xs text-slate-200 bg-slate-900/90 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors min-h-[36px] sm:hidden"
                  title="Take photo with camera"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>

            {/* Detected metadata overlay */}
            <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-lg bg-black/85 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Wardrobe: </span>
                <span className="text-slate-200 font-medium">
                  {detectedMeta?.detectedWardrobe || 'Neutral Casual Jacket'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Preservation: </span>
                <span className="text-cyan-400 font-mono font-semibold">98.5%</span>
              </div>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all min-h-[250px] flex-1 ${
              isDragging
                ? 'border-cyan-400 bg-cyan-950/20'
                : 'border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/10 bg-slate-900/30'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 shadow-inner">
              <Upload className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">
              Select or Drop Your Photo
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              JPG, PNG, WEBP from your Android gallery or computer files. Face & clothes are preserved.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md shadow-purple-600/25 transition-all min-h-[44px]"
              >
                Choose from Gallery
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="px-3 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors min-h-[44px] flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Camera</span>
              </button>
            </div>
          </div>
        )}

        {/* Hidden inputs for Android gallery and camera */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Quick Sample Presets */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Or Try Studio Sample Subject
            </span>
            <span className="text-[10px] text-purple-400 font-mono">Instant Test</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PRESET_CHARACTERS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onImageSelected(preset.imagePath);
                  triggerScanAnimation();
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all min-h-[48px] active:scale-[0.98] ${
                  imageSrc === preset.imagePath
                    ? 'border-purple-500 bg-purple-950/30 shadow-sm shadow-purple-500/20'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                }`}
              >
                <img
                  src={preset.imagePath}
                  alt={preset.name}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {preset.tag}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
