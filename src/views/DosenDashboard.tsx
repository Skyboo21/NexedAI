// src/views/DosenDashboard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NexedMasteryTableModule from "../components/NexedMasteryTableModule";
import { useAuthStore } from "../store/authStore";

export default function DosenDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Route protection redirect only if role explicitly belongs to another portal
  useEffect(() => {
    if (user?.role && user.role !== "dosen") {
      if (user.role === "mahasiswa") {
        router.push("/dashboard");
      } else if (user.role === "admin") {
        router.push("/admin-dashboard");
      }
    }
  }, [user, router]);

  // Safe fallback to prevent blank/null render during SSR or page reloads
  const activeUser = user || {
    email: "dosen@nexed.ai",
    role: "dosen" as const,
    name: "Dr. Hendra Wijaya",
  };

  return (
    <div className="bg-[#020617] text-slate-100 min-h-screen flex flex-col relative overflow-x-hidden font-['Outfit'] antialiased">
      {/* Ambient Light Background */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[150px] opacity-40 pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] opacity-40 pointer-events-none -z-10" />

      {/* Top Header Navbar inside Dosen layout */}
      <header
        className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20 px-6 py-4 transition-all"
        role="banner"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
              <span>Portal Dosen Pengampu</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300">Algoritma & Struktur Data (Kelas A)</span>
            </div>
            <h1
              suppressHydrationWarning
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              Dashboard Analitik: {activeUser.name || activeUser.email.split("@")[0]}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
              ● Semester Genap 2026
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 w-full relative z-10" role="main">
        {/* Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/70 border border-white/10 rounded-2xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Total Mahasiswa
            </div>
            <div className="text-3xl font-black text-white">42 Mahasiswa</div>
            <p className="text-xs text-emerald-400 mt-2 font-semibold">
              ● 100% Terdaftar di Sistem
            </p>
          </div>

          <div className="p-5 bg-slate-900/70 border border-white/10 rounded-2xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Rata-rata Skor Kelas
            </div>
            <div className="text-3xl font-black text-blue-400">84.6%</div>
            <p className="text-xs text-slate-400 mt-2">Target Penguasaan: &gt;75%</p>
          </div>

          <div className="p-5 bg-slate-900/70 border border-white/10 rounded-2xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Mahasiswa Perlu Atensi
            </div>
            <div className="text-3xl font-black text-red-400">2 Orang</div>
            <p className="text-xs text-red-400/80 mt-2 font-semibold">⚠️ Butuh Bimbingan Remedial</p>
          </div>

          <div className="p-5 bg-slate-900/70 border border-white/10 rounded-2xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tingkat Penguasaan (Mastery)
            </div>
            <div className="text-3xl font-black text-emerald-400">78.5%</div>
            <p className="text-xs text-emerald-400/80 mt-2">Kategori: Sangat Baik</p>
          </div>
        </div>

        {/* Section 1: Alert Mahasiswa Berisiko */}
        <section id="alerts" aria-labelledby="alert-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              id="alert-heading"
              className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-3"
            >
              <span className="text-2xl">⚠️</span>
              <span>Peringatan Dini Mahasiswa Berisiko</span>
              <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse shadow-sm">
                Real-time Alert
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-red-950/40 border border-red-500/30 rounded-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-extrabold text-lg text-white">Budi Santoso</h3>
                  <span className="text-xs text-slate-400 font-mono">NIM: 202401048</span>
                </div>
                <span className="text-xs font-bold text-red-400 bg-red-500/20 border border-red-500/30 px-2.5 py-1 rounded-full">
                  Berisiko Tinggi
                </span>
              </div>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                Gagal menyelesaikan Kuis Modul Looping & Iterasi 3 kali berturut-turut. Skor kuis
                terakhir: 35/100.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-red-500/20">
                <span className="text-xs text-slate-400">
                  Rekomendasi AI: Berikan tugas penguatan dasar
                </span>
                <span className="text-xs font-bold text-red-400 group-hover:underline">
                  Tinjau Log Belajar &rarr;
                </span>
              </div>
            </div>

            <div className="p-6 bg-orange-950/40 border border-orange-500/30 rounded-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-extrabold text-lg text-white">Siti Aminah</h3>
                  <span className="text-xs text-slate-400 font-mono">NIM: 202401092</span>
                </div>
                <span className="text-xs font-bold text-orange-400 bg-orange-500/20 border border-orange-500/30 px-2.5 py-1 rounded-full">
                  Perlu Perhatian
                </span>
              </div>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                Waktu pengerjaan tugas modul Struktur Data Array melebihi rata-rata kelas sebesar
                200%. Belum mengunggah target mandiri.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-orange-500/20">
                <span className="text-xs text-slate-400">
                  Rekomendasi AI: Kirim pengingat asistensi lab
                </span>
                <span className="text-xs font-bold text-orange-400 group-hover:underline">
                  Tinjau Log Belajar &rarr;
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Tabel Penguasaan (Mastery Table TanStack Query) */}
        <section aria-labelledby="table-heading" className="space-y-4">
          <NexedMasteryTableModule />
        </section>
      </main>
    </div>
  );
}
