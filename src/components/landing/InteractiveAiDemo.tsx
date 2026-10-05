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
    <div className="bg-white rounded-3xl border border-black/10 shadow-xs overflow-hidden font-['Inter',sans-serif]">
      {/* Top Demo Bar */}
      <div className="bg-[#FAFAFA] px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-black" />
          <span className="text-xs font-semibold text-black">
            Simulasi Ekstraksi & Evaluasi Kurikulum
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/5 text-black border border-black/10">
            Mode Demonstrasi
          </span>
        </div>
      </div>

      {/* Topic Switcher Pills (Minimal Monochrome) */}
      <div className="p-4 sm:p-5 bg-white border-b border-black/8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-black/40 uppercase tracking-wider mr-1">
            Sampel Modul:
          </span>
          {SAMPLE_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleSelectTopic(topic.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedTopicId === topic.id
                  ? "bg-black text-white shadow-xs"
                  : "bg-[#F4F4F6] text-black/70 hover:bg-[#eaeaea] border border-black/5"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/5 text-black border border-black/10">
                {currentTopic.level}
              </span>
              <span className="text-xs text-black/50 font-normal">
                Hasil Pemrosesan AI Otomatis
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-normal text-black tracking-tight">
              {currentTopic.title}
            </h3>
          </div>

          {/* Sub-Tabs for Result Types */}
          <div
            role="tablist"
            aria-label="Navigasi Hasil AI"
            className="flex p-1 bg-[#F4F4F6] rounded-full self-start sm:self-auto gap-1 border border-black/5"
          >
            <button
              type="button"
              role="tab"
              onClick={() => setActiveTab("ringkasan")}
              aria-selected={activeTab === "ringkasan"}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "ringkasan"
                  ? "bg-white text-black shadow-xs font-semibold"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Ringkasan Inti
            </button>
            <button
              type="button"
              role="tab"
              onClick={() => setActiveTab("roadmap")}
              aria-selected={activeTab === "roadmap"}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "roadmap"
                  ? "bg-white text-black shadow-xs font-semibold"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Peta Belajar (3 Tahap)
            </button>
            <button
              type="button"
              role="tab"
              onClick={() => setActiveTab("kuis")}
              aria-selected={activeTab === "kuis"}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "kuis"
                  ? "bg-white text-black shadow-xs font-semibold"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Kuis Adaptif
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
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed text-sm">
                  {currentTopic.summary}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Poin Inti Hasil Analisis:
                  </h4>
                  <ul className="space-y-2">
                    {currentTopic.keyPoints.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="leading-relaxed">{point}</span>
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
                  AI mengonversi materi mentah menjadi jalur belajar bertahap dengan akumulasi XP capaian:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentTopic.roadmap.map((node) => (
                    <div
                      key={node.step}
                      className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="w-6 h-6 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                            #{node.step}
                          </span>
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            +{node.xp} XP
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-sm">{node.title}</h5>
                        <p className="text-xs text-slate-500 mt-1">{node.desc}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-blue-700">
                        <span>Status: Rekomendasi</span>
                        <span>Siap Uji &rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: KUIS INTERAKTIF */}
            {activeTab === "kuis" && (
              <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Formatif Adaptif • 1 Soal Sampel
                  </span>
                  <span className="text-xs text-slate-500">
                    Klik salah satu opsi untuk melihat evaluasi
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {currentTopic.quiz.question}
                </h4>

                <div className="space-y-2">
                  {currentTopic.quiz.options.map((option, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isCorrect = idx === currentTopic.quiz.correctIndex;
                    let optionStyle =
                      "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700";

                    if (quizSubmitted) {
                      if (isCorrect) {
                        optionStyle =
                          "bg-emerald-50 border-emerald-400 text-emerald-900 font-medium";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "bg-rose-50 border-rose-400 text-rose-900 font-medium";
                      }
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleQuizAnswer(idx)}
                        className={`w-full text-left p-3.5 rounded-lg border text-xs transition-colors flex items-center justify-between gap-3 ${optionStyle}`}
                      >
                        <span className="leading-relaxed">{option}</span>
                        {quizSubmitted && isCorrect && (
                          <span className="text-emerald-700 font-bold text-xs shrink-0">
                            ✓ Benar
                          </span>
                        )}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <span className="text-rose-700 font-bold text-xs shrink-0">✕ Salah</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 block">Penjelasan Jawaban:</span>
                    <p className="leading-relaxed">{currentTopic.quiz.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TUTOR CHATBOT */}
            {activeTab === "tutor" && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    AI
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Nexed AI Tutor</span>
                      <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                        Online
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{currentTopic.aiAdvice}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-600">
                    Ingin mengajukan pertanyaan lain atau upload materi lengkap PDF Anda?
                  </span>
                  <a
                    href="/register"
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shrink-0"
                  >
                    Buka Asisten Penuh di Akun Anda &rarr;
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
