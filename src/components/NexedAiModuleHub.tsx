// src/components/NexedAiModuleHub.tsx
"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface AnalyzedModuleResult {
  title: string;
  sourceType: "file" | "text";
  fileName?: string;
  estimatedTime: string;
  difficulty: "Dasar" | "Menengah" | "Lanjut";
  xpReward: number;
  summary: {
    overview: string;
    keyPoints: Array<{
      term: string;
      definition: string;
    }>;
    proTips: string;
    breakdownTime: {
      concept: string;
      practice: string;
      quiz: string;
    };
  };
  roadmap: Array<{
    step: number;
    stage: string;
    title: string;
    description: string;
    actionItem: string;
    understood: boolean;
  }>;
  quiz: Array<{
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

const DEFAULT_BINARY_SEARCH: AnalyzedModuleResult = {
  title: "Algoritma Pencarian Biner (Binary Search) & Analisis Kompleksitas",
  sourceType: "text",
  estimatedTime: "40 Menit",
  difficulty: "Menengah",
  xpReward: 120,
  summary: {
    overview:
      "Pencarian Biner adalah algoritma pencarian berefisiensi tinggi dengan prinsip Divide and Conquer. Algoritma ini membagi ruang pencarian menjadi dua bagian secara berulang pada kumpulan data yang sudah terurut (sorted array).",
    keyPoints: [
      {
        term: "Divide and Conquer",
        definition:
          "Memecah masalah menjadi sub-masalah identik berukuran setengah hingga target ditemukan.",
      },
      {
        term: "Kompleksitas Waktu O(log N)",
        definition:
          "Jumlah iterasi maksimal hanya sebanding dengan logaritma basis 2 dari jumlah data N.",
      },
      {
        term: "Midpoint Overflow Guard",
        definition:
          "Menggunakan mid = low + (high - low) / 2 untuk mencegah integer overflow pada memori.",
      },
      {
        term: "Prasyarat Terurut (Pre-sorted)",
        definition:
          "Data wajib telah diurutkan terlebih dahulu sebelum Binary Search dapat dieksekusi.",
      },
    ],
    proTips:
      "Jika data sering bertambah secara dinamis, pertimbangkan biaya pengurutan awal (O(N log N)). Binary Search sangat optimal untuk data yang sering dibaca namun jarang diubah.",
    breakdownTime: {
      concept: "12 Menit",
      practice: "18 Menit",
      quiz: "10 Menit",
    },
  },
  roadmap: [
    {
      step: 1,
      stage: "Tahap 1: Fondasi",
      title: "Pahami Konsep Penunjuk (Low, Mid, High)",
      description:
        "Kuasai pergeseran penunjuk pointer low dan high saat membandingkan nilai elemen tengah (array[mid]) terhadap target nilai yang dicari.",
      actionItem: "Gambarkan alur pembagian array 7 elemen di atas kertas.",
      understood: false,
    },
    {
      step: 2,
      stage: "Tahap 2: Implementasi",
      title: "Konstruksi Loop While (low <= high)",
      description:
        "Tulis kode algoritma iteratif dengan kondisi terminasi yang tepat guna menghindari infinite loop saat elemen tidak ditemukan.",
      actionItem: "Implementasikan kode dalam Python atau C++ dan uji kasus elemen tidak ada.",
      understood: false,
    },
    {
      step: 3,
      stage: "Tahap 3: Optimasi & Pengujian",
      title: "Analisis Worst Case & Implementasi Rekursif",
      description:
        "Bandingkan konsumsi memori Call Stack antara pendekatan iteratif vs rekursif, serta evaluasi kasus batas array kosong.",
      actionItem:
        "Ukur perbedaan efisiensi Binary Search dibanding Linear Search pada 100.000 data.",
      understood: false,
    },
  ],
  quiz: [
    {
      id: 1,
      question: "Apakah syarat mutlak agar algoritma Binary Search dapat bekerja dengan benar?",
      options: [
        "Data harus bertipe string",
        "Kumpulan data harus sudah dalam keadaan terurut (sorted)",
        "Ukuran array harus merupakan bilangan genap",
        "Data tidak boleh memiliki duplikat",
      ],
      correctIndex: 1,
      explanation:
        "Binary Search bergantung pada sifat keterurutan data untuk mengeliminasi separuh ruang pencarian pada setiap langkah perbandingan.",
    },
    {
      id: 2,
      question:
        "Berapakah jumlah perbandingan maksimal (worst-case) untuk mencari elemen dalam array terurut berukuran 1.024 elemen menggunakan Binary Search?",
      options: ["10 kali", "1.024 kali", "512 kali", "100 kali"],
      correctIndex: 0,
      explanation: "Karena kompleksitas waktu O(log₂ N), maka log₂(1024) = 10 kali perbandingan.",
    },
    {
      id: 3,
      question: "Mengapa perhitungan titik tengah dianjurkan 'mid = low + (high - low) / 2'?",
      options: [
        "Membuat pencarian dua kali lebih cepat",
        "Mencegah potensi integer overflow pada tipe data primitif",
        "Memungkinkan pencarian pada array tak terurut",
        "Otomatis membulatkan bilangan ke atas",
      ],
      correctIndex: 1,
      explanation:
        "Rumus (low + high) / 2 dapat menyebabkan integer overflow jika nilai low + high melebihi kapasitas memori nilai integer maksimum.",
    },
  ],
};

const DEFAULT_TREE_TRAVERSAL: AnalyzedModuleResult = {
  title: "Struktur Data Tree & Algoritma Traversal Rekursif",
  sourceType: "text",
  estimatedTime: "45 Menit",
  difficulty: "Lanjut",
  xpReward: 140,
  summary: {
    overview:
      "Pohon Biner (Binary Tree) adalah struktur data hierarkis di mana setiap simpul (node) memiliki paling banyak dua anak (left & right child). Traversal adalah mekanisme mengunjungi seluruh simpul tepat satu kali.",
    keyPoints: [
      {
        term: "Inorder Traversal (L-N-R)",
        definition:
          "Mengunjungi anak kiri, simpul saat ini, kemudian anak kanan. Menghasilkan urutan terurut pada BST.",
      },
      {
        term: "Preorder Traversal (N-L-R)",
        definition:
          "Mengunjungi simpul saat ini terlebih dahulu, cocok untuk kloning/serialisasi struktur pohon.",
      },
      {
        term: "Postorder Traversal (L-R-N)",
        definition:
          "Mengunjungi kedua anak terlebih dahulu sebelum simpul induk, ideal untuk penghapusan pohon memori.",
      },
      {
        term: "Kompleksitas O(N)",
        definition:
          "Setiap simpul dikunjungi tepat satu kali dengan ruang Call Stack sedalam tinggi pohon O(H).",
      },
    ],
    proTips:
      "Pada Binary Search Tree (BST), Inorder Traversal dijamin selalu menghasilkan urutan nilai yang terurut secara ascending dari terkecil ke terbesar.",
    breakdownTime: {
      concept: "15 Menit",
      practice: "20 Menit",
      quiz: "10 Menit",
    },
  },
  roadmap: [
    {
      step: 1,
      stage: "Tahap 1: Fondasi",
      title: "Definisi Node & Hubungan Root-Child",
      description:
        "Pahami representasi memori class Node yang memuat value data, pointer left, dan pointer right.",
      actionItem: "Buat class Node sederhana dengan constructor pointer null.",
      understood: false,
    },
    {
      step: 2,
      stage: "Tahap 2: Implementasi",
      title: "Pembuatan Fungsi Rekursif Tiga Jalur",
      description:
        "Tulis fungsi rekursif untuk Inorder, Preorder, dan Postorder dengan base-case pengecekan node null.",
      actionItem: "Implementasikan ketiga fungsi dan cetak urutan output simpul.",
      understood: false,
    },
    {
      step: 3,
      stage: "Tahap 3: Pengujian",
      title: "Breadth-First Search (Level-Order) Menggunakan Queue",
      description:
        "Bandingkan traversal mendalam (DFS) dengan penelusuran melebar (BFS) per tingkat menggunakan antrean.",
      actionItem: "Selesaikan tantangan pencarian ketinggian maksimal (max depth) dari tree.",
      understood: false,
    },
  ],
  quiz: [
    {
      id: 1,
      question: "Urutan kunjungan simpul pada Inorder Traversal adalah...",
      options: [
        "Root -> Left -> Right",
        "Left -> Root -> Right",
        "Left -> Right -> Root",
        "Right -> Root -> Left",
      ],
      correctIndex: 1,
      explanation:
        "Inorder mengunjungi sub-pohon kiri terlebih dahulu, kemudian simpul induk (root), dan diakhiri dengan sub-pohon kanan.",
    },
    {
      id: 2,
      question:
        "Pada Binary Search Tree (BST), traversal manakah yang menghasilkan urutan data terurut naik?",
      options: ["Preorder", "Postorder", "Inorder", "Level-order"],
      correctIndex: 2,
      explanation:
        "Karena pada BST anak kiri < induk < anak kanan, maka urutan Left-Root-Right (Inorder) selalu menghasilkan data terurut menaik.",
    },
    {
      id: 3,
      question:
        "Struktur data bantu apa yang lazim digunakan untuk Breadth-First / Level-Order Traversal?",
      options: ["Stack (LIFO)", "Queue (FIFO)", "Hash Map", "Linked List sirkular"],
      correctIndex: 1,
      explanation:
        "Queue (First-In, First-Out) digunakan untuk menampung simpul anak per tingkat secara berurutan dari kiri ke kanan.",
    },
  ],
};

const ANALYSIS_STEPS = [
  { percent: 25, label: "Membaca dan mengekstraksi konten materi...", icon: "📄" },
  { percent: 50, label: "Menganalisis konsep esensial & kesulitan materi...", icon: "🧠" },
  { percent: 75, label: "Menyusun peta belajar adaptif bertahap...", icon: "🗺️" },
  { percent: 100, label: "Menghasilkan ringkasan dan kuis latihan aktif...", icon: "✨" },
];

export default function NexedAiModuleHub() {
  const [inputMode, setInputMode] = useState<"file" | "text">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analysisResult, setAnalyzedResult] = useState<AnalyzedModuleResult | null>(null);

  // Result Tabs
  const [activeResultTab, setActiveResultTab] = useState<"summary" | "roadmap" | "quiz" | "chat">(
    "summary",
  );

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isQuizChecked, setIsQuizChecked] = useState(false);

  // Roadmap understanding state
  const [roadmapStatus, setRoadmapStatus] = useState<Record<number, boolean>>({});

  // Chat tutor state
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: "user" | "ai"; text: string }>
  >([]);
  const [chatPrompt, setChatPrompt] = useState("");
  const [isAiReplying, setIsAiReplying] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // File drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Start AI Analysis Process
  const handleStartAnalysis = (presetKey?: string) => {
    setIsAnalyzing(true);
    setCurrentStepIndex(0);
    setAnalyzedResult(null);
    setIsQuizChecked(false);
    setUserAnswers({});

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < ANALYSIS_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Resolve result based on input
          let chosenData: AnalyzedModuleResult = DEFAULT_BINARY_SEARCH;
          if (
            presetKey === "tree_traversal" ||
            textInput.toLowerCase().includes("tree") ||
            textInput.toLowerCase().includes("pohon")
          ) {
            chosenData = DEFAULT_TREE_TRAVERSAL;
          } else if (presetKey === "binary_search") {
            chosenData = DEFAULT_BINARY_SEARCH;
          } else if (selectedFile) {
            const fileName = selectedFile.name.toLowerCase();
            if (
              fileName.includes("tree") ||
              fileName.includes("pohon") ||
              fileName.includes("struktur")
            ) {
              chosenData = {
                ...DEFAULT_TREE_TRAVERSAL,
                fileName: selectedFile.name,
                sourceType: "file",
              };
            } else {
              chosenData = {
                ...DEFAULT_BINARY_SEARCH,
                title: selectedFile.name.replace(/\.[^/.]+$/, ""),
                fileName: selectedFile.name,
                sourceType: "file",
              };
            }
          } else if (textInput.trim()) {
            chosenData = {
              ...DEFAULT_BINARY_SEARCH,
              title: textInput.length > 50 ? `${textInput.substring(0, 48)}...` : textInput,
              sourceType: "text",
            };
          }

          // Initialize states
          setAnalyzedResult(chosenData);
          const initialRoadmap: Record<number, boolean> = {};
          for (const stepItem of chosenData.roadmap) {
            initialRoadmap[stepItem.step] = false;
          }
          setRoadmapStatus(initialRoadmap);

          setChatMessages([
            {
              id: "init",
              sender: "ai",
              text: `Halo! Saya Nexed AI Tutor. Materi **"${chosenData.title}"** telah selesai diproses ke dalam silabus adaptif. Tanyakan konsep teknis apa pun atau pilih pertanyaan cepat di bawah!`,
            },
          ]);

          setIsAnalyzing(false);
        }, 500);
      }
    }, 600);
  };

  // Toggle roadmap item understood
  const toggleRoadmapStep = (stepNumber: number) => {
    setRoadmapStatus((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  // Chat message send
  const handleSendChat = (presetText?: string) => {
    const textToSend = presetText || chatPrompt;
    if (!textToSend.trim() || isAiReplying || !analysisResult) return;

    const userMsg = { id: Date.now().toString(), sender: "user" as const, text: textToSend };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!presetText) setChatPrompt("");
    setIsAiReplying(true);

    setTimeout(() => {
      let botAnswer = `Untuk konsep **${analysisResult.title}**, perhatikan keterkaitan antara struktur logika dan alokasi memorinya. Pastikan prasyarat logika awal telah terpenuhi sebelum memanggil proses perulangan.`;

      const lower = textToSend.toLowerCase();
      if (lower.includes("analogi") || lower.includes("sehari-hari")) {
        botAnswer = `💡 **Analogi Nyata:**\nBayangkan kamu mencari nama "Budi" di buku telepon setebal 1.000 halaman. Kamu tidak membacanya dari halaman 1 (Linear Search), melainkan langsung membuka halaman tengah (500). Jika nama di halaman 500 adalah "Kurnia", kamu langsung membuang paruh kedua dan hanya mencari di paruh pertama. Itulah prinsip efisiensi Divide & Conquer!`;
      } else if (lower.includes("perbedaan") || lower.includes("linear")) {
        botAnswer = `📊 **Perbandingan Utama:**\n• **Linear Search**: Memeriksa satu per satu. Waktu O(N). Tidak butuh data terurut.\n• **Binary Search**: Membagi dua setiap langkah. Waktu O(log N). Wajib data terurut terlebih dahulu. Pada 1.000.000 data, Linear butuh 1.000.000 langkah, sedangkan Binary Search maksimal hanya 20 langkah!`;
      } else if (lower.includes("rekursif") || lower.includes("iteratif")) {
        botAnswer = `⚙️ **Rekursif vs Iteratif:**\n• **Iteratif**: Menggunakan loop 'while (low <= high)', lebih hemat memori karena tidak menambah stack frame.\n• **Rekursif**: Fungsi memanggil dirinya sendiri, kodenya lebih ringkas dan elegan, namun memakai memori O(log N) untuk Call Stack.`;
      }

      setChatMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "ai", text: botAnswer },
      ]);
      setIsAiReplying(false);
    }, 700);
  };

  useEffect(() => {
    if (activeResultTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isAiReplying, activeResultTab]);

  const roadmapCompletedCount = Object.values(roadmapStatus).filter(Boolean).length;
  const roadmapTotal = analysisResult?.roadmap.length || 3;
  const roadmapPercent = Math.round((roadmapCompletedCount / roadmapTotal) * 100);

  return (
    <section
      aria-label="Nexed AI Study Hub"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6"
    >
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            <span>Nexed AI Module Study Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Unggah Materi & Analisis Adaptif Instan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Unggah modul kuliah (PDF, TXT, DOCX) atau tempel topik belajar. Asisten cerdas Nexed AI
            akan mengekstrak poin inti, merancang peta belajar bertahap, kuis active recall, serta
            tutor AI interaktif.
          </p>
        </div>

        {analysisResult && (
          <button
            type="button"
            onClick={() => {
              setAnalyzedResult(null);
              setSelectedFile(null);
              setTextInput("");
            }}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
          >
            <span>🔄</span>
            <span>Unggah Materi Baru</span>
          </button>
        )}
      </div>

      {/* VIEW A: UPLOAD & INPUT AREA (When Not Analyzed & Not Analyzing) */}
      {!analysisResult && !isAnalyzing && (
        <div className="space-y-6 animate-in fade-in">
          {/* Quick Preset Selector Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              💡 Atau Pilih Modul Cepat untuk Diuji Langsung:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleStartAnalysis("binary_search")}
                className="px-3.5 py-1.5 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <span>🔍</span>
                <span>Algoritma Pencarian Biner (O(log N))</span>
              </button>
              <button
                type="button"
                onClick={() => handleStartAnalysis("tree_traversal")}
                className="px-3.5 py-1.5 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <span>🌲</span>
                <span>Pohon Biner & Traversal Rekursif</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex gap-2 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setInputMode("file")}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
                inputMode === "file"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              📁 Unggah File Dokumen (PDF, TXT, DOCX)
            </button>
            <button
              type="button"
              onClick={() => setInputMode("text")}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
                inputMode === "text"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              📝 Tempel Teks Modul / Topik Cepat
            </button>
          </div>

          {/* Mode 1: Dropzone File */}
          {inputMode === "file" && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50/60 scale-[1.01]"
                  : selectedFile
                    ? "border-emerald-400 bg-emerald-50/30"
                    : "border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400"
              }`}
            >
              <input
                id="nexed-file-upload-input"
                type="file"
                accept=".pdf,.txt,.docx,.doc,.md"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <label
                htmlFor="nexed-file-upload-input"
                className="cursor-pointer flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl shadow-xs">
                  {selectedFile ? "📄" : "☁️"}
                </div>

                {selectedFile ? (
                  <div className="space-y-1">
                    <span className="text-sm font-extrabold text-slate-900 block">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      Ukuran: {(selectedFile.size / 1024).toFixed(1)} KB • Siap diproses AI
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-800 block">
                      Tarik & jatuhkan file modul di sini, atau{" "}
                      <span className="text-indigo-600 underline">pilih dari perangkat</span>
                    </span>
                    <span className="text-xs text-slate-400 block">
                      Mendukung format PDF, TXT, DOCX, atau Markdown (Maks. 25 MB)
                    </span>
                  </div>
                )}
              </label>

              {selectedFile && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors"
                  >
                    Hapus File
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Textarea Paste */}
          {inputMode === "text" && (
            <div className="space-y-2">
              <label
                htmlFor="pasted-content-input"
                className="block text-xs font-bold text-slate-700"
              >
                Isi Materi atau Rangkuman Topik Belajar
              </label>
              <textarea
                id="pasted-content-input"
                rows={5}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Tempelkan teks materi kuliah, diktat praktikum, atau deskripsi topik yang ingin kamu bedah bersama AI di sini..."
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all leading-relaxed"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={(!selectedFile && !textInput.trim()) || isAnalyzing}
              onClick={() => handleStartAnalysis()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <span>✨</span>
              <span>Analisis dengan Nexed AI</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW B: REAL-TIME PROGRESS BAR & ANALYSIS STATE */}
      {isAnalyzing && (
        <div className="py-12 px-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-6 animate-in fade-in">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl mx-auto shadow-md animate-bounce">
              {ANALYSIS_STEPS[currentStepIndex]?.icon || "🤖"}
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Memproses Modul dengan Nexed AI Engine...
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {ANALYSIS_STEPS[currentStepIndex]?.label}
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${ANALYSIS_STEPS[currentStepIndex]?.percent || 25}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 px-1">
              <span>Fase {currentStepIndex + 1} dari 4</span>
              <span className="text-indigo-600 font-extrabold">
                {ANALYSIS_STEPS[currentStepIndex]?.percent || 25}% Selesai
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW C: INSTANT ASSISTANT VIEW (4 TABS) */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header of analyzed module */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  ✓ Berhasil Dianalisis AI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  Tingkat: {analysisResult.difficulty}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                {analysisResult.title}
              </h3>
              <p className="text-xs text-slate-500">
                Estimasi Waktu Belajar: <strong>{analysisResult.estimatedTime}</strong> • Potensi
                Reward: <strong className="text-amber-600">+{analysisResult.xpReward} XP</strong>
              </p>
            </div>

            {/* Quick action badges */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-center min-w-[90px]">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Penguasaan</div>
                <div className="text-sm font-black text-indigo-600">{roadmapPercent}%</div>
              </div>
            </div>
          </div>

          {/* Navigation for the 4 Assistant Tabs */}
          <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeResultTab === "summary"}
              onClick={() => setActiveResultTab("summary")}
              className={`pb-2.5 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                activeResultTab === "summary"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>📖</span>
              <span>1. Ringkasan Inti AI</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeResultTab === "roadmap"}
              onClick={() => setActiveResultTab("roadmap")}
              className={`pb-2.5 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                activeResultTab === "roadmap"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>🗺️</span>
              <span>2. Peta Belajar Adaptif</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                {roadmapCompletedCount}/{roadmapTotal}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeResultTab === "quiz"}
              onClick={() => setActiveResultTab("quiz")}
              className={`pb-2.5 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                activeResultTab === "quiz"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>📝</span>
              <span>3. Kuis Active Recall</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700">
                {analysisResult.quiz.length} Soal
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeResultTab === "chat"}
              onClick={() => setActiveResultTab("chat")}
              className={`pb-2.5 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                activeResultTab === "chat"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>💬</span>
              <span>4. Tanya Nexed AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>
          </div>

          {/* TAB PANEL 1: RINGKASAN INTI (AI SUMMARY) */}
          {activeResultTab === "summary" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                  Ringkasan Eksekutif
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {analysisResult.summary.overview}
                </p>
              </div>

              {/* Key terms highlights */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                  Istilah & Konsep Esensial
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {analysisResult.summary.keyPoints.map((pt, i) => (
                    <div
                      key={`term-${i}`}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs"
                    >
                      <div className="text-xs font-extrabold text-indigo-700 mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        <span>{pt.term}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{pt.definition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips Callout */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
                <span className="text-base shrink-0">💡</span>
                <div>
                  <span className="font-extrabold block mb-0.5">Tips Dosen AI:</span>
                  <span>{analysisResult.summary.proTips}</span>
                </div>
              </div>

              {/* Estimated Study Breakdown */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    Teori & Konsep
                  </div>
                  <div className="text-xs font-extrabold text-slate-800 mt-1">
                    {analysisResult.summary.breakdownTime.concept}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Praktik Kode</div>
                  <div className="text-xs font-extrabold text-slate-800 mt-1">
                    {analysisResult.summary.breakdownTime.practice}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    Evaluasi Kuis
                  </div>
                  <div className="text-xs font-extrabold text-slate-800 mt-1">
                    {analysisResult.summary.breakdownTime.quiz}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB PANEL 2: PETA BELAJAR ADAPTIF (ROADMAP) */}
          {activeResultTab === "roadmap" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">
                    Progres Pemahaman Materi Anda
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Tandai setiap tahapan yang sudah Anda pahami untuk memperbarui grafik capaian.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-indigo-600">
                    {roadmapPercent}% Selesai
                  </span>
                </div>
              </div>

              {/* Roadmap Step Cards */}
              <div className="space-y-4">
                {analysisResult.roadmap.map((stepItem) => {
                  const isUnderstood = !!roadmapStatus[stepItem.step];
                  return (
                    <div
                      key={`roadmap-${stepItem.step}`}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isUnderstood
                          ? "bg-emerald-50/40 border-emerald-200 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isUnderstood
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {stepItem.stage}
                          </span>
                          {isUnderstood && (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <span>✓</span> <span>Dikuasai</span>
                            </span>
                          )}
                        </div>

                        <h5 className="text-sm font-extrabold text-slate-900">{stepItem.title}</h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {stepItem.description}
                        </p>
                        <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50/60 px-3 py-1 rounded-lg w-fit">
                          🎯 Aksi Mandiri: {stepItem.actionItem}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleRoadmapStep(stepItem.step)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-1.5 ${
                          isUnderstood
                            ? "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                        }`}
                      >
                        <span>{isUnderstood ? "Batal Tandai" : "✓ Tandai Paham"}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB PANEL 3: KUIS INTERAKTIF ACTIVE RECALL */}
          {activeResultTab === "quiz" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Kuis Evaluasi Pemahaman Modul
                  </h4>
                  <p className="text-xs text-slate-500">
                    Uji daya serap konsep esensial yang diekstrak langsung oleh AI dari materi Anda.
                  </p>
                </div>
              </div>

              {/* Questions list */}
              <div className="space-y-5">
                {analysisResult.quiz.map((q, qIndex) => {
                  const selected = userAnswers[qIndex];
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div
                      key={`quiz-q-${q.id}`}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {q.question}
                        </h5>
                      </div>

                      <div className="space-y-2 pt-1">
                        {q.options.map((opt, optIndex) => {
                          const isOptionSelected = selected === optIndex;
                          let btnStyle =
                            "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";

                          if (isQuizChecked) {
                            if (optIndex === q.correctIndex) {
                              btnStyle =
                                "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold";
                            } else if (isOptionSelected) {
                              btnStyle = "bg-rose-50 border-rose-300 text-rose-900 font-bold";
                            }
                          } else if (isOptionSelected) {
                            btnStyle =
                              "bg-indigo-50 border-indigo-300 text-indigo-900 font-bold ring-2 ring-indigo-500/20";
                          }

                          return (
                            <button
                              key={`opt-${optIndex}`}
                              type="button"
                              disabled={isQuizChecked}
                              onClick={() =>
                                setUserAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
                              }
                              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {isQuizChecked && optIndex === q.correctIndex && (
                                <span className="text-emerald-700 font-bold">✓ Kunci Jawaban</span>
                              )}
                              {isQuizChecked && isOptionSelected && optIndex !== q.correctIndex && (
                                <span className="text-rose-600 font-bold">✕ Pilihan Anda</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Callout */}
                      {isQuizChecked && (
                        <div
                          className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                            isCorrect
                              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                              : "bg-rose-50 border border-rose-200 text-rose-900"
                          }`}
                        >
                          <span className="font-extrabold block mb-1">
                            {isCorrect ? "✅ Jawaban Anda Tepat!" : "⚠️ Belum Tepat:"}
                          </span>
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Submit & Reset Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                {!isQuizChecked ? (
                  <button
                    type="button"
                    disabled={Object.keys(userAnswers).length < analysisResult.quiz.length}
                    onClick={() => setIsQuizChecked(true)}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
                  >
                    Periksa Jawaban Kuis
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsQuizChecked(false);
                        setUserAnswers({});
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Ulangi Kuis
                    </button>
                    <span className="text-xs font-bold text-slate-700">
                      Nilai:{" "}
                      {
                        Object.entries(userAnswers).filter(
                          ([qIdx, ansIdx]) =>
                            analysisResult.quiz[Number(qIdx)]?.correctIndex === ansIdx,
                        ).length
                      }{" "}
                      / {analysisResult.quiz.length} Benar
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB PANEL 4: AI TUTOR CHAT DRAWER */}
          {activeResultTab === "chat" && (
            <div className="bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] animate-in fade-in">
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>🤖</span>
                    <span>Tanya Nexed AI - Modul "{analysisResult.title}"</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Bebas tanyakan keraguan materi, minta analogi, atau perjelas baris kode.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Live Assistant
                </span>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none shadow-2xs"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAiReplying && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 w-fit">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <span>Nexed AI sedang merangkai penjelasan...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="p-2.5 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() =>
                    handleSendChat(
                      "Berikan analogi sederhana kehidupan sehari-hari tentang materi ini!",
                    )
                  }
                  className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 px-3 py-1 rounded-full whitespace-nowrap transition-colors"
                >
                  💡 Minta Analogi Nyata
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSendChat(
                      "Apa perbedaan utama metode ini dibanding pendekatan konvensional?",
                    )
                  }
                  className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 px-3 py-1 rounded-full whitespace-nowrap transition-colors"
                >
                  📊 Perbandingan Efisiensi
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSendChat("Jelaskan implementasi rekursif vs iteratif pada materi ini!")
                  }
                  className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 px-3 py-1 rounded-full whitespace-nowrap transition-colors"
                >
                  ⚙️ Rekursif vs Iteratif
                </button>
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="p-3 bg-white border-t border-slate-200 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ketik pertanyaan terkait materi ini..."
                  value={chatPrompt}
                  onChange={(e) => setChatPrompt(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!chatPrompt.trim() || isAiReplying}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
                >
                  Kirim
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
