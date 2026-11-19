import React, { useState } from 'react';
import {
  History,
  X,
  Search,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Car,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { ScanHistoryRecord } from '../types/lpr';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanHistoryRecord[];
  onSelectRecord: (record: ScanHistoryRecord) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectRecord,
  onClearHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValid, setFilterValid] = useState<'all' | 'valid' | 'invalid'>('all');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const matchesQuery =
      item.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicleType.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;
    if (filterValid === 'valid') return item.isValid;
    if (filterValid === 'invalid') return !item.isValid;
    return true;
  });

  const exportCsv = () => {
    if (history.length === 0) return;
    const headers = ['Timestamp', 'Plate Number', 'State / UT', 'Vehicle Type', 'Format Category', 'Blur Score', 'Status'];
    const rows = history.map((item) => [
      new Date(item.timestamp).toISOString(),
      `"${item.plateNumber}"`,
      `"${item.stateName}"`,
      `"${item.vehicleType}"`,
      `"${item.formatCategory}"`,
      item.blurScore,
      item.isValid ? 'Valid' : 'Invalid',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `enhancelpr-scan-log-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJson = () => {
    if (history.length === 0) return;
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enhancelpr-scan-log-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                License Plate Recognition History
              </h3>
              <p className="text-xs text-slate-400">
                {history.length} vehicle scan records stored locally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <>
                <button
                  onClick={exportCsv}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                  title="Export to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">CSV</span>
                </button>

                <button
                  onClick={exportJson}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                  title="Export to JSON"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">JSON</span>
                </button>

                <button
                  onClick={onClearHistory}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 transition-colors"
                  title="Clear all history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row gap-3 bg-slate-950/40">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by plate number, state, or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterValid('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterValid === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterValid('valid')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterValid === 'valid'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Valid Only
            </button>
            <button
              onClick={() => setFilterValid('invalid')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterValid === 'invalid'
                  ? 'bg-rose-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Invalid Only
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No recognition records found.
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectRecord(item);
                  onClose();
                }}
                className="group p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all flex items-center justify-between gap-3 cursor-pointer"
              >
                {/* Left: Thumbnail & Plate */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0 flex items-center justify-center">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.plateNumber}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-cyan-300">
                        {item.plateNumber}
                      </span>
                      {item.isValid ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60">
                          <CheckCircle className="w-2.5 h-2.5" />
                          Valid
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-800/60">
                          <XCircle className="w-2.5 h-2.5" />
                          Non-Standard
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{item.stateName}</span>
                      <span>•</span>
                      <span>{item.vehicleType}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Timestamp & Action */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Sharpness: {item.blurScore}%
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
