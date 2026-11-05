import React, { useState } from 'react';
import { Menu, Sun, Moon, Search, FlaskConical, Shield, GraduationCap, X, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { CHEMICAL_DATABASE } from '../data/chemicals';

interface HeaderProps {
  user: UserProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleSidebar: () => void;
  setActivePage: (page: string) => void;
  onSelectChemicalForCalc?: (chemicalId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  darkMode,
  setDarkMode,
  toggleSidebar,
  setActivePage,
  onSelectChemicalForCalc
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const quickFeatures = [
    { title: 'Kalkulator Molaritas', page: 'calculator', desc: 'M = n / V, massa zat dengan kemurnian' },
    { title: 'Kalkulator Pengenceran', page: 'calculator', desc: 'C1V1 = C2V2 larutan stok' },
    { title: 'Kalkulator Persen Konsentrasi', page: 'calculator', desc: '% b/v, % v/v, % b/b larutan' },
    { title: 'Kalkulator Normalitas', page: 'calculator', desc: 'Valensi asam, basa, redoks & grek' },
    { title: 'Serial Dilution (Bertingkat)', page: 'calculator', desc: 'Pengenceran tabung berantai' },
    { title: 'Kebutuhan Reagen Sampel', page: 'calculator', desc: 'Hitung volume reagen N sampel & cadangan' },
    { title: 'Konverter Satuan Lab', page: 'converter', desc: 'Massa, volume, konsentrasi' },
    { title: 'Inventaris Reagen', page: 'inventory', desc: 'Monitoring stok & kedaluwarsa' },
    { title: 'ReagenLab AI Assistant', page: 'ai', desc: 'Asisten pintar kimia & TLM' },
    { title: 'Pusat Edukasi & Latihan', page: 'education', desc: 'Materi praktikum & latihan soal' }
  ];

  const filteredFeatures = searchQuery.trim()
    ? quickFeatures.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredChemicals = searchQuery.trim()
    ? CHEMICAL_DATABASE.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.casNumber.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <>
      <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Reagen<span className="text-cyan-500">Lab</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Smart Calculation, Accurate Laboratory
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Trigger (Desktop) */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Cari fitur kalkulator atau reagen kimia...</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-[10px] font-mono text-slate-400 shadow-xs">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Pencarian"
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Ubah tema"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* User Mode Badge */}
          <button
            onClick={() => setActivePage('profile')}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
              user.role === 'analis' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
            }`}>
              {user.role === 'analis' ? <Shield className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                {user.name.split(',')[0]}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {user.role === 'analis' ? 'Analis Lab' : 'Mahasiswa TLM'}
              </p>
            </div>
          </button>
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Cari kalkulator (molaritas, pengenceran) atau bahan kimia (NaCl, HCl)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Results */}
            <div className="p-3 max-h-[60vh] overflow-y-auto space-y-4">
              {searchQuery.trim() === '' ? (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                    Fitur Populer
                  </p>
                  <div className="space-y-1 mt-1">
                    {quickFeatures.slice(0, 5).map((feat, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActivePage(feat.page);
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{feat.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{feat.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {filteredFeatures.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                        Fitur & Kalkulator ({filteredFeatures.length})
                      </p>
                      <div className="space-y-1 mt-1">
                        {filteredFeatures.map((feat, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setActivePage(feat.page);
                              setSearchOpen(false);
                            }}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-left transition"
                          >
                            <div>
                              <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">{feat.title}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{feat.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-cyan-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredChemicals.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                        Bahan Kimia Terverifikasi ({filteredChemicals.length})
                      </p>
                      <div className="space-y-1 mt-1">
                        {filteredChemicals.map(chem => (
                          <button
                            key={chem.id}
                            onClick={() => {
                              if (onSelectChemicalForCalc) {
                                onSelectChemicalForCalc(chem.id);
                              }
                              setActivePage('chemicals');
                              setSearchOpen(false);
                            }}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-900 dark:text-white">{chem.name}</span>
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                  {chem.formula}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Mr: {chem.mr} g/mol | CAS: {chem.casNumber} | {chem.category}
                              </p>
                            </div>
                            <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                              Lihat Detail &rarr;
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredFeatures.length === 0 && filteredChemicals.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      Tidak ditemukan hasil untuk &ldquo;{searchQuery}&rdquo;. Coba istilah lain seperti &ldquo;molaritas&rdquo;, &ldquo;pengenceran&rdquo;, atau &ldquo;NaCl&rdquo;.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
