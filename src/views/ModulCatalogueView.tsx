// src/views/ModulCatalogueView.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NexedAiModuleHub, { type AnalyzedModuleResult } from "../components/NexedAiModuleHub";
import { LEARNING_TOPICS, type LearningTopic } from "../data/learningTopics";

export default function ModulCatalogueView() {
  const [completedIds, setCompletedIds] = useState<number[]>([1, 2]);
  const [filter, setFilter] = useState<"all" | "completed" | "recommended" | "locked">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedModules, setUploadedModules] = useState<
    Array<{
      id: string;
      title: string;
      filename: string;
      chunkCount: number;
      totalWords: number;
      uploadedAt: string;
      rawText: string;
      analyzedResult?: AnalyzedModuleResult | null;
    }>
  >([]);

  const loadUploadedModules = () => {
    try {
      const saved = localStorage.getItem("nexed_uploaded_modules");
      if (saved) {
        setUploadedModules(JSON.parse(saved));
      } else {
        setUploadedModules([]);
      }
    } catch {
      // safe fallback
    }
  };

  useEffect(() => {
    loadUploadedModules();
    const handleUpdate = () => loadUploadedModules();
    window.addEventListener("nexed_modules_updated", handleUpdate);
    return () => window.removeEventListener("nexed_modules_updated", handleUpdate);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("completed_topics");
      if (saved) {
        setCompletedIds(JSON.parse(saved));
      }
    } catch {
      // safe fallback
    }
  }, []);

  const totalXp = LEARNING_TOPICS.reduce((acc, t) => acc + t.xp, 0);
  const earnedXp = LEARNING_TOPICS.filter((t) => completedIds.includes(t.id)).reduce(
    (acc, t) => acc + t.xp,
    0,
  );

  const filteredTopics = LEARNING_TOPICS.filter((topic) => {
    const isCompleted = completedIds.includes(topic.id);
    let status: "completed" | "recommended" | "locked" = topic.status;
    if (isCompleted) status = "completed";

    if (filter !== "all" && status !== filter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.meeting.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-black font-['Inter',sans-serif] antialiased">
      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-black/8 sticky top-0 z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
              <span>Portal Akademik Mahasiswa</span>
              <span className="text-black/20">/</span>
              <span className="text-black font-semibold">D3 TI SV UNS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-light text-black tracking-tight">
              Katalog Modul Praktikum & Asisten Riset Adaptif
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-xs font-medium px-4 py-2 rounded-full bg-[#F4F4F6] hover:bg-neutral-200 text-black transition-colors border border-black/10 shadow-2xs"
            >
              &larr; Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* FITUR UTAMA 1: LIVE AI MODULE STUDY HUB (UPLOAD & ADAPTIVE ASSISTANT) */}
        <NexedAiModuleHub />

        {/* FITUR 1.5: DOKUMEN MODUL PRIBADI MAHASISWA */}
        {uploadedModules.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-black/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-black bg-[#F4F4F6] border border-black/10 px-2.5 py-0.5 rounded-full mb-1 inline-block">
                  Arsip Berkas Praktikum
                </span>
                <h2 className="text-xl font-light text-black tracking-tight">
                  Modul Mandiri Terunggah ({uploadedModules.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUploadedModules([]);
                  localStorage.removeItem("nexed_uploaded_modules");
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("nexed_modules_updated"));
                  }
                }}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-[#F4F4F6] hover:bg-rose-50 hover:text-rose-600 text-neutral-600 text-xs font-medium transition-colors border border-black/10 hover:border-rose-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Hapus seluruh riwayat modul yang diunggah"
              >
                <span>Bersihkan Riwayat Modul</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {uploadedModules.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-black/8 p-6 shadow-xs hover:border-black/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase text-black bg-[#F4F4F6] border border-black/10 px-2.5 py-0.5 rounded-full">
                        {item.filename.split(".").pop() || "DOC"}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {item.uploadedAt}
                      </span>
                    </div>

                    <h3 className="text-sm font-medium text-black line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mb-4 truncate font-mono">
                      {item.filename} &bull; {item.chunkCount} chunk ({item.totalWords} kata)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-black/5">
                    <button
                      type="button"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        const evt = new CustomEvent("nexed_load_module", { detail: item });
                        window.dispatchEvent(evt);
                      }}
                      className="flex-1 py-2 px-4 bg-black hover:bg-neutral-800 text-white font-medium text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Pelajari Sekarang &rarr;</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next = uploadedModules.filter((m) => m.id !== item.id);
                        setUploadedModules(next);
                        localStorage.setItem("nexed_uploaded_modules", JSON.stringify(next));
                      }}
                      className="p-2 text-neutral-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer text-xs"
                      title="Hapus modul dari daftar"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FITUR 2: MODUL KURIKULUM RESMI */}
        <div className="space-y-6 pt-4 border-t border-black/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-black bg-[#F4F4F6] border border-black/10 px-3 py-0.5 rounded-full mb-1.5 inline-block">
                Kurikulum Resmi D3 TI SV UNS
              </span>
              <h2 className="text-xl font-light text-black tracking-tight">
                Silabus Modul Praktikum Terstruktur
              </h2>
            </div>

            {/* Quick Completion Stats */}
            <div className="text-xs font-mono text-neutral-600 bg-[#F4F4F6] border border-black/10 px-3.5 py-1.5 rounded-full shadow-2xs self-start sm:self-auto">
              <span>
                {completedIds.length} dari {LEARNING_TOPICS.length} Modul Tuntas
              </span>
              <span className="text-black/20 mx-2">•</span>
              <span className="font-semibold text-black">
                {earnedXp} / {totalXp} XP
              </span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-black/8 shadow-xs">
            {/* Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist">
              {(["all", "completed", "recommended", "locked"] as const).map((status) => {
                const isActive = filter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-black text-white shadow-xs"
                        : "bg-[#F4F4F6] text-neutral-600 border border-black/10 hover:bg-neutral-200 hover:text-black"
                    }`}
                  >
                    {status === "all" && "Semua Modul"}
                    {status === "completed" && "Selesai"}
                    {status === "recommended" && "Rekomendasi"}
                    {status === "locked" && "Terkunci"}
                  </button>
                );
              })}
            </div>

            {/* Search input */}
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Cari modul atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-[#FAFAFA] border border-black/10 rounded-full text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic: LearningTopic) => {
              const isCompleted = completedIds.includes(topic.id);
              const isRecommended = topic.status === "recommended" && !isCompleted;
              const isLocked = topic.status === "locked" && !isCompleted;

              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-3xl border border-black/8 p-6 shadow-xs hover:border-black/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono text-neutral-600 bg-[#F4F4F6] border border-black/10 px-2.5 py-0.5 rounded-full">
                        {topic.meeting}
                      </span>

                      {isCompleted ? (
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                          Selesai
                        </span>
                      ) : isRecommended ? (
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                          Rekomendasi
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-neutral-500 bg-[#F4F4F6] border border-black/10 px-2.5 py-0.5 rounded-full">
                          Terkunci
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-medium text-black mb-2 leading-snug">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4">
                      {topic.description}
                    </p>

                    <div className="space-y-1.5 text-[11px] text-neutral-500 border-t border-black/5 pt-3 mb-5">
                      <div className="flex justify-between">
                        <span>Dosen Pengampu:</span>
                        <span className="font-medium text-black">{topic.lecturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beban Studi:</span>
                        <span className="font-medium text-black">
                          {topic.sks} SKS ({topic.duration})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reward XP:</span>
                        <span className="font-mono font-medium text-black">+{topic.xp} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <Link
                    href={isLocked ? "#" : `/modul/${topic.id}`}
                    className={`w-full py-2.5 px-4 rounded-full text-xs font-medium text-center transition-all flex items-center justify-center gap-1.5 ${
                      isLocked
                        ? "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed pointer-events-none"
                        : isCompleted
                          ? "bg-[#F4F4F6] hover:bg-neutral-200 text-black border border-black/10 shadow-2xs"
                          : "bg-black hover:bg-neutral-800 text-white shadow-xs"
                    }`}
                  >
                    <span>
                      {isLocked
                        ? "Topik Terkunci"
                        : isCompleted
                          ? "Pelajari Ulang"
                          : "Mulai Belajar"}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
