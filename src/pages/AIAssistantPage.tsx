import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  FlaskConical
} from 'lucide-react';
import { UserProfile } from '../types';

interface AIAssistantPageProps {
  user: UserProfile;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  provider?: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  'Jelaskan rumus Molaritas dan cara penimbangan NaCl 0,1 M 250 mL',
  'Mengapa saat mengencerkan asam sulfat (H2SO4) air tidak boleh dituang ke asam?',
  'Bagaimana menentukan valensi dan Berat Ekuivalen (BE) pada titrasi permanganometri?',
  'Buatkan contoh soal praktikum TLM mengenai pengenceran bertingkat (serial dilution)',
  'Bagaimana prosedur pembuatan larutan pewarna Giemsa kerja dari stok pekat?'
];

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'model',
      content: `Halo ${user.name}! Saya **ReagenLab AI**, asisten kecerdasan buatan laboratorium kimia & Teknologi Laboratorium Medik (TLM).

Saya dapat membantu Anda dengan:
- Memeriksa langkah dan rumus perhitungan larutan (Molaritas, Normalitas, Pengenceran $C_1 V_1 = C_2 V_2$)
- Peringatan Keselamatan Kerja Laboratorium (K3, MSDS, simbol GHS)
- Prosedur pembuatan reagen standar dan reagen hematologi/klinis
- Pembahasan soal praktikum dan simulasi studi kasus lab

Ada yang ingin Anda tanyakan atau diskusikan hari ini?`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          context: {
            userName: user.name,
            userRole: user.role,
            institution: user.institution
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        content: data.reply || 'Maaf, saya tidak dapat menjawab saat ini.',
        provider: data.provider,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'model',
        content: `⚠️ Terjadi kendala koneksi ke server AI: ${err.message}. Silakan periksa kembali jaringan atau gunakan modul rumus mandiri di menu Kalkulator.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    if (confirm('Bersihkan riwayat percakapan dengan ReagenLab AI?')) {
      setMessages([
        {
          id: `welcome_${Date.now()}`,
          role: 'model',
          content: `Percakapan telah direset. Silakan ajukan pertanyaan atau konsultasi seputar perhitungan reagen dan praktikum TLM!`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] sm:h-[calc(100vh-115px)] max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base text-slate-900 dark:text-white">
                ReagenLab AI
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                Lab Assistant
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Asisten Ilmiah Perhitungan Larutan &amp; TLM Kimia Medik
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Messages stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-xs text-xs sm:text-[13px] leading-relaxed relative group ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
              }`}
            >
              {/* Message text with basic whitespace preservation */}
              <div className="whitespace-pre-wrap font-sans space-y-2">
                {msg.content}
              </div>

              {/* Message footer: timestamp & copy */}
              <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] ${
                msg.role === 'user' ? 'border-white/20 text-cyan-100' : 'border-slate-100 dark:border-slate-800 text-slate-400'
              }`}>
                <span>{msg.timestamp} {msg.provider ? `• ${msg.provider}` : ''}</span>
                <button
                  onClick={() => handleCopy(msg.id, msg.content)}
                  title="Salin pesan"
                  className="opacity-70 hover:opacity-100 flex items-center gap-1 transition"
                >
                  {copiedId === msg.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 shadow-xs mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-xs flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1">ReagenLab AI sedang menghitung dan memvalidasi...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Suggestions Chips */}
      <div className="py-2 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        {PRESET_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 whitespace-nowrap shadow-2xs transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md focus-within:border-cyan-500 transition"
        >
          <input
            type="text"
            placeholder="Tanyakan rumus, cara pengenceran, atau perhitungan reagen TLM..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-xs bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold shadow-xs active:scale-95 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-1.5">
          Didukung Google Gemini &amp; Model Komputasi Kimia ReagenLab. Selalu verifikasi prosedur laboratorium sebelum tindakan klinis.
        </p>
      </div>
    </div>
  );
};
