// src/components/ModuleRagChat.tsx
"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface ModuleRagChatProps {
  defaultModuleId?: string;
  defaultModuleName?: string;
  className?: string;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  usedChunks?: number;
}

interface IndexedModuleInfo {
  moduleId: string;
  filename: string;
  chunkCount: number;
  totalWords: number;
  indexedAt: string;
}

export default function ModuleRagChat({
  defaultModuleId = "modul-pribadi",
  defaultModuleName = "Modul Kuliah Saya",
  className = "",
}: ModuleRagChatProps) {
  // Upload State
  const [moduleId, setModuleId] = useState(defaultModuleId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [indexedModule, setIndexedModule] = useState<IndexedModuleInfo | null>(null);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      sender: "ai",
      text: "Halo! Saya adalah **NEXED AI Tutor** yang beroperasi dalam mode **Strict RAG**.\n\nSilakan unggah dokumen materi kuliah Anda (.pdf, .txt, atau .md) di panel sebelah kiri. Saya akan menjawab pertanyaan Anda **hanya berdasarkan teks dokumen tersebut** secara faktual tanpa mengarang.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Update default module id when props change
  useEffect(() => {
    if (defaultModuleId) {
      setModuleId(defaultModuleId);
    }
  }, [defaultModuleId]);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiSearching]);

  // Handle Drag & Drop
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
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
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
    ];
    const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!validExtensions.includes(ext)) {
      setUploadError("Format file tidak didukung. Harap unggah file .pdf, .txt, atau .md.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("Ukuran file terlalu besar. Maksimal ukuran file adalah 20MB.");
      return;
    }
    setSelectedFile(file);
  };

  // Upload & Index Module to Backend
  const handleUploadAndIndex = async () => {
    if (!selectedFile) {
      setUploadError("Silakan pilih file dokumen terlebih dahulu.");
      return;
    }

    const currentId = moduleId.trim() || `modul-${Date.now()}`;
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("moduleId", currentId);

      const response = await fetch("/api/modul/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengunggah dan mengindeks modul.");
      }

      const newIndexedInfo: IndexedModuleInfo = {
        moduleId: currentId,
        filename: data.filename || selectedFile.name,
        chunkCount: data.chunkCount || 0,
        totalWords: data.totalWords || 0,
        indexedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setIndexedModule(newIndexedInfo);

      // Add system announcement in chat
      setMessages((prev) => [
        ...prev,
        {
          id: `index-${Date.now()}`,
          sender: "ai",
          text: `📄 Modul **"${newIndexedInfo.filename}"** berhasil diindeks!\n• **ID Modul:** \`${newIndexedInfo.moduleId}\`\n• **Jumlah Potongan Teks:** ${newIndexedInfo.chunkCount} chunk (~${newIndexedInfo.totalWords} kata)\n\nSekarang Anda dapat mengajukan pertanyaan apa pun seputar modul ini.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan saat mengunggah modul.";
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Send Chat Message
  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isAiSearching) return;

    if (!indexedModule) {
      setChatError("Harap unggah dan indeks modul terlebih dahulu sebelum bertanya.");
      return;
    }

    setChatError(null);
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery("");
    setIsAiSearching(true);

    try {
      const res = await fetch("/api/modul/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: indexedModule.moduleId,
          message: textToSend.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mendapatkan balasan dari AI.");
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.reply,
        usedChunks: data.usedChunks,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kendala saat memproses jawaban.";
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: `⚠️ Maaf, terjadi kesalahan: ${errorMessage}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Reset / Clear Chat History
  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "ai",
        text: "Sesi percakapan telah dibersihkan. Silakan ajukan pertanyaan baru mengenai modul yang telah diindeks.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setChatError(null);
  };

  const starterPrompts = [
    "Apa poin utama yang dibahas dalam modul ini?",
    "Jelaskan istilah kunci yang disebutkan dalam dokumen!",
    "Buatkan ringkasan ringkas dari materi ini.",
  ];

  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl p-4 sm:p-6 text-slate-900 shadow-xs font-['Outfit'] antialiased ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Mode: Strict RAG (Hanya Berdasarkan Modul)
            </span>
            <span className="text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
              Engine: Groq Llama 3.3 70B &bull; Temp: 0
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>🔬</span>
            <span>RAG Document Q&A Hub</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tanyakan materi kuliah{" "}
            <strong className="text-blue-700 font-semibold">"{defaultModuleName}"</strong> dan dapatkan
            jawaban faktual langsung dari kutipan dokumen tanpa halusinasi.
          </p>
        </div>

        {/* Clear chat button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleClearChat}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 flex items-center gap-1.5 cursor-pointer"
            title="Bersihkan riwayat percakapan"
          >
            <span>🗑️</span>
            <span>Bersihkan Chat</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Upload Panel (Left) & Chatbot Window (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* =========================================================================
            PANEL 1: UNGGAH MODUL PRIBADI (Col Span 5)
           ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>📁</span>
                  <span>Panel Unggah Modul</span>
                </h3>
                {indexedModule && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                    ✓ Terindeks
                  </span>
                )}
              </div>

              {/* Module Identifier */}
              <div className="space-y-1.5 mb-4">
                <label
                  htmlFor="nexed-module-id-input"
                  className="block text-[11px] font-semibold text-slate-700"
                >
                  ID Modul / Target Topik
                </label>
                <input
                  id="nexed-module-id-input"
                  type="text"
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                  placeholder="Contoh: modul-1 atau struktur-data"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>

              {/* Dropzone Area */}
              {/* Single persistent file input - never unmounted */}
              <input
                ref={fileInputRef}
                id="nexed-rag-file-input"
                type="file"
                accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.md,.rtf,.odt,.sql,.py,.java,.cpp,.c,.js,.ts,.html,.css,.json,.csv"
                onClick={(e) => {
                  (e.currentTarget as HTMLInputElement).value = "";
                }}
                onChange={handleFileChange}
                className="sr-only"
                tabIndex={-1}
                aria-label="Pilih dokumen modul"
              />

              {!selectedFile ? (
                <label
                  htmlFor="nexed-rag-file-input"
                  aria-label="Area unggah file modul"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative block w-full border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer select-none ${
                    isDragging
                      ? "border-blue-500 bg-blue-50/70"
                      : "border-slate-300 bg-white hover:bg-slate-50/80 hover:border-slate-400"
                  }`}
                >
                  <div className="pointer-events-none flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl border border-blue-200">
                      ☁️
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Seret & lepas file ke sini, atau{" "}
                        <span className="text-blue-600 font-bold underline">pilih file</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Mendukung dokumen .PDF, .TXT, dan .MD (Maks 20MB)
                      </p>
                    </div>
                  </div>
                </label>
              ) : (
                <section
                  aria-label="Area unggah file modul"
                  className="relative overflow-hidden border-2 border-dashed rounded-xl p-6 text-center transition-colors border-emerald-500 bg-emerald-50/40"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl border border-emerald-300">
                      📄
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-900 break-all">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <label
                      htmlFor="nexed-rag-file-input"
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold mt-1 cursor-pointer underline inline-block"
                    >
                      Klik untuk ganti file
                    </label>
                  </div>
                </section>
              )}

              {/* Upload Error Alert */}
              {uploadError && (
                <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <span>⚠️</span>
                  <div className="flex-1 font-medium">{uploadError}</div>
                </div>
              )}
            </div>

            {/* Bottom of Upload Panel: Index Button & Status Info */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                id="btn-upload-index-module"
                disabled={!selectedFile || isUploading}
                onClick={handleUploadAndIndex}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mengekstrak Teks & Mengindeks...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Unggah & Indeks Modul</span>
                  </>
                )}
              </button>

              {/* Indexed Status Card */}
              {indexedModule && (
                <div className="p-3 bg-white rounded-lg border border-emerald-300 text-[11px] text-slate-700 space-y-1">
                  <div className="flex items-center justify-between text-emerald-700 font-bold">
                    <span className="flex items-center gap-1">
                      <span>✓</span>
                      <span>Siap Ditanyakan</span>
                    </span>
                    <span className="text-slate-400 text-[10px]">{indexedModule.indexedAt}</span>
                  </div>
                  <div className="truncate text-slate-900 font-medium">
                    {indexedModule.filename}
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-[10px]">
                    <span>{indexedModule.chunkCount} chunk tersimpan</span>
                    <span>&bull;</span>
                    <span>~{indexedModule.totalWords} kata</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            PANEL 2: WINDOW CHATBOT RAG (Col Span 7)
           ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col h-[560px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          {/* Chat Window Header */}
          <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm border border-blue-200">
                🤖
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Asisten Tutor NexedAI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[10px] text-slate-500">
                  {indexedModule ? (
                    <span>
                      Modul: <strong className="text-blue-700 font-semibold">{indexedModule.filename}</strong> (
                      {indexedModule.chunkCount} chunk)
                    </span>
                  ) : (
                    <span>Menunggu unggahan modul...</span>
                  )}
                </div>
              </div>
            </div>

            {indexedModule && (
              <span className="hidden sm:inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                Strict Verified
              </span>
            )}
          </div>

          {/* Conversation Area */}
          <section
            aria-label="Riwayat percakapan modul"
            className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-100/60 text-xs"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-xl p-3.5 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {msg.usedChunks !== undefined && msg.usedChunks > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center gap-1 text-[10px] text-blue-700 font-semibold">
                      <span>🔍</span>
                      <span>Dijawab berdasarkan {msg.usedChunks} potongan teks relevan</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Loading Search State */}
            {isAiSearching && (
              <div className="flex items-center gap-2.5 text-xs text-blue-700 bg-white border border-blue-200 rounded-xl px-3.5 py-2.5 w-fit shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="font-semibold">NEXED AI sedang mencari di dalam dokumen...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </section>

          {/* Chat Error Notice */}
          {chatError && (
            <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs flex items-center justify-between">
              <span>⚠️ {chatError}</span>
              <button
                type="button"
                onClick={() => setChatError(null)}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Quick Starter Suggestions */}
          {indexedModule && (
            <div className="px-3 py-2 bg-white border-t border-slate-200 flex gap-2 overflow-x-auto">
              {starterPrompts.map((prompt, idx) => (
                <button
                  key={`quick-${idx}`}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isAiSearching}
                  className="text-[11px] text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1 rounded-full shrink-0 transition-colors cursor-pointer disabled:opacity-50"
                >
                  💡 {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Field & Send Action */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              id="nexed-rag-chat-input"
              placeholder={
                indexedModule
                  ? "Tanyakan isi modul ini... (Tekan Enter)"
                  : "Unggah dokumen modul terlebih dahulu untuk bertanya..."
              }
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isAiSearching}
              className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:opacity-60 transition-colors"
            />
            <button
              type="submit"
              id="btn-send-rag-query"
              disabled={!inputQuery.trim() || isAiSearching}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span>Kirim</span>
              <span>&rarr;</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
