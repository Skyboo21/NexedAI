// app/(mahasiswa)/modul/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ModuleRagChat from "../../../../src/components/ModuleRagChat";
import { LEARNING_TOPICS, type LearningTopic } from "../../../../src/data/learningTopics";
import { fetchAIExplanationApi } from "../../../../src/services/apiService";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function DynamicModulReaderPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const topicId = rawId ? Number.parseInt(rawId, 10) : 3;

  const currentTopic: LearningTopic =
    LEARNING_TOPICS.find((t) => t.id === topicId) ?? (LEARNING_TOPICS[0] as LearningTopic);

  const [activeTab, setActiveTab] = useState<"materi" | "rag" | "ai" | "kuis">("materi");
  const [completedTopicIds, setCompletedTopicIds] = useState<number[]>([]);

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

  // Load completed topics
  useEffect(() => {
    try {
      const saved = localStorage.getItem("completed_topics");
      if (saved) {
        setCompletedTopicIds(JSON.parse(saved));
      } else {
        const defaultCompleted = [1, 2];
        localStorage.setItem("completed_topics", JSON.stringify(defaultCompleted));
        setCompletedTopicIds(defaultCompleted);
      }
    } catch {
      // safe fallback
    }
  }, []);

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

  // Auto scroll chat
  useEffect(() => {
    if (activeTab === "ai") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isAiTyping, activeTab]);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
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
          responseText = `💡 **Analogi Kehidupan Nyata (Looping):**\n\n• **FOR Loop** seperti menekan tombol dispenser air untuk mengisi 5 botol minum secara berurutan. Kamu sudah tahu persis jumlah botolnya (5).\n• **WHILE Loop** seperti mengisi bak mandi hingga pelampung batas air naik. Kamu tidak menghitung berapa liter air mengalir, yang penting berhenti saat bak sudah penuh!`;
        } else if (currentTopic.id === 2) {
          responseText = `💡 **Analogi Kehidupan Nyata (Kondisional):**\n\nKondisional itu seperti lampu lalu lintas! JIKA lampu berwarna HIJAU, mobil melaju. JIKA KUNING, hati-hati. SELAIN ITU (MERAH), mobil harus berhenti total.`;
        } else {
          responseText = `💡 **Analogi Konseptual:**\nKonsep "${currentTopic.title}" ibarat resep memasak langkah-demi-langkah. Setiap instruksi harus jelas, runut, dan memiliki hasil akhir yang terukur.`;
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
    if (!completedTopicIds.includes(currentTopic.id)) {
      const updated = [...completedTopicIds, currentTopic.id];
      setCompletedTopicIds(updated);
      try {
        localStorage.setItem("completed_topics", JSON.stringify(updated));
      } catch {
        // safe
      }
      setAwardedXp(currentTopic.xp);
      setShowCompletionModal(true);
    } else {
      setShowCompletionModal(true);
      setAwardedXp(0);
    }
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

  const isCompleted = completedTopicIds.includes(currentTopic.id);

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-black font-['Inter',sans-serif] antialiased flex flex-col">
      {/* Header Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-black/8 sticky top-0 z-30 px-4 sm:px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/modul"
              className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-[#F4F4F6] hover:bg-neutral-200 text-black transition-colors border border-black/8"
            >
              &larr; Katalog Modul
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

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-600 bg-[#F4F4F6] px-3.5 py-1.5 rounded-full border border-black/8 font-medium">
              <span className="font-semibold text-black">Dosen:</span>
              <span>{currentTopic.lecturer}</span>
            </div>
            <div className="bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1">
              <span>+{currentTopic.xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Silabus Perkuliahan */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-xs hover:border-black/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-neutral-500 font-medium text-xs uppercase tracking-wider">
                Silabus Modul
              </h2>
              <span className="text-[10px] font-mono text-black bg-[#F4F4F6] border border-black/10 px-2 py-0.5 rounded-full">
                {completedTopicIds.length} / {LEARNING_TOPICS.length} Tuntas
              </span>
            </div>

            <nav className="space-y-1.5" aria-label="Daftar Modul">
              {LEARNING_TOPICS.map((topic) => {
                const isActive = topic.id === currentTopic.id;
                const done = completedTopicIds.includes(topic.id);

                return (
                  <Link
                    key={topic.id}
                    href={`/modul/${topic.id}`}
                    className={`block p-3 rounded-2xl text-xs transition-all border ${
                      isActive
                        ? "bg-black border-black text-white font-medium shadow-xs"
                        : "bg-white border-transparent hover:bg-[#F4F4F6] text-neutral-700 font-normal"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] ${isActive ? "text-white/60" : "text-neutral-500"}`}>{topic.meeting}</span>
                      {done && (
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${isActive ? "bg-neutral-800 text-white border-white/20" : "bg-[#F4F4F6] text-black border-black/10"}`}>
                          ✓ Selesai
                        </span>
                      )}
                    </div>
                    <div className="truncate font-medium">{topic.title}</div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Right Main Column: Tab Contents */}
        <main className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Navigation Tabs */}
          <div
            className="bg-white p-1.5 rounded-full border border-black/8 shadow-xs flex gap-1.5"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "materi"}
              onClick={() => setActiveTab("materi")}
              className={`flex-1 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === "materi"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:bg-[#F4F4F6] hover:text-black"
              }`}
            >
              Materi & Konsep
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "rag"}
              onClick={() => setActiveTab("rag")}
              className={`flex-1 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === "rag"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:bg-[#F4F4F6] hover:text-black"
              }`}
            >
              Asisten RAG Modul
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "ai"}
              onClick={() => setActiveTab("ai")}
              className={`flex-1 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === "ai"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:bg-[#F4F4F6] hover:text-black"
              }`}
            >
              Asisten Tutor AI
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "kuis"}
              onClick={() => setActiveTab("kuis")}
              className={`flex-1 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === "kuis"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:bg-[#F4F4F6] hover:text-black"
              }`}
            >
              Evaluasi Kuis ({currentTopic.quiz.length})
            </button>
          </div>

          {/* TAB 1: MATERI */}
          {activeTab === "materi" && (
            <div className="space-y-6">
              {/* Capaian Pembelajaran */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all duration-300">
                <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-xs px-3 py-1 rounded-full inline-block mb-3">
                  Silabus & Capaian
                </span>
                <h3 className="text-base font-medium text-black mb-3 flex items-center gap-2">
                  <span>Capaian Pembelajaran Khusus</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
                  {currentTopic.learningOutcomes.map((outcome, i) => (
                    <li key={`outcome-${i}`} className="flex items-start gap-2">
                      <span className="text-black font-bold mt-0.5">&bull;</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Concepts */}
              {currentTopic.keyConcepts.map((concept, idx) => (
                <div
                  key={`concept-${idx}`}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all duration-300 space-y-4"
                >
                  <h4 className="text-base sm:text-lg font-medium text-black">{concept.subtitle}</h4>
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
                            className="px-3 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-colors cursor-pointer"
                          >
                            {copiedCodeIndex === idx ? "✓ Tersalin" : "Salin Kode"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setRunCodeIndex(idx)}
                            className="px-3 py-1 rounded-full bg-white hover:bg-neutral-200 text-black text-[11px] font-medium transition-colors cursor-pointer"
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

              {/* Action Button: Selesaikan Modul */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleCompleteTopic}
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-medium text-xs rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>✓</span>
                  <span>
                    {isCompleted ? "Topik Telah Diselesaikan" : "Tandai Selesai & Klaim XP"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: RAG ASSISTANT */}
          {activeTab === "rag" && (
            <ModuleRagChat
              defaultModuleId={`modul-${currentTopic.id}`}
              defaultModuleName={currentTopic.title}
            />
          )}

          {/* TAB 3: AI TUTOR */}
          {activeTab === "ai" && (
            <div className="bg-white rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all duration-300 flex flex-col h-[600px] overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-black/8 bg-[#F4F4F6]/50 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-black">
                    NEXED Tutor AI
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
                  className="px-5 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 text-white font-medium text-xs rounded-full transition-all shadow-xs cursor-pointer"
                >
                  Kirim
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: KUIS */}
          {activeTab === "kuis" && (
            <div className="bg-white rounded-3xl border border-black/8 p-6 sm:p-8 shadow-xs hover:border-black/20 transition-all duration-300 space-y-6">
              <div>
                <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-xs px-3 py-1 rounded-full inline-block mb-2">
                  Active Recall Test
                </span>
                <h3 className="text-base sm:text-lg font-light text-black">
                  Uji Pemahaman Konsep ({currentTopic.quiz.length} Soal)
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Pilihlah salah satu jawaban yang paling tepat untuk menguji pemahaman Anda.
                </p>
              </div>

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
                              className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${optionClass}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIndex === q.correctIndex && (
                                <span className="text-white font-mono text-[10px] bg-neutral-800 px-2 py-0.5 rounded-full">✓ Benar</span>
                              )}
                              {quizSubmitted && isOptionSelected && optIndex !== q.correctIndex && (
                                <span className="text-black font-mono text-[10px] bg-neutral-300 px-2 py-0.5 rounded-full">✕ Salah</span>
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
              <div className="flex justify-between items-center pt-4 border-t border-black/8">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(selectedAnswers).length < currentTopic.quiz.length}
                    className="px-6 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 text-white font-medium text-xs rounded-full shadow-xs transition-all cursor-pointer"
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
                      className="px-5 py-2.5 bg-[#F4F4F6] hover:bg-neutral-200 text-black text-xs font-medium rounded-full cursor-pointer border border-black/8"
                    >
                      Ulangi Kuis
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteTopic}
                      className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-medium rounded-full shadow-xs cursor-pointer"
                    >
                      ✓ Selesaikan Modul & Klaim XP
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl text-center space-y-4 border border-black/10 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl mx-auto font-bold shadow-xs">
              ✓
            </div>
            <h3 className="text-xl font-light text-black">Selamat! Topik Tuntas</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Anda telah menyelesaikan seluruh materi dan evaluasi pada topik{" "}
              <strong>{currentTopic.title}</strong>.
            </p>

            {awardedXp > 0 && (
              <div className="py-2 px-4 rounded-full bg-[#F4F4F6] border border-black/10 text-black font-mono font-medium text-xs inline-block">
                +{awardedXp} XP Berhasil Ditambahkan
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleNextTopic}
                className="w-full py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
              >
                Lanjut ke Topik Berikutnya &rarr;
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full py-2.5 rounded-full bg-[#F4F4F6] hover:bg-neutral-200 text-black font-medium text-xs transition-colors cursor-pointer border border-black/8"
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
