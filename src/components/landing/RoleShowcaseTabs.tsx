// src/components/landing/RoleShowcaseTabs.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export function RoleShowcaseTabs() {
  const [activeRole, setActiveRole] = useState<"mahasiswa" | "dosen" | "admin">("mahasiswa");

  return (
    <div className="space-y-8">
      {/* Role Navigation Switcher */}
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Pilihan Peran Pengguna"
          className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 gap-1"
        >
          <button
            type="button"
            role="tab"
            onClick={() => setActiveRole("mahasiswa")}
            aria-selected={activeRole === "mahasiswa"}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeRole === "mahasiswa"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🎓</span>
            <span>Untuk Mahasiswa</span>
          </button>
          <button
            type="button"
            role="tab"
            onClick={() => setActiveRole("dosen")}
            aria-selected={activeRole === "dosen"}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeRole === "dosen"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>👨‍🏫</span>
            <span>Untuk Dosen</span>
          </button>
          <button
            type="button"
            role="tab"
            onClick={() => setActiveRole("admin")}
            aria-selected={activeRole === "admin"}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeRole === "admin"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🛡️</span>
            <span>Untuk Admin</span>
          </button>
        </div>
      </div>

      {/* Role Card Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {activeRole === "mahasiswa" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-200">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <span>Belajar Adaptif & Gamifikasi</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                Taklukkan Pemrograman dengan Bimbingan AI 24/7
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tidak perlu pusing membaca ratusan halaman modul teks tebal. Unggah file dokumen kuliah Anda, dan Nexed AI akan membedah teori, membuat kuis pemahaman, menyusun roadmap step-by-step, serta menghitung poin XP capaian belajar Anda.
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </span>
                  <span>Upload Modul PDF / DOCX langsung diproses AI</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </span>
                  <span>Papan Peringkat (Leaderboard) & Koleksi Lencana Prestasi</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </span>
                  <span>Efek selebrasi konfeti interaktif saat menuntaskan materi</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
                >
                  <span>Daftar Akun Mahasiswa</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Feature Mockup Preview */}
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-900">Cuplikan Progres Mahasiswa</span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Level 10 • Master
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Looping & Iterasi: Optimasi
                    </h5>
                    <p className="text-[11px] text-slate-500">Tuntas 3/3 Tantangan Kuis</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    100% Selesai
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Binary Search Tree Traversal
                    </h5>
                    <p className="text-[11px] text-slate-500">Rekomendasi Berikutnya</p>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    +120 XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeRole === "dosen" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-200">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span>Early Warning & Class Mastery</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                Pantau Penguasaan Materi Kelas & Lakukan Intervensi Cepat
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dosen pengampu dapat memantau ketercapaian kompetensi (*mastery rate*) mahasiswa secara real-time. Sistem otomatis mengidentifikasi mahasiswa yang berisiko tertinggal (*at-risk*) dan menyediakan fitur intervensi remedial satu klik.
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </span>
                  <span>Distribusi Grade A–E dan metrik penguasaan kelas</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </span>
                  <span>Log aktivitas detail pengerjaan kuis per mahasiswa</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </span>
                  <span>Pemberian tugas remedial langsung tersimpan ke server</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
                >
                  <span>Masuk Portal Dosen</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Feature Mockup Preview */}
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-900">
                  Analitik Kelas: TI-A (42 Mahasiswa)
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Mastery: 78.5%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                    Rata-Rata Nilai
                  </span>
                  <span className="text-xl font-bold text-slate-900">84.6</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-rose-600 font-semibold uppercase block">
                    Perlu Perhatian
                  </span>
                  <span className="text-xl font-bold text-rose-600">2 Mahasiswa</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeRole === "admin" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-200">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <span>Tata Kelola Sistem & Keamanan RBAC</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                Kontrol Akses Terpusat & Pemantauan Performa Server
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Administrator sistem memiliki kendali penuh atas manajemen akun, integritas modul kurikulum, audit log keamanan, serta verifikasi token sesi kriptografis HMAC-SHA256.
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </span>
                  <span>Audit log perubahan hak akses & otentikasi</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </span>
                  <span>Zero Vulnerabilities & Keamanan HttpOnly Cookies</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
                >
                  <span>Masuk Portal Administrator</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Feature Mockup Preview */}
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-900">Status Kesehatan Sistem</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Aktif & Stabil
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between font-mono">
                  <span className="text-slate-600">Edge Middleware Guard</span>
                  <span className="text-emerald-700 font-semibold">Aktif & Terproteksi</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between font-mono">
                  <span className="text-slate-600">HMAC-SHA256 Token Signature</span>
                  <span className="text-emerald-700 font-semibold">Valid</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoleShowcaseTabs;
