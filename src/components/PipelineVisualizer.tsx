import React from 'react';
import {
  Upload,
  Crosshair,
  Crop,
  Gauge,
  Sparkles,
  Type as TypeIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import { PipelineStep } from '../types/lpr';

interface PipelineVisualizerProps {
  steps: PipelineStep[];
  isProcessing: boolean;
  currentStepIndex: number;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  steps,
  isProcessing,
  currentStepIndex,
}) => {
  const getIcon = (id: string, status: string) => {
    if (status === 'active') {
      return <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />;
    }
    if (status === 'completed') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
    if (status === 'error') {
      return <AlertCircle className="w-4 h-4 text-rose-400" />;
    }

    switch (id) {
      case 'ingest':
        return <Upload className="w-4 h-4 text-slate-400" />;
      case 'detect':
        return <Crosshair className="w-4 h-4 text-slate-400" />;
      case 'crop':
        return <Crop className="w-4 h-4 text-slate-400" />;
      case 'quality':
        return <Gauge className="w-4 h-4 text-slate-400" />;
      case 'enhance':
        return <Sparkles className="w-4 h-4 text-slate-400" />;
      case 'ocr':
        return <TypeIcon className="w-4 h-4 text-slate-400" />;
      case 'validate':
        return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const overallPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl">
      {/* Top pipeline status banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Automated LPR Pipeline Architecture
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">•</span>
          <span className="text-xs text-cyan-400/90 font-mono hidden sm:inline">
            7-Stage Computer Vision & MoRTH Compliance
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Progress:</span>
            <span className="font-mono font-bold text-cyan-400">{overallPercent}%</span>
          </div>
          <div className="w-24 sm:w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((step, idx) => {
          const isActive = step.status === 'active';
          const isCompleted = step.status === 'completed';
          const isError = step.status === 'error';

          let borderClass = 'border-slate-800/70 bg-slate-950/40 text-slate-400';
          if (isActive) {
            borderClass = 'border-cyan-500/80 bg-cyan-950/30 text-cyan-200 ring-1 ring-cyan-500/40 shadow-lg shadow-cyan-950/50';
          } else if (isCompleted) {
            borderClass = 'border-emerald-600/50 bg-emerald-950/20 text-slate-200';
          } else if (isError) {
            borderClass = 'border-rose-600/50 bg-rose-950/20 text-rose-300';
          }

          return (
            <div
              key={step.id}
              className={`relative rounded-xl p-3 border transition-all duration-200 flex flex-col justify-between min-h-[96px] ${borderClass}`}
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  0{idx + 1}
                </span>
                <div className="p-1 rounded-md bg-slate-900/80 border border-slate-800">
                  {getIcon(step.id, step.status)}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold tracking-tight text-slate-200 leading-snug">
                  {step.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {step.metric || step.subtitle}
                </p>
              </div>

              {isActive && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse rounded-b-xl" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
