// app/(mahasiswa)/modul/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LEARNING_TOPICS, type LearningTopic } from "../../../src/data/learningTopics";

export default function ModulCataloguePage() {
  const [completedIds, setCompletedIds] = useState<number[]>([1, 2]);
  const [filter, setFilter] = useState<"all" | "completed" | "recommended" | "locked">("all");
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="bg-slate-50 min-h-screen text-slate-900 font-['Outfit'] antialiased">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
              <span>Portal Pembelajaran</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">Katalog Modul Adaptif</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Modul Pembelajaran Algoritma & Pemrograman
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            >
              &larr; Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Hero Card Overview */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-2">
              Kurikulum Berbasis Kompetensi
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Penguasaan Terstruktur & Bimbingan AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Pelajari setiap bab secara mendalam. Setiap modul dilengkapi materi konsep, simulasi
              kode interaktif, sesi tanya-jawab bersama tutor AI, dan evaluasi kuis mandiri.
            </p>
          </div>

          {/* Progress Widget */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shrink-0 w-full md:w-64">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Progres Selesai</span>
              <span>{Math.round((completedIds.length / LEARNING_TOPICS.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedIds.length / LEARNING_TOPICS.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
              <span>
                {completedIds.length} dari {LEARNING_TOPICS.length} Modul
              </span>
              <span className="font-bold text-amber-600">
                ⚡ {earnedXp} / {totalXp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {status === "all" && "Semua Modul"}
                  {status === "completed" && "✅ Selesai"}
                  {status === "recommended" && "⭐ Rekomendasi AI"}
                  {status === "locked" && "🔒 Terkunci"}
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
              className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {topic.meeting}
                    </span>

                    {isCompleted ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        ✅ Selesai
                      </span>
                    ) : isRecommended ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        ⭐ Rekomendasi AI
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                        🔒 Terkunci
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {topic.description}
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-500 border-t border-slate-100 pt-3 mb-4">
                    <div className="flex justify-between">
                      <span>Dosen Pengampu:</span>
                      <span className="font-semibold text-slate-700">{topic.lecturer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Beban Studi:</span>
                      <span className="font-semibold text-slate-700">
                        {topic.sks} SKS ({topic.duration})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hadiah XP:</span>
                      <span className="font-bold text-amber-600">+{topic.xp} XP</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <Link
                  href={isLocked ? "#" : `/modul/${topic.id}`}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                    isLocked
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed pointer-events-none"
                      : isCompleted
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                  }`}
                >
                  <span>{isLocked ? "🔒" : isCompleted ? "📖" : "🚀"}</span>
                  <span>
                    {isLocked ? "Topik Terkunci" : isCompleted ? "Pelajari Ulang" : "Mulai Belajar"}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
