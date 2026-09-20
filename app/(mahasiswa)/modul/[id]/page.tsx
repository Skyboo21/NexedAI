// app/(mahasiswa)/modul/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

  const [activeTab, setActiveTab] = useState<"materi" | "ai" | "kuis">("materi");
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
    <div className="bg-slate-50 min-h-screen text-slate-900 font-['Outfit'] antialiased flex flex-col">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/modul"
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            >
              &larr; Katalog Modul
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
                <span className="text-indigo-600 font-bold">{currentTopic.courseName}</span>
                <span>&bull;</span>
                <span>{currentTopic.meeting}</span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {currentTopic.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <span className="font-bold">Dosen:</span>
              <span>{currentTopic.lecturer}</span>
            </div>
            <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1">
              <span>⚡</span>
              <span>+{currentTopic.xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Silabus Perkuliahan */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Silabus Modul
              </h2>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
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
                    className={`block p-3 rounded-xl text-xs transition-all border ${
                      isActive
                        ? "bg-indigo-50 border-indigo-200 text-indigo-900 font-bold shadow-xs"
                        : "bg-white border-transparent hover:bg-slate-50 text-slate-700 font-medium"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-500">{topic.meeting}</span>
                      {done && (
                        <span className="text-[10px] text-emerald-600 font-bold">✓ Selesai</span>
                      )}
                    </div>
                    <div className="truncate">{topic.title}</div>
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
            className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex gap-1.5"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "materi"}
              onClick={() => setActiveTab("materi")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "materi"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              📖 Materi & Konsep
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "ai"}
              onClick={() => setActiveTab("ai")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "ai"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              🤖 Asisten Tutor AI
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "kuis"}
              onClick={() => setActiveTab("kuis")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "kuis"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              📝 Evaluasi Kuis ({currentTopic.quiz.length})
            </button>
          </div>

          {/* TAB 1: MATERI */}
          {activeTab === "materi" && (
            <div className="space-y-6">
              {/* Capaian Pembelajaran */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  <span>Capaian Pembelajaran Khusus</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {currentTopic.learningOutcomes.map((outcome, i) => (
                    <li key={`outcome-${i}`} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">&bull;</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Concepts */}
              {currentTopic.keyConcepts.map((concept, idx) => (
                <div
                  key={`concept-${idx}`}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
                >
                  <h4 className="text-base font-extrabold text-slate-900">{concept.subtitle}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {concept.explanation}
                  </p>

                  {/* Code Snippet Box */}
                  {concept.codeSnippet && (
                    <div className="rounded-xl border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden text-xs">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800">
                        <span className="text-[11px] font-mono text-slate-400">Python 3.x</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(concept.codeSnippet || "", idx)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                          >
                            {copiedCodeIndex === idx ? "✓ Tersalin" : "Salin Kode"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setRunCodeIndex(idx)}
                            className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-colors"
                          >
                            ▶ Jalankan
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 font-mono text-xs overflow-x-auto text-emerald-400">
                        {concept.codeSnippet}
                      </pre>

                      {/* Simulated Execution Output */}
                      {runCodeIndex === idx && concept.codeOutput && (
                        <div className="p-3.5 bg-slate-950 border-t border-slate-800 text-[11px] font-mono">
                          <span className="text-slate-500 block mb-1">Output Konsol:</span>
                          <span className="text-slate-200 whitespace-pre-wrap">
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
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <span>✓</span>
                  <span>
                    {isCompleted ? "Topik Telah Diselesaikan" : "Tandai Selesai & Klaim XP"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AI TUTOR */}
          {activeTab === "ai" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[600px] overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>🤖</span>
                    <span>NEXED Tutor AI</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Bimbingan dialogis topik "{currentTopic.title}"
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Aktif 24/7
                </span>
              </div>

              {/* Chat Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-br-none shadow-xs"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isAiTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 w-fit">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <span>NEXED AI sedang mengetik penjelasan...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggested Questions */}
              <div className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto">
                {currentTopic.suggestedQuestions.map((q, idx) => (
                  <button
                    key={`sug-${idx}`}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="text-[11px] text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 px-3 py-1.5 rounded-full shrink-0 transition-colors"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-slate-200 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Tanyakan konsep atau minta analogi sehari-hari..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isAiTyping}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                >
                  Kirim
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: KUIS */}
          {activeTab === "kuis" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Uji Pemahaman Konsep ({currentTopic.quiz.length} Soal)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
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
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {qIndex + 1}. {q.question}
                      </h4>

                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isOptionSelected = selected === optIndex;
                          let optionClass =
                            "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";

                          if (quizSubmitted) {
                            if (optIndex === q.correctIndex) {
                              optionClass =
                                "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold";
                            } else if (isOptionSelected) {
                              optionClass = "bg-rose-50 border-rose-300 text-rose-900";
                            }
                          } else if (isOptionSelected) {
                            optionClass =
                              "bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold";
                          }

                          return (
                            <button
                              key={`opt-${optIndex}`}
                              type="button"
                              disabled={quizSubmitted}
                              onClick={() =>
                                setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
                              }
                              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${optionClass}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIndex === q.correctIndex && (
                                <span className="text-emerald-600 font-bold">✓ Benar</span>
                              )}
                              {quizSubmitted && isOptionSelected && optIndex !== q.correctIndex && (
                                <span className="text-rose-600 font-bold">✕ Salah</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div
                          className={`p-3 rounded-xl text-xs ${
                            isCorrect
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-rose-50 text-rose-800"
                          }`}
                        >
                          <span className="font-bold block mb-1">
                            {isCorrect ? "Jawaban Anda Benar!" : "Jawaban Belum Tepat:"}
                          </span>
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Submit Bar */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(selectedAnswers).length < currentTopic.quiz.length}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
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
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                    >
                      Ulangi Kuis
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteTopic}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-4 border border-slate-200 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
              🎉
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Selamat! Topik Tuntas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anda telah menyelesaikan seluruh materi dan evaluasi pada topik{" "}
              <strong>{currentTopic.title}</strong>.
            </p>

            {awardedXp > 0 && (
              <div className="py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-sm inline-block">
                ⚡ +{awardedXp} XP Berhasil Ditambahkan!
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleNextTopic}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Lanjut ke Topik Berikutnya &rarr;
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
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
