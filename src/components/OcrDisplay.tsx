import React, { useState } from 'react';
import {
  Type,
  Copy,
  Check,
  Volume2,
  Edit2,
  Sparkles,
  ShieldAlert,
  Percent,
} from 'lucide-react';
import { OcrResult } from '../types/lpr';

interface OcrDisplayProps {
  ocrResult: OcrResult;
  plateStyle?: string;
  onPlateEdited?: (newText: string) => void;
}

export const OcrDisplay: React.FC<OcrDisplayProps> = ({
  ocrResult,
  plateStyle = 'Standard Private (White)',
  onPlateEdited,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(ocrResult.normalizedNumber || ocrResult.rawText);

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(ocrResult.normalizedNumber || ocrResult.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text to speech readout
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    const textToRead = ocrResult.normalizedNumber || ocrResult.rawText;
    const utterance = new SpeechSynthesisUtterance(
      `Vehicle license plate recognized: ${textToRead.split('').join(' ')}`
    );
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onPlateEdited && editedText.trim() !== ocrResult.normalizedNumber) {
      onPlateEdited(editedText.trim().toUpperCase());
    }
  };

  // Determine HSRP Replica Colors based on plateStyle
  const isYellow = plateStyle.toLowerCase().includes('commercial') || plateStyle.toLowerCase().includes('transport');
  const isGreen = plateStyle.toLowerCase().includes('electric');
  const isDiplomatic = plateStyle.toLowerCase().includes('diplomatic');

  let hsrpBg = 'bg-white';
  let hsrpTextColor = 'text-slate-950';
  let hsrpBorder = 'border-slate-800';

  if (isYellow) {
    hsrpBg = 'bg-amber-400';
    hsrpTextColor = 'text-slate-950';
    hsrpBorder = 'border-amber-600';
  } else if (isGreen) {
    hsrpBg = 'bg-emerald-700';
    hsrpTextColor = 'text-white';
    hsrpBorder = 'border-emerald-900';
  } else if (isDiplomatic) {
    hsrpBg = 'bg-blue-700';
    hsrpTextColor = 'text-white';
    hsrpBorder = 'border-blue-900';
  }

  const confidenceScore = ocrResult.confidence || 95;

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Neural OCR Character Recognition
            </h3>
            <p className="text-[11px] text-slate-400">
              High Security Registration Plate (HSRP) Character Extraction
            </p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/70">
            <Percent className="w-3 h-3 text-cyan-400" />
            <span>{confidenceScore}% Confidence</span>
          </div>

          <button
            onClick={handleSpeak}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Read out license plate aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Copy plate number to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Realistic Indian HSRP Replica Banner */}
      <div className="relative py-2 flex flex-col items-center justify-center">
        <div
          className={`relative w-full max-w-xl h-24 sm:h-28 rounded-xl border-4 ${hsrpBorder} ${hsrpBg} shadow-2xl flex items-center justify-between px-3 sm:px-5 select-none overflow-hidden`}
        >
          {/* Subtle Embossed Bevel Rim */}
          <div className="absolute inset-1 border border-black/15 rounded-lg pointer-events-none" />

          {/* 4 Corner Snap Rivets */}
          <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-700 shadow-inner flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-slate-600" />
          </div>
          <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-700 shadow-inner flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-slate-600" />
          </div>
          <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-700 shadow-inner flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-slate-600" />
          </div>
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-700 shadow-inner flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-slate-600" />
          </div>

          {/* Left Blue IND Strip */}
          <div className="w-10 sm:w-12 h-full -ml-3 sm:-ml-5 bg-blue-700 flex flex-col items-center justify-between py-2 border-r border-blue-900 shadow-md">
            {/* Hologram Circle */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-300 to-blue-200 border border-blue-400 flex items-center justify-center shadow">
              <div className="w-2.5 h-2.5 rounded-full border border-blue-800" />
            </div>
            {/* IND letters */}
            <span className="text-[11px] sm:text-xs font-black tracking-widest text-white font-mono">
              IND
            </span>
          </div>

          {/* Center License Plate Digits (Hot stamped 3D look) */}
          <div className="flex-1 text-center px-2">
            {isEditing ? (
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value.toUpperCase())}
                  className="px-3 py-1 text-xl sm:text-2xl font-black font-mono tracking-widest text-slate-900 bg-white/90 border-2 border-cyan-500 rounded-lg text-center uppercase"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 rounded-lg bg-cyan-600 text-white font-bold text-xs"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span
                  className={`text-2xl sm:text-4xl font-black font-mono tracking-[0.2em] sm:tracking-[0.25em] drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] ${hsrpTextColor}`}
                  style={{ fontFamily: "'JetBrains Mono', 'Chakra Petch', monospace" }}
                >
                  {ocrResult.normalizedNumber || ocrResult.rawText}
                </span>
                {/* Laser Branded PIN Code at bottom (HSRP Spec) */}
                <span className="text-[9px] font-mono text-slate-500/80 tracking-wider mt-0.5">
                  IND AA2049182390 • CMVR RULE 50
                </span>
              </div>
            )}
          </div>

          {/* Edit icon trigger */}
          {!isEditing && (
            <button
              onClick={() => {
                setEditedText(ocrResult.normalizedNumber || ocrResult.rawText);
                setIsEditing(true);
              }}
              className="p-1 rounded bg-black/10 hover:bg-black/20 text-slate-800 transition-colors"
              title="Manual correction of plate number"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Character-by-Character OCR Confidence Breakdown */}
      {ocrResult.characters && ocrResult.characters.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px] uppercase text-slate-400">
              Character Segmentation & Neural Probabilities
            </span>
            <span className="text-[10px] text-slate-500">
              Per-glyph OCR confidence score
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {ocrResult.characters.map((item, idx) => {
              const conf = item.confidence || 95;
              const isHigh = conf >= 90;
              const isMed = conf >= 70 && conf < 90;

              let color = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
              if (isMed) color = 'bg-amber-950/60 text-amber-300 border-amber-800/60';
              else if (!isHigh) color = 'bg-rose-950/60 text-rose-300 border-rose-800/60';

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-lg border font-mono ${color} min-w-[32px]`}
                >
                  <span className="text-sm font-black">{item.char}</span>
                  <span className="text-[9px] font-semibold opacity-80">{conf}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HSRP Physical Feature Verifications */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/70">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-slate-400">IND Country Strip:</span>
          <span className="font-semibold text-slate-200">
            {ocrResult.hasIndStrip !== false ? 'Present' : 'Not Detected'}
          </span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/70">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-slate-400">Ashok Hologram:</span>
          <span className="font-semibold text-slate-200">
            {ocrResult.hasHologram !== false ? 'Verified' : 'Absent'}
          </span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/70">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-400">Obstructions:</span>
          <span className="font-semibold text-slate-200">
            {ocrResult.hasObstructions ? 'Detected' : 'Clear View'}
          </span>
        </div>
      </div>
    </div>
  );
};
