// src/views/StudentDashboard.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NexedDashboardModule from "../components/NexedDashboardModule";
import NexedFormEntryModule from "../components/NexedFormEntryModule";
import TaskTodoList from "../components/TaskTodoList";
import { useAuthStore } from "../store/authStore";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return (
      <div className="bg-slate-50 text-slate-900 min-h-screen flex items-center justify-center font-['Outfit']">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Memuat dashboard mahasiswa...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-['Outfit'] antialiased">
      {/* Top Header Bar */}
      <header
        className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 transition-all"
        role="banner"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
              <span>Portal Pembelajaran Mahasiswa</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">Peta Belajar & Capaian</span>
            </div>
            <h1
              suppressHydrationWarning
              className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight"
            >
              Selamat Datang, {activeUser.name || activeUser.email.split("@")[0]}
            </h1>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <Link
              href="/modul"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <span>📚</span>
              <span>Buka Modul Belajar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8">
        {/* Banner Hero Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Ekosistem Pembelajaran Adaptif AI</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Pusat Pembelajaran Cerdas & Terstruktur
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Tingkatkan pemahaman algoritma dan struktur data Anda melalui kurikulum adaptif,
              target belajar mandiri berbasis validasi skema, serta interaksi panduan tutor AI
              terpadu.
            </p>
          </div>
        </div>

        {/* Quick Metrics Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status Kurikulum
            </div>
            <div className="text-2xl font-black text-slate-900">5 Modul</div>
            <p className="text-xs text-indigo-600 mt-1.5 font-semibold">
              2 Selesai, 1 Rekomendasi AI
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Experience (XP)
            </div>
            <div className="text-2xl font-black text-amber-600">125 XP</div>
            <p className="text-xs text-slate-500 mt-1.5">Level 2 Mahasiswa Adaptif</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Target Berjalan
            </div>
            <div className="text-2xl font-black text-emerald-600">In Progress</div>
            <p className="text-xs text-slate-500 mt-1.5">Checklist target belajar mandiri</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Rekomendasi AI
            </div>
            <div className="text-lg font-bold text-indigo-700 truncate">Looping & Iterasi</div>
            <p className="text-xs text-slate-500 mt-1.5">Perlu latihan pengulangan bersarang</p>
          </div>
        </div>

        {/* 2-Column Content Layout: Left = Roadmap, Right = Form & Task List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Peta Belajar Roadmap */}
          <section
            id="peta"
            aria-label="Peta Belajar"
            className="lg:col-span-2 flex flex-col gap-8"
          >
            <NexedDashboardModule />
          </section>

          {/* Right 1 Col: Zod Form Target + Todo List */}
          <section
            id="riwayat"
            aria-label="Aktivitas Belajar Mandiri"
            className="lg:col-span-1 flex flex-col gap-8"
          >
            <NexedFormEntryModule />
            <TaskTodoList />
          </section>
        </div>
      </div>
    </div>
  );
}
