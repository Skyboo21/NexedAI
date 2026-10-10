// src/components/NexedAiModuleHub.tsx
"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import ModuleRagChat from "./ModuleRagChat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper fetch yang memanggil FastAPI backend dengan fallback ke Next.js internal route
const apiFetch = (endpoint: string, init?: RequestInit): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  return fetch(url, init).catch(() => fetch(endpoint, init));
};

export interface AnalyzedModuleResult {
  title: string;
  sourceType: "file" | "text";
  fileName?: string;
  estimatedTime: string;
  difficulty: "Dasar" | "Menengah" | "Lanjut";
  xpReward: number;
  summary: {
    overview: string;
    keyTakeaways?: string[];
    keyPoints: Array<{
      term: string;
      definition: string;
      category?: string;
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
    keyConcepts?: string[];
    detailedGuide?: string;
    practiceScenario?: string;
    checkQuestion?: string;
  }>;
  quiz: Array<{
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

import { analyzeModuleContent, generateChatResponse } from "../lib/aiModuleAnalyzer";

const ANALYSIS_STEPS = [
  { percent: 25, label: "Membaca dan mengekstraksi konten materi...", icon: "📄" },
  { percent: 50, label: "Menganalisis konsep esensial & kesulitan materi...", icon: "🧠" },
  { percent: 75, label: "Menyusun peta belajar adaptif bertahap...", icon: "🗺️" },
  { percent: 100, label: "Menghasilkan ringkasan dan kuis latihan aktif...", icon: "✨" },
];

function CodeBlockSnippet({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="my-2.5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-sm">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800/80 text-[10px]">
        <span className="font-mono font-bold tracking-wider text-slate-400 uppercase">
          {language || "CODE"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/70 hover:bg-slate-700 transition-colors"
        >
          {copied ? (
            <>
              <span className="text-emerald-400">✓</span>
              <span className="text-emerald-400 font-bold">Tersalin!</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>Salin Kode</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 text-[11px] font-mono leading-relaxed overflow-x-auto text-neutral-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function renderInlineFormatted(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={`b-${idx}`} className="font-semibold text-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={`c-${idx}`}
          className="px-1.5 py-0.5 rounded-md bg-[#F4F4F6] text-black font-mono text-[11px] font-medium border border-black/10"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function ChatMessageContent({ text, isUser }: { text: string; isUser: boolean }) {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{text}</span>;
  }

  const codeBlockRegex = /(```[\s\S]*?```|'''[\s\S]*?''')/g;
  const sections = text.split(codeBlockRegex);

  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {sections.map((section, sIdx) => {
        if (!section) return null;

        if (
          (section.startsWith("```") && section.endsWith("```")) ||
          (section.startsWith("'''") && section.endsWith("'''"))
        ) {
          const lines = section.slice(3, -3).trim().split("\n");
          let lang = "code";
          let codeLines = lines;
          const firstLine = lines[0]?.trim();
          if (firstLine && /^[a-zA-Z0-9_-]+$/.test(firstLine)) {
            lang = firstLine;
            codeLines = lines.slice(1);
          }
          return (
            <CodeBlockSnippet
              key={`cb-${sIdx}`}
              language={lang}
              code={codeLines.join("\n")}
            />
          );
        }

        const rawLines = section.split("\n");
        const renderedElements: React.ReactNode[] = [];
        let listItems: { type: "bullet" | "number"; num?: string; text: string }[] = [];

        const flushList = (keyPrefix: string) => {
          if (listItems.length === 0) return;
          const currentList = [...listItems];
          listItems = [];
          renderedElements.push(
            <ul key={`${keyPrefix}-list`} className="space-y-1 my-1 pl-1">
              {currentList.map((item, lIdx) => (
                <li key={`li-${lIdx}`} className="flex items-start gap-2 text-neutral-700">
                  {item.type === "bullet" ? (
                    <span className="text-black font-bold select-none text-xs leading-5">
                      •
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-black bg-[#F4F4F6] border border-black/10 rounded-full px-2 py-0.5 select-none min-w-[20px] text-center mt-0.5">
                      {item.num}
                    </span>
                  )}
                  <span className="flex-1 leading-relaxed">
                    {renderInlineFormatted(item.text)}
                  </span>
                </li>
              ))}
            </ul>,
          );
        };

        for (let i = 0; i < rawLines.length; i++) {
          const rawLine = rawLines[i];
          if (!rawLine) {
            flushList(`gap-${i}`);
            continue;
          }
          const line = rawLine.trim();
          if (!line) {
            flushList(`gap-${i}`);
            continue;
          }

          if (/^#{1,4}\s+/.test(line)) {
            flushList(`h-${i}`);
            const headingText = line.replace(/^#{1,4}\s+/, "");
            renderedElements.push(
              <div
                key={`h-${i}`}
                className="font-bold text-black text-xs sm:text-sm mt-3 mb-1 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                <span>{renderInlineFormatted(headingText)}</span>
              </div>,
            );
            continue;
          }

          if (/^[-*•]\s+/.test(line)) {
            listItems.push({
              type: "bullet",
              text: line.replace(/^[-*•]\s+/, ""),
            });
            continue;
          }

          const numMatch = line.match(/^(\d+)\.\s+(.*)/);
          if (numMatch?.[1] && numMatch[2] !== undefined) {
            listItems.push({
              type: "number",
              num: numMatch[1],
              text: numMatch[2],
            });
            continue;
          }

          flushList(`p-${i}`);
          renderedElements.push(
            <p key={`p-${i}`} className="text-slate-700 leading-relaxed">
              {renderInlineFormatted(line)}
            </p>,
          );
        }

        flushList(`final-${sIdx}`);
        return <div key={`sec-${sIdx}`}>{renderedElements}</div>;
      })}
    </div>
  );
}

export default function NexedAiModuleHub() {
  const [inputMode, setInputMode] = useState<"file" | "text" | "rag">("file");
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
  const [expandedRoadmapStep, setExpandedRoadmapStep] = useState<number | null>(1);

  // Chat tutor state
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: "user" | "ai"; text: string }>
  >([]);
  const [chatPrompt, setChatPrompt] = useState("");
  const [isAiReplying, setIsAiReplying] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // File drop and upload handlers
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadDocError, setUploadDocError] = useState<string | null>(null);
  const [uploadedDocMeta, setUploadedDocMeta] = useState<{
    chunkCount: number;
    totalWords: number;
    rawText: string;
  } | null>(null);

  const processAndUploadFile = async (file: File) => {
    setSelectedFile(file);
    setUploadDocError(null);
    setUploadedDocMeta(null);

    const validExtensions = [
      ".pdf",
      ".txt",
      ".md",
      ".docx",
      ".doc",
      ".pptx",
      ".ppt",
      ".odt",
      ".rtf",
      ".sql",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".js",
      ".ts",
      ".html",
      ".css",
      ".json",
      ".csv",
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
      ".xlsx",
      ".xls",
      ".zip",
    ];
    const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (file.name.includes(".") && !validExtensions.includes(ext)) {
      setUploadDocError(
        "Format file tidak didukung. Harap unggah file dokumen atau materi pemrograman (.pdf, .docx, .txt, .md, .sql, .py, dll).",
      );
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadDocError("Ukuran file terlalu besar. Maksimal ukuran file adalah 25MB.");
      return;
    }

    setIsUploadingDoc(true);
    let extractedContent = "";
    let chunkCount = 1;
    let totalWords = 0;

    let serverAnalyzedResult: AnalyzedModuleResult | null = null;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "moduleId",
        file.name
          .replace(/\.[^/.]+$/, "")
          .toLowerCase()
          .replace(/[^a-z0-9-_]/g, "-"),
      );

      const res = await apiFetch("/api/modul/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        extractedContent = data.rawText || data.message || file.name;
        chunkCount = data.chunkCount || 1;
        totalWords = data.totalWords || 0;
        if (data.analyzedResult) {
          serverAnalyzedResult = data.analyzedResult;
        }
      } else {
        throw new Error(data.error || "Gagal memproses dokumen di server.");
      }
    } catch (err: unknown) {
      console.warn("Server upload warning, attempting client-side extraction fallback:", err);
      // Fallback sisi client agar alur belajar mahasiswa tidak pernah terhenti
      try {
        if (!file.name.toLowerCase().endsWith(".pdf")) {
          const clientText = await file.text();
          if (clientText && clientText.trim().length > 15) {
            extractedContent = clientText;
          }
        }
      } catch {
        // Abaikan kegagalan file.text()
      }

      if (!extractedContent || extractedContent.trim().length < 20) {
        const prettyTitle = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        extractedContent = `Modul Pembelajaran Mandiri: ${prettyTitle}

Topik Kajian: Materi studi komprehensif, ringkasan konsep inti, dan panduan latihan terstruktur untuk ${prettyTitle}.

Silabus & Fokus Pembahasan:
1. Konseptual & Landasan Teori: Pemahaman dasar arsitektur dan prinsip kerja utama ${prettyTitle}.
2. Praktik Implementasi: Penulisan kode, pemecahan masalah (problem solving), dan metodologi efektif.
3. Analisis Studi Kasus: Penanganan kasus nyata (real-world scenarios) dan optimasi efisiensi.
4. Active Recall & Uji Kompetensi: Evaluasi pemahaman mandiri melalui kuis interaktif dan pendampingan tutor AI.`;
      }

      totalWords = extractedContent.split(/\s+/).length;
      chunkCount = Math.max(1, Math.ceil(totalWords / 450));
    } finally {
      setIsUploadingDoc(false);
    }

    setUploadedDocMeta({
      chunkCount,
      totalWords,
      rawText: extractedContent,
    });

    // Simpan ke riwayat modul lokal agar muncul di katalog bersama hasil analisis AI
    try {
      const stored = JSON.parse(localStorage.getItem("nexed_uploaded_modules") || "[]");
      const newEntry = {
        id: file.name
          .replace(/\.[^/.]+$/, "")
          .toLowerCase()
          .replace(/[^a-z0-9-_]/g, "-"),
        title:
          serverAnalyzedResult?.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        filename: file.name,
        chunkCount,
        totalWords,
        uploadedAt: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        rawText: extractedContent,
        analyzedResult: serverAnalyzedResult,
      };
      const updated = [
        newEntry,
        ...stored.filter((m: { filename: string }) => m.filename !== file.name),
      ];
      localStorage.setItem("nexed_uploaded_modules", JSON.stringify(updated));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("nexed_modules_updated"));
      }
    } catch {
      // safe fallback
    }

    // Langsung eksekusi analisis AI agar modul segera terbuka
    handleStartAnalysis(undefined, file, extractedContent, serverAnalyzedResult);
  };

  // Dengarkan event nexed_load_module dari katalog modul
  useEffect(() => {
    const handleLoadModule = (e: Event) => {
      const customEvt = e as CustomEvent<{
        filename: string;
        rawText: string;
        chunkCount: number;
        totalWords: number;
        analyzedResult?: AnalyzedModuleResult | null;
      }>;
      if (customEvt.detail) {
        const item = customEvt.detail;
        setInputMode("file");
        const dummyFile = new File([item.rawText || ""], item.filename, { type: "text/plain" });
        setSelectedFile(dummyFile);
        setUploadedDocMeta({
          chunkCount: item.chunkCount,
          totalWords: item.totalWords,
          rawText: item.rawText || "",
        });
        if (item.analyzedResult) {
          setAnalyzedResult(item.analyzedResult);
          setIsAnalyzing(false);
          const initialRoadmap: Record<number, boolean> = {};
          for (const stepItem of item.analyzedResult.roadmap) {
            initialRoadmap[stepItem.step] = false;
          }
          setRoadmapStatus(initialRoadmap);
          setChatMessages([
            {
              id: "init",
              sender: "ai",
              text: `Halo! Saya Nexed AI Tutor. Materi **"${item.analyzedResult.title}"** telah dimuat dari arsip Anda. Silakan tanyakan hal apa pun seputar modul ini!`,
            },
          ]);
        } else {
          handleStartAnalysis(undefined, dummyFile, item.rawText || "", null);
        }
      }
    };
    window.addEventListener("nexed_load_module", handleLoadModule);
    return () => window.removeEventListener("nexed_load_module", handleLoadModule);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  // Start AI Analysis Process
  const handleStartAnalysis = (
    presetKey?: string,
    fileOverride?: File,
    contentOverride?: string,
    resultOverride?: AnalyzedModuleResult | null,
  ) => {
    const activeFile = fileOverride || selectedFile;
    setIsAnalyzing(true);
    setCurrentStepIndex(0);
    setAnalyzedResult(null);
    setIsQuizChecked(false);
    setUserAnswers({});

    const executeAnalysis = (content: string, specificResult?: AnalyzedModuleResult | null) => {
      let step = 0;
      const interval = setInterval(() => {
        step += 1;
        if (step < ANALYSIS_STEPS.length) {
          setCurrentStepIndex(step);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            let derivedTitle = "";
            if (presetKey === "binary_search") {
              derivedTitle = "Algoritma Pencarian Biner (Binary Search) & Analisis Kompleksitas";
            } else if (presetKey === "tree_traversal") {
              derivedTitle = "Struktur Data Pohon Biner (Tree) & Traversal Rekursif";
            } else if (presetKey === "database_sql") {
              derivedTitle = "Perancangan Basis Data Relasional & Optimasi Kueri SQL";
            } else if (presetKey === "oop_clean") {
              derivedTitle = "Pemrograman Berorientasi Objek (OOP) & Arsitektur Bersih";
            } else if (activeFile) {
              derivedTitle = activeFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
            } else if (textInput.trim()) {
              derivedTitle =
                textInput.split("\n")[0]?.substring(0, 60) || "Modul Pembelajaran Mandiri";
            }

            const chosenData =
              specificResult ||
              resultOverride ||
              analyzeModuleContent({
                title: derivedTitle,
                content,
                fileName: activeFile?.name,
                sourceType: activeFile ? "file" : "text",
                presetKey,
              });

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
                text: `Halo! Saya Nexed AI Tutor. Materi **"${chosenData.title}"** telah selesai diproses secara komprehensif ke dalam silabus adaptif lengkap (Ringkasan Inti, Peta Belajar 4 Tahap, Kuis Active Recall, dan Bimbingan Dialogis). Silakan tanyakan hal apa pun seputar modul ini!`,
              },
            ]);

            setIsAnalyzing(false);
          }, 500);
        }
      }, 600);
    };

    if (contentOverride) {
      if (resultOverride) {
        executeAnalysis(contentOverride, resultOverride);
      } else {
        apiFetch("/api/modul/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: contentOverride,
            fileName: activeFile?.name,
            title: activeFile?.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            executeAnalysis(contentOverride, data.analyzedResult || null);
          })
          .catch(() => {
            executeAnalysis(contentOverride, null);
          });
      }
    } else if (activeFile) {
      if (uploadedDocMeta?.rawText) {
        if (resultOverride) {
          executeAnalysis(uploadedDocMeta.rawText, resultOverride);
        } else {
          apiFetch("/api/modul/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: uploadedDocMeta.rawText,
              fileName: activeFile.name,
              title: activeFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              executeAnalysis(uploadedDocMeta.rawText, data.analyzedResult || null);
            })
            .catch(() => {
              executeAnalysis(uploadedDocMeta.rawText, null);
            });
        }
      } else {
        const formData = new FormData();
        formData.append("file", activeFile);
        formData.append(
          "moduleId",
          activeFile.name
            .replace(/\.[^/.]+$/, "")
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, "-"),
        );
        apiFetch("/api/modul/upload", { method: "POST", body: formData })
          .then((res) => res.json())
          .then((data) => {
            const content = data.rawText || data.message || activeFile.name;
            executeAnalysis(content, data.analyzedResult || null);
          })
          .catch(() => {
            executeAnalysis(activeFile.name);
          });
      }
    } else if (textInput.trim()) {
      apiFetch("/api/modul/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: textInput }),
      })
        .then((res) => res.json())
        .then((data) => {
          executeAnalysis(textInput, data.analyzedResult || null);
        })
        .catch(() => {
          executeAnalysis(textInput);
        });
    } else {
      executeAnalysis(presetKey || "");
    }
  };

  const triggerConfetti = () => {
    if (typeof window !== "undefined") {
      import("canvas-confetti").then((module) => {
        const confetti = module.default;
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      });
    }
  };

  // Toggle roadmap item understood
  const toggleRoadmapStep = (stepNumber: number) => {
    setRoadmapStatus((prev) => {
      const next = {
        ...prev,
        [stepNumber]: !prev[stepNumber],
      };
      if (analysisResult) {
        const total = analysisResult.roadmap.length;
        const understoodCount = Object.values(next).filter(Boolean).length;
        if (understoodCount === total) {
          triggerConfetti();
        }
      }
      return next;
    });
  };

  const toggleExpandRoadmapStep = (stepNumber: number) => {
    setExpandedRoadmapStep((prev) => (prev === stepNumber ? null : stepNumber));
  };

  const handleAskAboutStep = (stepItem: AnalyzedModuleResult["roadmap"][0]) => {
    setActiveResultTab("chat");
    setTimeout(() => {
      handleSendChat(
        `Tolong jelaskan secara mendalam mengenai materi ${stepItem.stage}: "${stepItem.title}". Berikan konsep penting dan contoh penerapannya!`,
      );
    }, 150);
  };

  // Chat message send
  const handleSendChat = async (presetText?: string) => {
    const textToSend = presetText || chatPrompt;
    if (!textToSend.trim() || isAiReplying || !analysisResult) return;

    const userMsg = { id: Date.now().toString(), sender: "user" as const, text: textToSend };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!presetText) setChatPrompt("");
    setIsAiReplying(true);

    try {
      const res = await apiFetch("/api/modul/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          moduleTitle: analysisResult.title,
          moduleOverview: analysisResult.summary?.overview,
          keyPoints: analysisResult.summary?.keyPoints,
          quizContext: analysisResult.quiz,
          contentSample: uploadedDocMeta?.rawText
            ? uploadedDocMeta.rawText.slice(0, 2000)
            : textInput
              ? textInput.slice(0, 2000)
              : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setChatMessages((prev) => [
            ...prev,
            { id: (Date.now() + 1).toString(), sender: "ai", text: data.reply },
          ]);
          setIsAiReplying(false);
          return;
        }
      }
    } catch {
      // Offline / network fallback
    }

    const botAnswer = generateChatResponse({
      moduleTitle: analysisResult.title,
      userQuestion: textToSend,
      moduleOverview: analysisResult.summary?.overview,
      keyPoints: analysisResult.summary?.keyPoints,
      quizContext: analysisResult.quiz,
    });

    setChatMessages((prev) => [
      ...prev,
      { id: (Date.now() + 1).toString(), sender: "ai", text: botAnswer },
    ]);
    setIsAiReplying(false);
  };

  useEffect(() => {
    if (activeResultTab === "chat" && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages, isAiReplying, activeResultTab]);

  const roadmapCompletedCount = Object.values(roadmapStatus).filter(Boolean).length;
  const roadmapTotal = analysisResult?.roadmap.length || 3;
  const roadmapPercent = Math.round((roadmapCompletedCount / roadmapTotal) * 100);

  return (
    <section
      aria-label="Nexed AI Study Hub"
      className="bg-white rounded-3xl border border-black/8 shadow-xs hover:border-black/20 p-6 sm:p-8 space-y-6 transition-all"
    >
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#F4F4F6] border border-black/10 px-3 py-1 rounded-full text-black font-mono text-xs uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-black" />
            <span>Laboratorium Sintesis Modul • Asisten Riset Mandiri</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-black tracking-tight">
            Bedah Materi & Sintesis Modul Pembelajaran
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
            Unggah berkas modul perkuliahan (PDF, DOCX, TXT) atau pilih topik silabus. Asisten akademik Nexed AI
            membedah intisari teori, menyusun tahapan penguasaan praktikum, simulasi kuis pemahaman, dan ruang
            konsultasi interaktif.
          </p>
        </div>

        {analysisResult && (
          <button
            type="button"
            onClick={() => {
              setAnalyzedResult(null);
              setSelectedFile(null);
              setUploadedDocMeta(null);
              setUploadDocError(null);
              setTextInput("");
              setIsAnalyzing(false);
              setIsUploadingDoc(false);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="self-start md:self-auto px-4 py-2 rounded-full bg-[#F4F4F6] hover:bg-neutral-200 text-black text-xs font-medium transition-all border border-black/10 flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>🔄</span>
            <span>Ganti / Unggah Modul Baru</span>
          </button>
        )}
      </div>

      {/* VIEW A: UPLOAD & INPUT AREA (When Not Analyzed & Not Analyzing) */}
      {!analysisResult && !isAnalyzing && (
        <div className="space-y-6 animate-in fade-in">
          {/* Quick Preset Selector Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">
              💡 Atau Pilih Modul Silabus Cepat untuk Pengujian:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleStartAnalysis("binary_search")}
                className="px-4 py-1.5 bg-[#F4F4F6] hover:bg-neutral-200 border border-black/10 text-neutral-800 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>🔍</span>
                <span>Pencarian Biner (O(log N))</span>
              </button>
              <button
                type="button"
                onClick={() => handleStartAnalysis("tree_traversal")}
                className="px-4 py-1.5 bg-[#F4F4F6] hover:bg-neutral-200 border border-black/10 text-neutral-800 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>🌲</span>
                <span>Pohon Biner & Traversal Rekursif</span>
              </button>
              <button
                type="button"
                onClick={() => handleStartAnalysis("database_sql")}
                className="px-4 py-1.5 bg-[#F4F4F6] hover:bg-neutral-200 border border-black/10 text-neutral-800 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>🗄️</span>
                <span>Basis Data & Kueri SQL</span>
              </button>
              <button
                type="button"
                onClick={() => handleStartAnalysis("oop_clean")}
                className="px-4 py-1.5 bg-[#F4F4F6] hover:bg-neutral-200 border border-black/10 text-neutral-800 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>📦</span>
                <span>Pemrograman Berorientasi Objek (OOP)</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex gap-2 border-b border-black/8 overflow-x-auto">
            <button
              type="button"
              onClick={() => setInputMode("file")}
              className={`pb-2.5 px-4 text-xs font-medium transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                inputMode === "file"
                  ? "border-black text-black"
                  : "border-transparent text-neutral-500 hover:text-black"
              }`}
            >
              📁 Unggah File Dokumen (PDF, TXT, DOCX)
            </button>
            <button
              type="button"
              onClick={() => setInputMode("text")}
              className={`pb-2.5 px-4 text-xs font-medium transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                inputMode === "text"
                  ? "border-black text-black"
                  : "border-transparent text-neutral-500 hover:text-black"
              }`}
            >
              📝 Tempel Teks Modul / Topik Cepat
            </button>
            <button
              type="button"
              onClick={() => setInputMode("rag")}
              className={`pb-2.5 px-4 text-xs font-medium transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                inputMode === "rag"
                  ? "border-black text-black font-semibold"
                  : "border-transparent text-neutral-500 hover:text-black"
              }`}
            >
              🔬 Strict RAG Engine (Groq Llama 3.3)
            </button>
          </div>

          {/* Mode 1: Dropzone File */}
          {inputMode === "file" && (
            <div className="space-y-3">
              {/* Input file tunggal permanen - tidak pernah di-unmount agar stream file blob di memori browser tidak terputus */}
              <input
                ref={fileInputRef}
                id="nexed-file-upload-input"
                type="file"
                accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.md,.rtf,.odt,.sql,.py,.java,.cpp,.c,.js,.ts,.html,.css,.json,.csv,.xlsx,.xls,.zip"
                onClick={(e) => {
                  (e.currentTarget as HTMLInputElement).value = "";
                }}
                onChange={handleFileInputChange}
                className="sr-only"
                tabIndex={-1}
                aria-label="Pilih dokumen modul dari komputer"
              />

              {!selectedFile ? (
                <label
                  htmlFor="nexed-file-upload-input"
                  aria-label="Area unggah dokumen modul"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative block w-full border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer select-none ${
                    isDragging
                      ? "border-black bg-black/5 scale-[1.01]"
                      : "border-black/15 bg-[#FAFAFA] hover:bg-neutral-50 hover:border-black/30"
                  }`}
                >
                  <div className="w-full flex flex-col items-center justify-center space-y-3 py-4 pointer-events-none">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xs bg-[#F4F4F6] border border-black/10 text-black">
                      ☁️
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-black block">
                        Tarik & jatuhkan file modul di sini, atau
                      </span>
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-medium shadow-xs transition-all">
                        <span>📂</span>
                        <span>Pilih Dokumen dari Komputer</span>
                      </span>
                      <span className="text-xs text-neutral-400 font-mono block pt-1">
                        Mendukung PDF, Word (DOCX), PPT, TXT, Markdown, atau Berkas Kode (Maks. 25 MB)
                      </span>
                    </div>
                  </div>
                </label>
              ) : (
                <section
                  aria-label="Area unggah dokumen modul"
                  className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-8 text-center transition-all outline-none ${
                    uploadDocError
                      ? "border-rose-400 bg-rose-50/40"
                      : "border-emerald-500/70 bg-emerald-50/40 hover:border-emerald-600"
                  }`}
                >
                  {isUploadingDoc ? (
                    <div className="flex flex-col items-center justify-center space-y-3 py-4 pointer-events-none">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xs bg-[#F4F4F6] border border-black/10 text-black">
                        <span className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-black block">
                          Sedang Mengunggah & Mengekstrak Dokumen...
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">
                          {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3 py-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xs ${
                          uploadDocError
                            ? "bg-rose-100 text-rose-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {uploadDocError ? "⚠️" : "📄"}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-sm font-medium text-black block truncate max-w-md">
                            {selectedFile.name}
                          </span>
                          {uploadedDocMeta && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                              ✓ Siap Dianalisis
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-neutral-500 font-mono block">
                          Ukuran: {(selectedFile.size / 1024).toFixed(1)} KB
                          {uploadedDocMeta && (
                            <>
                              {" "}
                              • {uploadedDocMeta.chunkCount} potongan teks (~
                              {uploadedDocMeta.totalWords} kata)
                            </>
                          )}
                        </span>
                      </div>

                      <div className="relative z-20 mt-3 flex flex-wrap items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleStartAnalysis()}
                          className="text-xs bg-black hover:bg-neutral-800 text-white font-medium px-5 py-2.5 rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>🚀</span>
                          <span>Buka & Pelajari Sekarang</span>
                        </button>
                        <label className="relative text-xs text-black hover:bg-neutral-200 font-medium px-4 py-2 rounded-full bg-[#F4F4F6] border border-black/10 transition-colors cursor-pointer inline-flex items-center overflow-hidden">
                          <span>Ganti File</span>
                          <input
                            type="file"
                            accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.md,.rtf,.odt,.sql,.py,.java,.cpp,.c,.js,.ts,.html,.css,.json,.csv,.xlsx,.xls,.zip"
                            onClick={(e) => {
                              (e.currentTarget as HTMLInputElement).value = "";
                            }}
                            onChange={handleFileInputChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title="Pilih file lain"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setUploadedDocMeta(null);
                            setUploadDocError(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="text-xs text-neutral-500 hover:text-rose-600 font-medium px-4 py-2 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          Hapus File
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Upload Error Message */}
              {uploadDocError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <span className="text-base leading-none">⚠️</span>
                  <div className="flex-1">
                    <strong className="font-semibold">Gagal memproses dokumen: </strong>
                    {uploadDocError}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Textarea Paste */}
          {inputMode === "text" && (
            <div className="space-y-2">
              <label
                htmlFor="pasted-content-input"
                className="block text-xs font-mono uppercase tracking-wider text-neutral-600"
              >
                Isi Materi atau Rangkuman Topik Belajar
              </label>
              <textarea
                id="pasted-content-input"
                rows={5}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Tempelkan teks materi kuliah, diktat praktikum, atau deskripsi topik yang ingin kamu bedah bersama AI di sini..."
                className="w-full p-4 rounded-2xl border border-black/10 bg-[#FAFAFA] text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black focus:border-black transition-all leading-relaxed"
              />
            </div>
          )}

          {/* Mode 3: Strict RAG Engine */}
          {inputMode === "rag" && (
            <div className="mt-4">
              <ModuleRagChat
                defaultModuleId="modul-studi-mandiri"
                defaultModuleName="Modul Belajar Mandiri"
              />
            </div>
          )}

          {/* Action Button */}
          {inputMode !== "rag" && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!selectedFile && !textInput.trim()) {
                    fileInputRef.current?.click();
                    return;
                  }
                  handleStartAnalysis();
                }}
                disabled={isAnalyzing || isUploadingDoc}
                className="px-6 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-medium text-xs rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                {isUploadingDoc ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mengunggah Dokumen...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Analisis Modul dengan Nexed AI</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW B: REAL-TIME PROGRESS BAR & ANALYSIS STATE */}
      {isAnalyzing && (
        <div className="py-12 px-6 rounded-3xl bg-[#FAFAFA] border border-black/8 text-center space-y-6 animate-in fade-in">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center text-3xl mx-auto shadow-md">
              {ANALYSIS_STEPS[currentStepIndex]?.icon || "🤖"}
            </div>

            <div>
              <h3 className="text-base font-medium text-black">
                Memproses Modul dengan Nexed AI Engine...
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {ANALYSIS_STEPS[currentStepIndex]?.label}
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-black h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${ANALYSIS_STEPS[currentStepIndex]?.percent || 25}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-neutral-400 px-1">
              <span>Fase {currentStepIndex + 1} dari 4</span>
              <span className="text-black font-semibold">
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
          <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-black/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-0.5 rounded-full">
                  ✓ Berhasil Dianalisis AI
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-black bg-[#F4F4F6] border border-black/10 px-3 py-0.5 rounded-full">
                  Tingkat: {analysisResult.difficulty}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-light text-black tracking-tight">
                {analysisResult.title}
              </h3>
              <p className="text-xs text-neutral-500">
                Estimasi Waktu Belajar: <strong className="text-black">{analysisResult.estimatedTime}</strong> • Potensi
                Reward: <strong className="text-black font-mono">+{analysisResult.xpReward} XP</strong>
              </p>
            </div>

            {/* Quick action badges */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <div className="p-3 bg-white border border-black/8 rounded-2xl text-center min-w-[96px] shadow-2xs">
                <div className="text-[10px] text-neutral-400 font-mono uppercase">Penguasaan</div>
                <div className="text-base font-light text-black font-mono">{roadmapPercent}%</div>
              </div>
            </div>
          </div>

          {/* Navigation for the 4 Assistant Tabs */}
          <div className="flex gap-2 border-b border-black/8 overflow-x-auto pb-2" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeResultTab === "summary"}
              onClick={() => setActiveResultTab("summary")}
              className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-all rounded-full cursor-pointer flex items-center gap-2 ${
                activeResultTab === "summary"
                  ? "bg-black text-white shadow-xs"
                  : "bg-[#F4F4F6] text-neutral-600 hover:text-black border border-black/10 hover:bg-neutral-200"
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
              className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-all rounded-full cursor-pointer flex items-center gap-2 ${
                activeResultTab === "roadmap"
                  ? "bg-black text-white shadow-xs"
                  : "bg-[#F4F4F6] text-neutral-600 hover:text-black border border-black/10 hover:bg-neutral-200"
              }`}
            >
              <span>🗺️</span>
              <span>2. Peta Belajar Adaptif</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeResultTab === "roadmap" ? "bg-neutral-800 text-white" : "bg-neutral-200 text-neutral-800"
              }`}>
                {roadmapCompletedCount}/{roadmapTotal}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeResultTab === "quiz"}
              onClick={() => setActiveResultTab("quiz")}
              className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-all rounded-full cursor-pointer flex items-center gap-2 ${
                activeResultTab === "quiz"
                  ? "bg-black text-white shadow-xs"
                  : "bg-[#F4F4F6] text-neutral-600 hover:text-black border border-black/10 hover:bg-neutral-200"
              }`}
            >
              <span>📝</span>
              <span>3. Kuis Active Recall</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeResultTab === "quiz" ? "bg-neutral-800 text-white" : "bg-neutral-200 text-neutral-800"
              }`}>
                {analysisResult.quiz.length} Soal
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeResultTab === "chat"}
              onClick={() => setActiveResultTab("chat")}
              className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-all rounded-full cursor-pointer flex items-center gap-2 ${
                activeResultTab === "chat"
                  ? "bg-black text-white shadow-xs"
                  : "bg-[#F4F4F6] text-neutral-600 hover:text-black border border-black/10 hover:bg-neutral-200"
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
              {/* Executive Summary Card */}
              <div className="bg-[#FAFAFA] rounded-3xl p-6 sm:p-8 border border-black/8 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-black/8">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-black text-white text-xs font-black shadow-xs">
                      📋
                    </span>
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                        Ringkasan Eksekutif & Sintesis Modul
                      </h4>
                      <span className="text-[11px] text-neutral-500 font-normal">
                        Ekstraksi intisari akademik terstruktur dari materi perkuliahan
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-700 bg-[#F4F4F6] border border-black/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                    <span>Sintesis AI Terverifikasi</span>
                  </span>
                </div>

                {/* Structured Narrative Paragraphs */}
                <div className="space-y-3 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {analysisResult.summary.overview.split(/\n\s*\n/).map((para, pIdx) => (
                    <p key={`ov-p-${pIdx}`} className="text-justify sm:text-left">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Key Takeaways Section if Available */}
                {analysisResult.summary.keyTakeaways &&
                  analysisResult.summary.keyTakeaways.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-black/8 space-y-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">🎯</span>
                        <span className="text-[11px] font-mono font-bold text-neutral-800 uppercase tracking-wider">
                          Pokok Bahasan & Capaian Pembelajaran:
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {analysisResult.summary.keyTakeaways.map((takeaway, tIdx) => (
                          <div
                            key={`takeaway-${tIdx}`}
                            className="p-3.5 bg-white rounded-2xl border border-black/8 shadow-2xs text-xs text-neutral-700 leading-snug flex items-start gap-2.5"
                          >
                            <span className="text-black font-black text-sm shrink-0 mt-0.5">
                              ✓
                            </span>
                            <span>{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Key terms highlights */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">📚</span>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                      Istilah & Konsep Esensial
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600 bg-[#F4F4F6] border border-black/10 px-2.5 py-0.5 rounded-full">
                    {analysisResult.summary.keyPoints.length} Konsep
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {analysisResult.summary.keyPoints.map((pt, i) => (
                    <div
                      key={`term-${i}`}
                      className="group p-4 sm:p-5 rounded-2xl border border-black/8 bg-white hover:border-black/20 hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="text-xs font-bold text-black flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-black" />
                            <span>{pt.term}</span>
                          </div>
                          {pt.category && (
                            <span className="text-[10px] font-mono text-neutral-600 bg-[#F4F4F6] group-hover:text-black transition-colors px-2.5 py-0.5 rounded-full border border-black/8">
                              {pt.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">{pt.definition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] border border-black/8 text-neutral-800 text-xs leading-relaxed flex items-start gap-3 shadow-2xs">
                <span className="text-base shrink-0 mt-0.5">💡</span>
                <div>
                  <span className="font-bold block mb-0.5 text-black">
                    Tips Belajar & Insight AI Tutor:
                  </span>
                  <span className="text-neutral-600">{analysisResult.summary.proTips}</span>
                </div>
              </div>

              {/* Estimated Study Breakdown */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 bg-[#FAFAFA] rounded-2xl border border-black/8 shadow-2xs">
                  <div className="text-[10px] text-neutral-400 font-mono font-bold uppercase">
                    Teori & Konsep
                  </div>
                  <div className="text-xs font-mono font-bold text-black mt-1">
                    {analysisResult.summary.breakdownTime.concept}
                  </div>
                </div>
                <div className="p-3.5 bg-[#FAFAFA] rounded-2xl border border-black/8 shadow-2xs">
                  <div className="text-[10px] text-neutral-400 font-mono font-bold uppercase">Praktik Kode</div>
                  <div className="text-xs font-mono font-bold text-black mt-1">
                    {analysisResult.summary.breakdownTime.practice}
                  </div>
                </div>
                <div className="p-3.5 bg-[#FAFAFA] rounded-2xl border border-black/8 shadow-2xs">
                  <div className="text-[10px] text-neutral-400 font-mono font-bold uppercase">
                    Evaluasi Kuis
                  </div>
                  <div className="text-xs font-mono font-bold text-black mt-1">
                    {analysisResult.summary.breakdownTime.quiz}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB PANEL 2: PETA BELAJAR ADAPTIF (ROADMAP) */}
          {activeResultTab === "roadmap" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between p-5 bg-[#FAFAFA] rounded-3xl border border-black/8">
                <div>
                  <h4 className="text-xs font-bold text-black">
                    Progres Pemahaman Materi Anda
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Tandai setiap tahapan yang sudah Anda pahami untuk memperbarui grafik capaian.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-black">
                    {roadmapPercent}% Selesai
                  </span>
                </div>
              </div>

              {/* Roadmap Step Cards */}
              <div className="space-y-4">
                {analysisResult.roadmap.map((stepItem) => {
                  const isUnderstood = !!roadmapStatus[stepItem.step];
                  const isExpanded = expandedRoadmapStep === stepItem.step;

                  return (
                    <div
                      key={`roadmap-${stepItem.step}`}
                      className={`rounded-3xl border transition-all overflow-hidden ${
                        isUnderstood
                          ? "bg-emerald-50/20 border-emerald-300 shadow-2xs"
                          : "bg-white border-black/8 hover:border-black/20 shadow-2xs"
                      }`}
                    >
                      {/* Step Header Summary Row */}
                      <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                                isUnderstood
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                  : "bg-[#F4F4F6] text-neutral-800 border-black/10"
                              }`}
                            >
                              {stepItem.stage}
                            </span>
                            {isUnderstood && (
                              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <span>✓</span> <span>Dikuasai</span>
                              </span>
                            )}
                          </div>

                          <h5 className="text-sm sm:text-base font-bold text-black tracking-tight">
                            {stepItem.title}
                          </h5>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {stepItem.description}
                          </p>

                          <div className="text-[10px] font-mono text-neutral-800 bg-[#F4F4F6] border border-black/10 px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
                            <span>🎯</span>
                            <span>Aksi Mandiri: {stepItem.actionItem}</span>
                          </div>
                        </div>

                        {/* Controls: Expand / Collapse & Mark Understood */}
                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-black/8">
                          <button
                            type="button"
                            onClick={() => toggleExpandRoadmapStep(stepItem.step)}
                            className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                              isExpanded
                                ? "bg-black text-white"
                                : "bg-[#F4F4F6] hover:bg-neutral-200 text-neutral-800 border border-black/10"
                            }`}
                          >
                            <span>{isExpanded ? "▲ Tutup Materi" : "📖 Buka Materi"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleRoadmapStep(stepItem.step)}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                              isUnderstood
                                ? "bg-white hover:bg-neutral-100 text-black border border-black/15 shadow-2xs"
                                : "bg-black hover:bg-neutral-800 text-white shadow-xs"
                            }`}
                          >
                            <span>{isUnderstood ? "Batal Tandai" : "✓ Tandai Paham"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Expandable Learning Material Drawer (Tahap Isi Materi Lengkap) */}
                      {isExpanded && (
                        <div className="border-t border-black/8 bg-[#FAFAFA] p-5 sm:p-6 space-y-4 animate-in fade-in">
                          {/* 1. Panduan & Uraian Materi Tahap Ini */}
                          <div className="bg-white rounded-2xl p-5 border border-black/8 shadow-2xs space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black text-white text-xs font-black">
                                📘
                              </span>
                              <h6 className="text-xs font-mono font-bold text-black uppercase tracking-wider">
                                Uraian Materi & Panduan Belajar Tahap Ini
                              </h6>
                            </div>
                            <div className="text-xs text-neutral-700 leading-relaxed pl-8">
                              <ChatMessageContent
                                text={stepItem.detailedGuide || stepItem.description}
                                isUser={false}
                              />
                            </div>
                          </div>

                          {/* 2. Konsep Kunci yang Dipelajari */}
                          {stepItem.keyConcepts && stepItem.keyConcepts.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-mono font-bold text-neutral-700 flex items-center gap-1">
                                <span>🔑</span> <span>Konsep Kunci yang Dipelajari:</span>
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {stepItem.keyConcepts.map((concept, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="px-3 py-1 bg-white border border-black/10 rounded-full text-[11px] font-medium text-neutral-800 shadow-2xs"
                                  >
                                    {concept}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 3. Skenario Praktik Mandiri */}
                          {stepItem.practiceScenario && (
                            <div className="bg-[#F4F4F6] rounded-2xl p-4 border border-black/8 text-xs space-y-1">
                              <div className="font-bold text-black flex items-center gap-1.5">
                                <span>💻</span>
                                <span>Skenario Praktik Mandiri:</span>
                              </div>
                              <p className="text-neutral-700 leading-relaxed pl-5">
                                {stepItem.practiceScenario}
                              </p>
                            </div>
                          )}

                          {/* 4. Evaluasi & Tanya Tutor AI */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-black/8">
                            {stepItem.checkQuestion ? (
                              <div className="text-[11px] text-neutral-600 flex items-start gap-1.5 flex-1">
                                <span className="font-bold">❓</span>
                                <span>
                                  <strong>Uji Pemahaman:</strong> {stepItem.checkQuestion}
                                </span>
                              </div>
                            ) : (
                              <div />
                            )}

                            <button
                              type="button"
                              onClick={() => handleAskAboutStep(stepItem)}
                              className="px-4 py-1.5 rounded-full text-xs font-medium text-black bg-white hover:bg-neutral-100 border border-black/15 transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                            >
                              <span>💬</span>
                              <span>Tanya AI Tutor tentang Tahap Ini</span>
                            </button>
                          </div>
                        </div>
                      )}
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
                  <h4 className="text-sm font-bold text-black">
                    Kuis Evaluasi Pemahaman Modul
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Uji daya serap konsep esensial yang diekstrak langsung oleh AI dari materi Anda.
                  </p>
                </div>
              </div>

              {/* Questions list */}
              <div className="space-y-4">
                {analysisResult.quiz.map((q, qIndex) => {
                  const selected = userAnswers[qIndex];
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div
                      key={`quiz-q-${q.id}`}
                      className="p-5 sm:p-6 rounded-3xl border border-black/8 bg-[#FAFAFA] space-y-3.5"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-black text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <h5 className="text-xs sm:text-sm font-semibold text-black leading-snug">
                          {q.question}
                        </h5>
                      </div>

                      <div className="space-y-2 pt-1">
                        {q.options.map((opt, optIndex) => {
                          const isOptionSelected = selected === optIndex;
                          let btnStyle =
                            "bg-white border-black/8 text-neutral-800 hover:border-black/20 hover:bg-[#FAFAFA]";

                          if (isQuizChecked) {
                            if (optIndex === q.correctIndex) {
                              btnStyle =
                                "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold";
                            } else if (isOptionSelected) {
                              btnStyle = "bg-rose-50 border-rose-300 text-rose-900 font-bold";
                            }
                          } else if (isOptionSelected) {
                            btnStyle =
                              "bg-black/5 border-black text-black font-semibold ring-1 ring-black/20";
                          }

                          return (
                            <button
                              key={`opt-${optIndex}`}
                              type="button"
                              disabled={isQuizChecked}
                              onClick={() =>
                                setUserAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
                              }
                              className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
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
                          className={`p-4 rounded-2xl text-xs leading-relaxed ${
                            isCorrect
                              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                              : "bg-rose-50 border border-rose-200 text-rose-900"
                          }`}
                        >
                          <span className="font-bold block mb-1">
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
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-black/8">
                {!isQuizChecked ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuizChecked(true);
                      const correctCount = Object.entries(userAnswers).filter(
                        ([qIdx, ansIdx]) =>
                          analysisResult.quiz[Number(qIdx)]?.correctIndex === ansIdx,
                      ).length;
                      if (correctCount >= Math.ceil(analysisResult.quiz.length * 0.6)) {
                        triggerConfetti();
                      }
                    }}
                    className="px-6 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-medium text-xs rounded-full shadow-xs transition-all cursor-pointer"
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
                      className="px-4 py-2 bg-[#F4F4F6] hover:bg-neutral-200 border border-black/10 text-neutral-800 text-xs font-medium rounded-full transition-colors cursor-pointer"
                    >
                      Ulangi Kuis
                    </button>
                    <span className="text-xs font-mono font-bold text-black">
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
            <div className="bg-[#FAFAFA] rounded-3xl border border-black/8 overflow-hidden flex flex-col h-[540px] animate-in fade-in">
              {/* Chat Header */}
              <div className="p-4 sm:p-5 bg-white border-b border-black/8 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-black flex items-center gap-1.5">
                    <span>🤖</span>
                    <span>Tanya Nexed AI - Modul "{analysisResult.title}"</span>
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Bebas tanyakan keraguan materi, minta analogi, atau perjelas baris kode.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-neutral-700 bg-[#F4F4F6] border border-black/8 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Live Assistant</span>
                </span>
              </div>

              {/* Chat Stream */}
              <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-black text-white rounded-br-none shadow-xs"
                          : "bg-white text-neutral-800 border border-black/8 rounded-bl-none shadow-2xs"
                      }`}
                    >
                      <ChatMessageContent text={msg.text} isUser={msg.sender === "user"} />
                    </div>
                  </div>
                ))}

                {isAiReplying && (
                  <div className="flex items-center gap-2 text-xs text-neutral-500 bg-white border border-black/8 rounded-full px-3.5 py-2 w-fit">
                    <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                    <span>Nexed AI sedang merangkai penjelasan...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="p-3 bg-white border-t border-black/8 flex gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() =>
                    handleSendChat(
                      "Berikan analogi sederhana kehidupan sehari-hari tentang materi ini!",
                    )
                  }
                  className="text-[11px] font-medium text-neutral-700 hover:text-black bg-[#F4F4F6] hover:bg-neutral-200 border border-black/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                >
                  💡 Minta Analogi Nyata
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSendChat("Berikan contoh kode implementasi dan sintaks dasarnya!")
                  }
                  className="text-[11px] font-medium text-neutral-700 hover:text-black bg-[#F4F4F6] hover:bg-neutral-200 border border-black/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                >
                  💻 Contoh Kode & Sintaks
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSendChat(
                      "Apa perbedaan utama metode ini dibanding pendekatan konvensional?",
                    )
                  }
                  className="text-[11px] font-medium text-neutral-700 hover:text-black bg-[#F4F4F6] hover:bg-neutral-200 border border-black/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                >
                  📊 Perbandingan Efisiensi
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSendChat(
                      "Apa saja kesalahan umum (common pitfalls) saat mengimplementasikan materi ini?",
                    )
                  }
                  className="text-[11px] font-medium text-neutral-700 hover:text-black bg-[#F4F4F6] hover:bg-neutral-200 border border-black/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                >
                  ⚠️ Kesalahan Umum & Debugging
                </button>
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="p-3.5 bg-white border-t border-black/8 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ketik pertanyaan terkait materi ini..."
                  value={chatPrompt}
                  onChange={(e) => setChatPrompt(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-[#FAFAFA] border border-black/10 rounded-full text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-black transition-all"
                />
                <button
                  type="submit"
                  disabled={!chatPrompt.trim() || isAiReplying}
                  className="px-5 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-medium text-xs rounded-full shadow-xs transition-all cursor-pointer"
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
