import React, { useState } from 'react';
import {
  History,
  Search,
  FileDown,
  FileSpreadsheet,
  Trash2,
  RotateCcw,
  Printer,
  Copy,
  Check,
  Calendar,
  ExternalLink,
  ChevronDown,
  Calculator,
  Beaker
} from 'lucide-react';
import { CalculationHistoryItem, UserProfile } from '../types';
import { exportCalculationToPDF, exportHistoryToCSV } from '../utils/pdfExport';

interface HistoryPageProps {
  user: UserProfile;
  history: CalculationHistoryItem[];
  onDeleteHistoryItem: (id: string) => void;
  onClearAllHistory: () => void;
  onRepeatCalculation: (item: CalculationHistoryItem) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  user,
  history,
  onDeleteHistoryItem,
  onClearAllHistory,
  onRepeatCalculation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.result.formula.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || item.type === filterType;

    return matchesSearch && matchesType;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleCopy = (item: CalculationHistoryItem) => {
    const text = `ReagenLab Hasil: ${item.title}\nHasil: ${item.result.primaryResult} ${item.result.primaryUnit}\nRumus: ${item.result.formula}\nTanggal: ${new Date(item.timestamp).toLocaleString('id-ID')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = (item: CalculationHistoryItem) => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Riwayat Perhitungan &amp; Ekspor Laporan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar lengkap hasil preparasi larutan, unduh sertifikat PDF resmi, dan ekspor data tabel spreadsheet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={() => exportHistoryToCSV(history)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Ekspor CSV</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Kosongkan semua riwayat perhitungan?')) {
                    onClearAllHistory();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-semibold transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Semua</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul larutan, jenis kalkulator, atau rumus..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        {/* Filter Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'Semua Tipe' },
            { id: 'molaritas', label: 'Molaritas' },
            { id: 'pengenceran', label: 'Pengenceran' },
            { id: 'persen', label: 'Persen (%)' },
            { id: 'normalitas', label: 'Normalitas' },
            { id: 'serial_dilution', label: 'Serial Dilution' },
            { id: 'kebutuhan_reagen', label: 'Kebutuhan Reagen' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterType === f.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 space-y-2">
            <History className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Belum ada riwayat perhitungan.
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Setiap kali Anda menekan tombol &ldquo;Simpan Riwayat&rdquo; pada kalkulator, data perhitungan akan diarsipkan di sini.
            </p>
          </div>
        ) : (
          filteredHistory.map(item => {
            const isExpanded = expandedId === item.id;
            const dateStr = new Date(item.timestamp).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-cyan-500/30 transition overflow-hidden"
              >
                {/* Main Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                        {item.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span>
                        Hasil: <strong className="text-cyan-600 dark:text-cyan-400 font-bold">{item.result.primaryResult} {item.result.primaryUnit}</strong>
                      </span>
                      <span>•</span>
                      <span>Rumus: {item.result.formula}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-sans">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {dateStr}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => handleCopy(item)}
                      title="Salin Hasil"
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => exportCalculationToPDF(item, user)}
                      title="Unduh PDF Resmi"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                    >
                      <FileDown className="w-4 h-4 text-cyan-500" />
                      <span>PDF</span>
                    </button>

                    <button
                      onClick={() => onRepeatCalculation(item)}
                      title="Ulangi di Kalkulator"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs font-bold transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ulangi</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(item.id)}
                      title="Lihat Detail Langkah"
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus catatan "${item.title}" dari riwayat?`)) {
                          onDeleteHistoryItem(item.id);
                        }
                      }}
                      title="Hapus"
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expandable Step-by-Step Breakdown */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Input Parameter yang Digunakan:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                        {Object.entries(item.inputs).map(([k, v]) => (
                          <div key={k} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 block font-sans">{k}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Langkah Perhitungan Rinci:
                      </span>
                      <div className="space-y-1">
                        {item.result.steps.map((st, i) => (
                          <div key={i} className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                            {st}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
