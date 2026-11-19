import React from 'react';
import { Scan, History, Sparkles, BookOpen, ShieldCheck, RefreshCw } from 'lucide-react';

interface HeaderProps {
  totalScans: number;
  onOpenHistory: () => void;
  onOpenSpecs: () => void;
  onReset: () => void;
  hasActiveResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalScans,
  onOpenHistory,
  onOpenSpecs,
  onReset,
  hasActiveResult,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white">
            <Scan className="w-5 h-5 text-white stroke-[2.5]" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl text-slate-100 tracking-tight font-sans">
                Enhance<span className="text-cyan-400">LPR</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase tracking-wider">
                MoRTH CMVR Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI-Powered License Plate Detection, Enhancement & Indian RTO Validation
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasActiveResult && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-colors shadow-sm"
              title="Reset and scan a new vehicle"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">New Scan</span>
            </button>
          )}

          <button
            onClick={onOpenSpecs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Indian HSRP Specs</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            <span>History</span>
            {totalScans > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {totalScans}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
