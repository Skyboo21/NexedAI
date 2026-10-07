// src/components/landing/RoleShowcaseTabs.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export function RoleShowcaseTabs() {
  const [activeRole, setActiveRole] = useState<"mahasiswa" | "dosen" | "admin">("mahasiswa");

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      {/* Role Navigation Switcher (Minimal Monochrome) */}
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Pilihan Peran Pengguna"
          className="inline-flex p-1.5 bg-[#F4F4F6] rounded-full border border-black/8 gap-1 shadow-2xs"
        >
          <button
            type="button"
            role="tab"
            onClick={() => setActiveRole("mahasiswa")}
            aria-selected={activeRole === "mahasiswa"}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              activeRole === "mahasiswa"
                ? "bg-black text-white shadow-xs font-semibold"
                : "text-black/60 hover:text-black"
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
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              activeRole === "dosen"
                ? "bg-black text-white shadow-xs font-semibold"
                : "text-black/60 hover:text-black"
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
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              activeRole === "admin"
                ? "bg-black text-white shadow-xs font-semibold"
                : "text-black/60 hover:text-black"
            }`}
          >
            <span>🛡️</span>
            <span>Untuk Admin</span>
          </button>
        </div>
      </div>

      {/* Role Card Content */}
      <div className="bg-[#FAFAFA] rounded-3xl border border-black/8 p-6 sm:p-10 shadow-xs">
        {activeRole === "mahasiswa" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-200">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium bg-[#F4F4F6] text-black/80 border border-black/8 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-black/60" />
                <span>Belajar Adaptif & Gamifikasi</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-normal text-black tracking-tight leading-tight">
                Taklukkan Pemrograman dengan Bimbingan AI 24/7
              </h3>
              <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                Tidak perlu pusing membaca ratusan halaman modul teks tebal. Unggah file dokumen kuliah Anda, dan Nexed AI akan membedah teori, membuat kuis pemahaman, menyusun roadmap step-by-step, serta menghitung poin XP capaian belajar Anda.
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs font-medium text-black/80">
                  <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                    ✓
                  </span>
                  <span>Upload Modul PDF / DOCX langsung diproses AI</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-black/80">
                  <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                    ✓
                  </span>
                  <span>Papan Peringkat (Leaderboard) & Koleksi Lencana Prestasi</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-black/80">
                  <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                    ✓
                  </span>
                  <span>Efek selebrasi konfeti interaktif saat menuntaskan materi</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/register"
                  className="btn-pill-black"
                >
                  <span>Daftar Akun Mahasiswa</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Feature Mockup Preview (Clean Monochrome Bento) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-black/8 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-black/8">
                <span className="text-xs font-medium text-black">Cuplikan Progres Mahasiswa</span>
                <span className="text-[11px] font-mono font-medium text-black/75 bg-[#F4F4F6] px-2.5 py-0.5 rounded-full border border-black/8">
                  Level 10 &bull; Master
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-black/8 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-medium text-black">
                      Looping &amp; Iterasi: Optimasi
                    </h5>
                    <p className="text-[11px] text-black/50">Tuntas 3/3 Tantangan Kuis</p>
                  </div>
                  <span className="text-[11px] font-medium text-white bg-black px-2.5 py-0.5 rounded-full">
                    100% Selesai
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-black/8 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-medium text-black">
                      Binary Search Tree Traversal
                    </h5>
                    <p className="text-[11px] text-black/50">Rekomendasi Berikutnya</p>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-black bg-[#F4F4F6] px-2.5 py-0.5 rounded-full border border-black/8">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium bg-[#F4F4F6] text-black/80 border border-black/8 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-black/60" />
                <span>Early Warning &amp; Class Mastery</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-normal text-black tracking-tight leading-tight">
                Pantau Penguasaan Materi Kelas &amp; Lakukan Intervensi Cepat
              </h3>
              <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                Dosen pengampu dapat memantau ketercapaian kompetensi (*mastery rate*) mahasiswa secara real-time. Sistem otomatis mengidentifikasi mahasiswa yang berisiko tertinggal (*at-risk*) dan menyediakan fitur intervensi remedial satu klik.
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs font-medium text-black/80">
                  <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                    ✓
                  </span>
                  <span>Distribusi Grade A–E dan metrik penguasaan kelas</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-black/80">
                  <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                    ✓
                  </span>
                  <span>Log aktivitas detail pengerjaan kuis per mahasiswa</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-black/80">
                  <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                    ✓
                  </span>
                  <span>Pemberian tugas remedial langsung tersimpan ke server</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="btn-pill-black"
                >
                  <span>Masuk Portal Dosen</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Feature Mockup Preview (Clean Monochrome Bento) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-black/8 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-black/8">
                <span className="text-xs font-medium text-black">
                  Analitik Kelas: TI-A (42 Mahasiswa)
                </span>
                <span className="text-[11px] font-mono font-medium text-white bg-black px-2.5 py-0.5 rounded-full">
                  Mastery: 78.5%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-black/8">
                  <span className="text-[10px] text-black/50 font-mono uppercase tracking-wider block">
                    Rata-Rata Nilai
                  </span>
                  <span className="text-xl font-light text-black mt-0.5 block">84.6</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-black/8">
                  <span className="text-[10px] text-black/50 font-mono uppercase tracking-wider block">
                    Perlu Perhatian
                  </span>
                  <span className="text-xl font-medium text-black mt-0.5 block">2 Mahasiswa</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeRole === "admin" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-200">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium bg-[#F4F4F6] text-black/80 border border-black/8 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-black/60" />
                <span>Tata Kelola Sistem &amp; Keamanan RBAC</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-normal text-black tracking-tight leading-tight">
                Kontrol Akses Terpusat &amp; Pemantauan Performa Server
              </h3>
              <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                Administrator sistem memiliki kendali penuh atas manajemen akun, integritas modul kurikulum, audit log keamanan, serta verifikasi token sesi kriptografis HMAC-SHA256.
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs font-medium text-black/80">
                  <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                    ✓
                  </span>
                  <span>Audit log perubahan hak akses &amp; otentikasi</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-black/80">
                  <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                    ✓
                  </span>
                  <span>Zero Vulnerabilities &amp; Keamanan HttpOnly Cookies</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="btn-pill-black"
                >
                  <span>Masuk Portal Administrator</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Feature Mockup Preview (Clean Monochrome Bento) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-black/8 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-black/8">
                <span className="text-xs font-medium text-black">Status Kesehatan Sistem</span>
                <span className="text-[11px] font-medium text-white bg-black px-2.5 py-0.5 rounded-full">
                  Aktif &amp; Stabil
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-black/8 flex items-center justify-between font-mono">
                  <span className="text-black/60">Edge Middleware Guard</span>
                  <span className="text-black font-medium">Aktif &amp; Terproteksi</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-black/8 flex items-center justify-between font-mono">
                  <span className="text-black/60">HMAC-SHA256 Token Signature</span>
                  <span className="text-black font-medium">Valid</span>
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
