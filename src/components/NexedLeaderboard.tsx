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

function formatXp(xp: number): string {
  return xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function NexedLeaderboard() {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "badges">("leaderboard");

  return (
    <section
      aria-label="Papan Peringkat dan Lencana Prestasi Belajar"
      className="bg-white p-6 md:p-8 rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all duration-300 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-xs px-3 py-0.5 rounded-full uppercase tracking-wider">
              Kompetensi Mahasiswa • D3 TI UNS
            </span>
            <span className="bg-[#F4F4F6] text-neutral-600 border border-black/10 font-mono text-xs px-2.5 py-0.5 rounded-full">
              Semester Genap 2026
            </span>
          </div>
          <h3 className="text-xl font-light text-black tracking-tight">
            Papan Peringkat & Lencana Capaian
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Akumulasi skor pemahaman praktikum dan lencana penguasaan modul kelas TI SV UNS.
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div
          role="tablist"
          aria-label="Navigasi Peringkat dan Lencana"
          className="flex p-1 bg-[#F4F4F6] rounded-full self-start sm:self-auto border border-black/10"
        >
          <button
            type="button"
            role="tab"
            onClick={() => setActiveTab("leaderboard")}
            aria-selected={activeTab === "leaderboard"}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === "leaderboard"
                ? "bg-black text-white shadow-xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            Peringkat XP
          </button>
          <button
            type="button"
            role="tab"
            onClick={() => setActiveTab("badges")}
            aria-selected={activeTab === "badges"}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === "badges"
                ? "bg-black text-white shadow-xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            Koleksi Lencana ({BADGES_LIST.filter((b) => b.unlocked).length}/{BADGES_LIST.length})
          </button>
        </div>
      </div>

      {activeTab === "leaderboard" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-black/8 bg-[#FAFAFA] text-neutral-600 font-mono">
                <th className="py-3 px-4 uppercase tracking-wider text-[11px] w-12 text-center rounded-l-xl">
                  Pos
                </th>
                <th className="py-3 px-4 uppercase tracking-wider text-[11px]">
                  Mahasiswa
                </th>
                <th className="py-3 px-4 uppercase tracking-wider text-[11px]">
                  Tier / Gelar
                </th>
                <th className="py-3 px-4 uppercase tracking-wider text-[11px] text-center">
                  Lencana
                </th>
                <th className="py-3 px-4 uppercase tracking-wider text-[11px] text-right rounded-r-xl">
                  Total XP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {LEADERBOARD_DATA.map((entry) => (
                <tr
                  key={entry.nim}
                  className={`transition-colors ${
                    entry.isCurrentUser
                      ? "bg-neutral-100/70 border-l-2 border-black font-semibold hover:bg-neutral-100"
                      : "hover:bg-neutral-50/80"
                  }`}
                >
                  <td className="py-3.5 px-4 text-center font-bold text-xs">
                    {entry.rank === 1 ? (
                      <span className="text-amber-600 font-extrabold font-mono">#1</span>
                    ) : entry.rank === 2 ? (
                      <span className="text-neutral-700 font-bold font-mono">#2</span>
                    ) : entry.rank === 3 ? (
                      <span className="text-amber-800 font-bold font-mono">#3</span>
                    ) : (
                      <span className="text-neutral-400 font-mono">#{entry.rank}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-mono font-medium shrink-0">
                        {entry.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <div className="font-medium text-black flex items-center gap-1.5">
                          <span>{entry.name}</span>
                          {entry.isCurrentUser && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black text-white">
                              Anda
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">{entry.nim}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-700 font-normal">{entry.level}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-medium text-black">
                    {entry.badgesCount}
                  </td>
                  <td
                    suppressHydrationWarning
                    className="py-3.5 px-4 text-right font-mono font-medium text-black"
                  >
                    {`${formatXp(entry.xp)} XP`}
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
                  ? "bg-white border-black/8 shadow-2xs hover:border-black/20"
                  : "bg-[#FAFAFA] border-black/5 opacity-60"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  b.unlocked ? "bg-[#F4F4F6] border border-black/10 text-black" : "bg-neutral-200"
                }`}
              >
                {b.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-xs text-black">{b.title}</h4>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full border border-black/10 ${
                      b.tier === "Gold"
                        ? "bg-amber-100 text-amber-900"
                        : b.tier === "Silver"
                          ? "bg-[#F4F4F6] text-neutral-700"
                          : "bg-amber-50 text-amber-900"
                    }`}
                  >
                    {b.tier}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-snug">{b.description}</p>
                <div className="text-[10px] font-mono pt-0.5">
                  {b.unlocked ? (
                    <span className="text-emerald-800 font-medium">✓ Terbuka</span>
                  ) : (
                    <span className="text-neutral-400">Belum Tercapai</span>
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
