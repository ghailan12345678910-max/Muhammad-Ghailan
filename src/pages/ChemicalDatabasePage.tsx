import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  ExternalLink,
  ShieldAlert,
  Flame,
  Skull,
  Biohazard,
  AlertTriangle,
  Beaker,
  Thermometer,
  Layers,
  BookOpen,
  X,
  Calculator,
  ChevronRight
} from 'lucide-react';
import { CHEMICAL_DATABASE } from '../data/chemicals';
import { ChemicalItem } from '../types';

interface ChemicalDatabasePageProps {
  onSelectChemicalForCalc: (chemicalId: string) => void;
  setActivePage: (page: string) => void;
}

export const ChemicalDatabasePage: React.FC<ChemicalDatabasePageProps> = ({
  onSelectChemicalForCalc,
  setActivePage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedChem, setSelectedChem] = useState<ChemicalItem | null>(null);

  const categories = [
    'all',
    'Garam',
    'Asam/Basa',
    'Reagen Klinis',
    'Pewarna/Staining',
    'Indikator',
    'Buffer',
    'Lainnya'
  ];

  const filteredChemicals = CHEMICAL_DATABASE.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(query) ||
      item.formula.toLowerCase().includes(query) ||
      item.casNumber.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getGhsIcon = (symbol: string) => {
    switch (symbol) {
      case 'korosif':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300">Korosif</span>;
      case 'toksik':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300">Toksik Akut</span>;
      case 'mudah_terbakar':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border border-orange-300">Mudah Menyala</span>;
      case 'oksidator':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 border border-yellow-300">Oksidator</span>;
      case 'bahaya_kesehatan':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300">Karsinogenik / Kronis</span>;
      case 'iritan':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300">Iritan</span>;
      case 'bahaya_lingkungan':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">Polutan Lingkungan</span>;
      default:
        return null;
    }
  };

  const handleUseInCalculator = (chem: ChemicalItem) => {
    onSelectChemicalForCalc(chem.id);
    setActivePage('calculator');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Katalog Reagen & Bahan Kimia Terverifikasi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Database zat kimia laboratorium TLM terstandardisasi dengan nomor CAS, Mr, piktogram GHS, dan protokol penyimpanan.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold self-start sm:self-auto">
          {filteredChemicals.length} Bahan Terdaftar
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari zat (cth: NaCl, asam klorida, 7647-14-5, pewarna)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Chemicals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChemicals.map(chem => (
          <div
            key={chem.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Name & Formula */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {chem.name}
                  </h3>
                  <span className="font-mono text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                    {chem.formula}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                  {chem.category}
                </span>
              </div>

              {/* Chemical Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl mb-3 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Massa Molar (Mr)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{chem.mr} g/mol</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Nomor CAS</span>
                  <span className="text-slate-700 dark:text-slate-300">{chem.casNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Bentuk Fisik</span>
                  <span className="text-slate-700 dark:text-slate-300">{chem.physicalState}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Kemurnian Std</span>
                  <span className="text-slate-700 dark:text-slate-300">{chem.standardPurity}%</span>
                </div>
              </div>

              {/* GHS Badges */}
              <div className="flex flex-wrap gap-1 mb-3">
                {chem.ghsSymbols.length === 0 ? (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Tidak Berbahaya pada Kondisi Standar
                  </span>
                ) : (
                  chem.ghsSymbols.map(sym => (
                    <span key={sym}>{getGhsIcon(sym)}</span>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedChem(chem)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
              >
                Lihat Detail Lengkap &rarr;
              </button>

              <button
                onClick={() => handleUseInCalculator(chem)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 text-xs font-bold transition active:scale-95"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Gunakan di Kalkulator</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedChem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto max-h-[88vh] space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  {selectedChem.category}
                </span>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedChem.name}
                </h2>
                <p className="font-mono text-sm text-cyan-600 dark:text-cyan-400 font-bold">
                  {selectedChem.formula} • Mr {selectedChem.mr} g/mol
                </p>
              </div>
              <button
                onClick={() => setSelectedChem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 text-[10px] block">Nomor CAS</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedChem.casNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Bentuk Bahan</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedChem.physicalState}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Kemurnian Standar</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedChem.standardPurity}%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Kerapatan / Densitas</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedChem.density ? `${selectedChem.density} g/mL` : 'Padatan Standar'}
                </span>
              </div>
            </div>

            {/* GHS & Hazards */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Simbol GHS & Pernyataan Bahaya (H-Statements)</span>
              </h4>
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedChem.ghsSymbols.map(sym => (
                  <span key={sym}>{getGhsIcon(sym)}</span>
                ))}
              </div>
              <ul className="space-y-1 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40">
                {selectedChem.hazardStatements.map((h, i) => (
                  <li key={i}>• {h}</li>
                ))}
              </ul>
            </div>

            {/* Storage Condition */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-cyan-500" />
                <span>Kondisi Penyimpanan yang Direkomendasikan</span>
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {selectedChem.storageCondition}
              </p>
            </div>

            {/* Compatibility Notes */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Kompatibilitas & Catatan Analis</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                {selectedChem.compatibilityNotes}
              </p>
            </div>

            {/* Source Reference */}
            <div>
              <span className="text-[10px] text-slate-400 block">Sumber Referensi Ilmiah:</span>
              <p className="text-[11px] text-slate-500 italic">{selectedChem.referenceSource}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedChem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleUseInCalculator(selectedChem);
                  setSelectedChem(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-sm"
              >
                <Calculator className="w-4 h-4" />
                <span>Buka di Kalkulator</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
