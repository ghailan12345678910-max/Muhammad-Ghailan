import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Scale,
  FlaskConical,
  Layers,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { convertUnits } from '../utils/calculations';

export const UnitConverterPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'massa' | 'volume' | 'konsentrasi'>('volume');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('L');
  const [toUnit, setToUnit] = useState<string>('mL');
  const [valency, setValency] = useState<string>('1');
  const [copied, setCopied] = useState(false);

  const massUnits = ['µg', 'mg', 'g', 'kg'];
  const volumeUnits = ['µL', 'mL', 'L'];
  const concUnits = ['M', 'mM', 'µM', 'N', '% b/v', 'mg/L', 'µg/mL'];

  const getUnits = () => {
    if (activeCategory === 'massa') return massUnits;
    if (activeCategory === 'volume') return volumeUnits;
    return concUnits;
  };

  const handleCategoryChange = (cat: 'massa' | 'volume' | 'konsentrasi') => {
    setActiveCategory(cat);
    if (cat === 'massa') {
      setFromUnit('g');
      setToUnit('mg');
      setInputValue('1');
    } else if (cat === 'volume') {
      setFromUnit('L');
      setToUnit('mL');
      setInputValue('1');
    } else {
      setFromUnit('M');
      setToUnit('mM');
      setInputValue('0.1');
    }
  };

  const numVal = parseFloat(inputValue);
  const valencyVal = parseFloat(valency) || 1;
  const result = isNaN(numVal)
    ? 0
    : convertUnits(numVal, activeCategory, fromUnit, toUnit, { valency: valencyVal });

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${result} ${toUnit}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Konverter Satuan Laboratorium
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Konversi seketika antara satuan massa analitis, volume mikroliter/liter, dan molaritas/normalitas.
        </p>
      </div>

      {/* Category Pills */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: 'volume', label: 'Volume Larutan', icon: FlaskConical },
          { id: 'massa', label: 'Massa Analitis', icon: Scale },
          { id: 'konsentrasi', label: 'Konsentrasi Kimia', icon: Layers }
        ].map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id as any)}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-sm shadow-cyan-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Converter Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        {/* Valency input for normality if relevant */}
        {activeCategory === 'konsentrasi' && (fromUnit === 'N' || toUnit === 'N') && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 text-xs space-y-1">
            <span className="font-bold text-amber-900 dark:text-amber-300">
              Valensi / Faktor Ekuivalen (n) untuk Normalitas:
            </span>
            <input
              type="number"
              min="1"
              value={valency}
              onChange={e => setValency(e.target.value)}
              className="w-full font-mono text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white"
            />
            <p className="text-[10px] text-amber-700 dark:text-amber-400">
              Contoh: HCl / NaOH = 1, H2SO4 = 2, KMnO4 (suasana asam) = 5.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
          {/* From Side (5 cols) */}
          <div className="sm:col-span-5 space-y-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Dari (Input)
            </label>
            <input
              type="number"
              step="any"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="w-full font-mono text-lg font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
            />
            <select
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              {getUnits().map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Swap Button (1 col) */}
          <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-6">
            <button
              onClick={handleSwap}
              title="Tukar Satuan"
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-600 dark:text-slate-300 transition shadow-xs"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* To Side (5 cols) */}
          <div className="sm:col-span-5 space-y-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Ke (Hasil Konversi)
            </label>
            <div className="w-full font-mono text-lg font-extrabold px-3.5 py-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 text-cyan-900 dark:text-cyan-300 truncate">
              {result}
            </div>
            <select
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              {getUnits().map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Highlight Result Output */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Hasil Langsung:
            </span>
            <p className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
              {inputValue} {fromUnit} = <span className="text-cyan-600 dark:text-cyan-400">{result} {toUnit}</span>
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-cyan-500 transition shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
