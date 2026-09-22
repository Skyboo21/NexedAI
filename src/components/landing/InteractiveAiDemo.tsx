// src/components/landing/InteractiveAiDemo.tsx
"use client";

import { useState } from "react";

interface SampleTopic {
  id: string;
  title: string;
  level: string;
  summary: string;
  keyPoints: string[];
  roadmap: Array<{ step: number; title: string; desc: string; xp: number }>;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  aiAdvice: string;
}

const SAMPLE_TOPICS: SampleTopic[] = [
  {
    id: "looping",
    title: "Looping & Iterasi (For vs While)",
    level: "Dasar • Pemula",
    summary:
      "Perulangan (Looping) adalah struktur kontrol fundamental yang mengulang blok kode hingga kondisi terminasi terpenuhi. FOR digunakan saat iterasi sudah pasti, sedangkan WHILE digunakan saat jumlah iterasi bergantung pada kondisi dinamis.",
    keyPoints: [
      "Inisialisasi, kondisi terminasi, dan langkah iterasi (step/increment).",
      "Pencegahan Infinite Loop dengan memastikan variabel kondisi selalu berubah.",
      "Kompleksitas waktu tipikal: O(N) untuk perulangan tunggal, O(N²) untuk perulangan bersarang.",
    ],
    roadmap: [
      { step: 1, title: "Konsep Iterasi Sekuensial", desc: "Flowchart & Logika Counter", xp: 50 },
      {
        step: 2,
        title: "Sintaks FOR & WHILE Loop",
        desc: "Tracing Table & Break/Continue",
        xp: 75,
      },
      {
        step: 3,
        title: "Optimasi Perulangan",
        desc: "Menghindari kalkulasi berulang di kondisi",
        xp: 100,
      },
    ],
    quiz: {
      question: "Kapan struktur WHILE loop lebih disukai daripada FOR loop?",
      options: [
        "Ketika kita sudah tahu pasti iterasi harus berjalan tepat 100 kali.",
        "Ketika jumlah perulangan tidak diketahui pasti sebelum program berjalan dan bergantung pada kondisi input.",
        "Hanya saat memproses data bertipe array satu dimensi.",
        "Saat program membutuhkan kecepatan kompilasi hardware tertinggi.",
      ],
      correctIndex: 1,
      explanation:
        "Tepat! WHILE loop ideal untuk kondisi di mana akhir perulangan tidak dapat diprediksi secara statis (seperti membaca stream input atau menunggu sinyal berhenti).",
    },
    aiAdvice:
      "💡 Tips Nexed AI: Jika kamu sering mendapati program 'hang', selalu periksa baris update variabel pengontrol (seperti i++) sebelum kurung kurawal penutup loop!",
  },
  {
    id: "tree",
    title: "Struktur Data Binary Search Tree (BST)",
    level: "Menengah • Data Structure",
    summary:
      "Binary Search Tree adalah pohon biner terurut di mana setiap simpul (node) anak kiri selalu bernilai lebih kecil dari induknya, dan setiap simpul anak kanan bernilai lebih besar atau sama.",
    keyPoints: [
      "Pencarian efisien rata-rata: O(log N).",
      "Tiga traversal utama: In-Order (menghasilkan urutan terurut), Pre-Order, dan Post-Order.",
      "Kondisi degenerasi menjadi O(N) jika pohon tidak seimbang (skewed tree).",
    ],
    roadmap: [
      {
        step: 1,
        title: "Properti Node & Pointer",
        desc: "Root, Leaf, Left Child, Right Child",
        xp: 60,
      },
      { step: 2, title: "Operasi Insert & Search", desc: "Algoritma penelusuran rekursif", xp: 85 },
      {
        step: 3,
        title: "Pohon Seimbang (AVL/Red-Black)",
        desc: "Rotasi untuk menjaga tinggi O(log N)",
        xp: 120,
      },
    ],
    quiz: {
      question:
        "Metode penelusuran (traversal) manakah yang menghasilkan urutan elemen angka terurut menaik (ascending) pada BST?",
      options: [
        "Pre-Order Traversal",
        "In-Order Traversal",
        "Post-Order Traversal",
        "Level-Order Traversal",
      ],
      correctIndex: 1,
      explanation:
        "Benar sekali! In-Order traversal mengunjungi [Kiri -> Induk -> Kanan], sehingga pada BST nilainya otomatis terurut dari terkecil ke terbesar.",
    },
    aiAdvice:
      "💡 Tips Nexed AI: Bayangkan BST seperti menyortir buku di rak perpustakaan. Selalu mulai dari node tengah (root) untuk membelah pencarian menjadi dua bagian!",
  },
  {
    id: "recursion",
    title: "Rekursi & Divide-and-Conquer",
    level: "Lanjutan • Algoritma",
    summary:
      "Rekursi adalah teknik pemecahan masalah di mana suatu fungsi memanggil dirinya sendiri dengan sub-masalah yang lebih kecil sampai mencapai Base Case (kondisi berhenti).",
    keyPoints: [
      "Dua syarat mutlak: Base Case dan Recursive Step.",
      "Call Stack Memory: Setiap pemanggilan fungsi memakan frame memori di stack.",
      "Divide-and-Conquer: Membagi masalah, menaklukkan sub-masalah, lalu menggabungkan solusi (contoh: Merge Sort).",
    ],
    roadmap: [
      {
        step: 1,
        title: "Anatomi Base Case",
        desc: "Menghentikan rekursi sebelum Stack Overflow",
        xp: 70,
      },
      { step: 2, title: "Call Stack Tracing", desc: "Visualisasi tumpukan memori fungsi", xp: 95 },
      {
        step: 3,
        title: "Memoization & DP",
        desc: "Menghindari perhitungan ulang sub-masalah tumpang tindih",
        xp: 140,
      },
    ],
    quiz: {
      question: "Apa konsekuensi langsung jika suatu fungsi rekursif lupa menyertakan Base Case?",
      options: [
        "Program akan menghasilkan output angka acak.",
        "Terjadi Stack Overflow error karena fungsi terus memanggil dirinya tanpa batas.",
        "Kompiler akan otomatis mengubahnya menjadi FOR loop.",
        "Memori RAM akan otomatis dibersihkan oleh Garbage Collector tanpa error.",
      ],
      correctIndex: 1,
      explanation:
        "Tepat! Tanpa base case, call stack akan terus bertambah hingga batas memori alokasi stack terlampaui (Stack Overflow).",
    },
    aiAdvice:
      "💡 Tips Nexed AI: Selalu tulis Base Case pada baris paling pertama di dalam fungsi rekursifmu sebelum logika lainnya!",
  },
];

export function InteractiveAiDemo() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("looping");
  const [activeTab, setActiveTab] = useState<"ringkasan" | "roadmap" | "kuis" | "tutor">(
    "ringkasan",
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const currentTopic =
    SAMPLE_TOPICS.find((t) => t.id === selectedTopicId) ?? (SAMPLE_TOPICS[0] as SampleTopic);

  const handleSelectTopic = (id: string) => {
    if (id === selectedTopicId) return;
    setIsProcessing(true);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setSelectedTopicId(id);

    // Short realistic simulation delay
    setTimeout(() => {
      setIsProcessing(false);
    }, 450);
  };

  const handleQuizAnswer = (index: number) => {
    setSelectedQuizOption(index);
    setQuizSubmitted(true);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Top Demo Bar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400 border-l border-slate-700 pl-3">
            Nexed_AI_Engine::simulasi_interaktif.tsx
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Playground
          </span>
          <span className="text-[11px] text-slate-400">Pilih modul di bawah ini:</span>
        </div>
      </div>

      {/* Topic Switcher Pills */}
      <div className="p-4 sm:p-6 bg-slate-50/80 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Sampel Modul:
          </span>
          {SAMPLE_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleSelectTopic(topic.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTopicId === topic.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {topic.title.split("(")[0]?.trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Workspace Area */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Header of Active Topic */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {currentTopic.level}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Hasil Pemrosesan AI Otomatis
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentTopic.title}
            </h3>
          </div>

          {/* Sub-Tabs for Result Types */}
          <div
            role="tablist"
            aria-label="Navigasi Hasil AI"
            className="flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto"
          >
            <button
              type="button"
              role="tab"
              onClick={() => setActiveTab("ringkasan")}
              aria-selected={activeTab === "ringkasan"}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "ringkasan"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📝 Ringkasan
            </button>
            <button
              type="button"
              role="tab"
              onClick={() => setActiveTab("roadmap")}
              aria-selected={activeTab === "roadmap"}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "roadmap"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🗺️ Peta Belajar
            </button>
            <button
              type="button"
              role="tab"
              onClick={() => setActiveTab("kuis")}
              aria-selected={activeTab === "kuis"}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "kuis"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🎯 Kuis Adaptif
            </button>
            <button
              type="button"
              role="tab"
              onClick={() => setActiveTab("tutor")}
              aria-selected={activeTab === "tutor"}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "tutor"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🤖 AI Tutor
            </button>
          </div>
        </div>

        {/* Tab Contents with Simulation State */}
        {isProcessing ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            <div>
              <p className="text-sm font-bold text-slate-800">
                Memproses Modul & Menyusun Jalur Pembelajaran...
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Mengekstrak konsep kunci, struktur rekursi, dan pohon sintaksis
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-200">
            {/* TAB 1: RINGKASAN */}
            {activeTab === "ringkasan" && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-slate-800 leading-relaxed text-sm">
                  {currentTopic.summary}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                    📌 Poin Inti Hasil Analisis AI:
                  </h4>
                  <ul className="space-y-2.5">
                    {currentTopic.keyPoints.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-xs text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: ROADMAP */}
            {activeTab === "roadmap" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  AI mengonversi materi mentah menjadi jalur belajar bertahap dengan akumulasi XP
                  capaian:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentTopic.roadmap.map((node) => (
                    <div
                      key={node.step}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                            #{node.step}
                          </span>
                          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            +{node.xp} XP
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-sm">{node.title}</h5>
                        <p className="text-xs text-slate-500 mt-1">{node.desc}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-indigo-600">
                        <span>Status: Rekomendasi</span>
                        <span>Siap Uji →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: KUIS INTERAKTIF */}
            {activeTab === "kuis" && (
              <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                    Formatif Adaptif • 1 Soal Sampel
                  </span>
                  <span className="text-xs text-slate-500">
                    Klik salah satu opsi untuk melihat evaluasi
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {currentTopic.quiz.question}
                </h4>

                <div className="space-y-2.5">
                  {currentTopic.quiz.options.map((option, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isCorrect = idx === currentTopic.quiz.correctIndex;
                    let optionStyle =
                      "bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-slate-700";

                    if (quizSubmitted) {
                      if (isCorrect) {
                        optionStyle =
                          "bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "bg-rose-50 border-rose-400 text-rose-900 font-semibold";
                      }
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleQuizAnswer(idx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                      >
                        <span className="leading-relaxed">{option}</span>
                        {quizSubmitted && isCorrect && (
                          <span className="text-emerald-600 font-black text-sm shrink-0">
                            ✓ Benar
                          </span>
                        )}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <span className="text-rose-600 font-black text-sm shrink-0">✕ Salah</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200 animate-in fade-in duration-200 text-xs text-slate-700 space-y-1">
                    <span className="font-extrabold text-slate-900 block">Penjelasan Jawaban:</span>
                    <p className="leading-relaxed">{currentTopic.quiz.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TUTOR CHATBOT */}
            {activeTab === "tutor" && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-indigo-600/20 shrink-0">
                    🤖
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">Nexed AI Tutor</span>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                        Online
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{currentTopic.aiAdvice}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-600">
                    Ingin mengajukan pertanyaan lain atau upload materi lengkap PDF Anda?
                  </span>
                  <a
                    href="/register"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shrink-0"
                  >
                    Buka Asisten Penuh di Akun Anda →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InteractiveAiDemo;
