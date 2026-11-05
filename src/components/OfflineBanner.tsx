import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Database } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center gap-2.5 rounded-xl bg-amber-600/95 dark:bg-amber-700/95 text-white px-3.5 py-2.5 shadow-xl backdrop-blur-xs border border-amber-400/30 animate-in slide-in-from-bottom duration-200">
      <div className="p-1.5 rounded-lg bg-black/20 shrink-0">
        <WifiOff className="w-4 h-4 text-amber-200" />
      </div>
      <div className="text-xs">
        <p className="font-semibold">Mode Offline Aktif</p>
        <p className="text-amber-100/90 text-[11px] flex items-center gap-1 mt-0.5">
          <Database className="w-3 h-3 inline" />
          Kalkulator, database reagen, dan inventaris tersimpan di perangkat. ReagenLab AI membutuhkan internet.
        </p>
      </div>
    </div>
  );
};
