import React from 'react';
import { X, ShieldCheck, Check, Sparkles, BookOpen, Layers } from 'lucide-react';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Indian MoRTH & CMVR License Plate Standards
              </h3>
              <p className="text-xs text-slate-400">
                Rule 50 CMVR (High Security Registration Plate Specification)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-300">
          {/* Section 1: Standard Plate Grammar */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              1. Numbering Structure & Grammar (Central Motor Vehicles Act)
            </h4>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 font-mono space-y-2">
              <div className="text-sm font-black text-cyan-300 tracking-wider">
                [SS] [RR] [CC] [NNNN]
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <div>
                  <strong className="text-slate-200">SS (2 Letters):</strong> State or Union Territory code (e.g. MH, DL, KA, TN).
                </div>
                <div>
                  <strong className="text-slate-200">RR (2 Digits):</strong> District Regional Transport Office (RTO) code (e.g. 01, 12).
                </div>
                <div>
                  <strong className="text-slate-200">CC (0-3 Letters):</strong> Series batch or alphabet allocation (e.g. AB, EV, CA).
                </div>
                <div>
                  <strong className="text-slate-200">NNNN (4 Digits):</strong> Unique vehicle registration number (0001 to 9999).
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Bharat Series (BH) */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              2. Bharat Series (BH Series - Introduced 2021)
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Designed by MoRTH for defence personnel, central government employees, and private companies with offices in 4+ states to avoid vehicle re-registration when relocating.
            </p>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-[11px] text-slate-300">
              Format: <span className="text-emerald-400 font-bold">[YY] BH [4 Digits] [1-2 Letters]</span> (e.g., <code className="text-white">22 BH 5432 AA</code>)
            </div>
          </div>

          {/* Section 3: Official Color Schemes */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              3. Mandatory Color Scheme by Vehicle Category
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-white text-slate-950 font-bold border border-slate-400 flex items-center justify-between">
                <span>Private / Personal Vehicles</span>
                <span className="text-[10px] font-mono font-normal bg-black/10 px-2 py-0.5 rounded">White Plate, Black Text</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-400 text-slate-950 font-bold border border-amber-500 flex items-center justify-between">
                <span>Commercial / Transport (Cab/Bus)</span>
                <span className="text-[10px] font-mono font-normal bg-black/10 px-2 py-0.5 rounded">Yellow Plate, Black Text</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-700 text-white font-bold border border-emerald-800 flex items-center justify-between">
                <span>Electric Private Vehicles (EV)</span>
                <span className="text-[10px] font-mono font-normal bg-black/20 px-2 py-0.5 rounded">Green Plate, White Text</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-700 text-amber-300 font-bold border border-emerald-800 flex items-center justify-between">
                <span>Electric Commercial Vehicles</span>
                <span className="text-[10px] font-mono font-normal bg-black/20 px-2 py-0.5 rounded">Green Plate, Yellow Text</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-700 text-white font-bold border border-blue-800 flex items-center justify-between">
                <span>Diplomatic / Consular Missions</span>
                <span className="text-[10px] font-mono font-normal bg-black/20 px-2 py-0.5 rounded">Blue Plate, White Text</span>
              </div>
              <div className="p-3 rounded-xl bg-black text-amber-400 font-bold border border-slate-800 flex items-center justify-between">
                <span>Self-Drive / Rental Cars</span>
                <span className="text-[10px] font-mono font-normal bg-white/10 px-2 py-0.5 rounded">Black Plate, Yellow Text</span>
              </div>
            </div>
          </div>

          {/* Section 4: HSRP Security Features */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-cyan-400">
              4. High Security Registration Plate (HSRP) Anatomy
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li><strong>Chromium Ashok Chakra Hologram:</strong> Hot-stamped 20mm x 20mm blue hologram on the top-left edge.</li>
              <li><strong>International IND Designation:</strong> Blue reflective strip with bold &quot;IND&quot; text in white.</li>
              <li><strong>Unique 10-Digit Laser Branded PIN:</strong> Bottom left etched identifier linked with VAHAN 4.0 database.</li>
              <li><strong>FE-Schrift Font:</strong> High-security anti-tamper typeface making fraudulent alteration of &apos;3&apos; to &apos;8&apos; or &apos;F&apos; to &apos;E&apos; impossible.</li>
              <li><strong>Non-Reusable Snap Rivets:</strong> Cannot be unscrewed without visibly destroying the mounting fixture.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs"
          >
            Got it, Back to Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
