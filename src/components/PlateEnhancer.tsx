import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Sliders,
  Download,
  AlertTriangle,
  CheckCircle,
  Eye,
  Maximize2,
  RefreshCw,
  Gauge,
  Sun,
  Layers,
} from 'lucide-react';
import { QualityAssessment, EnhancementSettings } from '../types/lpr';
import { enhancePlateImage } from '../utils/imageProcessing';

interface PlateEnhancerProps {
  originalCroppedUrl: string;
  qualityAssessment: QualityAssessment;
  onEnhancedImageUpdated?: (enhancedUrl: string) => void;
}

export const PlateEnhancer: React.FC<PlateEnhancerProps> = ({
  originalCroppedUrl,
  qualityAssessment,
  onEnhancedImageUpdated,
}) => {
  const [enhancedUrl, setEnhancedUrl] = useState<string>(originalCroppedUrl);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);

  // Manual adjustment settings
  const [settings, setSettings] = useState<EnhancementSettings>({
    sharpness: qualityAssessment.isBlurry ? 75 : 30,
    contrast: qualityAssessment.isBlurry ? 25 : 10,
    brightness: 0,
    binarize: false,
    threshold: 128,
    gamma: 1.0,
    activeFilter: qualityAssessment.isBlurry ? 'adaptive-unsharp' : 'natural',
  });

  // Re-run enhancement whenever settings change
  useEffect(() => {
    let isMounted = true;
    enhancePlateImage(originalCroppedUrl, settings).then((result) => {
      if (isMounted) {
        setEnhancedUrl(result);
        onEnhancedImageUpdated?.(result);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [originalCroppedUrl, settings, onEnhancedImageUpdated]);

  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = () => setIsDraggingSlider(true);
  const handlePointerUp = () => setIsDraggingSlider(false);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSlider || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handlePresetSelect = (preset: 'auto' | 'sharp' | 'binary' | 'reset') => {
    if (preset === 'auto') {
      setSettings({
        sharpness: 75,
        contrast: 25,
        brightness: 5,
        binarize: false,
        threshold: 128,
        gamma: 1.0,
        activeFilter: 'adaptive-unsharp',
      });
    } else if (preset === 'sharp') {
      setSettings({
        sharpness: 95,
        contrast: 35,
        brightness: 0,
        binarize: false,
        threshold: 128,
        gamma: 0.9,
        activeFilter: 'high-contrast',
      });
    } else if (preset === 'binary') {
      setSettings({
        sharpness: 60,
        contrast: 40,
        brightness: 0,
        binarize: true,
        threshold: 125,
        gamma: 1.0,
        activeFilter: 'binarized',
      });
    } else {
      setSettings({
        sharpness: 0,
        contrast: 0,
        brightness: 0,
        binarize: false,
        threshold: 128,
        gamma: 1.0,
        activeFilter: 'natural',
      });
    }
  };

  const downloadImage = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-4">
      {/* Header with Blur Quality status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Plate Crop & Clarity Enhancement
            </h3>
            <p className="text-[11px] text-slate-400">
              High-Precision ROI Isolation & Laplacian Edge Reconstruction
            </p>
          </div>
        </div>

        {/* Quality Assessment Badge */}
        <div className="flex items-center gap-2">
          {qualityAssessment.isBlurry ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/70">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Blurry Plate Detected ({qualityAssessment.blurScore}/100)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/70">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Crisp & Sharp ({qualityAssessment.blurScore}/100)</span>
            </div>
          )}

          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showControls
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
            }`}
            title="Toggle fine-tuning controls"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quality Assessment Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-mono">
            <Gauge className="w-3 h-3 text-cyan-400" />
            Sharpness
          </div>
          <div className="text-sm font-bold font-mono text-slate-100 mt-0.5">
            {qualityAssessment.blurScore}%
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-mono">
            <Eye className="w-3 h-3 text-emerald-400" />
            Readability
          </div>
          <div className="text-sm font-bold font-mono text-slate-100 mt-0.5">
            {qualityAssessment.readabilityScore}%
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-mono">
            <Sun className="w-3 h-3 text-amber-400" />
            Lighting
          </div>
          <div className="text-xs font-semibold text-slate-200 mt-0.5 truncate">
            {qualityAssessment.lightingCondition || 'Optimal'}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-mono">
            <Layers className="w-3 h-3 text-purple-400" />
            Filter State
          </div>
          <div className="text-xs font-semibold text-cyan-300 mt-0.5 truncate capitalize">
            {settings.activeFilter.replace('-', ' ')}
          </div>
        </div>
      </div>

      {/* Interactive Split Slider / Before & After View */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-400">◄ Raw Cropped Plate</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-cyan-400">Enhanced Plate ►</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Drag vertical divider to compare sharpness
          </span>
        </div>

        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-ew-resize select-none touch-none shadow-inner"
        >
          {/* Background: Raw Original Plate */}
          <div className="absolute inset-0 flex items-center justify-center p-3">
            <img
              src={originalCroppedUrl}
              alt="Raw Cropped Plate"
              className="max-w-full max-h-full object-contain filter drop-shadow-md"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/80 text-[10px] font-mono text-slate-400">
              RAW CROP
            </div>
          </div>

          {/* Foreground: Enhanced Plate (Clipped by slider position) */}
          <div
            className="absolute inset-0 overflow-hidden flex items-center justify-center p-3 pointer-events-none"
            style={{
              clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
            }}
          >
            <img
              src={enhancedUrl}
              alt="Enhanced Plate"
              className="max-w-full max-h-full object-contain filter drop-shadow-md"
            />
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-700/80 text-[10px] font-mono text-cyan-300">
              ENHANCED (DEBLURRED)
            </div>
          </div>

          {/* Divider Handle Line */}
          <div
            className="absolute inset-y-0 w-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-500 border-2 border-slate-950 shadow-lg flex items-center justify-center text-slate-950 text-[10px] font-bold">
              ↔
            </div>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500">Presets:</span>
          <button
            onClick={() => handlePresetSelect('auto')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              settings.activeFilter === 'adaptive-unsharp'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Auto De-blur
          </button>
          <button
            onClick={() => handlePresetSelect('sharp')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              settings.activeFilter === 'high-contrast'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Edge Boost
          </button>
          <button
            onClick={() => handlePresetSelect('binary')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              settings.activeFilter === 'binarized'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            B&W Threshold
          </button>
          <button
            onClick={() => handlePresetSelect('reset')}
            className="px-2 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => downloadImage(enhancedUrl, 'enhanced-license-plate.png')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            title="Download enhanced crop"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save Enhanced</span>
          </button>
        </div>
      </div>

      {/* Expandable Manual Fine-Tuning Controls */}
      {showControls && (
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-3 pt-3 mt-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
            <span className="text-xs font-bold text-slate-300">
              Manual Image Enhancement Adjustments
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Unsharp Mask Convolution & Histogram CLAHE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Sharpness Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Sharpen Strength</span>
                <span className="font-mono text-cyan-400">{settings.sharpness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sharpness}
                onChange={(e) =>
                  setSettings({ ...settings, sharpness: parseInt(e.target.value, 10) })
                }
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Contrast Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Contrast Boost</span>
                <span className="font-mono text-cyan-400">
                  {settings.contrast > 0 ? `+${settings.contrast}` : settings.contrast}
                </span>
              </div>
              <input
                type="range"
                min="-40"
                max="60"
                value={settings.contrast}
                onChange={(e) =>
                  setSettings({ ...settings, contrast: parseInt(e.target.value, 10) })
                }
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Brightness Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Brightness Offset</span>
                <span className="font-mono text-cyan-400">
                  {settings.brightness > 0 ? `+${settings.brightness}` : settings.brightness}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={settings.brightness}
                onChange={(e) =>
                  setSettings({ ...settings, brightness: parseInt(e.target.value, 10) })
                }
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
