import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Clock,
  ShieldAlert,
  Flame,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LEARNING_MODULES, MCQ_QUESTIONS, ESSAY_QUESTIONS } from '../data/education';
import { getQuizScore, saveQuizScore } from '../utils/storage';

export const EducationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'mcq' | 'essay'>('modules');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(LEARNING_MODULES[0].id);

  // MCQ state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedScore, setSavedScore] = useState(getQuizScore());

  // Essay state: toggled solutions
  const [openSolutions, setOpenSolutions] = useState<Record<number, boolean>>({});

  const toggleSolution = (id: number) => {
    setOpenSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedModule = LEARNING_MODULES.find(m => m.id === selectedModuleId) || LEARNING_MODULES[0];

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleSubmitMCQ = () => {
    let score = 0;
    MCQ_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });

    setIsSubmitted(true);
    saveQuizScore(score, MCQ_QUESTIONS.length);
    setSavedScore({ completed: Date.now(), score, total: MCQ_QUESTIONS.length });

    // Confetti celebration if score is good (>= 70%)
    if (score >= MCQ_QUESTIONS.length * 0.7) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pusat Pembelajaran &amp; Latihan TLM
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
              Kurikulum Medik
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kuasai konsep kimia larutan, stoikiometri analitik, dan prosedur keselamatan laboratorium TLM.
          </p>
        </div>

        {/* Saved quiz badge */}
        {savedScore.completed > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-500/20 text-xs">
            <Award className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-slate-700 dark:text-slate-300">
              Skor Terakhir: <strong className="font-mono text-cyan-600 dark:text-cyan-400">{savedScore.score}/{savedScore.total}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Mode Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'modules'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>9 Modul Materi</span>
        </button>

        <button
          onClick={() => setActiveTab('mcq')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'mcq'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Latihan Pilihan Ganda ({MCQ_QUESTIONS.length} Soal)</span>
        </button>

        <button
          onClick={() => setActiveTab('essay')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'essay'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Studi Kasus Esai ({ESSAY_QUESTIONS.length} Kasus)</span>
        </button>
      </div>

      {/* TAB 1: 9 Learning Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Module Selector Sidebar (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              Daftar Modul Pembelajaran
            </span>
            <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
              {LEARNING_MODULES.map(m => {
                const isSelected = m.id === selectedModuleId;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModuleId(m.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-300 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {m.duration}
                      </span>
                      <span className="px-1.5 py-0.2 rounded font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {m.level}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs leading-snug">{m.title}</h3>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module Content Reader (8 cols on lg) */}
          <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                  {selectedModule.level} • {selectedModule.duration}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {selectedModule.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedModule.description}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {selectedModule.content.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span>{sec.sectionTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {sec.text}
                  </p>

                  {/* Formula Box */}
                  {sec.formula && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 font-mono text-xs font-bold text-cyan-800 dark:text-cyan-300">
                      {sec.formula}
                    </div>
                  )}

                  {/* Example Box */}
                  {sec.example && (
                    <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300 whitespace-pre-line">
                      <strong className="block mb-1 text-[11px] uppercase tracking-wider text-blue-700 dark:text-blue-400">
                        Contoh Soal & Pengerjaan:
                      </strong>
                      {sec.example}
                    </div>
                  )}

                  {/* Safety Tip */}
                  {sec.safetyTip && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong>Peringatan K3:</strong> {sec.safetyTip}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Multiple Choice Practice */}
      {activeTab === 'mcq' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Quiz Header Banner */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Latihan Soal Pilihan Ganda TLM
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Terjawab: {answeredCount} dari {MCQ_QUESTIONS.length} Soal
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetQuiz}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Kuis</span>
              </button>

              {!isSubmitted ? (
                <button
                  onClick={handleSubmitMCQ}
                  disabled={answeredCount === 0}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-bold shadow-sm shadow-cyan-500/20 transition"
                >
                  Kirim & Nilai
                </button>
              ) : (
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai dinilai!</span>
                </div>
              )}
            </div>
          </div>

          {/* Result Card when Submitted */}
          {isSubmitted && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/30 border border-cyan-500/30 text-white text-center space-y-2">
              <Sparkles className="w-8 h-8 text-cyan-400 mx-auto" />
              <h3 className="font-extrabold text-xl">
                Hasil Latihan Soal Anda
              </h3>
              <p className="text-3xl font-black font-mono text-cyan-400">
                {savedScore.score} / {savedScore.total}
              </p>
              <p className="text-xs text-slate-300">
                {savedScore.score >= savedScore.total * 0.8
                  ? 'Luar biasa! Pemahaman teori dan perhitungan kimia Anda sangat solid.'
                  : savedScore.score >= savedScore.total * 0.6
                  ? 'Bagus! Pelajari kembali penjelasan pada nomor yang belum tepat.'
                  : 'Tetap semangat! Buka kembali menu 9 Modul Pembelajaran untuk memperdalam pemahaman.'}
              </p>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-4">
            {MCQ_QUESTIONS.map((q, idx) => {
              const selectedOption = userAnswers[q.id];
              const isCorrect = selectedOption === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                      Soal #{idx + 1} • {q.topic}
                    </span>
                    {isSubmitted && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {isCorrect ? 'Benar (+1)' : 'Kurang Tepat (0)'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOption === optIdx;
                      let optionClasses = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';

                      if (isSubmitted) {
                        if (optIdx === q.correctIndex) {
                          optionClasses = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold';
                        } else if (isChosen && !isCorrect) {
                          optionClasses = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-800 dark:text-rose-300 font-medium';
                        }
                      } else if (isChosen) {
                        optionClasses = 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-800 dark:text-cyan-300 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition ${optionClasses}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] bg-white/80 dark:bg-slate-700 shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                          {isSubmitted && isChosen && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation when submitted */}
                  {isSubmitted && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">
                        Pembahasan Ilmiah:
                      </p>
                      <p className="leading-relaxed font-mono text-[11px]">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Essay Case Studies */}
      {activeTab === 'essay' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Studi Kasus &amp; Latihan Esai Praktikum TLM
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Latihan pemecahan kasus nyata di laboratorium medik. Cobalah menghitung secara mandiri di lembar kerja sebelum membuka pembahasan langkah penyelesaian.
            </p>
          </div>

          <div className="space-y-4">
            {ESSAY_QUESTIONS.map((item) => {
              const isOpen = !!openSolutions[item.id];

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      {item.topic}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      Studi Kasus #{item.id}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {item.problem}
                  </p>

                  {/* Given Data Table */}
                  <div className="text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Data yang Diketahui:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(item.givenData).map(([k, v]) => (
                        <div key={k} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-left border border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 block">{k}</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Solution Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => toggleSolution(item.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 text-xs font-bold transition"
                    >
                      <span>{isOpen ? 'Tutup Pembahasan' : 'Buka Kunci Jawaban & Pembahasan Lengkap'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Expandable Solution */}
                  {isOpen && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-cyan-500/30 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Hasil Akhir:
                        </span>
                        <span className="font-mono text-xs font-extrabold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950 px-2.5 py-1 rounded-lg">
                          {item.finalAnswer}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Tahapan Pengerjaan Step-by-Step:
                        </span>
                        {item.solutionSteps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300"
                          >
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
