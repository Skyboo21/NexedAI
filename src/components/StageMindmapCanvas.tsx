// src/components/StageMindmapCanvas.tsx
"use client";

import React, { useState, useEffect, useId } from "react";
import {
  Award,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  ExternalLink,
  HelpCircle,
  RotateCcw,
  AlertCircle,
  Video,
  ListTodo,
  CheckSquare,
  Square,
  ArrowRight,
  RefreshCw,
  Search,
  BookOpen,
} from "lucide-react";
import type { LearningStageItem, RecommendedVideo } from "./NexedAiModuleHub";
import ModuleCertificateModal from "./ModuleCertificateModal";
import {
  claimModuleCertificate,
  getClaimedCertificates,
  type ModuleCertificateRecord,
} from "../lib/progressStorage";

interface StageMindmapCanvasProps {
  stages: LearningStageItem[];
  moduleTitle: string;
  moduleId?: string;
  onStageCompleted?: (stageNumber: number) => void;
  onOpenVideoModal?: (video: RecommendedVideo) => void;
  roadmapStatus: Record<number, boolean>;
  setRoadmapStatus: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function StageMindmapCanvas({
  stages,
  moduleTitle,
  moduleId = "modul-aktif",
  onStageCompleted,
  onOpenVideoModal,
  roadmapStatus,
  setRoadmapStatus,
}: StageMindmapCanvasProps) {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [lockedToast, setLockedToast] = useState<string | null>(null);

  // Per-stage action checklist state: { [stageIndex]: { [itemIndex]: boolean } }
  const [checklistState, setChecklistState] = useState<Record<number, Record<number, boolean>>>({});

  // Per-stage video quiz state
  const [stageQuizzes, setStageQuizzes] = useState<Record<number, QuizQuestion[]>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, Record<number, number>>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});
  const [quizPassed, setQuizPassed] = useState<Record<number, boolean>>({});
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [activeCert, setActiveCert] = useState<ModuleCertificateRecord | null>(null);

  const safeStages = Array.isArray(stages) && stages.length > 0 ? stages : [];
  const totalStages = safeStages.length;

  // Calculate completion
  const completedStagesCount = safeStages.filter(
    (s, idx) => !!roadmapStatus[s.stageNumber || idx + 1],
  ).length;
  const progressPercent =
    totalStages > 0 ? Math.round((completedStagesCount / totalStages) * 100) : 0;
  const isAllCompleted = totalStages > 0 && completedStagesCount === totalStages;

  // Cek apakah sudah pernah klaim sertifikat sebelumnya
  useEffect(() => {
    const certs = getClaimedCertificates();
    const cleanId = moduleId.toLowerCase().trim();
    if (certs[cleanId]) {
      setActiveCert(certs[cleanId]);
    }
  }, [moduleId, isAllCompleted]);

  // Load / generate quiz for current stage if not yet loaded
  useEffect(() => {
    const currentStage = safeStages[activeStageIndex];
    if (!currentStage) return;

    if (stageQuizzes[activeStageIndex] && stageQuizzes[activeStageIndex].length > 0) {
      return;
    }

    let isMounted = true;
    setIsLoadingQuiz(true);

    const videoId =
      currentStage.stageVideo?.videoId ||
      currentStage.stageVideo?.embedId ||
      "";

    fetch("/api/youtube/stage-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoId,
        videoTitle: currentStage.stageVideo?.title || currentStage.title,
        stageTitle: currentStage.title,
        stageMaterial: currentStage.detailedMaterial || currentStage.shortSummary,
        topic: moduleTitle,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data && Array.isArray(data.quizQuestions) && data.quizQuestions.length > 0) {
          setStageQuizzes((prev) => ({
            ...prev,
            [activeStageIndex]: data.quizQuestions,
          }));
        } else {
          // Fallback questions
          const fallbackQ: QuizQuestion[] = [
            {
              question: `Apa tujuan kunci dari materi '${currentStage.title}'?`,
              options: [
                `Memahami fondasi konsep dan alur kerjanya sebelum implementasi lanjutan.`,
                `Menghindari penulisan kode terstruktur agar eksekusi lebih cepat.`,
                `Menghapus dependensi validasi input data.`,
                `Mematikan fungsi logging kesalahan pada sistem.`,
              ],
              correctIndex: 0,
              explanation: `Konsep dasar pada '${currentStage.title}' sangat penting untuk memastikan sistem berjalan stabil.`,
            },
            {
              question: `Sesuai panduan tahap ini, tindakan apa yang harus dilakukan mahasiswa?`,
              options: [
                `Mengabaikan instruksi dan menebak konfigurasi secara acak.`,
                `Mempraktikkan langkah kerja secara bertahap dan memvalidasi hasilnya.`,
                `Mengganti seluruh arsitektur tanpa pengujian lokal.`,
                `Menghentikan proses ketika menemukan kendala pertama.`,
              ],
              correctIndex: 1,
              explanation: `Praktik yang baik menuntut langkah terstruktur dan verifikasi mandiri terhadap output kerja.`,
            },
          ];
          setStageQuizzes((prev) => ({ ...prev, [activeStageIndex]: fallbackQ }));
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const fallbackQ: QuizQuestion[] = [
          {
            question: `Apa fokus utama yang ditekankan pada materi '${currentStage.title}'?`,
            options: [
              `Memahami prinsip dasar dan alur kerjanya secara terstruktur.`,
              `Menghapus dokumentasi teknis sistem.`,
              `Melompati tahapan pengujian output.`,
              `Menonaktifkan fitur keamanan sistem.`,
            ],
            correctIndex: 0,
            explanation: `Pemahaman alur dasar '${currentStage.title}' merupakan prasyarat mutlak untuk tahap selanjutnya.`,
          },
          {
            question: `Bagaimana cara menguji keberhasilan pemahaman pada tahap ini?`,
            options: [
              `Membiarkan error terjadi tanpa penanganan yang tepat.`,
              `Mengeksekusi skenario praktik dan memverifikasi kesesuaian output.`,
              `Menyalin solusi tanpa memahami logika di baliknya.`,
              `Menghapus seluruh file konfigurasi projek.`,
            ],
            correctIndex: 1,
            explanation: `Verifikasi hasil praktik memastikan pemahaman konsep telah terinternalisasi dengan baik.`,
          },
        ];
        setStageQuizzes((prev) => ({ ...prev, [activeStageIndex]: fallbackQ }));
      })
      .finally(() => {
        if (isMounted) setIsLoadingQuiz(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeStageIndex, safeStages, moduleTitle, stageQuizzes]);

  // Is stage unlocked helper (Coursera-Style Sequential Lock)
  const isStageUnlocked = (index: number): boolean => {
    if (index === 0) return true; // Tahap 1 selalu terbuka
    const prevStage = safeStages[index - 1];
    if (!prevStage) return false;
    const prevStepNum = prevStage.stageNumber || index;
    return !!roadmapStatus[prevStepNum];
  };

  const isStageCompleted = (index: number): boolean => {
    const stage = safeStages[index];
    if (!stage) return false;
    const stepNum = stage.stageNumber || index + 1;
    return !!roadmapStatus[stepNum];
  };

  const handleSelectStage = (index: number) => {
    if (isStageUnlocked(index)) {
      setActiveStageIndex(index);
      setLockedToast(null);
    } else {
      setLockedToast(
        `Simpul '${safeStages[index]?.title || `Tahap ${index + 1}`}' masih terkunci. Selesaikan Tahap ${index} dan lulus kuis video untuk membukanya.`,
      );
      setTimeout(() => setLockedToast(null), 4000);
    }
  };

  const handleToggleChecklist = (stageIdx: number, itemIdx: number) => {
    setChecklistState((prev) => {
      const stageItems = prev[stageIdx] || {};
      return {
        ...prev,
        [stageIdx]: {
          ...stageItems,
          [itemIdx]: !stageItems[itemIdx],
        },
      };
    });
  };

  const handleSelectQuizOption = (questionIdx: number, optionIdx: number) => {
    if (quizPassed[activeStageIndex]) return; // Jika sudah lulus, kunci
    setQuizAnswers((prev) => {
      const current = prev[activeStageIndex] || {};
      return {
        ...prev,
        [activeStageIndex]: {
          ...current,
          [questionIdx]: optionIdx,
        },
      };
    });
  };

  const handleCheckQuizAnswers = () => {
    const questions = stageQuizzes[activeStageIndex] || [];
    const answers = quizAnswers[activeStageIndex] || {};

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const passed = questions.length > 0 && correctCount === questions.length;
    setQuizSubmitted((prev) => ({ ...prev, [activeStageIndex]: true }));
    setQuizPassed((prev) => ({ ...prev, [activeStageIndex]: passed }));
  };

  const handleResetQuiz = () => {
    setQuizAnswers((prev) => ({ ...prev, [activeStageIndex]: {} }));
    setQuizSubmitted((prev) => ({ ...prev, [activeStageIndex]: false }));
    setQuizPassed((prev) => ({ ...prev, [activeStageIndex]: false }));
  };

  const handleCompleteCurrentStage = () => {
    const currentStage = safeStages[activeStageIndex];
    if (!currentStage) return;

    const stepNum = currentStage.stageNumber || activeStageIndex + 1;
    setRoadmapStatus((prev) => ({ ...prev, [stepNum]: true }));
    if (onStageCompleted) {
      onStageCompleted(stepNum);
    }

    // Auto-advance ke tahap berikutnya jika ada
    if (activeStageIndex < totalStages - 1) {
      setActiveStageIndex(activeStageIndex + 1);
    }
  };

  const handleClaimCertificateClick = () => {
    const cert = claimModuleCertificate({
      moduleId,
      topicTitle: moduleTitle,
      competencies: safeStages.map((s) => s.title),
    });
    setActiveCert(cert);
    setIsCertModalOpen(true);
  };

  const currentStage = safeStages[activeStageIndex] || safeStages[0];
  const activeQuiz = stageQuizzes[activeStageIndex] || [];
  const activeAnswers = quizAnswers[activeStageIndex] || {};
  const isCurrentQuizSubmitted = !!quizSubmitted[activeStageIndex];
  const isCurrentQuizPassed =
    !!quizPassed[activeStageIndex] || isStageCompleted(activeStageIndex);

  const activeChecklist =
    currentStage?.actionChecklist && currentStage.actionChecklist.length > 0
      ? currentStage.actionChecklist
      : [
          `Pahami konsep pokok: ${(currentStage?.keyConcepts || []).slice(0, 2).join(" & ") || currentStage?.title}.`,
          currentStage?.selfAction || `Pelajari dan terapkan langkah kerja ${currentStage?.title}.`,
          currentStage?.practiceScenario || `Terapkan konsep pada skenario kasus dan verifikasi output.`,
        ];

  const currentStageChecklistState = checklistState[activeStageIndex] || {};
  const checkedActionsCount = activeChecklist.filter(
    (_, idx) => !!currentStageChecklistState[idx],
  ).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert jika user mengeklik simpul terkunci */}
      {lockedToast && (
        <div className="fixed bottom-6 right-6 z-40 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-rose-500/50 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Lock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-rose-300">Simpul Masih Terkunci (Sequential Gate)</div>
            <p className="text-slate-300 leading-relaxed">{lockedToast}</p>
          </div>
        </div>
      )}

      {/* 1. TOP HEADER & CELEBRATION BANNER */}
      <div className="p-6 bg-white rounded-3xl border border-black/8 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-full text-[11px] font-bold uppercase tracking-wider">
                Interactive Mindmap Tree
              </span>
              <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 border border-black/10 rounded-full text-[11px] font-mono">
                {completedStagesCount} dari {totalStages} Simpul Selesai
              </span>
              {isAllCompleted && (
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Menguasai Modul</span>
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-black tracking-tight">
              Peta Belajar Adaptif: {moduleTitle}
            </h3>
            <p className="text-xs text-neutral-500">
              Selesaikan setiap simpul secara berurutan. Simpul berikutnya akan terbuka otomatis setelah Anda menonton video tutorial dan lulus kuis checkpoint.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-black">{progressPercent}% Tuntas</div>
              <div className="w-28 bg-neutral-100 h-2 rounded-full overflow-hidden border border-black/8 mt-1">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {isAllCompleted && (
              <button
                type="button"
                onClick={handleClaimCertificateClick}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-extrabold rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer animate-pulse"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>🎓 Klaim E-Sertifikat Kelulusan</span>
              </button>
            )}
          </div>
        </div>

        {/* Banner 100% Completion jika sudah tuntas */}
        {isAllCompleted && (
          <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-emerald-900 text-sm">
                  Luar Biasa! Seluruh Simpul Pembelajaran Berhasil Anda Kuasai!
                </div>
                <div className="text-emerald-700">
                  Dapatkan pengakuan kompetensi resmi dengan mengunduh E-Sertifikat dan perolehan +250 XP.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClaimCertificateClick}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Buka E-Sertifikat</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* 2. VISUAL KANVAS MINDMAP BERCABANG (SVG CONNECTORS + NODES) */}
      <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden relative text-white">
        {/* Subtle Canvas Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#38BDF8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                Mindmap Sequential Graph (Coursera-Style)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Klik simpul untuk membuka video & modul kerja
            </span>
          </div>

          {/* Root to Branches Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Root Node: Modul Overview (Left Column) */}
            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 space-y-3 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-black text-xs">
                  ROOT
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Titik Tolak Modul
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-1">
                    {moduleTitle}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Pohon kompetensi ini dirancang secara berurutan. Kuasai simpul awal untuk membuka kemampuan di simpul berikutnya.
              </p>

              <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400 font-mono text-[10px]">
                  <span>Status Penyelesaian:</span>
                  <span className="text-white font-bold">{completedStagesCount}/{totalStages} Tahap</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stage Nodes Branches (Right Column: 8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {safeStages.map((stage, idx) => {
                const unlocked = isStageUnlocked(idx);
                const completed = isStageCompleted(idx);
                const isActive = activeStageIndex === idx;

                return (
                  <div
                    key={`mindmap-node-${idx}-${stage.title}`}
                    onClick={() => handleSelectStage(idx)}
                    className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                      !unlocked
                        ? "bg-slate-900/40 border-slate-800/60 opacity-60 hover:opacity-80"
                        : isActive
                          ? "bg-slate-900 border-indigo-400 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-950/40"
                          : completed
                            ? "bg-slate-900/90 border-emerald-500/50 hover:border-emerald-400"
                            : "bg-slate-900/80 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Indicator & Stage Title */}
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${
                            completed
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : isActive
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40"
                                : unlocked
                                  ? "bg-slate-800 text-slate-300 border border-slate-700"
                                  : "bg-slate-950 text-slate-600 border border-slate-800"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : !unlocked ? (
                            <Lock className="w-4 h-4 text-slate-500" />
                          ) : (
                            <span>{stage.stageNumber || idx + 1}</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                              {stage.phaseLabel || `Tahap ${stage.stageNumber || idx + 1}`}
                            </span>

                            {completed ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Tuntas</span>
                              </span>
                            ) : isActive ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 flex items-center gap-1">
                                <Play className="w-3 h-3 fill-indigo-300" />
                                <span>Sedang Dipelajari</span>
                              </span>
                            ) : unlocked ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                Terbuka
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-950 text-slate-500 border border-slate-800 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Terkunci</span>
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {stage.title}
                          </h4>

                          <p className="text-xs text-slate-300 line-clamp-1">
                            {stage.shortSummary}
                          </p>
                        </div>
                      </div>

                      {/* Right: Branching Leaves (Key Concepts Pills) */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 shrink-0 pt-2 sm:pt-0">
                        {(stage.keyConcepts || []).slice(0, 3).map((concept, cIdx) => (
                          <span
                            key={`leaf-${idx}-${cIdx}`}
                            className="px-2 py-0.5 bg-slate-800/90 text-slate-300 border border-slate-700/80 rounded-md text-[10px] font-mono whitespace-nowrap"
                          >
                            • {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE STAGE WORK PANEL (VIDEO + CHECKLIST + QUIZ GATE) */}
      {currentStage && (
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-2xs">
          {/* Active Stage Heading Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-black/8 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-full text-[11px] font-mono font-bold">
                  {currentStage.phaseLabel || `Tahap ${activeStageIndex + 1}`}
                </span>
                {isStageCompleted(activeStageIndex) ? (
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tahap Ini Telah Tuntas</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Selesaikan 2 Soal Kuis untuk Membuka Tahap Selanjutnya</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-black mt-1">
                {currentStage.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
                {currentStage.shortSummary}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={
                  currentStage.stageVideo?.videoUrl ||
                  `https://www.youtube.com/results?search_query=${encodeURIComponent(
                    `${currentStage.searchQuery || currentStage.title} tutorial`,
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-full bg-[#F4F4F6] hover:bg-neutral-200 text-black text-xs font-semibold border border-black/10 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Search className="w-3.5 h-3.5 text-neutral-600" />
                <span>Cari Video/Subtitle Alternatif</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Grid Layout: Video Tutorial (Left) & Action Checklist (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left (7 cols): Embedded YouTube Video Player */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-rose-600" />
                  <span>1. Video Tutorial Tahap Ini (Wajib Ditonton)</span>
                </span>
                {currentStage.stageVideo?.duration && (
                  <span className="text-[11px] font-mono text-neutral-500 bg-[#F4F4F6] px-2 py-0.5 rounded-md border border-black/10">
                    Durasi: {currentStage.stageVideo.duration}
                  </span>
                )}
              </div>

              {/* YouTube Embed Container */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-black/10 shadow-sm">
                {currentStage.stageVideo?.embedId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${currentStage.stageVideo.embedId}?rel=0&modestbranding=1`}
                    title={currentStage.stageVideo.title || currentStage.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-slate-900 text-slate-300 space-y-2">
                    <Video className="w-10 h-10 text-slate-500" />
                    <div className="text-xs font-semibold text-white">
                      Video Rekomendasi Terverifikasi: {currentStage.title}
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-sm">
                      Tonton tutorial melalui tautan resmi untuk memahami langkah praktikum simpul ini.
                    </p>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                        `${currentStage.searchQuery || currentStage.title} tutorial`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Buka Tutorial di YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Video Meta Summary */}
              {currentStage.stageVideo && (
                <div className="p-3.5 bg-[#FAFAFA] rounded-2xl border border-black/8 flex items-center justify-between text-xs gap-3">
                  <div className="space-y-0.5">
                    <div className="font-bold text-black line-clamp-1">
                      {currentStage.stageVideo.title}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Channel: {currentStage.stageVideo.channel || currentStage.stageVideo.channelName || "Official Tutorial"}
                    </div>
                  </div>
                  {onOpenVideoModal && (
                    <button
                      type="button"
                      onClick={() => onOpenVideoModal(currentStage.stageVideo!)}
                      className="px-3 py-1.5 bg-white hover:bg-neutral-100 border border-black/10 rounded-full font-semibold text-black text-xs shrink-0 cursor-pointer shadow-2xs"
                    >
                      Buka Mode Fokus
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right (5 cols): Checklist "Harus Ngapain Aja" */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black flex items-center gap-1.5">
                  <ListTodo className="w-4 h-4 text-indigo-600" />
                  <span>2. Checklist &quot;Harus Ngapain Aja&quot;</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  {checkedActionsCount}/{activeChecklist.length} Tuntas
                </span>
              </div>

              <div className="space-y-2.5 p-4 bg-[#FAFAFA] rounded-2xl border border-black/8">
                {activeChecklist.map((actionText, aIdx) => {
                  const isChecked = !!currentStageChecklistState[aIdx];
                  return (
                    <div
                      key={`action-chk-${activeStageIndex}-${aIdx}`}
                      onClick={() => handleToggleChecklist(activeStageIndex, aIdx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isChecked
                          ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                          : "bg-white border-black/8 text-slate-800 hover:border-black/20"
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={`Tandai tugas ${aIdx + 1}`}
                        className="mt-0.5 shrink-0 text-black cursor-pointer"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-neutral-400" />
                        )}
                      </button>
                      <div className="text-xs leading-relaxed flex-1 select-none">
                        <span className="font-bold mr-1">Langkah {aIdx + 1}:</span>
                        <span className={isChecked ? "line-through text-neutral-500" : ""}>
                          {actionText}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2 border-t border-black/8 text-[11px] text-neutral-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Centang langkah di atas setelah Anda selesai mempraktikkannya.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. KUIS WAJIB TONTON VIDEO (UNLOCK GATE) */}
          <div className="space-y-4 pt-4 border-t border-black/8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-black flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>3. Kuis Wajib Tonton Video (Checkpoint Pembuka Simpul)</span>
                </span>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Jawab 2 soal pilihan ganda di bawah ini dengan skor 100% (2/2 benar) berdasarkan penjelasan materi video untuk membuka simpul berikutnya.
                </p>
              </div>

              {isCurrentQuizPassed && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Lulus 100% (Syarat Terpenuhi)</span>
                </span>
              )}
            </div>

            {isLoadingQuiz ? (
              <div className="p-8 rounded-2xl border border-black/10 bg-[#FAFAFA] text-center space-y-2 animate-pulse">
                <RefreshCw className="w-5 h-5 text-black animate-spin mx-auto" />
                <div className="text-xs font-semibold text-black">
                  Menganalisis Subtitle Video & Menyusun Kuis...
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activeQuiz.map((qItem, qIdx) => {
                  const selectedOption = activeAnswers[qIdx];
                  const isCorrect = isCurrentQuizSubmitted && selectedOption === qItem.correctIndex;
                  const isWrong =
                    isCurrentQuizSubmitted &&
                    selectedOption !== undefined &&
                    selectedOption !== qItem.correctIndex;

                  return (
                    <div
                      key={`quiz-item-${activeStageIndex}-${qIdx}`}
                      className="p-5 bg-[#FAFAFA] rounded-2xl border border-black/8 space-y-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <div className="text-xs font-bold text-black leading-relaxed">
                          {qItem.question}
                        </div>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {qItem.options.map((opt, oIdx) => {
                          const isSelected = selectedOption === oIdx;
                          let optionStyle =
                            "bg-white border-black/10 hover:border-black/30 text-slate-800";

                          if (isCurrentQuizSubmitted) {
                            if (oIdx === qItem.correctIndex) {
                              optionStyle =
                                "bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-400";
                            } else if (isSelected && !isCorrect) {
                              optionStyle =
                                "bg-rose-50 border-rose-300 text-rose-950 line-through opacity-80";
                            }
                          } else if (isSelected) {
                            optionStyle =
                              "bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold ring-1 ring-indigo-500";
                          }

                          return (
                            <button
                              key={`opt-${qIdx}-${oIdx}`}
                              type="button"
                              onClick={() => handleSelectQuizOption(qIdx, oIdx)}
                              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${optionStyle}`}
                            >
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/5 shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="leading-relaxed">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback Penjelasan */}
                      {isCurrentQuizSubmitted && (
                        <div
                          className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                            isCorrect
                              ? "bg-emerald-50/80 text-emerald-900 border border-emerald-200"
                              : "bg-rose-50/80 text-rose-900 border border-rose-200"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          )}
                          <p className="leading-relaxed">{qItem.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Action Submit / Advance Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-neutral-500">
                    {!isCurrentQuizSubmitted ? (
                      <span>Pilih jawaban untuk kedua pertanyaan di atas, lalu klik <strong>Periksa Jawaban</strong>.</span>
                    ) : isCurrentQuizPassed ? (
                      <span className="text-emerald-700 font-bold">
                        ✓ Selamat! Anda lulus kuis. Silakan lanjut membuka simpul berikutnya.
                      </span>
                    ) : (
                      <span className="text-rose-600 font-medium">
                        Ada jawaban yang belum tepat. Silakan klik &quot;Coba Lagi&quot; untuk mengulang tanpa penalti.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isCurrentQuizSubmitted && !isCurrentQuizPassed && (
                      <button
                        type="button"
                        onClick={handleResetQuiz}
                        className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-black rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Coba Lagi</span>
                      </button>
                    )}

                    {!isCurrentQuizSubmitted ? (
                      <button
                        type="button"
                        onClick={handleCheckQuizAnswers}
                        disabled={Object.keys(activeAnswers).length < activeQuiz.length}
                        className="px-5 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Periksa Jawaban
                      </button>
                    ) : isCurrentQuizPassed ? (
                      <button
                        type="button"
                        onClick={handleCompleteCurrentStage}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer animate-bounce-subtle"
                      >
                        <span>
                          {activeStageIndex < totalStages - 1
                            ? `Selesaikan Tahap ${activeStageIndex + 1} & Buka Simpul Berikutnya →`
                            : "Tuntaskan Seluruh Modul & Buka Sertifikat 🎓"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal E-Sertifikat Kelulusan */}
      <ModuleCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certificate={activeCert}
        moduleTitle={moduleTitle}
      />
    </div>
  );
}

