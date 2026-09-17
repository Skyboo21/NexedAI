// src/views/StudentDashboard.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NexedDashboardModule from "../components/NexedDashboardModule";
import NexedFormEntryModule from "../components/NexedFormEntryModule";
import TaskTodoList from "../components/TaskTodoList";
import { useAuthStore } from "../store/authStore";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Route protection redirect only if role explicitly belongs to another portal
  useEffect(() => {
    if (user?.role && user.role !== "mahasiswa") {
      if (user.role === "dosen") {
        router.push("/dosen-dashboard");
      } else if (user.role === "admin") {
        router.push("/admin-dashboard");
      }
    }
  }, [user, router]);

  // Safe fallback to prevent blank/null render during SSR or page reloads
  const activeUser = user || {
    email: "mahasiswa@nexed.ai",
    role: "mahasiswa" as const,
    name: "Muhammad Hariz",
  };

  return (
    <div className="bg-[#020617] text-slate-100 min-h-screen flex flex-col relative overflow-x-hidden font-['Outfit'] antialiased">
      {/* Ambient background glows */}
      <div className="absolute top-0 -left-20 w-[30rem] h-[30rem] bg-purple-600/15 rounded-full mix-blend-screen filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-[30rem] h-[30rem] bg-blue-600/15 rounded-full mix-blend-screen filter blur-[140px] pointer-events-none" />

      {/* Top Header Navbar inside Mahasiswa layout */}
      <header
        className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20 px-6 py-4 transition-all"
        role="banner"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
              <span>Portal Mahasiswa</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300">Peta Belajar & Target Mandiri</span>
            </div>
            <h1
              suppressHydrationWarning
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              Selamat Datang, {activeUser.name || activeUser.email.split("@")[0]}
            </h1>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <Link
              href="/belajar"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-purple-500/25 transition-all"
            >
              <span>📚</span>
              <span>Buka Modul Belajar AI</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full relative z-10 space-y-8" role="main">
        {/* Banner Hero */}
        <div className="relative glass-card rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-blue-950/30 shadow-2xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-inner shadow-purple-500/20">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Adaptive AI Learning Ecosystem</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-slate-300 mb-3">
              Pusat Pembelajaran Cerdas
            </h2>
            <p className="text-slate-300 max-w-3xl text-sm sm:text-base font-light leading-relaxed">
              Akses peta belajar kurikulum adaptif Algoritma & Pemrograman, tetapkan target belajar
              terstruktur dengan validasi skema Zod, dan tuntaskan materi bersama asisten AI NEXED.
            </p>
          </div>
        </div>

        {/* Quick Progress Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/70 border border-white/10 rounded-2xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Status Kurikulum
            </div>
            <div className="text-2xl font-black text-white">5 Modul</div>
            <p className="text-xs text-purple-400 mt-2 font-semibold">
              2 Selesai, 1 Rekomendasi AI
            </p>
          </div>

          <div className="p-5 bg-slate-900/70 border border-white/10 rounded-2xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Total Experience (XP)
            </div>
            <div className="text-2xl font-black text-amber-400">125 XP</div>
            <p className="text-xs text-slate-400 mt-2">Level 2 Mahasiswa Adaptif</p>
          </div>

          <div className="p-5 bg-slate-900/70 border border-white/10 rounded-2xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Target Berjalan
            </div>
            <div className="text-2xl font-black text-emerald-400">In Progress</div>
            <p className="text-xs text-emerald-400/80 mt-2">Daftar tugas tersimpan lokal</p>
          </div>

          <div className="p-5 bg-slate-900/70 border border-white/10 rounded-2xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Rekomendasi AI Terkini
            </div>
            <div className="text-lg font-bold text-blue-300 truncate">Looping & Iterasi</div>
            <p className="text-xs text-slate-400 mt-2">Butuh penguatan konsep dasar</p>
          </div>
        </div>

        {/* 2-Column Content Layout: Left = Roadmap, Right = Form & Task List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Peta Belajar Roadmap */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <NexedDashboardModule />
          </div>

          {/* Right 1 Col: Zod Form Target + Todo List */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <NexedFormEntryModule />
            <TaskTodoList />
          </div>
        </div>
      </main>
    </div>
  );
}
