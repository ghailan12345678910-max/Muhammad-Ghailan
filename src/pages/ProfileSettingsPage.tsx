import React, { useState } from 'react';
import {
  User,
  Shield,
  GraduationCap,
  Save,
  Building,
  Mail,
  Hash,
  Database,
  Trash2,
  RotateCcw,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface ProfileSettingsPageProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onResetAllData: () => void;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  user,
  onUpdateUser,
  onResetAllData
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<UserRole>(user.role);
  const [institution, setInstitution] = useState(user.institution);
  const [nimOrNip, setNimOrNip] = useState(user.nimOrNip || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      role,
      institution,
      nimOrNip
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Profil Pengguna &amp; Konfigurasi Laboratorium
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Atur identitas pengguna, institusi laboratorium, dan mode akses (Mahasiswa TLM vs Analis Lab).
        </p>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
              role === 'analis'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
            }`}>
              {role === 'analis' ? <Shield className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">{name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {role === 'analis' ? 'Analis Laboratorium Profesional' : 'Mahasiswa Teknologi Laboratorium Medik (TLM)'}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-xs active:scale-95 transition"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Profil</span>
              </>
            )}
          </button>
        </div>

        {/* Role Selector Cards */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Pilihan Mode Akun &amp; Hak Akses:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setRole('mahasiswa')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                role === 'mahasiswa'
                  ? 'bg-cyan-50/50 dark:bg-cyan-950/30 border-cyan-500 shadow-xs ring-1 ring-cyan-500'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-cyan-600 dark:text-cyan-400">
                <GraduationCap className="w-4 h-4" />
                <span className="font-bold text-xs">Mode Mahasiswa TLM</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Difokuskan untuk kegiatan praktikum, seluruh kalkulator kimia, 9 modul materi pembelajaran, latihan soal pilihan ganda &amp; esai, dan ekspor lembar praktikum PDF.
              </p>
            </div>

            <div
              onClick={() => setRole('analis')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                role === 'analis'
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-400">
                <Shield className="w-4 h-4" />
                <span className="font-bold text-xs">Mode Analis Laboratorium</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Seluruh kalkulator kimia, perhitungan kebutuhan reagen $N$ sampel dengan safety margin, kontrol mutu QC, dan manajemen penuh stok &amp; log pemakaian reagen.
              </p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap &amp; Gelar
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Pengguna
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Institusi / Universitas / Laboratorium
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {role === 'analis' ? 'Nomor Induk Pegawai (NIP/SIP)' : 'Nomor Induk Mahasiswa (NIM)'}
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={nimOrNip}
                onChange={e => setNimOrNip(e.target.value)}
                placeholder="P13374341..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Storage & Data Management Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
          <Database className="w-4 h-4 text-cyan-500" />
          <h3 className="font-bold text-sm">Penyimpanan Lokal &amp; Pemulihan Data</h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Seluruh data perhitungan larutan, stok inventaris, dan progres latihan tersimpan secara aman di peramban web lokal (IndexedDB / LocalStorage) sehingga tetap dapat diakses tanpa koneksi internet.
        </p>

        <div className="pt-2 flex items-center justify-between">
          <div>
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">Reset Data Sampel Awal</p>
            <p className="text-[11px] text-slate-400">Kembalikan daftar inventaris reagen dan pengaturan ke data contoh laboratorium.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('Apakah Anda ingin memulihkan data inventaris awal dan mereset riwayat?')) {
                onResetAllData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-700 dark:text-rose-400 text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* About ReagenLab */}
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-5 text-center space-y-1 text-slate-500 text-xs">
        <p className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
          Reagen<span className="text-cyan-500">Lab</span> v2.0
        </p>
        <p className="italic">Smart Calculation, Accurate Laboratory.</p>
        <p className="text-[11px] text-slate-400 pt-1">
          Dirancang untuk mahasiswa Teknologi Laboratorium Medik (TLM) dan tenaga analis kimia klinis Indonesia.
        </p>
      </div>
    </div>
  );
};
