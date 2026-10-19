// src/components/NexedLeaderboard.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Zap,
  Brain,
  Target,
  Shield,
  Rocket,
  Award,
  Check,
  RefreshCw,
} from "lucide-react";
import { onProgressUpdate } from "../lib/progressStorage";
import { useAuthStore } from "../store/authStore";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  nim: string;
  xp: number;
  badgesCount: number;
  level: string;
  isCurrentUser?: boolean;
  email?: string;
}

export interface BadgeItem {
  id: string;
  code: string;
  title: string;
  description: string;
  tier: "Gold" | "Silver" | "Bronze";
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string | null;
}

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Ucik Dika Maharani",
    nim: "202401012",
    xp: 2450,
    badgesCount: 6,
    level: "Lvl 7 • Scholar",
    isCurrentUser: false,
  },
  {
    rank: 2,
    name: "Muhammad Hariz Lazuardi",
    nim: "M3124001",
    email: "mahasiswa@nexed.ai",
    xp: 2180,
    badgesCount: 5,
    level: "Lvl 7 • Scholar",
    isCurrentUser: false,
  },
  {
    rank: 3,
    name: "Zam Zam Zahrina",
    nim: "202401015",
    xp: 1950,
    badgesCount: 4,
    level: "Lvl 5 • Apprentice",
    isCurrentUser: false,
  },
  {
    rank: 4,
    name: "Siti Aminah",
    nim: "202401092",
    xp: 1420,
    badgesCount: 3,
    level: "Lvl 3 • Praktikan Terampil",
    isCurrentUser: false,
  },
  {
    rank: 5,
    name: "Budi Santoso",
    nim: "202401048",
    xp: 980,
    badgesCount: 2,
    level: "Lvl 2 • Learner",
    isCurrentUser: false,
  },
];

const FALLBACK_BADGES: BadgeItem[] = [
  {
    id: "b1",
    code: "algo_master",
    title: "Algo Master",
    description: "Menuntaskan modul algoritma sorting dengan skor 100",
    unlocked: true,
    tier: "Gold",
    iconName: "Trophy",
  },
  {
    id: "b2",
    code: "active_recaller",
    title: "Active Recaller",
    description: "Menjawab kuis active recall dengan performa konsisten",
    unlocked: true,
    tier: "Gold",
    iconName: "Zap",
  },
  {
    id: "b3",
    code: "deep_thinker",
    title: "Deep Thinker",
    description: "Menganalisis konsep komputasi bersama Nexed AI Tutor",
    unlocked: true,
    tier: "Silver",
    iconName: "Brain",
  },
  {
    id: "b4",
    code: "target_achiever",
    title: "Target Achiever",
    description: "Menyelesaikan target modul belajar terstruktur kurikulum",
    unlocked: false,
    tier: "Silver",
    iconName: "Target",
  },
  {
    id: "b5",
    code: "bug_hunter",
    title: "Bug Hunter",
    description: "Menyelesaikan 10 latihan pengujian logika dan penanganan kasus batas",
    unlocked: false,
    tier: "Bronze",
    iconName: "Shield",
  },
  {
    id: "b6",
    code: "speed_demon",
    title: "Speed Demon",
    description: "Menyelesaikan evaluasi mandiri secara tangkas dan tuntas",
    unlocked: false,
    tier: "Bronze",
    iconName: "Rocket",
  },
];

function formatXp(xp: number): string {
  return xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getLevelTitle(xp: number): string {
  if (xp >= 2000) return "Lvl 7 • Scholar";
  if (xp >= 1500) return "Lvl 5 • Apprentice";
  if (xp >= 1000) return "Lvl 3 • Praktikan Terampil";
  if (xp >= 500) return "Lvl 2 • Learner";
  return "Lvl 1 • Novice";
}

function getBadgeIcon(iconName: string, tier: string) {
  const iconClass =
    tier === "Gold"
      ? "w-5 h-5 text-amber-500"
      : tier === "Silver"
        ? "w-5 h-5 text-indigo-500"
        : "w-5 h-5 text-amber-700";

  switch (iconName) {
    case "Trophy":
      return <Trophy className={iconClass} />;
    case "Zap":
      return <Zap className={iconClass} />;
    case "Brain":
      return <Brain className={iconClass} />;
    case "Target":
      return <Target className={iconClass} />;
    case "Shield":
      return <Shield className={iconClass} />;
    case "Rocket":
      return <Rocket className={iconClass} />;
    default:
      return <Award className={iconClass} />;
  }
}

export default function NexedLeaderboard() {
  const { user: activeAuthUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"leaderboard" | "badges">("leaderboard");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(FALLBACK_LEADERBOARD);
  const [badges, setBadges] = useState<BadgeItem[]>(FALLBACK_BADGES);
  const [isLoading, setIsLoading] = useState(false);

  const isRowCurrentUser = (entry: LeaderboardEntry): boolean => {
    if (activeAuthUser) {
      if (activeAuthUser.email && entry.email && entry.email.toLowerCase() === activeAuthUser.email.toLowerCase()) {
        return true;
      }
      if (activeAuthUser.nimOrNip && entry.nim && entry.nim === activeAuthUser.nimOrNip) {
        return true;
      }
      if (activeAuthUser.name && entry.name && activeAuthUser.name.trim().toLowerCase() === entry.name.trim().toLowerCase()) {
        return true;
      }
      return false;
    }
    return Boolean(entry.isCurrentUser);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const headers: Record<string, string> = {};
      if (activeAuthUser?.email) {
        headers["x-user-email"] = activeAuthUser.email;
      }
      const [lbRes, badgesRes] = await Promise.all([
        fetch("/api/gamification/leaderboard", { headers }),
        fetch("/api/gamification/badges", { headers }),
      ]);

      if (lbRes.ok) {
        const lbJson = await lbRes.json();
        if (Array.isArray(lbJson.data) && lbJson.data.length > 0) {
          setLeaderboard(lbJson.data);
        }
      }

      if (badgesRes.ok) {
        const badgesJson = await badgesRes.json();
        if (Array.isArray(badgesJson.data) && badgesJson.data.length > 0) {
          setBadges(badgesJson.data);
        }
      }
    } catch {
      // safe fallback to initial state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const cleanup = onProgressUpdate(() => {
      loadData();
    });
    return cleanup;
  }, [activeAuthUser?.email, activeAuthUser?.name]);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <section
      id="peringkat"
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
              Real-time Database
            </span>
            {isLoading && (
              <RefreshCw className="w-3 h-3 text-neutral-400 animate-spin" />
            )}
          </div>
          <h3 className="text-xl font-light text-black tracking-tight">
            Papan Peringkat & Lencana Capaian
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Akumulasi skor pemahaman praktikum dan lencana penguasaan modul kelas TI SV UNS yang disinkronkan secara langsung.
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
            Koleksi Lencana ({unlockedCount}/{badges.length})
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeTab === "leaderboard" ? (
          <motion.div
            key="leaderboard-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="overflow-x-auto"
          >
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
                {leaderboard.map((entry, idx) => {
                  const isCurrent = isRowCurrentUser(entry);
                  return (
                    <motion.tr
                      key={entry.nim || entry.name}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: idx * 0.03 }}
                      className={`transition-colors ${
                        isCurrent
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
                              {isCurrent && (
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
                    </motion.tr>
                  );
                })}

                {activeAuthUser && activeAuthUser.role === "mahasiswa" && !leaderboard.some(isRowCurrentUser) && (
                  <tr className="bg-neutral-100/90 border-t-2 border-black/20 font-semibold transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-xs font-mono text-neutral-400">
                      -
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-mono font-medium shrink-0">
                          {activeAuthUser.name
                            ? activeAuthUser.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")
                            : "AN"}
                        </div>
                        <div>
                          <div className="font-medium text-black flex items-center gap-1.5">
                            <span>{activeAuthUser.name || "Mahasiswa Aktif"}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black text-white">
                              Anda
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            {activeAuthUser.nimOrNip || "202401999"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 font-normal">
                      {getLevelTitle(activeAuthUser.xp ?? 0)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-medium text-black">
                      {badges.filter((b) => b.unlocked).length}
                    </td>
                    <td
                      suppressHydrationWarning
                      className="py-3.5 px-4 text-right font-mono font-medium text-black"
                    >
                      {`${formatXp(activeAuthUser.xp ?? 0)} XP`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div
            key="badges-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {badges.map((b, idx) => (
              <motion.div
                key={b.id || b.code}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
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
                  {getBadgeIcon(b.iconName, b.tier)}
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
                      <span className="text-emerald-800 font-medium inline-flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Terbuka
                      </span>
                    ) : (
                      <span className="text-neutral-400">Belum Tercapai</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
