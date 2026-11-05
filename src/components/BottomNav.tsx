import React from 'react';
import { LayoutDashboard, Calculator, Database, Boxes, Bot } from 'lucide-react';

interface BottomNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  const tabs = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'calculator', label: 'Kalkulator', icon: Calculator },
    { id: 'chemicals', label: 'Katalog', icon: Database },
    { id: 'inventory', label: 'Stok', icon: Boxes },
    { id: 'ai', label: 'AI Lab', icon: Bot },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePage === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive
                ? 'text-cyan-600 dark:text-cyan-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition ${isActive ? 'bg-cyan-50 dark:bg-cyan-950/60' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
