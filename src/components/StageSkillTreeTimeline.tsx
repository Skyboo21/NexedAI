// src/components/StageSkillTreeTimeline.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  HelpCircle,
  ListTodo,
  Lock,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Square,
  CheckSquare,
  Video,
  Zap,
} from "lucide-react";
import type { LearningStageItem, RecommendedVideo } from "./NexedAiModuleHub";
import ModuleCertificateModal from "./ModuleCertificateModal";
import {
  claimModuleCertificate,
  getClaimedCertificates,
  addTotalUserXp,
  type ModuleCertificateRecord,
} from "../lib/progressStorage";

interface StageSkillTreeTimelineProps {
  stages: LearningStageItem[];
  moduleTitle: string;
  moduleId?: string;
  roadmapStatus: Record<number, boolean>;
  setRoadmapStatus: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  onOpenVideoModal?: (video: RecommendedVideo) => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function StageSkillTreeTimeline({
  stages,
  moduleTitle,
  moduleId = "modul-aktif",
  roadmapStatus,
  setRoadmapStatus,
  onOpenVideoModal,
}: StageSkillTreeTimelineProps) {
  // Expanded stage accordion: null or stageNumber
  const [expandedStageNumber, setExpandedStageNumber] = useState<number | null>(1);
  const [lockedToast, setLockedToast] = useState<string | null>(null);

  // Per-stage checklist state: { [stageNum]: { [itemIdx]: boolean } }
  const [checklistState, setChecklistState] = useState<Record<number, Record<number, boolean>>>({});

  // Per-stage quiz state
  const [stageQuizzes, setStageQuizzes] = useState<Record<number, QuizQuestion[]>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, Record<number, number>>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});
  const [quizPassed, setQuizPassed] = useState<Record<number, boolean>>({});

  // E-Certificate modal state
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [activeCert, setActiveCert] = useState<ModuleCertificateRecord | null>(null);

  const safeStages = Array.isArray(stages) && stages.length > 0 ? stages : [];
  const totalStages = safeStages.length;

  const completedStagesCount = safeStages.filter(
    (s, idx) => !!roadmapStatus[s.stageNumber || idx + 1],
  ).length;

  const progressPercent =
    totalStages > 0 ? Math.round((completedStagesCount / totalStages) * 100) : 0;
  const isAllCompleted = totalStages > 0 && completedStagesCount === totalStages;

  // Restore previously claimed certificate if any
  useEffect(() => {
    const certs = getClaimedCertificates();
    const cleanId = moduleId.toLowerCase().trim();
    if (certs[cleanId]) {
      setActiveCert(certs[cleanId]);
    }
  }, [moduleId, isAllCompleted]);

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

  const handleCardClick = (index: number, stepNum: number) => {
    if (isStageUnlocked(index)) {
      setExpandedStageNumber(expandedStageNumber === stepNum ? null : stepNum);
      setLockedToast(null);
    } else {
      setLockedToast(
        `Tahap ${index + 1} masih terkunci. Selesaikan Tahap ${index} dan kuis videonya untuk membuka tahap ini.`,
      );
      setTimeout(() => setLockedToast(null), 4000);
    }
  };

  const handleToggleChecklist = (stageNum: number, itemIdx: number) => {
    setChecklistState((prev) => {
      const stageItems = prev[stageNum] || {};
      return {
        ...prev,
        [stageNum]: {
          ...stageItems,
          [itemIdx]: !stageItems[itemIdx],
        },
      };
    });
  };

  // Lazy generate / fetch quiz for a stage
  const getStageQuiz = (stage: LearningStageItem, stageNum: number): QuizQuestion[] => {
    if (stageQuizzes[stageNum]) return stageQuizzes[stageNum];

    // Gunakan kuis bawaan jika ada dari stage.quiz
    if (stage.quiz && Array.isArray(stage.quiz) && stage.quiz.length >= 2) {
      return stage.quiz;
    }

    // Default high-relevance fallback quiz
    const cleanTerm = (stage.keyConcepts || [])[0] || stage.title;
    const defaultQ: QuizQuestion[] = [
      {
        question: `Berdasarkan video materi '${stage.title}', apa fokus utama konsep '${cleanTerm}'?`,
        options: [
          `Menjadi fondasi alur kerja dan acuan terstruktur sebelum melangkah ke implementasi lanjutan.`,
          `Menghapus proses verifikasi data masukan untuk mempercepat runtime.`,
          `Mengabaikan penanganan error pada sistem.`,
          `Menonaktifkan fitur logging komputasi.`,
        ],
        correctIndex: 0,
        explanation: `Pemahaman mendasar terhadap '${cleanTerm}' sangat krusial sebelum masuk ke tahapan berikutnya.`,
      },
      {
        question: `Sesuai demonstrasi tutorial pada tahap ini, langkah apa yang paling tepat dipraktikkan?`,
        options: [
          `Mengabaikan dokumentasi dan menebak alur instruksi.`,
          `Menerapkan langkah kerja secara berurutan, menguji output, dan memvalidasi hasilnya.`,
          `Menghapus file konfigurasi utama projek.`,
          `Melompati tahap pengujian logika.`,
        ],
        correctIndex: 1,
        explanation: `Praktik yang baik menuntut langkah terstruktur dan verifikasi mandiri terhadap hasil kode.`,
      },
    ];

    return defaultQ;
  };

  const handleSelectQuizAnswer = (stageNum: number, qIdx: number, optIdx: number) => {
    if (quizPassed[stageNum]) return;
    setQuizAnswers((prev) => {
      const stageAns = prev[stageNum] || {};
      return {
        ...prev,
        [stageNum]: {
          ...stageAns,
          [qIdx]: optIdx,
        },
      };
    });
  };

  const handleCheckQuiz = (stageNum: number, questions: QuizQuestion[]) => {
    const answers = quizAnswers[stageNum] || {};
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correct += 1;
      }
    });

    const passed = correct === questions.length;
    setQuizSubmitted((prev) => ({ ...prev, [stageNum]: true }));
    setQuizPassed((prev) => ({ ...prev, [stageNum]: passed }));
  };

  const handleResetQuiz = (stageNum: number) => {
    setQuizAnswers((prev) => ({ ...prev, [stageNum]: {} }));
    setQuizSubmitted((prev) => ({ ...prev, [stageNum]: false }));
    setQuizPassed((prev) => ({ ...prev, [stageNum]: false }));
  };

  const handleCompleteStageAndAdvance = (index: number, stepNum: number) => {
    setRoadmapStatus((prev) => ({ ...prev, [stepNum]: true }));
    addTotalUserXp(150);

    // Buka tahap berikutnya secara otomatis
    if (index < totalStages - 1) {
      const nextStepNum = safeStages[index + 1]?.stageNumber || index + 2;
      setExpandedStageNumber(nextStepNum);
    }
  };

  const handleClaimCertificate = () => {
    const cert = claimModuleCertificate({
      moduleId,
      topicTitle: moduleTitle,
      competencies: safeStages.map((s) => s.title),
    });
    setActiveCert(cert);
    setIsCertModalOpen(true);
  };

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      {/* Toast Alert jika mengeklik tahap terkunci */}
      {lockedToast && (
        <div className="fixed bottom-6 right-6 z-40 max-w-md bg-zinc-950 text-white p-4 rounded-2xl shadow-2xl border border-zinc-800 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-zinc-100">Tahap Terkunci (Sequential Gate)</div>
            <p className="text-zinc-400 leading-relaxed">{lockedToast}</p>
          </div>
        </div>
      )}

      {/* 1. HEADER TERPUSAT (COLORWAY RESMI NEXED AI: MONOCHROME & ZINC) */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 text-[11px] font-mono uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
          <span>Peta Belajar Adaptif Hasil Ekstraksi AI Dokumen</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
          {moduleTitle}
        </h2>

        <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
          Tahapan belajar disusun 100% dinamis dan berurutan dari dokumen Anda. Tuntaskan kuis checkpoint video pada tiap simpul untuk membuka tahap selanjutnya.
        </p>

        {/* Progres Ketuntasan Bar */}
        <div className="pt-2 max-w-md mx-auto space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono font-medium text-zinc-600">
            <span>Progres Belajar:</span>
            <span className="font-bold text-zinc-950">
              {completedStagesCount} dari {totalStages} Tahap Selesai • {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden border border-zinc-200/80">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isAllCompleted ? "bg-emerald-600" : "bg-zinc-950"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Banner 100% Selesai + Tombol Klaim E-Sertifikat */}
        {isAllCompleted && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-left animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-950">
                  Selamat! Seluruh Tahap Peta Belajar Berhasil Anda Tuntaskan
                </div>
                <div className="text-[11px] text-emerald-800">
                  Klaim E-Sertifikat resmi kelulusan Anda dan dapatkan penghargaan kompetensi.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClaimCertificate}
              className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-amber-300 text-xs font-extrabold rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>🎓 Klaim E-Sertifikat Kelulusan</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. STRUKTUR TIMELINE 2 KOLOM (KIRI: SIMPUL & GARIS VERTIKAL | KANAN: KARTU TAHAP) */}
      <div className="relative max-w-4xl mx-auto space-y-6 before:absolute before:inset-0 before:left-6 sm:before:left-7 before:top-6 before:bottom-6 before:w-0.5 before:bg-zinc-200">
        {safeStages.map((stage, index) => {
          const stepNum = stage.stageNumber || index + 1;
          const unlocked = isStageUnlocked(index);
          const completed = isStageCompleted(index);
          const isExpanded = expandedStageNumber === stepNum;
          const questions = getStageQuiz(stage, stepNum);
          const stageAnswers = quizAnswers[stepNum] || {};
          const isSubmitted = !!quizSubmitted[stepNum];
          const isPassed = !!quizPassed[stepNum] || completed;

          const checklist =
            Array.isArray(stage.actionChecklist) && stage.actionChecklist.length >= 2
              ? stage.actionChecklist
              : [
                  `Pahami konsep pokok: ${(stage.keyConcepts || []).slice(0, 2).join(" & ") || stage.title}.`,
                  stage.selfAction || `Pelajari dan terapkan langkah kerja ${stage.title}.`,
                  stage.practiceScenario || `Terapkan konsep pada studi kasus dan validasi hasilnya.`,
                ];

          const stageCheckedCount = checklist.filter(
            (_, cIdx) => !!checklistState[stepNum]?.[cIdx],
          ).length;

          // Video spesifik tahap
          const video = stage.stageVideo;
          const videoQuery = stage.searchQuery || `${stage.title} tutorial`;
          const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
            videoQuery,
          )}`;

          return (
            <div key={`stage-row-${stepNum}`} className="relative z-10 flex items-start gap-4 sm:gap-6">
              {/* Kolom Kiri: Ikon Simpul Kotak Membulat & Garis Vertikal */}
              <div className="shrink-0 pt-2">
                <button
                  type="button"
                  onClick={() => handleCardClick(index, stepNum)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 cursor-pointer ${
                    completed
                      ? "bg-emerald-600 text-white shadow-md border-2 border-emerald-500"
                      : unlocked
                        ? "bg-zinc-950 text-white shadow-md border-2 border-zinc-900 ring-4 ring-zinc-900/10"
                        : "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                  }`}
                  aria-label={`Tahap ${stepNum}`}
                >
                  {completed ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : unlocked ? (
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Kolom Kanan: Kartu Tahap Interaktif */}
              <div
                className={`flex-1 rounded-3xl border transition-all duration-200 overflow-hidden text-left ${
                  completed
                    ? "bg-emerald-50/20 border-emerald-200 shadow-2xs hover:border-emerald-300"
                    : unlocked
                      ? "bg-white border-zinc-900 ring-1 ring-zinc-900/10 shadow-sm"
                      : "bg-zinc-50/80 border-zinc-200 opacity-80"
                }`}
              >
                {/* Header Kartu Tahap */}
                <div
                  onClick={() => handleCardClick(index, stepNum)}
                  className="p-5 sm:p-6 cursor-pointer select-none"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    {/* Badges: Tahap, Durasi, XP */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800 border border-zinc-200">
                        {stage.phaseLabel || `TAHAP ${stepNum}`}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-zinc-600 bg-zinc-50 border border-zinc-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>45 Menit</span>
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-600" />
                        <span>+150 XP</span>
                      </span>
                    </div>

                    {/* Status Badge Kanan Atas */}
                    <div>
                      {completed ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>✓ Tuntas</span>
                        </span>
                      ) : unlocked ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-zinc-950 text-white">
                          <Play className="w-3 h-3 fill-white" />
                          <span>▶ Sedang Dipelajari</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-500 border border-zinc-200">
                          <Lock className="w-3 h-3" />
                          <span>🔒 Terkunci</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Judul & Deskripsi Tahap */}
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                    {stage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed">
                    {stage.shortSummary}
                  </p>

                  {/* Tag Konsep Kunci */}
                  {stage.keyConcepts && stage.keyConcepts.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-3">
                      {stage.keyConcepts.slice(0, 4).map((concept, cIdx) => (
                        <span
                          key={`kc-${stepNum}-${cIdx}`}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-zinc-100 text-zinc-700 border border-zinc-200"
                        >
                          • {concept}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Ringkas & Tombol Detail > */}
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-100 text-xs">
                    <span className="text-zinc-500 font-medium">
                      {unlocked
                        ? "Siap dipelajari sekarang • Klik untuk membuka detail"
                        : "Terkunci • Selesaikan tahap sebelumnya"}
                    </span>
                    <button
                      type="button"
                      className="font-bold text-zinc-950 hover:text-zinc-700 flex items-center gap-1 transition-colors"
                    >
                      <span>{isExpanded ? "Tutup" : "Detail >"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. ACCORDION DETAIL TAHAP SAAT DIKLIK */}
                {isExpanded && unlocked && (
                  <div className="p-5 sm:p-6 bg-zinc-50/70 border-t border-zinc-200 space-y-6 animate-in fade-in duration-200">
                    {/* BAGIAN 1: VIDEO TUTORIAL WAJIB TONTON */}
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs font-bold text-zinc-950 flex items-center gap-1.5 uppercase tracking-wider">
                          <Video className="w-4 h-4 text-zinc-950" />
                          <span>1. Video Tutorial Wajib Tonton Tahap Ini</span>
                        </span>
                        <a
                          href={youtubeSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-zinc-700 hover:text-zinc-950 font-semibold underline flex items-center gap-1"
                        >
                          <span>Cari Video/Subtitle Sendiri di YouTube</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* YouTube Player Embed */}
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-200 shadow-sm">
                        {video?.embedId ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${video.embedId}?rel=0&modestbranding=1`}
                            title={video.title || stage.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-zinc-900 text-zinc-300 text-center space-y-2">
                            <Video className="w-10 h-10 text-zinc-500" />
                            <div className="text-xs font-bold text-white">
                              Tutorial Terverifikasi: {stage.title}
                            </div>
                            <p className="text-[11px] text-zinc-400 max-w-sm">
                              Tonton materi video untuk menjawab kuis pemahaman dan membuka simpul berikutnya.
                            </p>
                            <a
                              href={youtubeSearchUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5"
                            >
                              <span>Buka Tutorial di YouTube</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>

                      {video && (
                        <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center justify-between text-xs gap-3">
                          <div className="space-y-0.5">
                            <div className="font-bold text-zinc-900 line-clamp-1">{video.title}</div>
                            <div className="text-[11px] text-zinc-500">
                              Channel: {video.channel || video.channelName || "Official Tutorial"}
                            </div>
                          </div>
                          {onOpenVideoModal && (
                            <button
                              type="button"
                              onClick={() => onOpenVideoModal(video)}
                              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-full font-semibold text-xs shrink-0 cursor-pointer"
                            >
                              Fokus
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* BAGIAN 2: LANGKAH YANG HARUS DILAKUKAN (HARUS NGAPAIN AJA) */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-950 flex items-center gap-1.5 uppercase tracking-wider">
                          <ListTodo className="w-4 h-4 text-zinc-950" />
                          <span>2. Langkah yang Harus Dilakukan (&quot;Harus Ngapain Aja&quot;)</span>
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {stageCheckedCount}/{checklist.length} Selesai
                        </span>
                      </div>

                      <div className="space-y-2 p-4 bg-white rounded-2xl border border-zinc-200">
                        {checklist.map((actionText, cIdx) => {
                          const isChecked = !!checklistState[stepNum]?.[cIdx];
                          return (
                            <div
                              key={`chk-${stepNum}-${cIdx}`}
                              onClick={() => handleToggleChecklist(stepNum, cIdx)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                                isChecked
                                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                                  : "bg-white border-zinc-200 text-zinc-800 hover:border-zinc-300"
                              }`}
                            >
                              <button
                                type="button"
                                className="mt-0.5 shrink-0 text-zinc-950 cursor-pointer"
                                aria-label={`Tandai langkah ${cIdx + 1}`}
                              >
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-zinc-400" />
                                )}
                              </button>
                              <div className="text-xs leading-relaxed flex-1 select-none">
                                <span className="font-bold mr-1">Langkah {cIdx + 1}:</span>
                                <span className={isChecked ? "line-through text-zinc-500" : ""}>
                                  {actionText}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* BAGIAN 3: RINGKASAN MATERI TAHAP */}
                    {stage.detailedMaterial && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
                          3. Penjelasan Inti Materi Dokumen
                        </span>
                        <div className="p-4 bg-white rounded-2xl border border-zinc-200 text-xs text-zinc-700 leading-relaxed whitespace-pre-line">
                          {stage.detailedMaterial}
                        </div>
                      </div>
                    )}

                    {/* BAGIAN 4: KUIS PEMAHAMAN VIDEO (SYARAT BUKA TAHAP BERIKUTNYA) */}
                    <div className="space-y-4 pt-2 border-t border-zinc-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-zinc-950 flex items-center gap-1.5 uppercase tracking-wider">
                            <HelpCircle className="w-4 h-4 text-zinc-950" />
                            <span>4. Kuis Pemahaman Video (Syarat Buka Tahap Berikutnya)</span>
                          </span>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            Jawab kedua pertanyaan di bawah ini dengan skor 100% (2/2 benar) berdasarkan isi video untuk membuka tahap selanjutnya.
                          </p>
                        </div>
                        {isPassed && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Lulus 100%</span>
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        {questions.map((q, qIdx) => {
                          const selectedOption = stageAnswers[qIdx];
                          const isCorrect = isSubmitted && selectedOption === q.correctIndex;

                          return (
                            <div
                              key={`q-${stepNum}-${qIdx}`}
                              className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-2.5"
                            >
                              <div className="text-xs font-bold text-zinc-900 leading-relaxed">
                                {qIdx + 1}. {q.question}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {q.options.map((opt, oIdx) => {
                                  const isSelected = selectedOption === oIdx;
                                  let btnStyle = "bg-zinc-50 border-zinc-200 hover:border-zinc-400 text-zinc-800";

                                  if (isSubmitted) {
                                    if (oIdx === q.correctIndex) {
                                      btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500";
                                    } else if (isSelected && !isCorrect) {
                                      btnStyle = "bg-rose-50 border-rose-300 text-rose-950 line-through opacity-80";
                                    }
                                  } else if (isSelected) {
                                    btnStyle = "bg-zinc-950 text-white font-bold border-zinc-950";
                                  }

                                  return (
                                    <button
                                      key={`opt-${stepNum}-${qIdx}-${oIdx}`}
                                      type="button"
                                      onClick={() => handleSelectQuizAnswer(stepNum, qIdx, oIdx)}
                                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${btnStyle}`}
                                    >
                                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/5 shrink-0">
                                        {String.fromCharCode(65 + oIdx)}
                                      </span>
                                      <span className="leading-relaxed">{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {isSubmitted && (
                                <div
                                  className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                                    isCorrect
                                      ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                                      : "bg-rose-50 text-rose-900 border border-rose-200"
                                  }`}
                                >
                                  {isCorrect ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <span className="text-rose-600 font-bold shrink-0">✕</span>
                                  )}
                                  <p className="leading-relaxed">{q.explanation}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Tombol Periksa Jawaban / Buka Tahap Berikutnya */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                          <div className="text-xs text-zinc-500">
                            {!isSubmitted ? (
                              <span>Pilih jawaban untuk kedua soal, lalu klik <strong>Periksa Jawaban</strong>.</span>
                            ) : isPassed ? (
                              <span className="text-emerald-700 font-bold">
                                ✓ Skor 100%! Anda siap membuka tahap berikutnya.
                              </span>
                            ) : (
                              <span className="text-rose-600 font-medium">
                                Ada jawaban yang belum tepat. Silakan coba lagi tanpa penalti.
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {isSubmitted && !isPassed && (
                              <button
                                type="button"
                                onClick={() => handleResetQuiz(stepNum)}
                                className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Coba Lagi</span>
                              </button>
                            )}

                            {!isSubmitted ? (
                              <button
                                type="button"
                                onClick={() => handleCheckQuiz(stepNum, questions)}
                                disabled={Object.keys(stageAnswers).length < questions.length}
                                className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-xs"
                              >
                                Periksa Jawaban
                              </button>
                            ) : isPassed ? (
                              <button
                                type="button"
                                onClick={() => handleCompleteStageAndAdvance(index, stepNum)}
                                className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                              >
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>
                                  {index < totalStages - 1
                                    ? `✓ Selesaikan Tahap & Buka Tahap Berikutnya`
                                    : `Tuntaskan Seluruh Modul & Buka Sertifikat 🎓`}
                                </span>
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

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

