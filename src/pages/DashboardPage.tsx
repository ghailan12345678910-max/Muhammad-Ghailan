import React, { useState } from 'react';
import {
  Calculator,
  Boxes,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Shield,
  Layers,
  ChevronRight,
  Lightbulb,
  FileText,
  Search,
  FlaskConical,
  Beaker,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { UserProfile, CalculationHistoryItem, InventoryItem } from '../types';

interface DashboardPageProps {
  user: UserProfile;
  history: CalculationHistoryItem[];
  inventory: InventoryItem[];
  setActivePage: (page: string) => void;
  onRepeatCalculation: (item: CalculationHistoryItem) => void;
}

const LAB_TIPS = [
  {
    title: 'Aturan Meniskus Pengukuran Cairan',
    desc: 'Untuk larutan jernih/bening, baca dasar meniskus cekung tepat sejajar mata. Untuk larutan sangat pekat/berwarna gelap (seperti KMnO4), baca batas permukaan atas meniskus.',
    category: 'Teknik Volumetrik'
  },
  {
    title: 'K3 Pengenceran Asam Sulfat Pekat',
    desc: 'Selalu tuangkan asam sulfat pekat ke dalam air secara perlahan melalui dinding wadah sambil diaduk (AAA). Menuang air ke dalam asam memicu pendidihan lokal dan semburan asam berbahaya!',
    category: 'Keselamatan K3'
  },
  {
    title: 'Standarisasi Larutan Basa (NaOH)',
    desc: 'NaOH bersifat sangat higroskopis dan menyerap CO2 dari udara membentuk Na2CO3. Selalu standarisasi larutan kerja NaOH menggunakan standar primer Asam Oksalat atau Kalium Hidrogen Ftalat (KHP).',
    category: 'Kontrol Mutu'
  },
  {
    title: 'Pembersihan Alat Kaca Laboratorium',
    desc: 'Bilas labu ukur dan pipet dengan aquades minimal 3 kali. Jangan keringkan labu ukur berkalibrasi di dalam oven bersuhu tinggi (>60°C) karena dapat merusak kalibrasi volume kaca.',
    category: 'Good Lab Practice'
  }
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  history,
  inventory,
  setActivePage,
  onRepeatCalculation
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  // Stats Calculations
  const totalCalculations = history.length;
  const totalInventory = inventory.length;

  const now = new Date();
  const thirtyDaysAhead = new Date();
  thirtyDaysAhead.setDate(now.getDate() + 30);

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const expiringSoonItems = inventory.filter(item => {
    const exp = new Date(item.expiryDate);
    return exp > now && exp <= thirtyDaysAhead;
  });
  const expiredItems = inventory.filter(item => new Date(item.expiryDate) <= now);

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % LAB_TIPS.length);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
              {user.role === 'analis' ? (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>Mode Analis Laboratorium Profesional</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Mode Praktikum Mahasiswa TLM</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">{user.name}</span>
            </h1>

            <p className="text-sm text-slate-300 max-w-xl">
              {user.institution} • {user.role === 'analis' 
                ? 'Sistem siap membantu persiapan reagen presisi tinggi, QC kontrol, dan manajemen stok inventaris.' 
                : 'Pusat perhitungan larutan kimia akurat, latihan soal praktikum, dan pembuatan laporan praktikum TLM.'}
            </p>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActivePage('calculator')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 active:scale-95 transition"
            >
              <Calculator className="w-4 h-4" />
              <span>Buka Kalkulator</span>
            </button>
            <button
              onClick={() => setActivePage('ai')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white text-xs font-semibold active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Tanya ReagenLab AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Calculations */}
        <div
          onClick={() => setActivePage('history')}
          className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-xs hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Perhitungan</span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {totalCalculations}
            </span>
            <span className="text-xs text-slate-400">larutan</span>
          </div>
          <p className="mt-2 text-[11px] text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1">
            <span>Lihat Riwayat & PDF</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Total Inventory */}
        <div
          onClick={() => setActivePage('inventory')}
          className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 shadow-xs hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Reagen Lab</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {totalInventory}
            </span>
            <span className="text-xs text-slate-400">item terdaftar</span>
          </div>
          <p className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
            <span>Kelola Inventaris</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Low Stock Alert */}
        <div
          onClick={() => setActivePage('inventory')}
          className={`group cursor-pointer p-4 sm:p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all ${
            lowStockItems.length > 0
              ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 hover:border-amber-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Stok Menipis</span>
            <div className={`p-2 rounded-xl ${
              lowStockItems.length > 0
                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
              lowStockItems.length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
            }`}>
              {lowStockItems.length}
            </span>
            <span className="text-xs text-slate-400">perlu restok</span>
          </div>
          <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <span>{lowStockItems.length > 0 ? 'Cek item kritis' : 'Stok dalam batas aman'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Expiring / Expired Alert */}
        <div
          onClick={() => setActivePage('inventory')}
          className={`group cursor-pointer p-4 sm:p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all ${
            expiredItems.length > 0
              ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/60 hover:border-rose-400'
              : expiringSoonItems.length > 0
              ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Kedaluwarsa / Kritis</span>
            <div className={`p-2 rounded-xl ${
              expiredItems.length > 0
                ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                : expiringSoonItems.length > 0
                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
              expiredItems.length > 0
                ? 'text-rose-600 dark:text-rose-400'
                : expiringSoonItems.length > 0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-900 dark:text-white'
            }`}>
              {expiredItems.length + expiringSoonItems.length}
            </span>
            <span className="text-xs text-slate-400">
              ({expiredItems.length} expired, {expiringSoonItems.length} &lt;30h)
            </span>
          </div>
          <p className="mt-2 text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
            <span>Karantina & Monitoring</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* Feature Shortcuts Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Kalkulator & Fitur Laboratorium
          </h2>
          <button
            onClick={() => setActivePage('calculator')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            Buka Semua <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              title: 'Molaritas (M)',
              sub: 'm = M × Mr × V',
              icon: Beaker,
              color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500/20',
              action: () => setActivePage('calculator')
            },
            {
              title: 'Pengenceran',
              sub: 'C1V1 = C2V2',
              icon: FlaskConical,
              color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-500/20',
              action: () => setActivePage('calculator')
            },
            {
              title: 'Persen (%)',
              sub: '% b/v, % v/v, % b/b',
              icon: Layers,
              color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/20',
              action: () => setActivePage('calculator')
            },
            {
              title: 'Normalitas (N)',
              sub: 'BE = Mr / valensi',
              icon: TrendingUp,
              color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/20',
              action: () => setActivePage('calculator')
            },
            {
              title: 'Serial Dilution',
              sub: 'Bertingkat 1:2 s.d 1:10',
              icon: CheckCircle2,
              color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40 border-teal-500/20',
              action: () => setActivePage('calculator')
            },
            {
              title: 'Kebutuhan Reagen',
              sub: 'N Sampel + % Safety',
              icon: Shield,
              color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-500/20',
              action: () => setActivePage('calculator')
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 hover:-translate-y-0.5 text-left shadow-xs transition-all flex flex-col justify-between"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${item.color} mb-2.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Calculations & Daily Lab Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Calculation History */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-500" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                Riwayat Perhitungan Terbaru
              </h2>
            </div>
            <button
              onClick={() => setActivePage('history')}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Lihat Semua ({history.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {history.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Calculator className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Belum ada perhitungan yang tersimpan. Coba lakukan perhitungan pertamamu!
                </p>
                <button
                  onClick={() => setActivePage('calculator')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold"
                >
                  Mulai Menghitung
                </button>
              </div>
            ) : (
              history.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 rounded-xl px-2 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {item.title}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                      <span>Hasil: <strong className="text-cyan-600 dark:text-cyan-400">{item.result.primaryResult} {item.result.primaryUnit}</strong></span>
                      <span>•</span>
                      <span>{new Date(item.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onRepeatCalculation(item)}
                      title="Ulangi / Buka di Kalkulator"
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                    >
                      Buka
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Daily Lab Tips & Learning Progress */}
        <div className="space-y-4">
          {/* Daily Lab Tip Card */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/30 border border-cyan-500/30 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-400">
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Tips Lab Harian</span>
              </div>
              <button
                onClick={nextTip}
                className="text-[11px] text-cyan-400/80 hover:text-cyan-300 underline"
              >
                Ganti Tips
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                {LAB_TIPS[tipIndex].category}
              </span>
              <h3 className="font-bold text-sm text-white">
                {LAB_TIPS[tipIndex].title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {LAB_TIPS[tipIndex].desc}
              </p>
            </div>
          </div>

          {/* Quick Learning & Quiz Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white">
              <GraduationCap className="w-4 h-4 text-cyan-500" />
              <h3 className="font-bold text-sm">Pusat Pembelajaran TLM</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5">
              Pelajari 9 modul dasar kimia larutan dan uji pemahamanmu dengan latihan soal pilihan ganda & studi kasus esai.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActivePage('education')}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold text-center transition"
              >
                9 Modul Materi
              </button>
              <button
                onClick={() => setActivePage('education')}
                className="py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold text-center transition"
              >
                Latihan Soal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
