import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, Image as ImageIcon, Sparkles, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { SAMPLE_VEHICLES, SampleVehicle } from '../utils/sampleImages';

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string, sampleInfo?: SampleVehicle) => void;
  onOpenCamera: () => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onOpenCamera,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file reading
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Clipboard paste support (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            processFile(blob);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [disabled]);

  return (
    <div className="w-full space-y-6">
      {/* Main Drag-Drop / Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative group rounded-3xl border-2 border-dashed p-8 sm:p-10 transition-all duration-300 text-center cursor-pointer ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/40 shadow-2xl shadow-cyan-500/20 scale-[1.01]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60 shadow-xl'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={disabled}
        />

        {/* Center Upload Prompt */}
        <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300 shadow-lg shadow-cyan-500/10">
              <Upload className="w-8 h-8 stroke-[2]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shadow">
              AI
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              Upload Vehicle Image or Drop File Here
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Supports JPG, PNG, WEBP, or paste from clipboard (<kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">Ctrl+V</kbd>)
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-all shadow-md shadow-cyan-600/20 active:scale-95"
            >
              <ImageIcon className="w-4 h-4" />
              Browse Image
            </button>

            <button
              type="button"
              onClick={onOpenCamera}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all active:scale-95"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              Live Camera
            </button>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Angle & Tilt Invariance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Conditional Deblurring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Indian HSRP / BH Standards</span>
          </div>
        </div>
      </div>

      {/* Real-Time Vehicle Demo Gallery Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Real-Time Vehicle Demo Photos (1-Click Run)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            Select a real Indian road capture to run the full AI pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SAMPLE_VEHICLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onImageSelected(sample.dataUrl, sample)}
              disabled={disabled}
              className="group text-left p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 flex flex-col justify-between space-y-3 hover:shadow-lg hover:shadow-cyan-950/40 relative overflow-hidden active:scale-[0.98]"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80">
                <img
                  src={sample.dataUrl}
                  alt={sample.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {sample.isBlurrySample && (
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-amber-500/90 text-[10px] font-bold text-slate-950 flex items-center gap-1 shadow">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Blurry
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                    {sample.plateNumber}
                  </span>
                  <span className="text-[10px] text-slate-500">{sample.state}</span>
                </div>
                <h5 className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {sample.name}
                </h5>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {sample.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
