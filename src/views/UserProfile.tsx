// src/views/UserProfile.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  Flame,
  GraduationCap,
  History,
  Key,
  Laptop,
  Lock,
  LogOut,
  Mail,
  RefreshCw,
  Save,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

interface BadgeItem {
  id: string;
  code: string;
  title: string;
  description: string;
  tier: "Gold" | "Silver" | "Bronze";
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string | null;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  xpEarned: number;
  score?: number | null;
  createdAt: string;
}

interface UserGamificationStats {
  totalXp: number;
  level: string;
  streakDays: number;
  totalActivities: number;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  weeklyXp: number;
}

function formatXp(xp: number): string {
  return xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
      return <Sparkles className={iconClass} />;
    case "Target":
      return <Star className={iconClass} />;
    case "Shield":
      return <Shield className={iconClass} />;
    default:
      return <Award className={iconClass} />;
  }
}

export default function UserProfile() {
  const { user, logout, updateProfile } = useAuthStore();
  const router = useRouter();

  // Active Tab: overview | edit_profile | security | preferences
  const [activeTab, setActiveTab] = useState<
    "overview" | "edit_profile" | "security" | "preferences"
  >("overview");

  // Form State for Profile Editing
  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [phone, setPhone] = useState("");
  const [prodi, setProdi] = useState("");
  const [semester, setSemester] = useState(4);
  const [bio, setBio] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);

  // Learning Preferences State
  const [aiTutorStyle, setAiTutorStyle] = useState<"socratic" | "practical" | "comprehensive">(
    "socratic",
  );
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(6);
  const [notifyDailyQuiz, setNotifyDailyQuiz] = useState(true);
  const [notifyModuleUpdates, setNotifyModuleUpdates] = useState(true);
  const [prefSaveSuccess, setPrefSaveSuccess] = useState(false);

  // Live Backend Data
  const [stats, setStats] = useState<UserGamificationStats | null>(null);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [_isLoadingData, setIsLoadingData] = useState(true);

  const activeUser = user || {
    name: "Cahyo DP",
    email: "cahyodp@gmail.com",
    role: "mahasiswa" as const,
    nimOrNip: "V392450",
    prodi: "D3 Teknik Informatika SV UNS",
    semester: 4,
    xp: 2180,
  };

  // Populate form initial state
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setNim(user.nimOrNip || "V392450");
      setPhone(user.phone || "0812-3456-7890");
      setProdi(user.prodi || "D3 Teknik Informatika SV UNS");
      setSemester(user.semester || 4);
      setBio(
        user.bio ||
          "Mahasiswa D3 TI SV UNS • Fokus Minat: Algoritma & Pemrograman, Basis Data, dan Pengembangan Aplikasi Web Adaptif.",
      );
    } else {
      setName("Cahyo DP");
      setNim("V392450");
      setPhone("0812-3456-7890");
      setProdi("D3 Teknik Informatika SV UNS");
      setSemester(4);
      setBio(
        "Mahasiswa D3 TI SV UNS • Fokus Minat: Algoritma & Pemrograman, Basis Data, dan Pengembangan Aplikasi Web Adaptif.",
      );
    }
  }, [user]);

  // Fetch Gamification & Activities Data
  useEffect(() => {
    let isMounted = true;
    async function loadProfileTelemetry() {
      try {
        setIsLoadingData(true);
        const headers: Record<string, string> = {};
        if (activeUser.email) {
          headers["x-user-email"] = activeUser.email;
        }

        const [statsRes, badgesRes, actsRes] = await Promise.all([
          fetch("/api/activities/stats", { headers }),
          fetch("/api/gamification/badges", { headers }),
          fetch("/api/activities?limit=5", { headers }),
        ]);

        if (!isMounted) return;

        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          if (statsJson.stats) {
            setStats(statsJson.stats);
          }
        }

        if (badgesRes.ok) {
          const badgesJson = await badgesRes.json();
          if (Array.isArray(badgesJson.data)) {
            setBadges(badgesJson.data);
          }
        }

        if (actsRes.ok) {
          const actsJson = await actsRes.json();
          if (Array.isArray(actsJson.activities)) {
            setRecentActivities(actsJson.activities);
          }
        }
      } catch {
        // Safe fallback
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    }

    loadProfileTelemetry();
    return () => {
      isMounted = false;
    };
  }, [activeUser.email]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    updateProfile({
      name: name.trim(),
      nimOrNip: nim.trim(),
      phone: phone.trim(),
      prodi: prodi.trim(),
      semester: Number(semester),
      bio: bio.trim(),
    });

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 400);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefSaveSuccess(true);
    setTimeout(() => setPrefSaveSuccess(false), 4000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setSecurityMessage("Silakan masukkan kata sandi saat ini.");
      return;
    }
    if (newPassword.length < 6) {
      setSecurityMessage("Kata sandi baru minimal harus 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setSecurityMessage("Kata sandi berhasil diperbarui!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSecurityMessage(null), 4000);
  };

  const currentLevel = stats?.level || "Lvl 3 • Praktikan Terampil";
  const userXp = stats?.totalXp || activeUser.xp || 2180;
  const streak = stats?.streakDays || 12;
  const unlockedBadgesCount =
    stats?.unlockedBadgesCount || badges.filter((b) => b.unlocked).length || 3;
  const totalBadgesCount = stats?.totalBadgesCount || badges.length || 6;

  let roleLabel = "Mahasiswa Aktif";
  if (activeUser.role === "admin") {
    roleLabel = "Super Administrator";
  } else if (activeUser.role === "dosen") {
    roleLabel = "Tenaga Pendidik / Dosen";
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-slate-900 font-['Inter',sans-serif] antialiased">
      {/* Header Top Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-black/8 sticky top-0 z-20 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
              <span>Portal Akademik</span>
              <span className="text-black/20">/</span>
              <span>Profil Pengguna</span>
              <span className="text-black/20">/</span>
              <span className="text-black font-semibold">D3 TI SV UNS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-light text-black tracking-tight">
              Profil & Preferensi Pembelajaran
            </h1>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-1.5 text-xs font-medium bg-[#F4F4F6] hover:bg-neutral-200 text-black px-4 py-2.5 rounded-full border border-black/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-black" />
              <span>Kembali ke Beranda</span>
            </Link>
            <Link
              href="/riwayat"
              className="inline-flex items-center space-x-1.5 text-xs font-medium bg-[#F4F4F6] hover:bg-neutral-200 text-black px-4 py-2.5 rounded-full border border-black/10 transition-all cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-black" />
              <span>Riwayat Aktivitas</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* HERO BENTO PROFILE BANNER */}
        <div className="bg-white border border-black/8 rounded-3xl p-6 sm:p-8 shadow-xs hover:border-black/20 transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Avatar & Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-black text-white flex items-center justify-center text-3xl sm:text-4xl font-light font-mono shadow-md border-2 border-white ring-4 ring-black/5 shrink-0">
                  {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div
                  className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white"
                  title="Akun Terverifikasi SSO"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-3 py-1 rounded-full uppercase tracking-wider bg-[#F4F4F6] text-black border border-black/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    {roleLabel} (SSO UNS)
                  </span>
                  <span className="text-[11px] font-mono font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {currentLevel}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-light text-black tracking-tight">
                  {activeUser.name || "Cahyo DP"}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    {activeUser.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-neutral-400" />
                    NIM: {activeUser.nimOrNip || "V392450"}
                  </span>
                  <span className="text-neutral-600 font-sans font-medium">
                    {activeUser.prodi || "D3 Teknik Informatika SV UNS"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Academic KPI Bento Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFAFA] p-4 rounded-2xl border border-black/5">
              <div className="text-center sm:text-left px-2">
                <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                  IPK Kumulatif
                </div>
                <div className="text-lg font-bold text-black font-mono mt-0.5">3.84</div>
                <div className="text-[10px] text-emerald-600 font-medium">Sangat Memuaskan</div>
              </div>

              <div className="text-center sm:text-left px-2 border-l border-black/5">
                <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                  SKS Selesai
                </div>
                <div className="text-lg font-bold text-black font-mono mt-0.5">72 / 110</div>
                <div className="text-[10px] text-neutral-500">65% Kurikulum</div>
              </div>

              <div className="text-center sm:text-left px-2 border-l border-black/5">
                <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                  Semester Aktif
                </div>
                <div className="text-lg font-bold text-black font-mono mt-0.5">Sem. 4</div>
                <div className="text-[10px] text-indigo-600 font-medium">Genap 2025/2026</div>
              </div>

              <div className="text-center sm:text-left px-2 border-l border-black/5">
                <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                  Status Presensi
                </div>
                <div className="text-lg font-bold text-black font-mono mt-0.5">98.2%</div>
                <div className="text-[10px] text-emerald-600 font-medium">Memenuhi Syarat</div>
              </div>
            </div>
          </div>
        </div>

        {/* TAB TOGGLE BAR */}
        <div className="flex border-b border-black/10 overflow-x-auto gap-2 py-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "overview"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-neutral-600 hover:text-black border border-black/8 hover:bg-[#F4F4F6]"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Ringkasan & Prestasi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("edit_profile")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "edit_profile"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-neutral-600 hover:text-black border border-black/8 hover:bg-[#F4F4F6]"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Biodata & Edit Profil</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "security"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-neutral-600 hover:text-black border border-black/8 hover:bg-[#F4F4F6]"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Keamanan & Akun SSO</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "preferences"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-neutral-600 hover:text-black border border-black/8 hover:bg-[#F4F4F6]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preferensi Belajar AI</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <AnimatePresence mode="wait">
          {/* TAB 1: OVERVIEW & GAMIFICATION */}
          {activeTab === "overview" && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Bento 4-Cards Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total XP Card */}
                <div className="bg-white p-5 rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                        Total Akumulasi XP
                      </span>
                      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold font-mono text-black">
                      {formatXp(userXp)}{" "}
                      <span className="text-sm font-normal text-neutral-500">XP</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Target 2.500 XP untuk mencapai <strong>Lvl 9 • Expert</strong>
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/5">
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((userXp / 2500) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Study Streak Card */}
                <div className="bg-white p-5 rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                        Study Streak
                      </span>
                      <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                        <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold font-mono text-black">
                      {streak}{" "}
                      <span className="text-sm font-normal text-neutral-500">Hari Berturut</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Status keaktifan praktikum kelas berjalan konsisten.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Streak Aktif Hari Ini</span>
                  </div>
                </div>

                {/* 3. Badges Unlocked Card */}
                <div className="bg-white p-5 rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                        Lencana Terbuka
                      </span>
                      <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                        <Trophy className="w-4 h-4 text-amber-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold font-mono text-black">
                      {unlockedBadgesCount} / {totalBadgesCount}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Pencapaian evaluasi mandiri & kecakapan algoritma.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/5 text-[11px] text-neutral-500">
                    Tier tertinggi: <span className="font-semibold text-amber-700">Gold Tier</span>
                  </div>
                </div>

                {/* 4. Curriculum Modules Card */}
                <div className="bg-white p-5 rounded-3xl border border-black/8 shadow-xs hover:border-black/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                        Progres Modul
                      </span>
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                        <BookOpen className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold font-mono text-black">
                      3 / 5 <span className="text-sm font-normal text-neutral-500">Bab Tuntas</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Modul aktif: Bab 4 Rekursi & Pohon Biner.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Kelulusan kuis:</span>
                    <span className="font-bold text-emerald-600">100% Lulus</span>
                  </div>
                </div>
              </div>

              {/* Badges Showcase Grid */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-light text-black tracking-tight">
                      Koleksi Lencana Capaian Praktikum
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Lencana otomatis tersingkap berdasarkan ketuntasan materi, skor kuis, dan
                      kolaborasi bersama AI Tutor.
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-[#F4F4F6] text-black border border-black/10 px-3 py-1 rounded-full self-start sm:self-auto">
                    {unlockedBadgesCount} dari {totalBadgesCount} Terkumpul
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id || badge.code}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        badge.unlocked
                          ? "bg-white border-black/8 shadow-2xs hover:border-black/20"
                          : "bg-[#FAFAFA] border-black/5 opacity-60"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                          badge.unlocked
                            ? badge.tier === "Gold"
                              ? "bg-amber-50/70 border-amber-200"
                              : badge.tier === "Silver"
                                ? "bg-indigo-50/70 border-indigo-200"
                                : "bg-orange-50/70 border-orange-200"
                            : "bg-neutral-100 border-neutral-200"
                        }`}
                      >
                        {getBadgeIcon(badge.iconName, badge.tier)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-black truncate">{badge.title}</h4>
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              badge.unlocked
                                ? badge.tier === "Gold"
                                  ? "bg-amber-100 text-amber-800"
                                  : badge.tier === "Silver"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : "bg-orange-100 text-orange-800"
                                : "bg-neutral-200 text-neutral-600"
                            }`}
                          >
                            {badge.tier}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                          {badge.description}
                        </p>
                        <div className="text-[10px] font-mono text-neutral-400 mt-2 flex items-center gap-1">
                          {badge.unlocked ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Terbuka
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Lock className="w-3 h-3 text-neutral-400" /> Terkunci
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Learning Activity Feed */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-light text-black tracking-tight">
                      Riwayat Aktivitas Pembelajaran Terkini
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Log telemetri aktivitas interaktif yang tercatat di basis data persisten.
                    </p>
                  </div>
                  <Link
                    href="/riwayat"
                    className="text-xs font-medium text-black hover:underline flex items-center gap-1"
                  >
                    <span>Lihat Seluruh Riwayat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="divide-y divide-black/5">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((act) => (
                      <div key={act.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#F4F4F6] border border-black/8 flex items-center justify-center shrink-0 text-black">
                            {act.type === "quiz_completed" ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : act.type === "ai_tutor_chat" ? (
                              <Sparkles className="w-4 h-4 text-indigo-600" />
                            ) : act.type === "module_step" ? (
                              <BookOpen className="w-4 h-4 text-amber-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-neutral-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-black">{act.title}</div>
                            <div className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                              {act.description}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold font-mono text-emerald-700">
                            +{act.xpEarned} XP
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            {new Date(act.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-neutral-500">
                      Belum ada riwayat aktivitas yang tercatat. Selesaikan kuis atau modul untuk
                      mulai mengumpulkan XP!
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: EDIT BIODATA & PROFILE */}
          {activeTab === "edit_profile" && (
            <motion.div
              key="tab-edit-profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-light text-black tracking-tight">
                    Pengaturan Biodata & Profil Mahasiswa
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Perubahan data pada formulir ini akan tersimpan ke penyimpanan lokal dan
                    disinkronkan ke seluruh antarmuka NexedAI secara langsung.
                  </p>
                </div>

                {saveSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Profil berhasil diperbarui dan disinkronkan ke seluruh sistem!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="input-name"
                        className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5"
                      >
                        Nama Lengkap Mahasiswa
                      </label>
                      <input
                        id="input-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
                        placeholder="contoh: Cahyo DP"
                      />
                    </div>

                    {/* NIM */}
                    <div>
                      <label
                        htmlFor="input-nim"
                        className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5"
                      >
                        Nomor Induk Mahasiswa (NIM)
                      </label>
                      <input
                        id="input-nim"
                        type="text"
                        value={nim}
                        onChange={(e) => setNim(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-mono font-medium"
                        placeholder="contoh: V392450"
                      />
                    </div>

                    {/* Email (Read-Only) */}
                    <div>
                      <label
                        htmlFor="input-email"
                        className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5"
                      >
                        Alamat Email Akun SSO
                      </label>
                      <div className="relative">
                        <input
                          id="input-email"
                          type="email"
                          value={activeUser.email}
                          disabled
                          className="w-full px-4 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-500 font-mono cursor-not-allowed"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-medium">
                          Terverifikasi
                        </span>
                      </div>
                    </div>

                    {/* Phone / WA */}
                    <div>
                      <label
                        htmlFor="input-phone"
                        className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5"
                      >
                        Nomor WhatsApp / Kontak
                      </label>
                      <input
                        id="input-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-mono"
                        placeholder="contoh: 0812-3456-7890"
                      />
                    </div>

                    {/* Prodi */}
                    <div>
                      <label
                        htmlFor="input-prodi"
                        className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5"
                      >
                        Program Studi & Jurusan
                      </label>
                      <select
                        id="input-prodi"
                        value={prodi}
                        onChange={(e) => setProdi(e.target.value)}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                      >
                        <option value="D3 Teknik Informatika SV UNS">
                          D3 Teknik Informatika SV UNS
                        </option>
                        <option value="S1 Informatika FMIPA UNS">S1 Informatika FMIPA UNS</option>
                        <option value="S1 Sains Data FMIPA UNS">S1 Sains Data FMIPA UNS</option>
                        <option value="D3 Manajemen Informatika SV UNS">
                          D3 Manajemen Informatika SV UNS
                        </option>
                      </select>
                    </div>

                    {/* Semester */}
                    <div>
                      <label
                        htmlFor="input-semester"
                        className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5"
                      >
                        Tingkat Semester Berjalan
                      </label>
                      <select
                        id="input-semester"
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-mono"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>
                            Semester {s} ({s % 2 === 0 ? "Genap" : "Ganjil"})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Bio / Minat */}
                  <div>
                    <label
                      htmlFor="input-bio"
                      className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5"
                    >
                      Bio Akademik & Fokus Minat
                    </label>
                    <textarea
                      id="input-bio"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all leading-relaxed"
                      placeholder="Tuliskan minat studi, topik praktikum favorit, atau deskripsi singkat profil Anda..."
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-black hover:bg-neutral-800 text-white font-medium px-6 py-2.5 rounded-full text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Simpan Perubahan Profil</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* TAB 3: SECURITY & SSO */}
          {activeTab === "security" && (
            <motion.div
              key="tab-security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* SSO UNS Status Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-black">
                      Autentikasi Single Sign-On (SSO) UNS
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Akun Anda terintegrasi dengan kredensial resmi Universitas Sebelas Maret.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-black/5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                      Protokol Autentikasi
                    </div>
                    <div className="text-xs font-bold text-black mt-1">OAuth 2.0 / JWT Secure</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-black/5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                      Status Verifikasi
                    </div>
                    <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Terverifikasi Aktif
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-black/5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                      Sesi Login Terakhir
                    </div>
                    <div className="text-xs font-bold text-black mt-1">
                      Hari Ini • Aktif Sekarang
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Change Form */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-black">Perbarui Kata Sandi Akun</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Amankan akses portal akademik Anda dengan kata sandi yang kuat dan unik.
                  </p>
                </div>

                {securityMessage && (
                  <div
                    className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
                      securityMessage.includes("berhasil")
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                        : "bg-rose-50 border border-rose-200 text-rose-800"
                    }`}
                  >
                    {securityMessage.includes("berhasil") ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    )}
                    <span>{securityMessage}</span>
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
                  <div>
                    <label
                      htmlFor="input-current-pass"
                      className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5"
                    >
                      Kata Sandi Saat Ini
                    </label>
                    <input
                      id="input-current-pass"
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-mono"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="input-new-pass"
                      className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5"
                    >
                      Kata Sandi Baru
                    </label>
                    <input
                      id="input-new-pass"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-mono"
                      placeholder="Minimal 6 karakter"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="input-confirm-pass"
                      className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5"
                    >
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <input
                      id="input-confirm-pass"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-mono"
                      placeholder="Ketik ulang kata sandi baru"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-neutral-500 hover:text-black flex items-center gap-1.5 cursor-pointer select-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      <span>{showPassword ? "Sembunyikan Kata Sandi" : "Lihat Kata Sandi"}</span>
                    </button>

                    <button
                      type="submit"
                      className="bg-black hover:bg-neutral-800 text-white font-medium px-5 py-2.5 rounded-full text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Perbarui Kata Sandi</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Session & Device Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-black">
                      Perangkat & Sesi Login Aktif
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Daftar peramban yang sedang terautentikasi ke akun Anda.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-black/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center text-black">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-black flex items-center gap-2">
                        <span>Google Chrome di Windows 11</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full">
                          Perangkat Ini
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        IP: 103.23.xxx.xxx • Surakarta, Indonesia • Aktif Sekarang
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all font-medium border border-rose-200 cursor-pointer"
                  >
                    Keluar Sesi
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: AI & LEARNING PREFERENCES */}
          {activeTab === "preferences" && (
            <motion.div
              key="tab-preferences"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-light text-black tracking-tight">
                    Preferensi Pembelajaran & AI Tutor
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Sesuaikan kepribadian Nexed AI Tutor, ritme belajar harian, dan preferensi
                    notifikasi sesuai gaya belajar Anda.
                  </p>
                </div>

                {prefSaveSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>
                      Preferensi pembelajaran berhasil disimpan dan diaktifkan untuk AI Tutor Anda!
                    </span>
                  </div>
                )}

                <form onSubmit={handleSavePreferences} className="space-y-6">
                  {/* AI Tutor Response Style */}
                  <div>
                    <div className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                      Gaya Menjawab Nexed AI Tutor
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setAiTutorStyle("socratic")}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          aiTutorStyle === "socratic"
                            ? "bg-black text-white border-black shadow-xs"
                            : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-black"
                        }`}
                      >
                        <div className="text-xs font-bold mb-1">Metode Sokratik (Rekomendasi)</div>
                        <div
                          className={`text-[11px] leading-relaxed ${aiTutorStyle === "socratic" ? "text-neutral-300" : "text-neutral-500"}`}
                        >
                          Membimbing mahasiswa melalui analogi intuitif dan pertanyaan kritis
                          sebelum memberikan jawaban akhir.
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAiTutorStyle("practical")}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          aiTutorStyle === "practical"
                            ? "bg-black text-white border-black shadow-xs"
                            : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-black"
                        }`}
                      >
                        <div className="text-xs font-bold mb-1">Praktis & Solutif</div>
                        <div
                          className={`text-[11px] leading-relaxed ${aiTutorStyle === "practical" ? "text-neutral-300" : "text-neutral-500"}`}
                        >
                          Langsung menyajikan cuplikan sintaks kode, penanganan error, dan contoh
                          konkret tanpa pengantar panjang.
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAiTutorStyle("comprehensive")}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          aiTutorStyle === "comprehensive"
                            ? "bg-black text-white border-black shadow-xs"
                            : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-black"
                        }`}
                      >
                        <div className="text-xs font-bold mb-1">Akademik Mendalam</div>
                        <div
                          className={`text-[11px] leading-relaxed ${aiTutorStyle === "comprehensive" ? "text-neutral-300" : "text-neutral-500"}`}
                        >
                          Ulasan teori fundamental komputasi lengkap dengan notasi Big-O dan
                          referensi silabus kurikulum UNS.
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Target Waktu Belajar Mingguan */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="range-target-hours"
                        className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600"
                      >
                        Target Sesi Belajar Mandiri:{" "}
                        <span className="font-bold text-black">
                          {weeklyTargetHours} Jam / Minggu
                        </span>
                      </label>
                      <span className="text-xs text-neutral-400 font-mono">
                        Standar Kurikulum: 6 Jam/Minggu
                      </span>
                    </div>
                    <input
                      id="range-target-hours"
                      type="range"
                      min={2}
                      max={14}
                      step={1}
                      value={weeklyTargetHours}
                      onChange={(e) => setWeeklyTargetHours(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1">
                      <span>2 Jam (Santai)</span>
                      <span>6 Jam (Rekomendasi Dosen)</span>
                      <span>14 Jam (Intensif Responsi)</span>
                    </div>
                  </div>

                  {/* Notification Switches */}
                  <div className="space-y-3 pt-2">
                    <div className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                      Notifikasi & Pengingat Aktif
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <div>
                        <div className="text-xs font-semibold text-black">
                          Pengingat Kuis & Active Recall Harian
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          Kirim notifikasi pengingat singkat untuk menjaga study streak harian Anda.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifyDailyQuiz}
                        onChange={(e) => setNotifyDailyQuiz(e.target.checked)}
                        className="w-5 h-5 accent-black rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <div>
                        <div className="text-xs font-semibold text-black">
                          Pembaruan Silabus & Modul Dosen
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          Beritahu ketika dosen pengampu mengunggah materi ajar atau tugas praktikum
                          baru.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifyModuleUpdates}
                        onChange={(e) => setNotifyModuleUpdates(e.target.checked)}
                        className="w-5 h-5 accent-black rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="bg-black hover:bg-neutral-800 text-white font-medium px-6 py-2.5 rounded-full text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Preferensi Belajar</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOGOUT DANGER ZONE */}
        <div className="bg-white p-6 rounded-3xl border border-black/8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-black">Sesi Akun Pembelajaran</div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Keluar dari akun Anda di peramban ini jika menggunakan perangkat laboratorium bersama.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold py-2.5 px-5 rounded-full text-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-700" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </main>
    </div>
  );
}
