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
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-['Outfit'] antialiased">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <span>Portal Pembelajaran Mahasiswa</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">Peta Belajar & Capaian</span>
            </div>
            <h1
              suppressHydrationWarning
              className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
            >
              Selamat Datang, {activeUser.name || activeUser.email.split("@")[0]}
            </h1>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <Link
              href="/modul"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-xs transition-colors"
            >
              <span>Buka Modul Belajar &rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8">
        {/* Banner Hero Card */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Ekosistem Pembelajaran Terstruktur</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Pusat Pembelajaran Adaptif
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
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Status Kurikulum
            </div>
            <div className="text-2xl font-bold text-slate-900">5 Modul</div>
            <p className="text-xs text-blue-600 mt-1.5 font-medium">
              2 Selesai, 1 Rekomendasi
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Total Experience (XP)
            </div>
            <div className="text-2xl font-bold text-amber-600">125 XP</div>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">Level 2 Mahasiswa Adaptif</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Target Berjalan
            </div>
            <div className="text-2xl font-bold text-emerald-600">In Progress</div>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">Checklist target belajar mandiri</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Rekomendasi Belajar
            </div>
            <div className="text-lg font-bold text-slate-900 truncate">Looping & Iterasi</div>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">Perlu latihan pengulangan bersarang</p>
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
