// app/(mahasiswa)/riwayat/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Sparkles,
  Search,
  Award,
  Flame,
  Zap,
  Brain,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileText,
  Target,
  SlidersHorizontal,
} from "lucide-react";
import { onProgressUpdate } from "../../../src/lib/progressStorage";

interface ActivityItem {
  id: string;
  userId: string;
  type: string; // "quiz_completed" | "module_step" | "ai_tutor_chat" | "task_created"
  title: string;
  description: string;
  xpEarned: number;
  score: number | null;
  metadata: string | null;
  createdAt: string;
}

interface ActivityStats {
  totalXp: number;
  level: string;
  streakDays: number;
  totalActivities: number;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  weeklyXp: number;
  typeBreakdown: {
    quiz_completed: number;
    module_step: number;
    ai_tutor_chat: number;
    task_created: number;
  };
}

export default function RiwayatAktivitasPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/activities");
      if (res.ok) {
        const json = await res.json();
        setActivities(json.data || []);
        if (json.stats) setStats(json.stats);
      }
    } catch (err) {
      console.warn("Gagal mengambil data aktivitas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    const cleanup = onProgressUpdate(() => {
      fetchActivities();
    });
    return cleanup;
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (activeFilter !== "all" && act.type !== activeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          act.title.toLowerCase().includes(q) ||
          act.description.toLowerCase().includes(q) ||
          (act.metadata && act.metadata.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activities, activeFilter, searchQuery]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "quiz_completed":
        return {
          label: "Kuis Active Recall",
          icon: <Brain className="w-3.5 h-3.5 text-emerald-600" />,
          badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "module_step":
        return {
          label: "Modul Belajar",
          icon: <BookOpen className="w-3.5 h-3.5 text-amber-600" />,
          badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "ai_tutor_chat":
        return {
          label: "Nexed AI Tutor",
          icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600" />,
          badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
      case "task_created":
        return {
          label: "Checklist Target",
          icon: <Target className="w-3.5 h-3.5 text-purple-600" />,
          badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
        };
      default:
        return {
          label: "Aktivitas Akademik",
          icon: <History className="w-3.5 h-3.5 text-slate-600" />,
          badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
        };
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 5) return "Baru saja";
      if (diffMins < 60) return `${diffMins} menit lalu`;
      if (diffHours < 24 && now.getDate() === d.getDate()) {
        return `Hari ini, ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
      }

      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const parseMetadata = (raw: string | null) => {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-[#FAFAFA] text-black min-h-screen flex flex-col font-['Inter',sans-serif] antialiased">
      {/* Top Header Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-black/8 sticky top-0 z-20 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
              <span>Portal Akademik Mahasiswa</span>
              <span className="text-black/20">/</span>
              <span className="text-black font-semibold">Riwayat Telemetri Belajar</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-light text-black tracking-tight flex items-center gap-2.5">
              <History className="w-6 h-6 text-black" />
              <span>Riwayat Aktivitas & Gamifikasi</span>
            </h1>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={fetchActivities}
              className="inline-flex items-center space-x-1.5 text-xs font-medium bg-[#F4F4F6] hover:bg-neutral-200 text-black px-4 py-2.5 rounded-full border border-black/10 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Segarkan</span>
            </button>
            <Link
              href="/modul"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-xs"
            >
              <span>Lanjut Belajar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full space-y-6">
        {/* STATS BENTO HERO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total XP & Level */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs hover:border-black/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-500 font-mono text-xs uppercase tracking-wider">
                  Akumulasi XP
                </span>
                <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-[11px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>+{stats?.weeklyXp ?? 35} XP Minggu Ini</span>
                </span>
              </div>
              <div className="text-3xl font-light tracking-tight text-black font-mono">
                {stats?.totalXp ?? 225} <span className="text-base text-neutral-500 font-sans font-normal">XP</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1 font-medium">
                Peringkat Berjalan: {stats?.level ?? "Lvl 3 • Praktikan Terampil"}
              </p>
            </div>
            <div className="pt-4 border-t border-black/5 mt-4">
              <div className="w-full bg-[#F4F4F6] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-black h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(15, ((stats?.totalXp ?? 225) % 500) / 5))}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Streak Hari */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs hover:border-black/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-500 font-mono text-xs uppercase tracking-wider">
                  Konsistensi
                </span>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 font-medium text-[11px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Aktif</span>
                </span>
              </div>
              <div className="text-3xl font-light tracking-tight text-black font-mono">
                {stats?.streakDays ?? 12} <span className="text-base text-neutral-500 font-sans font-normal">Hari</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1 font-medium">
                Streak belajar berturut-turut tercatat
              </p>
            </div>
            <div className="pt-4 border-t border-black/5 mt-4 text-[11px] text-neutral-500">
              Pertahankan aktivitas setiap hari untuk melipatgandakan XP.
            </div>
          </motion.div>

          {/* Card 3: Total Selesai */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs hover:border-black/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-500 font-mono text-xs uppercase tracking-wider">
                  Total Aktivitas
                </span>
                <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-[11px] px-2.5 py-0.5 rounded-full">
                  Telemetri Real
                </span>
              </div>
              <div className="text-3xl font-light tracking-tight text-black font-mono">
                {stats?.totalActivities ?? activities.length} <span className="text-base text-neutral-500 font-sans font-normal">Log</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1 font-medium">
                Rekaman kuis, AI chat, & modul
              </p>
            </div>
            <div className="pt-4 border-t border-black/5 mt-4 text-[11px] text-neutral-500 flex items-center justify-between">
              <span>Kuis: {stats?.typeBreakdown.quiz_completed ?? 0}</span>
              <span>Modul: {stats?.typeBreakdown.module_step ?? 0}</span>
              <span>AI: {stats?.typeBreakdown.ai_tutor_chat ?? 0}</span>
            </div>
          </motion.div>

          {/* Card 4: Lencana */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs hover:border-black/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-500 font-mono text-xs uppercase tracking-wider">
                  Lencana Capaian
                </span>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium text-[11px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Koleksi</span>
                </span>
              </div>
              <div className="text-3xl font-light tracking-tight text-black font-mono">
                {stats?.unlockedBadgesCount ?? 2} <span className="text-base text-neutral-500 font-sans font-normal">/ {stats?.totalBadgesCount ?? 6}</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1 font-medium">
                Lencana prestasi kompetensi terbuka
              </p>
            </div>
            <div className="pt-4 border-t border-black/5 mt-4">
              <Link
                href="/dashboard#peringkat"
                className="text-xs font-semibold text-black hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Papan Peringkat & Lencana</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* FILTER & SEARCH BAR */}
        <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div
              role="tablist"
              aria-label="Filter kategori aktivitas"
              className="flex flex-wrap p-1 bg-[#F4F4F6] rounded-2xl md:rounded-full border border-black/10 gap-1"
            >
              {[
                { key: "all", label: "Semua Aktivitas" },
                { key: "quiz_completed", label: "Kuis Active Recall" },
                { key: "module_step", label: "Penyelesaian Modul" },
                { key: "ai_tutor_chat", label: "Tanya AI Tutor" },
                { key: "task_created", label: "Target Tugas" },
              ].map((tab) => {
                const isActive = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-black text-white shadow-xs"
                        : "text-neutral-600 hover:text-black hover:bg-black/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari riwayat aktivitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#FAFAFA] border border-black/10 rounded-full text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* TIMELINE LIST */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="bg-white rounded-3xl border border-black/8 p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-neutral-400 animate-spin mx-auto" />
              <p className="text-xs text-neutral-500 font-medium">
                Mengambil rekaman aktivitas telemetri dari database persisten...
              </p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="bg-white rounded-3xl border border-black/8 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F4F4F6] text-neutral-400 flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-black">Tidak Ada Riwayat Ditemukan</h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Belum ada rekaman aktivitas yang sesuai dengan filter ini. Mulai kerjakan kuis atau eksplorasi modul belajar untuk mengumpulkan riwayat dan XP!
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredActivities.map((act, index) => {
                const badgeInfo = getTypeBadge(act.type);
                const isExpanded = expandedId === act.id;
                const metadataObj = parseMetadata(act.metadata);

                return (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                    className="bg-white rounded-3xl border border-black/8 p-5 sm:p-6 shadow-xs hover:border-black/20 transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Type badge & Title */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-[#F4F4F6] border border-black/5 flex items-center justify-center shrink-0 mt-0.5">
                          {badgeInfo.icon}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 font-semibold ${badgeInfo.badgeClass}`}
                            >
                              {badgeInfo.label}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(act.createdAt)}</span>
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-black tracking-tight leading-snug">
                            {act.title}
                          </h3>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {act.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Score, XP pill & Details toggle */}
                      <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                        {act.score !== null && (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{act.score}%</span>
                          </span>
                        )}

                        {act.xpEarned > 0 && (
                          <span className="bg-amber-50 text-amber-900 border border-amber-200 font-mono text-xs px-3 py-1 rounded-full font-bold inline-flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-600" />
                            <span>+{act.xpEarned} XP</span>
                          </span>
                        )}

                        {metadataObj && (
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : act.id)}
                            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                            aria-label={isExpanded ? "Tutup detail" : "Lihat detail"}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expandable Metadata Detail */}
                    {isExpanded && metadataObj && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-3 border-t border-black/5 bg-[#FAFAFA] -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-3xl text-xs space-y-2"
                      >
                        <div className="text-[11px] font-mono text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Parameter Metadata Telemetri</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                          {Object.entries(metadataObj).map(([key, val]) => (
                            <div key={key} className="bg-white p-2 rounded-xl border border-black/5">
                              <span className="text-neutral-400 block">{key}:</span>
                              <span className="text-black font-semibold truncate block">
                                {typeof val === "object" ? JSON.stringify(val) : String(val)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
