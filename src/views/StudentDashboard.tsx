// src/views/StudentDashboard.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NexedDashboardModule from "../components/NexedDashboardModule";
import NexedFormEntryModule from "../components/NexedFormEntryModule";
import NexedLeaderboard from "../components/NexedLeaderboard";
import TaskTodoList from "../components/TaskTodoList";
import { useAuthStore } from "../store/authStore";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Role guard redirect
  useEffect(() => {
    if (user?.role && user.role !== "mahasiswa") {
      if (user.role === "dosen") {
        router.push("/dosen-dashboard");
      } else if (user.role === "admin") {
        router.push("/admin-dashboard");
      }
    }
  }, [user, router]);

  const activeUser = user ?? {
    email: "mahasiswa@nexed.ai",
    role: "mahasiswa" as const,
    name: "Muhammad Hariz",
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
              <span className="text-black font-semibold">D3 TI SV UNS</span>
            </div>
            <h1
              suppressHydrationWarning
              className="text-xl sm:text-2xl font-light text-black tracking-tight"
            >
              Selamat Datang, {activeUser.name || activeUser.email.split("@")[0]}
            </h1>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <Link
              href="/modul"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-xs"
            >
              <span>Buka Silabus Modul &rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Bento Grid Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full space-y-6">
        {/* Bento Grid 4-Kolom Responsif */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* CARD 1 (Span 2x1 - Welcome Hero): Sapaan, level, target semester, CTA */}
          <div className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-xs hover:border-black/20 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-xs px-3 py-1 rounded-full">
                  Level 3 • Praktikan Terampil
                </span>
                <span className="bg-[#F4F4F6] text-black/70 border border-black/10 font-mono text-xs px-3 py-1 rounded-full">
                  Semester 2 • TI SV UNS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light text-black tracking-tight">
                Studio Praktikum Algoritma & Pemrograman
              </h2>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                Pantau capaian praktikum mingguan, eksplorasi modul terstruktur, dan jalankan simulasi
                penguatan logika komputasi untuk menguasai standar kompetensi kurikulum D3 Teknik Informatika.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-neutral-500 font-normal">
                🎯 Target Berjalan: <span className="text-black font-medium">5 Modul Algoritma & Praktikum</span>
              </div>
              <Link
                href="/modul"
                className="inline-flex items-center justify-center space-x-2 text-xs font-medium bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-xs"
              >
                <span>Buka Modul Belajar &rarr;</span>
              </Link>
            </div>
          </div>

          {/* CARD 2 (Span 1x1 - XP & Streak): Total akumulasi XP, badge aktif, streak */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs hover:border-black/20 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-500 font-mono text-xs uppercase tracking-wider">
                  Total Pengalaman
                </span>
                <span className="bg-[#F4F4F6] text-black border border-black/10 font-medium text-[11px] px-2.5 py-0.5 rounded-full">
                  🔥 12 Hari Streak
                </span>
              </div>
              <div className="text-3xl font-light tracking-tight text-black mt-1">
                225 XP
              </div>
              <p className="text-xs text-neutral-500 mt-1 font-medium">+35 XP minggu ini</p>
            </div>

            <div className="pt-4 border-t border-black/5 mt-4 space-y-1.5">
              <div className="text-[11px] text-neutral-500 font-medium">Lencana Utama Aktif:</div>
              <div className="flex items-center gap-2.5 bg-[#F4F4F6] border border-black/10 p-3 rounded-2xl">
                <span className="text-xl">🏆</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-black truncate">Pakar Struktur Kontrol</p>
                  <span className="text-[10px] text-neutral-500 font-mono">Tingkat Lanjut (Gold Tier)</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3 (Span 1x1 - Prioritas Penguatan Materi): Rekomendasi materi terfokus */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs hover:border-black/20 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-500 font-mono text-xs uppercase tracking-wider">
                  Prioritas Materi
                </span>
                <span className="bg-[#F4F4F6] text-black border border-black/10 font-medium text-[11px] px-2.5 py-0.5 rounded-full">
                  Perlu Penguatan
                </span>
              </div>
              <div className="text-lg font-light text-black tracking-tight mt-1">
                Pengulangan & Iterasi
              </div>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                Akurasi logika nested loop berada di 64%. Coba latihan pengulangan terpandu sebelum responsi praktikum.
              </p>
            </div>

            <div className="pt-4 border-t border-black/5 mt-4">
              <Link
                href="/modul/3"
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium bg-[#F4F4F6] hover:bg-neutral-200 text-black border border-black/10 py-2.5 px-4 rounded-full transition-colors text-center"
              >
                <span>Mulai Penguatan Topik &rarr;</span>
              </Link>
            </div>
          </div>

          {/* CARD 4 (Span 2x2 - Peta Belajar Adaptif Interaktif) */}
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
            <NexedDashboardModule />
          </div>

          {/* CARD 5 (Span 2x2 - Target Planner & Input Mandiri Zod) */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-5">
            <NexedFormEntryModule />
            <TaskTodoList />
          </div>

          {/* CARD 6 (Span 4 - Leaderboard Widget) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <NexedLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
