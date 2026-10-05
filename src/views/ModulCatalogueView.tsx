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
            <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              <span>Portal Pembelajaran</span>
              <span className="text-black/20">/</span>
              <span className="text-black">Katalog Modul Adaptif</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-light text-black tracking-tight">
              Modul Pembelajaran & AI Study Hub
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-xs font-medium px-4 py-2 rounded-full bg-[#F4F4F6] hover:bg-neutral-200 text-black transition-colors border border-black/8"
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
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mb-1 inline-block">
                  Arsip Dokumen Anda
                </span>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Modul yang Diunggah ({uploadedModules.length})
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
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold transition-colors border border-slate-200 hover:border-rose-200 flex items-center gap-1.5 cursor-pointer"
                title="Hapus seluruh riwayat modul yang diunggah"
              >
                <span>Bersihkan Riwayat Modul</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {uploadedModules.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
                        {item.filename.split(".").pop() || "DOC"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {item.uploadedAt}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3 truncate">
                      {item.filename} &bull; {item.chunkCount} chunk ({item.totalWords} kata)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        const evt = new CustomEvent("nexed_load_module", { detail: item });
                        window.dispatchEvent(evt);
                      }}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
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
        <div className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded mb-1 inline-block">
                Kurikulum Resmi D3 TI SV UNS
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Daftar Modul Pembelajaran Terstruktur
              </h2>
            </div>

            {/* Quick Completion Stats */}
            <div className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs self-start sm:self-auto">
              <span>
                {completedIds.length} dari {LEARNING_TOPICS.length} Modul Tuntas
              </span>
              <span className="text-slate-300 mx-2">•</span>
              <span className="font-bold text-amber-600">
                {earnedXp} / {totalXp} XP
              </span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
                className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {topic.meeting}
                      </span>

                      {isCompleted ? (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          Selesai
                        </span>
                      ) : isRecommended ? (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          Rekomendasi
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          Terkunci
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {topic.description}
                    </p>

                    <div className="space-y-1 text-[11px] text-slate-500 border-t border-slate-100 pt-3 mb-4">
                      <div className="flex justify-between">
                        <span>Dosen Pengampu:</span>
                        <span className="font-medium text-slate-700">{topic.lecturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beban Studi:</span>
                        <span className="font-medium text-slate-700">
                          {topic.sks} SKS ({topic.duration})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hadiah XP:</span>
                        <span className="font-semibold text-amber-700">+{topic.xp} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <Link
                    href={isLocked ? "#" : `/modul/${topic.id}`}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 ${
                      isLocked
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none"
                        : isCompleted
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
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
