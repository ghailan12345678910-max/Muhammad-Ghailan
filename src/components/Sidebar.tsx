import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  ArrowLeftRight,
  Database,
  Boxes,
  Bot,
  GraduationCap,
  History,
  CheckCircle2,
  Settings,
  X,
  Shield,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: UserProfile;
  setUserRole: (role: 'mahasiswa' | 'analis') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isOpen,
  setIsOpen,
  user,
  setUserRole
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Lab',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'calculator',
      label: 'Smart Calculator',
      icon: Calculator,
      badge: '6 Rumus'
    },
    {
      id: 'converter',
      label: 'Konverter Satuan',
      icon: ArrowLeftRight,
      badge: null
    },
    {
      id: 'chemicals',
      label: 'Katalog Reagen',
      icon: Database,
      badge: null
    },
    {
      id: 'inventory',
      label: 'Manajemen Stok',
      icon: Boxes,
      badge: user.role === 'analis' ? 'Pro' : null
    },
    {
      id: 'ai',
      label: 'ReagenLab AI',
      icon: Bot,
      badge: 'Gemini'
    },
    {
      id: 'education',
      label: 'Pusat Edukasi',
      icon: GraduationCap,
      badge: 'Latihan'
    },
    {
      id: 'history',
      label: 'Riwayat & PDF',
      icon: History,
      badge: null
    },
    {
      id: 'verification',
      label: 'Uji Akurasi Lab',
      icon: CheckCircle2,
      badge: '6 Tes'
    },
    {
      id: 'profile',
      label: 'Profil & Pengaturan',
      icon: Settings,
      badge: null
    }
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Brand & Close on mobile */}
        <div>
          <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-sm shadow-cyan-600/20">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                Reagen<span className="text-cyan-500">Lab</span>
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Mode Switcher Capsule */}
          <div className="p-3">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Mode Pengguna Aktif
                </span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                  user.role === 'analis'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300'
                }`}>
                  {user.role === 'analis' ? 'Analis Lab' : 'Mahasiswa TLM'}
                </span>
              </div>

              {/* Mode Toggle Pills */}
              <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg bg-slate-200/70 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setUserRole('mahasiswa')}
                  className={`py-1 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition ${
                    user.role === 'mahasiswa'
                      ? 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-3 h-3" />
                  <span>Mahasiswa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('analis')}
                  className={`py-1 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition ${
                    user.role === 'analis'
                      ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>Analis Lab</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-1 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)]">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 dark:border-cyan-500/30 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-500' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Lab Support Info */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                Akurasi Lab Terstandarisasi
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              Sesuai Farmakope Indonesia & Standar Praktikum Kemenkes TLM.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
