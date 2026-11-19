import React, { useState, useRef } from 'react';
import { Crosshair, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, Compass, Car } from 'lucide-react';
import { BoundingBox } from '../types/lpr';

interface VehicleViewfinderProps {
  imageUrl: string;
  isScanning: boolean;
  boundingBox?: BoundingBox;
  vehicleType?: string;
  plateStyle?: string;
  angleDegrees?: number;
  onBoxAdjust?: (newBox: BoundingBox) => void;
}

export const VehicleViewfinder: React.FC<VehicleViewfinderProps> = ({
  imageUrl,
  isScanning,
  boundingBox,
  vehicleType,
  plateStyle,
  angleDegrees = 0,
}) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute CSS percentages from 0-1000 normalized coordinates
  const boxTop = boundingBox ? `${boundingBox.ymin / 10}%` : '0%';
  const boxLeft = boundingBox ? `${boundingBox.xmin / 10}%` : '0%';
  const boxWidth = boundingBox ? `${(boundingBox.xmax - boundingBox.xmin) / 10}%` : '0%';
  const boxHeight = boundingBox ? `${(boundingBox.ymax - boundingBox.ymin) / 10}%` : '0%';

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl flex flex-col space-y-3">
      {/* Viewfinder Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Source Vehicle Viewfinder
          </h3>
          {vehicleType && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
              {vehicleType}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {boundingBox && (
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
              title="Toggle bounding box highlight"
            >
              {showOverlay ? <EyeOff className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{showOverlay ? 'Hide Box' : 'Show Box'}</span>
            </button>
          )}

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
              disabled={zoomLevel <= 1}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-mono text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              disabled={zoomLevel >= 2.5}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 ml-1 rounded text-slate-400 hover:text-white"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video sm:aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center select-none"
      >
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Scaled Image */}
        <div
          className="relative max-w-full max-h-full transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={imageUrl}
            alt="Source Vehicle"
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[500px] object-contain rounded-lg"
          />

          {/* Animated Scanning Radar & Laser Bar when processing */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Vertical Laser Scanline */}
              <div className="absolute inset-x-0 h-1 bg-cyan-400/90 shadow-[0_0_15px_#22d3ee] animate-[scan_2s_ease-in-out_infinite]" />

              {/* Scanning HUD overlay */}
              <div className="absolute top-4 left-4 p-2 rounded-lg bg-slate-900/80 border border-cyan-500/50 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>NEURAL SCAN ACTIVE // LOCALIZING PLATE</span>
              </div>
            </div>
          )}

          {/* Detected License Plate Bounding Box */}
          {boundingBox && showOverlay && !isScanning && (
            <div
              className="absolute pointer-events-none transition-all duration-300"
              style={{
                top: boxTop,
                left: boxLeft,
                width: boxWidth,
                height: boxHeight,
              }}
            >
              {/* Outer Bounding Box Border */}
              <div className="w-full h-full border-2 border-cyan-400/90 rounded bg-cyan-500/15 shadow-[0_0_20px_rgba(6,182,212,0.4)] relative">
                {/* 4 Corner Crosshair Brackets */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-white" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-white" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-white" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-white" />

                {/* Tag Badge */}
                <div className="absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono font-bold text-[10px] shadow">
                  <span>PLATE ROI</span>
                  {angleDegrees !== 0 && (
                    <span className="flex items-center text-[9px] opacity-80">
                      <Compass className="w-2.5 h-2.5 mr-0.5" />
                      {angleDegrees > 0 ? `+${angleDegrees}°` : `${angleDegrees}°`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Viewfinder Corner Overlays */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-slate-600 pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-slate-600 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-slate-600 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-slate-600 pointer-events-none" />
      </div>

      {/* Footer Info Row */}
      {plateStyle && (
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1 px-1">
          <div className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-cyan-400" />
            <span>Class: <strong className="text-slate-200">{plateStyle}</strong></span>
          </div>
          {boundingBox && (
            <span className="font-mono text-[11px] text-slate-500">
              ROI: [Y: {boundingBox.ymin}-{boundingBox.ymax}, X: {boundingBox.xmin}-{boundingBox.xmax}]
            </span>
          )}
        </div>
      )}
    </div>
  );
};
