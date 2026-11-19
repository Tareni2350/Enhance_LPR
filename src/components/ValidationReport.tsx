import React, { useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Building,
  Hash,
  ShieldCheck,
  FileCheck,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ValidationResult } from '../types/lpr';

interface ValidationReportProps {
  validationResult: ValidationResult;
  plateText: string;
}

export const ValidationReport: React.FC<ValidationReportProps> = ({
  validationResult,
  plateText,
}) => {
  const isValid = validationResult.isValid;

  // Trigger celebration confetti when valid plate is confirmed
  useEffect(() => {
    if (isValid) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#06b6d4', '#10b981', '#3b82f6'],
        });
      } catch (e) {
        // Ignore if confetti fails
      }
    }
  }, [isValid, plateText]);

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Indian CMVR & MoRTH Format Validation
            </h3>
            <p className="text-[11px] text-slate-400">
              Central Motor Vehicles Rules (Rule 50 & 51) Compliance Engine
            </p>
          </div>
        </div>

        {/* Big Verdict Pill */}
        {isValid ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>VALID INDIAN FORMAT</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-950/40">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>NON-STANDARD / INVALID</span>
          </div>
        )}
      </div>

      {/* Structured Registration Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* State/UT */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-mono">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            State / Territory
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-slate-100 truncate">
              {validationResult.stateName || 'N/A'}
            </div>
            {validationResult.stateCode && (
              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                Code: {validationResult.stateCode}
              </span>
            )}
          </div>
        </div>

        {/* District RTO */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-mono">
            <Building className="w-3.5 h-3.5 text-blue-400" />
            RTO Authority
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-slate-100 truncate">
              {validationResult.districtRTO || 'Standard RTO Office'}
            </div>
            {validationResult.rtoCode && (
              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                RTO: {validationResult.rtoCode}
              </span>
            )}
          </div>
        </div>

        {/* Series Letters */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-mono">
            <Hash className="w-3.5 h-3.5 text-amber-400" />
            Series Code
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-slate-100 font-mono">
              {validationResult.series || 'Base'}
            </div>
            <span className="inline-block mt-0.5 text-[10px] text-slate-400">
              Vehicle Allotment Batch
            </span>
          </div>
        </div>

        {/* Unique Digits */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-mono">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            Registration No.
          </div>
          <div className="mt-2">
            <div className="text-base font-black font-mono text-emerald-400">
              {validationResult.uniqueDigits || '0000'}
            </div>
            <span className="inline-block mt-0.5 text-[10px] text-slate-400">
              Individual Unit ID
            </span>
          </div>
        </div>
      </div>

      {/* Format Category and Explanation */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase text-slate-400">
            Format Category: <strong className="text-cyan-300">{validationResult.formatCategory}</strong>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            MoRTH MV Act 1988
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {validationResult.validationExplanation}
        </p>

        {/* Issues list if any */}
        {validationResult.complianceIssues && validationResult.complianceIssues.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <div className="text-[10px] font-mono uppercase text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Formatting / Observational Remarks:</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-0.5 list-disc list-inside">
              {validationResult.complianceIssues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Compliance Rule 50 CMVR Specs Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
          <div className="p-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 mt-0.5">
            <Info className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">Rule 50 CMVR Standard</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Requires retro-reflective aluminum sheet, hot-stamped black film, and laser branded 10-digit PIN.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
          <div className="p-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">Tamper-Proof Snap Fasteners</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Standard non-reusable snap locks prevent illegal plate swapping across vehicles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
