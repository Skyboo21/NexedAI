// app/(mahasiswa)/modul/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Lightbulb,
  Layers,
  Code2,
  GraduationCap,
  Check,
  Lock,
  CheckCircle2,
  Target,
  Globe,
  Search,
  Bot,
  Video,
  BookOpen,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ModuleRagChat from "../../../../src/components/ModuleRagChat";
import { LEARNING_TOPICS, type LearningTopic } from "../../../../src/data/learningTopics";
import {
  fetchAIExplanationApi,
  getAdaptiveRecommendations,
  type AdaptiveLearningResponse,
} from "../../../../src/services/apiService";
import {
  getCompletedTopicIds,
  markModuleCompleted,
  saveModuleProgress,
  getModuleProgress,
} from "../../../../src/lib/progressStorage";
import { useAuthStore } from "../../../../src/store/authStore";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: string;
}

const COURSERA_STAGES = [
  {
    step: 1,
    title: "Fondasi Konseptual",
    shortTitle: "Konseptual",
    description: "Silabus, capaian pembelajaran khusus & landasan teori topik.",
    icon: Lightbulb,
  },
  {
    step: 2,
    title: "Komponen & Logika",
    shortTitle: "Logika & Kode",
    description: "Konsep esensial, struktur kode Python/C++ & simulasi eksekusi.",
    icon: Layers,
  },
  {
    step: 3,
    title: "Implementasi & Pengayaan",
    shortTitle: "Praktik & AI",
    description: "Deep-link materi industri terverifikasi, uji diagnostik & AI Tutor.",
    icon: Code2,
  },
  {
    step: 4,
    title: "Kuis Active Recall",
    shortTitle: "Evaluasi",
    description: "Uji pemahaman komprehensif, evaluasi instan & klaim XP.",
    icon: GraduationCap,
  },
];

export default function DynamicModulReaderPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const topicId = rawId ? Number.parseInt(rawId, 10) : 3;

  const currentTopic: LearningTopic =
    LEARNING_TOPICS.find((t) => t.id === topicId) ?? (LEARNING_TOPICS[0] as LearningTopic);

  // Coursera Stepper State (Stages 1..4)
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [stageProgress, setStageProgress] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  // Mobile syllabus accordion collapse state
  const [mobileSyllabusOpen, setMobileSyllabusOpen] = useState<boolean>(false);

  // Overall topics completed
  const [completedTopicIds, setCompletedTopicIds] = useState<number[]>([]);

  // Sub-tab inside Stage 3 (Implementasi & Pengayaan: 'resources' | 'rag' | 'ai')
  const [stage3Tab, setStage3Tab] = useState<"resources" | "rag" | "ai">("resources");

  // Adaptive recommendations state
  const [adaptiveRecs, setAdaptiveRecs] = useState<AdaptiveLearningResponse | null>(null);
  const [isLoadingRecs, setIsLoadingRecs] = useState<boolean>(true);

  // Code runner & copy state
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [runCodeIndex, setRunCodeIndex] = useState<number | null>(null);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Completion modal
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [awardedXp, setAwardedXp] = useState<number>(0);

  // Content scroll target
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Load completed topics
  useEffect(() => {
    try {
      const ids = getCompletedTopicIds();
      setCompletedTopicIds(ids);
    } catch {
      // safe fallback
    }
  }, []);

  // Load per-stage progress for this topic
  useEffect(() => {
    try {
      const savedProgress = getModuleProgress(String(currentTopic.id));
      const savedStages = localStorage.getItem(`stage_progress_${currentTopic.id}`);
      const isTopicDone = completedTopicIds.includes(currentTopic.id);

      if (savedProgress && savedProgress.completedSteps.length > 0) {
        const stageMap: Record<number, boolean> = { 1: false, 2: false, 3: false, 4: false };
        savedProgress.completedSteps.forEach((s) => {
          stageMap[s] = true;
        });
        setStageProgress(stageMap);
        let firstIncomplete = 1;
        for (let s = 1; s <= 4; s++) {
          if (!stageMap[s]) {
            firstIncomplete = s;
            break;
          }
        }
        setCurrentStage(firstIncomplete);
      } else if (savedStages) {
        const parsed = JSON.parse(savedStages) as Record<number, boolean>;
        setStageProgress(parsed);
        // Default to first incomplete stage or stage 1
        let firstIncomplete = 1;
        for (let s = 1; s <= 4; s++) {
          if (!parsed[s]) {
            firstIncomplete = s;
            break;
          }
        }
        setCurrentStage(firstIncomplete);
      } else if (isTopicDone) {
        setStageProgress({ 1: true, 2: true, 3: true, 4: true });
        setCurrentStage(1);
      } else {
        // Stage 1 is start
        setStageProgress({ 1: false, 2: false, 3: false, 4: false });
        setCurrentStage(1);
      }
    } catch {
      setStageProgress({ 1: false, 2: false, 3: false, 4: false });
      setCurrentStage(1);
    }
  }, [currentTopic.id, completedTopicIds]);

  // Initialize initial AI greetings on topic switch
  useEffect(() => {
    setChatMessages([
      {
        id: "initial-msg",
        role: "bot",
        text: `Halo! Saya asisten tutor AI NEXED. Sedang mempelajari materi **"${currentTopic.title}"**? Tanyakan konsep yang belum kamu pahami atau pilih pertanyaan cepat di bawah ini.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setRunCodeIndex(null);
  }, [currentTopic]);

  // Load Adaptive Recommendations from FastAPI
  useEffect(() => {
    let isMounted = true;
    setIsLoadingRecs(true);
    getAdaptiveRecommendations(
      `modul-${currentTopic.id}`,
      currentTopic.title,
      currentTopic.keyConcepts.map((k) => k.subtitle).join(", "),
    )
      .then((data) => {
        if (isMounted) {
          setAdaptiveRecs(data);
          setIsLoadingRecs(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingRecs(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentTopic]);

  // Auto scroll chat
  useEffect(() => {
    if (currentStage === 3 && stage3Tab === "ai") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isAiTyping, currentStage, stage3Tab]);

  const handleCopyCode = (code: string, index: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCodeIndex(index);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || chatInput;
    if (!textToSend.trim() || isAiTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setChatInput("");
    setIsAiTyping(true);

    try {
      const apiResponse = await fetchAIExplanationApi(textToSend);
      let responseText = apiResponse.message;

      const lower = textToSend.toLowerCase();
      if (lower.includes("analogi") || lower.includes("sehari-hari")) {
        if (currentTopic.id === 3) {
          responseText = `**Analogi Kehidupan Nyata (Looping):**\n\n• **FOR Loop** seperti menekan tombol dispenser air untuk mengisi 5 botol minum secara berurutan. Kamu sudah tahu persis jumlah botolnya (5).\n• **WHILE Loop** seperti mengisi bak mandi hingga pelampung batas air naik. Kamu tidak menghitung berapa liter air mengalir, yang penting berhenti saat bak sudah penuh!`;
        } else if (currentTopic.id === 2) {
          responseText = `**Analogi Kehidupan Nyata (Kondisional):**\n\nKondisional itu seperti lampu lalu lintas! JIKA lampu berwarna HIJAU, mobil melaju. JIKA KUNING, hati-hati. SELAIN ITU (MERAH), mobil harus berhenti total.`;
        } else {
          responseText = `**Analogi Konseptual:**\nKonsep "${currentTopic.title}" ibarat resep memasak langkah-demi-langkah. Setiap instruksi harus jelas, runut, dan memiliki hasil akhir yang terukur.`;
        }
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: `Terjadi kendala jaringan saat meminta respons AI. Namun untuk materi **${currentTopic.title}**, silakan pelajari kembali konsep utama pada tab Materi Pembelajaran.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleCompleteTopic = () => {
    // Mark stage 4 complete as well
    const updatedStages = { ...stageProgress, 4: true };
    setStageProgress(updatedStages);
    try {
      localStorage.setItem(`stage_progress_${currentTopic.id}`, JSON.stringify(updatedStages));
    } catch {}

    const alreadyDone = completedTopicIds.includes(currentTopic.id);
    const xpReward = alreadyDone ? 0 : currentTopic.xp;

    const correctAnswersCount = Object.entries(selectedAnswers).filter(
      ([idx, ans]) => ans === currentTopic.quiz[Number(idx)]?.correctIndex,
    ).length;
    const score =
      currentTopic.quiz.length > 0
        ? Math.round((correctAnswersCount / currentTopic.quiz.length) * 100)
        : 100;

    markModuleCompleted(String(currentTopic.id), currentTopic.title, xpReward, score);

    if (xpReward > 0) {
      useAuthStore.getState().addXp(xpReward);
    }

    if (!alreadyDone) {
      const updated = [...completedTopicIds, currentTopic.id];
      setCompletedTopicIds(updated);
      setAwardedXp(xpReward);
    } else {
      setAwardedXp(0);
    }

    setShowCompletionModal(true);
  };

  const handleNextTopic = () => {
    setShowCompletionModal(false);
    const nextTopic = LEARNING_TOPICS.find((t) => t.id === currentTopic.id + 1);
    if (nextTopic) {
      router.push(`/modul/${nextTopic.id}`);
    } else {
      router.push("/dashboard");
    }
  };

  // Coursera Progress Calculations
  const completedStagesCount = [1, 2, 3, 4].filter((s) => stageProgress[s]).length;
  const progressPercent = Math.round((completedStagesCount / 4) * 100);

  const getFirstIncompleteStage = (): number => {
    for (let s = 1; s <= 4; s++) {
      if (!stageProgress[s]) return s;
    }
    return 4;
  };

  const handleContinueLearning = () => {
    const nextIncomplete = getFirstIncompleteStage();
    setCurrentStage(nextIncomplete);
    contentAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Mark current stage as understood & advance to next stage
  const handleMarkStageAndAdvance = (stageNum: number) => {
    const updated = { ...stageProgress, [stageNum]: true };
    setStageProgress(updated);
    try {
      localStorage.setItem(`stage_progress_${currentTopic.id}`, JSON.stringify(updated));
    } catch {}

    const completedSteps = [1, 2, 3, 4].filter((s) => updated[s]);
    saveModuleProgress({
      moduleId: String(currentTopic.id),
      title: currentTopic.title,
      completedSteps,
      progressPercent: Math.round((completedSteps.length / 4) * 100),
      isCompleted: completedSteps.length === 4,
      xpEarned: completedSteps.length === 4 ? currentTopic.xp : 0,
      lastUpdated: new Date().toISOString(),
    });

    if (stageNum < 4) {
      setCurrentStage(stageNum + 1);
      contentAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      handleCompleteTopic();
    }
  };

  // Gated stage selection: stage 1 is open, subsequent stages unlock if current stage is reached or previous is completed
  const isStageUnlocked = (stageNum: number): boolean => {
    if (stageNum === 1) return true;
    if (stageProgress[stageNum] || stageProgress[stageNum - 1]) return true;
    // Allow if all prior stages completed
    for (let s = 1; s < stageNum; s++) {
      if (!stageProgress[s]) return false;
    }
    return true;
  };

  const isCompleted = completedTopicIds.includes(currentTopic.id);

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-black font-['Inter',sans-serif] antialiased flex flex-col overflow-x-hidden">
      {/* Course Header Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-black/8 sticky top-0 z-30 px-4 sm:px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/modul"
              className="min-h-[44px] flex items-center text-xs font-medium px-4 py-2 rounded-full bg-[#F4F4F6] hover:bg-neutral-200 text-black transition-colors border border-black/8 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Katalog Modul</span>
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
                <span className="text-black font-semibold">{currentTopic.courseName}</span>
                <span>&bull;</span>
                <span>{currentTopic.meeting}</span>
              </div>
              <h1 className="text-base sm:text-lg font-light text-black tracking-tight">
                {currentTopic.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-600 bg-[#F4F4F6] px-3.5 py-1.5 rounded-full border border-black/8 font-medium">
              <span className="font-semibold text-black">Dosen:</span>
              <span>{currentTopic.lecturer}</span>
            </div>
            <div className="bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1">
              <span>+{currentTopic.xp} XP</span>
            </div>
          </div>
        </div>

        {/* COURSERA REACTIVE PROGRESS BAR */}
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-black/8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-1 max-w-md">
              <div className="flex justify-between items-center text-xs mb-1 font-mono">
                <span className="font-bold text-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {completedStagesCount} dari 4 Tahap Selesai • {progressPercent}%
                  </span>
                </span>
                <span className="text-neutral-500 text-[11px]">
                  {progressPercent === 100 ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <Check className="w-3 h-3" /> Tuntas
                    </span>
                  ) : (
                    "Aktif"
                  )}
                </span>
              </div>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-black h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinueLearning}
            className="min-h-[44px] px-5 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Lanjutkan Belajar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div
        ref={contentAreaRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex flex-col lg:flex-row gap-6 pb-28 md:pb-8"
      >
        {/* LEFT COLUMN: SILABUS ALA COURSERA */}
        <aside className="w-full lg:w-80 shrink-0 space-y-4 lg:sticky lg:top-28 lg:self-start">
          {/* Mobile Collapsible Accordion Header */}
          <div className="lg:hidden bg-white border border-black/8 rounded-2xl p-3 shadow-xs">
            <button
              type="button"
              onClick={() => setMobileSyllabusOpen(!mobileSyllabusOpen)}
              className="w-full flex items-center justify-between min-h-[44px] text-xs font-medium text-black px-1 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-mono flex items-center justify-center">
                  {currentStage}
                </span>
                <div className="text-left">
                  <div className="text-[10px] text-neutral-500 font-mono">Silabus Belajar</div>
                  <div className="font-semibold text-xs">
                    Tahap {currentStage}: {COURSERA_STAGES[currentStage - 1]?.title}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-neutral-500">
                <span className="text-[11px] font-mono font-bold text-black">{progressPercent}%</span>
                {mobileSyllabusOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
          </div>

          {/* Stepper Card (Visible on Desktop OR when Mobile Accordion is Open) */}
          <div
            className={`bg-white border border-black/8 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-black/20 transition-all duration-300 ${
              mobileSyllabusOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/8">
              <div>
                <h2 className="text-black font-semibold text-xs uppercase tracking-wider">
                  Alur Silabus Coursera
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  4 Tahap Terstruktur Menuju Penguasaan
                </p>
              </div>
              <span className="text-[10px] font-mono text-black bg-[#F4F4F6] border border-black/10 px-2.5 py-1 rounded-full">
                {completedStagesCount}/4 Tuntas
              </span>
            </div>

            {/* Stepper List */}
            <div className="space-y-2.5" role="list">
              {COURSERA_STAGES.map((st) => {
                const isCurrent = currentStage === st.step;
                const isDone = !!stageProgress[st.step];
                const unlocked = isStageUnlocked(st.step);

                let badgeStyle = "bg-[#F4F4F6] text-neutral-600 border-black/10";
                if (isDone) {
                  badgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-300";
                } else if (isCurrent) {
                  badgeStyle = "bg-black text-white border-black";
                }

                return (
                  <button
                    key={`step-${st.step}`}
                    type="button"
                    onClick={() => {
                      if (unlocked) {
                        setCurrentStage(st.step);
                        setMobileSyllabusOpen(false);
                      }
                    }}
                    disabled={!unlocked}
                    className={`w-full text-left p-3.5 rounded-2xl min-h-[44px] transition-all border flex items-start gap-3 cursor-pointer ${
                      isCurrent
                        ? "bg-black text-white border-black shadow-xs ring-2 ring-black/10"
                        : unlocked
                        ? "bg-white border-black/8 hover:bg-[#F4F4F6] text-neutral-800"
                        : "bg-neutral-50/70 border-neutral-200/60 text-neutral-400 cursor-not-allowed opacity-60"
                    }`}
                  >
                    {/* Status Circle / Badge */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 border ${
                        isDone
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : isCurrent
                          ? "bg-white text-black border-white"
                          : unlocked
                          ? badgeStyle
                          : "bg-neutral-200 text-neutral-400 border-neutral-300"
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : unlocked ? (
                        st.step
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                            isCurrent ? "text-neutral-300" : isDone ? "text-emerald-700" : "text-neutral-500"
                          }`}
                        >
                          Tahap {st.step}
                        </span>
                        {isDone && (
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                              isCurrent
                                ? "bg-neutral-800 text-emerald-400 border-neutral-700"
                                : "bg-emerald-100 text-emerald-800 border-emerald-300"
                            }`}
                          >
                            <Check className="w-2.5 h-2.5" /> Selesai
                          </span>
                        )}
                        {!unlocked && (
                          <span className="text-[9px] font-mono text-neutral-400">
                            Terkunci
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold truncate">{st.title}</div>
                      <div
                        className={`text-[11px] leading-snug line-clamp-1 mt-0.5 ${
                          isCurrent ? "text-neutral-300" : "text-neutral-500"
                        }`}
                      >
                        {st.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Other Topics in Syllabus */}
            <div className="mt-6 pt-4 border-t border-black/8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                  Modul Lainnya
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {completedTopicIds.length} / {LEARNING_TOPICS.length} Topik
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {LEARNING_TOPICS.map((topic) => {
                  const isActive = topic.id === currentTopic.id;
                  const done = completedTopicIds.includes(topic.id);
                  return (
                    <Link
                      key={topic.id}
                      href={`/modul/${topic.id}`}
                      className={`block p-2.5 rounded-xl text-xs transition-all border ${
                        isActive
                          ? "bg-[#F4F4F6] border-black/20 text-black font-semibold"
                          : "bg-white border-transparent hover:bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{topic.title}</span>
                        {done && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col gap-5 min-w-0">
          {/* STAGE STEPPER PILL TABS (DESKTOP & TABLET QUICK SWITCH) */}
          <div
            className="bg-white p-1.5 rounded-full border border-black/8 shadow-xs flex gap-1.5 overflow-x-auto"
            role="tablist"
          >
            {COURSERA_STAGES.map((st) => {
              const isCurrent = currentStage === st.step;
              const isDone = !!stageProgress[st.step];
              const unlocked = isStageUnlocked(st.step);
              const StageIcon = st.icon;

              return (
                <button
                  key={`tab-${st.step}`}
                  type="button"
                  role="tab"
                  disabled={!unlocked}
                  aria-selected={isCurrent}
                  onClick={() => unlocked && setCurrentStage(st.step)}
                  className={`flex-1 min-h-[44px] py-2 px-3 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? "bg-black text-white shadow-xs font-semibold"
                      : unlocked
                      ? "text-neutral-600 hover:bg-[#F4F4F6] hover:text-black"
                      : "text-neutral-300 cursor-not-allowed"
                  }`}
                >
                  <StageIcon className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">Tahap {st.step}:</span>
                  <span>{st.shortTitle}</span>
                  {isDone && (
                    <span
                      className={`p-0.5 rounded-full ${
                        isCurrent ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* TAHAP 1: FONDASI KONSEPTUAL */}
          {/* ======================================================== */}
          {currentStage === 1 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Stage Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/8 shadow-xs hover:border-black/20 transition-all space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/8">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-xs px-3 py-1 rounded-full">
                      Tahap 1 dari 4
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      Fondasi Konseptual & Landasan Teori
                    </span>
                  </div>
                  {stageProgress[1] && (
                    <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tahap Selesai</span>
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-light text-black tracking-tight">
                    Pengantar & Capaian Pembelajaran: {currentTopic.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                    Sebelum masuk ke sintaks dan baris kode praktis, bangun terlebih dahulu pemahaman intuitif
                    mengenai esensi dan batasan logika algoritma pada topik ini.
                  </p>
                </div>
              </div>

              {/* Capaian Pembelajaran Khusus */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-black text-white text-xs flex items-center justify-center font-bold">
                    <Target className="w-4 h-4 text-white" />
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-black">
                    Capaian Pembelajaran Khusus (Course Learning Outcomes)
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700">
                  {currentTopic.learningOutcomes.map((outcome, i) => (
                    <li key={`outcome-${i}`} className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAFAFA] border border-black/5">
                      <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Analogi Kehidupan Nyata / Intuitive Explanation */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#F4F4F6] text-black text-xs flex items-center justify-center font-bold border border-black/10">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-black">
                    Intuisi Konsep & Cara Berpikir Komputasional
                  </h3>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F4F6] border border-black/8 text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-2">
                  <p>
                    Dalam dunia komputasi, <strong>{currentTopic.title}</strong> dirancang untuk menyelesaikan masalah
                    pengolahan data secara deterministik dan efisien. Jangan menghafal kode di luar kepala; fokuslah
                    pada <em>kapan</em> pola ini harus diterapkan dan <em>bagaimana alur eksekusinya</em> bekerja di memori sistem.
                  </p>
                  <p className="text-neutral-500 text-xs">
                    Tips: Lanjutkan ke Tahap 2 untuk melihat bedah komponen kode langkah demi langkah.
                  </p>
                </div>
              </div>

              {/* STAGE 1 BOTTOM ACTION */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleMarkStageAndAdvance(1)}
                  className="min-h-[44px] px-7 py-3 bg-black hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="flex items-center gap-1.5">
                    {stageProgress[1] ? (
                      "Lanjut ke Tahap 2: Komponen & Logika"
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Tandai Paham & Lanjut
                      </>
                    )}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAHAP 2: STRUKTUR KOMPONEN & LOGIKA */}
          {/* ======================================================== */}
          {currentStage === 2 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Stage Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/8 shadow-xs hover:border-black/20 transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/8">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-xs px-3 py-1 rounded-full">
                      Tahap 2 dari 4
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      Struktur Komponen & Logika Kode
                    </span>
                  </div>
                  {stageProgress[2] && (
                    <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tahap Selesai</span>
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-light text-black tracking-tight">
                  Eksplorasi Konsep Inti & Kode Interaktif
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Pelajari setiap komponen sintaks di bawah ini. Anda dapat menyalin kode atau menekan tombol
                  <strong> &quot;Jalankan&quot;</strong> untuk melihat simulasi output eksekusi konsol langsung di peramban.
                </p>
              </div>

              {/* Key Concepts List with Interactive Code */}
              {currentTopic.keyConcepts.map((concept, idx) => (
                <div
                  key={`concept-${idx}`}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all duration-300 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-black text-white text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-medium text-black">{concept.subtitle}</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                    {concept.explanation}
                  </p>

                  {/* Code Snippet Box */}
                  {concept.codeSnippet && (
                    <div className="rounded-2xl border border-black/15 bg-neutral-950 text-neutral-100 overflow-hidden text-xs">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800">
                        <span className="text-[11px] font-mono text-neutral-400 font-bold">Python 3.x</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(concept.codeSnippet || "", idx)}
                            className="min-h-[32px] px-3 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-colors cursor-pointer"
                          >
                            {copiedCodeIndex === idx ? (
                              <span className="flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400" /> Tersalin
                              </span>
                            ) : (
                              "Salin Kode"
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setRunCodeIndex(idx)}
                            className="min-h-[32px] px-3 py-1 rounded-full bg-white hover:bg-neutral-200 text-black text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Jalankan
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 font-mono text-xs overflow-x-auto text-emerald-400">
                        {concept.codeSnippet}
                      </pre>

                      {/* Simulated Execution Output */}
                      {runCodeIndex === idx && concept.codeOutput && (
                        <div className="p-3.5 bg-neutral-950 border-t border-neutral-800 text-[11px] font-mono">
                          <span className="text-neutral-500 block mb-1">Output Konsol:</span>
                          <span className="text-neutral-200 whitespace-pre-wrap">
                            {concept.codeOutput}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* STAGE 2 BOTTOM ACTION */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStage(1)}
                  className="min-h-[44px] px-5 py-2.5 rounded-full border border-black/10 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Tahap 1</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkStageAndAdvance(2)}
                  className="min-h-[44px] px-7 py-3 bg-black hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="flex items-center gap-1.5">
                    {stageProgress[2] ? (
                      "Lanjut ke Tahap 3: Praktik & AI"
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Tandai Paham & Lanjut
                      </>
                    )}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAHAP 3: PRAKTIK, IMPLEMENTASI & PENGAYAAN AI */}
          {/* ======================================================== */}
          {currentStage === 3 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Stage Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/8 shadow-xs hover:border-black/20 transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/8">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-xs px-3 py-1 rounded-full">
                      Tahap 3 dari 4
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      Praktik, Implementasi Kasus & Pendampingan AI
                    </span>
                  </div>
                  {stageProgress[3] && (
                    <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tahap Selesai</span>
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-light text-black tracking-tight">
                  Pengayaan Eksternal & Eksplorasi Interaktif
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Perluas wawasan Anda dengan materi deep-link kurasi video YouTube dan dokumentasi teknis,
                  atau konsultasikan materi yang masih membingungkan dengan Asisten RAG dan Tutor AI.
                </p>

                {/* Sub-tabs for Stage 3 */}
                <div className="pt-2 flex gap-2 border-b border-black/8 overflow-x-auto pb-1" role="tablist">
                  <button
                    type="button"
                    onClick={() => setStage3Tab("resources")}
                    className={`min-h-[44px] px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer flex items-center gap-2 ${
                      stage3Tab === "resources"
                        ? "bg-black text-white shadow-xs"
                        : "bg-[#F4F4F6] text-neutral-600 hover:text-black border border-black/10"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Materi Pengayaan (Deep-Link)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage3Tab("rag")}
                    className={`min-h-[44px] px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer flex items-center gap-2 ${
                      stage3Tab === "rag"
                        ? "bg-black text-white shadow-xs"
                        : "bg-[#F4F4F6] text-neutral-600 hover:text-black border border-black/10"
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Asisten RAG Modul</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage3Tab("ai")}
                    className={`min-h-[44px] px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer flex items-center gap-2 ${
                      stage3Tab === "ai"
                        ? "bg-black text-white shadow-xs"
                        : "bg-[#F4F4F6] text-neutral-600 hover:text-black border border-black/10"
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Asisten Tutor AI</span>
                  </button>
                </div>
              </div>

              {/* SUB-VIEW 1: REKOMENDASI MATERI PENGAYAAN */}
              {stage3Tab === "resources" && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all duration-300 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          AI Adaptive Learning
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>Direct Deep-Links Terverifikasi</span>
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-600" />
                        <span>Rekomendasi Materi Pengayaan (AI Curated)</span>
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Deep-link video tutorial spesifik dan dokumentasi teknis resmi yang dikurasi langsung untuk topik &ldquo;{currentTopic.title}&rdquo;.
                      </p>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  {isLoadingRecs ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                      <div className="p-5 rounded-2xl border border-black/8 bg-[#FAFAFA] animate-pulse space-y-3">
                        <div className="h-4 bg-neutral-200 rounded w-1/3" />
                        <div className="h-5 bg-neutral-200 rounded w-3/4" />
                        <div className="h-3 bg-neutral-200 rounded w-full" />
                      </div>
                      <div className="p-5 rounded-2xl border border-black/8 bg-[#FAFAFA] animate-pulse space-y-3">
                        <div className="h-4 bg-neutral-200 rounded w-1/3" />
                        <div className="h-5 bg-neutral-200 rounded w-3/4" />
                        <div className="h-3 bg-neutral-200 rounded w-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {adaptiveRecs?.external_resources.map((item, rIdx) => {
                        const isVideo =
                          item.type.toLowerCase().includes("youtube") ||
                          item.type.toLowerCase().includes("video");

                        return (
                          <div
                            key={`ext-resource-${rIdx}`}
                            className="p-5 rounded-2xl border border-black/8 bg-[#FAFAFA] hover:bg-white hover:border-black/20 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
                          >
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                                    isVideo
                                      ? "bg-rose-50 text-rose-700 border-rose-200"
                                      : "bg-[#F4F4F6] text-black border-black/10"
                                  }`}
                                >
                                  {isVideo ? (
                                    <>
                                      <Video className="w-3.5 h-3.5 text-rose-600" />
                                      <span>YouTube</span>
                                    </>
                                  ) : (
                                    <>
                                      <BookOpen className="w-3.5 h-3.5 text-slate-700" />
                                      <span>Dokumentasi</span>
                                    </>
                                  )}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                                  <Clock className="w-3 h-3 text-neutral-400" />
                                  <span>{item.duration}</span>
                                </span>
                              </div>
                              <h5 className="text-xs sm:text-sm font-bold text-black leading-snug line-clamp-2">
                                {item.title}
                              </h5>
                              <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                                {item.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-black/8 flex items-center justify-between">
                              <span className="text-[10px] font-mono text-neutral-400 truncate max-w-[140px] sm:max-w-[180px]">
                                {item.url.replace(/^https?:\/\//, "")}
                              </span>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-[44px] px-4 py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                              >
                                <span>Buka Materi</span>
                                <span className="text-[10px]">&nearr;</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Diagnostic Active Recall Questions */}
                  {adaptiveRecs?.diagnostic_questions && adaptiveRecs.diagnostic_questions.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F4F6] border border-black/8 space-y-2">
                      <span className="text-[11px] font-mono font-bold text-black flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Uji Diagnostik Refleksi Pemahaman:</span>
                      </span>
                      <ul className="space-y-1.5 text-xs text-neutral-700 pl-1">
                        {adaptiveRecs.diagnostic_questions.map((q, qIdx) => (
                          <li key={`diag-q-${qIdx}`} className="flex items-start gap-2">
                            <span className="font-bold text-black mt-0.5">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-VIEW 2: RAG ASSISTANT */}
              {stage3Tab === "rag" && (
                <div className="space-y-2">
                  <ModuleRagChat
                    defaultModuleId={`modul-${currentTopic.id}`}
                    defaultModuleName={currentTopic.title}
                  />
                </div>
              )}

              {/* SUB-VIEW 3: AI TUTOR CHAT */}
              {stage3Tab === "ai" && (
                <div className="bg-white rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all duration-300 flex flex-col h-[600px] overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-black/8 bg-[#F4F4F6]/50 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-black">
                        NEXED Tutor AI Dialogis
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        Bimbingan dialogis topik &ldquo;{currentTopic.title}&rdquo;
                      </p>
                    </div>
                    <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-[11px] px-2.5 py-0.5 rounded-full">
                      Aktif
                    </span>
                  </div>

                  {/* Chat Message List */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAFAFA]">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                            msg.role === "user"
                              ? "bg-black text-white shadow-xs"
                              : "bg-white text-neutral-800 border border-black/8 shadow-xs"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-1 px-1">{msg.timestamp}</span>
                      </div>
                    ))}

                    {isAiTyping && (
                      <div className="flex items-center gap-2 text-xs text-neutral-500 bg-white border border-black/8 rounded-2xl px-3 py-2 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                        <span>NEXED AI sedang menyusun penjelasan...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Suggested Questions */}
                  <div className="p-3 bg-white border-t border-black/8 flex gap-2 overflow-x-auto">
                    {currentTopic.suggestedQuestions.map((q, idx) => (
                      <button
                        key={`sug-${idx}`}
                        type="button"
                        onClick={() => handleSendMessage(q)}
                        className="text-[11px] text-neutral-700 hover:text-black bg-[#F4F4F6] hover:bg-neutral-200 border border-black/8 px-3.5 py-1.5 rounded-full shrink-0 transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Input Box */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="p-3 bg-white border-t border-black/8 flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Tanyakan konsep atau minta analogi sehari-hari..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-[#FAFAFA] border border-black/10 rounded-full text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isAiTyping}
                      className="min-h-[44px] px-5 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 text-white font-medium text-xs rounded-full transition-all shadow-xs cursor-pointer"
                    >
                      Kirim
                    </button>
                  </form>
                </div>
              )}

              {/* STAGE 3 BOTTOM ACTION */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStage(2)}
                  className="min-h-[44px] px-5 py-2.5 rounded-full border border-black/10 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Tahap 2</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkStageAndAdvance(3)}
                  className="min-h-[44px] px-7 py-3 bg-black hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="flex items-center gap-1.5">
                    {stageProgress[3] ? (
                      "Lanjut ke Tahap 4: Kuis Evaluasi"
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Tandai Paham & Lanjut
                      </>
                    )}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAHAP 4: PENGUJIAN & KUIS EVALUASI (ACTIVE RECALL) */}
          {/* ======================================================== */}
          {currentStage === 4 && (
            <div className="bg-white rounded-3xl border border-black/8 p-6 sm:p-8 shadow-xs hover:border-black/20 transition-all duration-300 space-y-6 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/8">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-xs px-3 py-1 rounded-full">
                      Tahap 4 dari 4
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      Uji Kompetensi & Active Recall
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-light text-black mt-2">
                    Evaluasi Pemahaman Konsep ({currentTopic.quiz.length} Soal)
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Pilihlah salah satu jawaban yang paling tepat untuk memvalidasi pemahaman materi Anda.
                  </p>
                </div>
                {isCompleted && (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Modul Telah Tuntas</span>
                  </span>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {currentTopic.quiz.map((q, qIndex) => {
                  const selected = selectedAnswers[qIndex];
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div
                      key={`quiz-${qIndex}`}
                      className="p-5 rounded-2xl border border-black/8 bg-[#FAFAFA] space-y-3"
                    >
                      <h4 className="text-xs sm:text-sm font-medium text-black">
                        {qIndex + 1}. {q.question}
                      </h4>

                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isOptionSelected = selected === optIndex;
                          let optionClass =
                            "bg-white border-black/10 text-neutral-700 hover:bg-neutral-100";

                          if (quizSubmitted) {
                            if (optIndex === q.correctIndex) {
                              optionClass =
                                "bg-black text-white font-medium border-black";
                            } else if (isOptionSelected) {
                              optionClass = "bg-neutral-200 border-neutral-300 text-neutral-600 line-through";
                            }
                          } else if (isOptionSelected) {
                            optionClass =
                              "bg-black text-white font-medium border-black";
                          }

                          return (
                            <button
                              key={`opt-${optIndex}`}
                              type="button"
                              disabled={quizSubmitted}
                              onClick={() =>
                                setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
                              }
                              className={`w-full text-left p-3.5 min-h-[44px] rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionClass}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIndex === q.correctIndex && (
                                <span className="text-white font-mono text-[10px] bg-neutral-800 px-2 py-0.5 rounded-full shrink-0 ml-2 flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Benar</span>
                                </span>
                              )}
                              {quizSubmitted && isOptionSelected && optIndex !== q.correctIndex && (
                                <span className="text-black font-mono text-[10px] bg-neutral-300 px-2 py-0.5 rounded-full shrink-0 ml-2">
                                  Salah
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-3.5 rounded-xl text-xs bg-white border border-black/10 text-neutral-700">
                          <span className="font-semibold block mb-1 text-black">
                            {isCorrect ? "Jawaban Anda Benar" : "Penjelasan Jawaban:"}
                          </span>
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Submit Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-black/8">
                <button
                  type="button"
                  onClick={() => setCurrentStage(3)}
                  className="min-h-[44px] px-5 py-2.5 rounded-full border border-black/10 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-medium transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Tahap 3</span>
                </button>

                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(selectedAnswers).length < currentTopic.quiz.length}
                    className="min-h-[44px] px-6 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 text-white font-medium text-xs sm:text-sm rounded-full shadow-xs transition-all cursor-pointer"
                  >
                    Kirim Jawaban Kuis
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedAnswers({});
                      }}
                      className="min-h-[44px] px-5 py-2.5 bg-[#F4F4F6] hover:bg-neutral-200 text-black text-xs font-medium rounded-full cursor-pointer border border-black/8"
                    >
                      Ulangi Kuis
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteTopic}
                      className="min-h-[44px] px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-medium rounded-full shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{isCompleted ? "Topik Tuntas • Buka Rekap" : "Selesaikan Modul & Klaim XP"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="md:hidden fixed bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-md border-t border-black/10 z-40 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-neutral-500">
              Tahap {currentStage}/4 • {progressPercent}%
            </span>
            <div className="w-24 bg-neutral-200 h-1.5 rounded-full overflow-hidden mt-0.5">
              <div
                className="bg-black h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {currentStage < 4 ? (
            <button
              type="button"
              onClick={() => handleMarkStageAndAdvance(currentStage)}
              className="min-h-[44px] px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{stageProgress[currentStage] ? "Lanjut Tahap" : "Tandai Paham & Lanjut"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!quizSubmitted) {
                  setQuizSubmitted(true);
                } else {
                  handleCompleteTopic();
                }
              }}
              className="min-h-[44px] px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {quizSubmitted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Klaim +{currentTopic.xp} XP</span>
                </>
              ) : (
                <span>Kirim Jawaban Kuis</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl text-center space-y-4 border border-black/10 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-light text-black">Selamat! Topik Tuntas</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Anda telah menyelesaikan seluruh 4 tahap materi dan evaluasi pada topik{" "}
              <strong>{currentTopic.title}</strong>.
            </p>

            {awardedXp > 0 && (
              <div className="py-2 px-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-medium text-xs inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>+{awardedXp} XP Berhasil Ditambahkan</span>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleNextTopic}
                className="w-full min-h-[44px] py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Lanjut ke Topik Berikutnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full min-h-[44px] py-2.5 rounded-full bg-[#F4F4F6] hover:bg-neutral-200 text-black font-medium text-xs transition-colors cursor-pointer border border-black/8"
              >
                Kembali ke Dashboard Mahasiswa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
