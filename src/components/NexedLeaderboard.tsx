// src/components/NexedLeaderboard.tsx
"use client";

import { useState } from "react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  nim: string;
  xp: number;
  badgesCount: number;
  level: string;
  isCurrentUser?: boolean;
}

interface BadgeItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  tier: "Gold" | "Silver" | "Bronze";
}

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Ucik Dika Maharani",
    nim: "202401012",
    xp: 2450,
    badgesCount: 8,
    level: "Lvl 12 • Grandmaster",
  },
  {
    rank: 2,
    name: "Muhammad Hariz Lazuardi",
    nim: "M3124001",
    xp: 2180,
    badgesCount: 7,
    level: "Lvl 10 • Master",
    isCurrentUser: true,
  },
  {
    rank: 3,
    name: "Zam Zam Zahrina",
    nim: "202401015",
    xp: 1950,
    badgesCount: 6,
    level: "Lvl 9 • Expert",
  },
  {
    rank: 4,
    name: "Siti Aminah",
    nim: "202401092",
    xp: 1420,
    badgesCount: 4,
    level: "Lvl 7 • Scholar",
  },
  {
    rank: 5,
    name: "Budi Santoso",
    nim: "202401048",
    xp: 980,
    badgesCount: 2,
    level: "Lvl 5 • Apprentice",
  },
];

const BADGES_LIST: BadgeItem[] = [
  {
    id: "b1",
    icon: "🏆",
    title: "Algo Master",
    description: "Menuntaskan modul algoritma sorting dengan skor 100",
    unlocked: true,
    tier: "Gold",
  },
  {
    id: "b2",
    icon: "⚡",
    title: "Active Recaller",
    description: "Menjawab kuis active recall berturut-turut tanpa jeda",
    unlocked: true,
    tier: "Gold",
  },
  {
    id: "b3",
    icon: "🧠",
    title: "Deep Thinker",
    description: "Menganalisis 3 modul pohon biner bersama Nexed AI Tutor",
    unlocked: true,
    tier: "Silver",
  },
  {
    id: "b4",
    icon: "🎯",
    title: "Target Achiever",
    description: "Menyelesaikan 5 target belajar mingguan tepat waktu",
    unlocked: true,
    tier: "Silver",
  },
  {
    id: "b5",
    icon: "🛡️",
    title: "Bug Hunter",
    description: "Mengoreksi 10 syntax edge cases praktikum lab",
    unlocked: false,
    tier: "Bronze",
  },
  {
    id: "b6",
    icon: "🚀",
    title: "Speed Demon",
    description: "Menyelesaikan kuis dalam waktu kurang dari 3 menit",
    unlocked: false,
    tier: "Bronze",
  },
];

export default function NexedLeaderboard() {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "badges">("leaderboard");

  return (
    <section
      aria-label="Papan Peringkat dan Lencana Prestasi Belajar"
      className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Gamifikasi Belajar • SKPL UNS
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              ● Live Season 2026
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Papan Peringkat & Lencana Capaian
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Perolehan poin pengalaman (XP) komputasional dan lencana kompetensi kelas TI-A.
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div
          role="tablist"
          aria-label="Navigasi Peringkat dan Lencana"
          className="flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto"
        >
          <button
            type="button"
            role="tab"
            onClick={() => setActiveTab("leaderboard")}
            aria-selected={activeTab === "leaderboard"}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "leaderboard"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏆 Peringkat XP
          </button>
          <button
            type="button"
            role="tab"
            onClick={() => setActiveTab("badges")}
            aria-selected={activeTab === "badges"}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "badges"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🎖️ Koleksi Lencana ({BADGES_LIST.filter((b) => b.unlocked).length}/{BADGES_LIST.length})
          </button>
        </div>
      </div>

      {activeTab === "leaderboard" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] w-12 text-center">
                  Pos
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                  Mahasiswa
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                  Tier / Gelar
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-center">
                  Lencana
                </th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">
                  Total XP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {LEADERBOARD_DATA.map((entry) => (
                <tr
                  key={entry.nim}
                  className={`transition-colors ${
                    entry.isCurrentUser
                      ? "bg-indigo-50/60 font-semibold hover:bg-indigo-50"
                      : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="py-3.5 px-4 text-center font-black text-xs">
                    {entry.rank === 1 ? (
                      <span className="text-amber-500 text-base">🥇</span>
                    ) : entry.rank === 2 ? (
                      <span className="text-slate-400 text-base">🥈</span>
                    ) : entry.rank === 3 ? (
                      <span className="text-amber-700 text-base">🥉</span>
                    ) : (
                      <span className="text-slate-400 font-mono">#{entry.rank}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                        {entry.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>{entry.name}</span>
                          {entry.isCurrentUser && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-indigo-600 text-white">
                              Anda
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{entry.nim}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{entry.level}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-indigo-700">
                    🎖️ {entry.badgesCount}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-indigo-600">
                    {entry.xp.toLocaleString()} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BADGES_LIST.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                b.unlocked
                  ? "bg-white border-slate-200 shadow-xs hover:border-indigo-300"
                  : "bg-slate-50 border-slate-200/60 opacity-60"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  b.unlocked ? "bg-indigo-50 border border-indigo-100" : "bg-slate-200"
                }`}
              >
                {b.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs text-slate-900">{b.title}</h4>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      b.tier === "Gold"
                        ? "bg-amber-100 text-amber-800"
                        : b.tier === "Silver"
                          ? "bg-slate-200 text-slate-700"
                          : "bg-amber-50 text-amber-900"
                    }`}
                  >
                    {b.tier}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{b.description}</p>
                <div className="text-[10px] font-bold pt-0.5">
                  {b.unlocked ? (
                    <span className="text-emerald-600">✓ Terbuka</span>
                  ) : (
                    <span className="text-slate-400">🔒 Belum Tercapai</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
