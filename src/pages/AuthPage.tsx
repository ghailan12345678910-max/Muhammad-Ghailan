import React, { useState } from 'react';
import {
  FlaskConical,
  GraduationCap,
  Shield,
  ArrowRight,
  Mail,
  Lock,
  User,
  Building,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>('mahasiswa');
  const [name, setName] = useState('muhammad Ghailan Apriliadi');
  const [email, setEmail] = useState('ghailan0348@gmail.com');
  const [institution, setInstitution] = useState('institut kesehatan rajawali (TLM)');
  const [nimOrNip, setNimOrNip] = useState('P1337434120042');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim() || (role === 'analis' ? 'Dimas Prasetyo, S.Tr.Kes' : 'muhammad Ghailan Apriliadi'),
      email: email.trim() || 'ghailan0348@gmail.com',
      role,
      institution: institution.trim() || 'institut kesehatan rajawali',
      nimOrNip: nimOrNip.trim() || (role === 'analis' ? '199208142018011002' : 'P1337434120042')
    };
    onLoginSuccess(newUser);
  };

  const handleQuickLogin = (selectedRole: UserRole) => {
    if (selectedRole === 'analis') {
      onLoginSuccess({
        id: 'usr_analis_demo',
        name: 'Dimas Prasetyo, S.Tr.Kes (Analis)',
        email: 'dimas.analis@labkesda.go.id',
        role: 'analis',
        institution: 'Instalasi Laboratorium RSUD Tarakan',
        nimOrNip: '199208142018011002'
      });
    } else {
      onLoginSuccess({
        id: 'usr_mhs_demo',
        name: 'muhammad Ghailan Apriliadi (Mahasiswa)',
        email: 'ghailan0348@gmail.com',
        role: 'mahasiswa',
        institution: 'institut kesehatan rajawali (TLM)',
        nimOrNip: 'P1337434120042'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-7 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Reagen<span className="text-cyan-400">Lab</span>
          </h1>
          <p className="text-xs text-slate-400">
            Smart Calculation, Accurate Laboratory.
          </p>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block text-center">
            Akses Cepat 1-Klik (Demo Testing):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('mahasiswa')}
              className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Mahasiswa TLM</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('analis')}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Analis Lab</span>
            </button>
          </div>
        </div>

        {/* Mode Tab Login / Register */}
        <div className="flex border-b border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 font-bold text-center border-b-2 transition ${
              !isRegister ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 font-bold text-center border-b-2 transition ${
              isRegister ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Choice */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
              Pilih Jenis Pengguna:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('mahasiswa')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  role === 'mahasiswa'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Mahasiswa TLM</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('analis')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  role === 'analis'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Analis Lab</span>
              </button>
            </div>
          </div>

          {/* If registering, show name & institution */}
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Institusi / Laboratorium</label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition"
          >
            <span>{isRegister ? 'Buat Akun ReagenLab' : 'Masuk ke Sistem'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
