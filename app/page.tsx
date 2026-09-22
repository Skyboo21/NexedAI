// app/page.tsx

import Link from "next/link";
import { InteractiveAiDemo } from "@/components/landing/InteractiveAiDemo";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { RoleShowcaseTabs } from "@/components/landing/RoleShowcaseTabs";

export const metadata = {
  title: "NexedAI - Platform E-Learning Adaptif Berbasis AI | D3 TI SV UNS",
  description:
    "Platform e-learning adaptif dengan kecerdasan buatan terpersonalisasi untuk akselerasi pemahaman mahasiswa vokasi di bidang algoritma, pemrograman, dan rekayasa perangkat lunak.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col font-sans">
      {/* 1. Global Sticky Navigation */}
      <LandingNavbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50">
          {/* Background Ambient Glows */}
          <div
            className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-indigo-300/20 via-blue-200/20 to-purple-300/20 blur-3xl -z-10 pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              {/* Institution Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/80 shadow-xs text-xs font-semibold text-indigo-700 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>PROYEK INOVASI VOKASI &bull; D3 TEKNIK INFORMATIKA SV UNS</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Platform E-Learning Adaptif{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">
                  Berbasis AI
                </span>{" "}
                untuk Mahasiswa Vokasi
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Revolusi cara belajar pemrograman & struktur data. Unggah modul kuliah Anda, biarkan
                AI menyusun ringkasan cerdas, peta belajar adaptif bertingkat XP, kuis evaluasi
                instan, dan tutor chatbot 24/7.
              </p>

              {/* CTA Group */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <a
                  href="#demo"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm sm:text-base hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Coba Demo AI Interaktif</span>
                </a>
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-sm sm:text-base hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Daftar Akun Mahasiswa</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Sudah Punya Akun? Masuk</span>
                </Link>
              </div>

              {/* Trust & Key Stats Strip */}
              <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="text-2xl sm:text-3xl font-black text-indigo-600">&lt; 1.2s</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    Ekstraksi Modul Cepat
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Parsing teks & intisari real-time
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="text-2xl sm:text-3xl font-black text-blue-600">94.2%</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    Akurasi Personalisasi
                  </div>
                  <div className="text-[11px] text-slate-500">Rekomendasi remedial adaptif</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">OWASP</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">PBKDF2 Cryptography</div>
                  <div className="text-[11px] text-slate-500">100.000 iterasi & HttpOnly token</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="text-2xl sm:text-3xl font-black text-purple-600">3 Peran</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">RBAC Terintegrasi</div>
                  <div className="text-[11px] text-slate-500">Mahasiswa, Dosen, dan Admin</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Core Features Bento Grid */}
        <section id="fitur" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Fitur Unggulan
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Dirancang untuk Kebutuhan Riil Praktikum Vokasi
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg">
                Menggabungkan generative AI mutakhir dengan pedagogi vokasional untuk meningkatkan
                retensi materi secara terukur.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 - Large Span */}
              <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-white border border-indigo-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md mb-6">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    AI Knowledge Parser
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    Ekstraksi Modul Cerdas Berbasis Konteks
                  </h3>
                  <p className="mt-3 text-slate-600 leading-relaxed max-w-xl">
                    Cukup seret dan letakkan dokumen silabus atau materi praktikum PDF. Mesin AI
                    NexedAI menganalisis sintaks bahasa C++, Java, atau Python di dalam modul,
                    menghasilkan intisari ringkas, poin kunci, dan kamus istilah secara otomatis
                    tanpa kehilangan esensi akademis.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-indigo-100/60 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
                  <span className="inline-flex items-center gap-1.5 text-indigo-700 bg-indigo-100/60 px-2.5 py-1 rounded-lg">
                    ✓ Parsing PDF Kuliah
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-indigo-700 bg-indigo-100/60 px-2.5 py-1 rounded-lg">
                    ✓ Ekstraksi Logika Kode
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-indigo-700 bg-indigo-100/60 px-2.5 py-1 rounded-lg">
                    ✓ Ringkasan Eksekutif
                  </span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md mb-6">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Dynamic Roadmap
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Peta Belajar Adaptif Berbasis XP
                  </h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    Setiap topik dipecah menjadi milestone terukur. Mahasiswa mengumpulkan XP
                    belajar di setiap tahapan, memicu motivasi berkelanjutan dengan sistem
                    gamifikasi yang relevan.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200/60 w-fit">
                  <span>Leveling & Indikator Penguasaan</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md mb-6">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Smart Assessment
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Kuis Diagnostik & Umpan Balik Instan
                  </h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    Ujian pemahaman formatif yang secara otomatis mengevaluasi logika berpikir
                    mahasiswa, memberikan penjelasan teknis mendalam mengapa sebuah opsi benar atau
                    salah saat itu juga.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60 w-fit">
                  <span>Penjelasan Alasan Jawaban Real-time</span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md mb-6">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                    Contextual Chatbot
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Tutor Interaktif Khusus Modul
                  </h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    AI tutor yang terkunci pada konteks modul praktikum yang sedang dipelajari.
                    Menghindari halusinasi dan memberikan analogi pemrograman yang mudah dipahami
                    mahasiswa.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200/60 w-fit">
                  <span>Asisten Pembelajaran 24 Jam</span>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md mb-6">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    Teacher Analytics
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Tinjau Log & Validasi Dosen
                  </h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    Portal khusus dosen untuk meninjau log aktivitas belajar mahasiswa secara
                    objektif, menyetujui riwayat praktikum, dan mengidentifikasi mahasiswa yang
                    memerlukan bimbingan khusus.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/60 w-fit">
                  <span>Audit Trail & Validasi Akademik</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Live Demo Section */}
        <section id="demo" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Interactive Playground
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Uji Langsung Kemampuan AI NexedAI
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg">
                Klik modul pemrograman di bawah ini untuk melihat bagaimana kecerdasan buatan
                menyusun intisari materi, peta belajar adaptif, dan kuis diagnostik secara langsung.
              </p>
            </div>

            {/* Interactive Demo Component */}
            <InteractiveAiDemo />
          </div>
        </section>

        {/* 5. Role-Based Features Showcase */}
        <section id="roles" className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Role-Based Access
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Satu Platform, Tiga Pengalaman Terintegrasi
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg">
                Didesain secara terpadu untuk alur kerja Mahasiswa, Dosen Pengampu, dan
                Administrator dengan isolasi keamanan RBAC yang ketat.
              </p>
            </div>

            {/* Role Showcase Tabs Component */}
            <RoleShowcaseTabs />
          </div>
        </section>

        {/* 6. Architecture & Performance Showcase */}
        <section id="arsitektur" className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                Arsitektur & Kinerja
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
                Dibangun di Atas Fondasi Rekayasa Modern
              </h2>
              <p className="mt-3 text-slate-400 text-base sm:text-lg">
                Menghadirkan stabilitas tingkat enterprise melalui Next.js 15 App Router, Rust
                toolchain, dan standar keamanan OWASP.
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-lg font-bold text-white">BFF & Next.js 15 App Router</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Pemisahan tegas logika server-side melalui Backend-for-Frontend (BFF). Autentikasi
                  dan pemrosesan sesi diisolasi sepenuhnya di server sehingga aman dari eksfiltrasi
                  skrip klien.
                </p>
                <div className="pt-2 text-xs font-mono text-indigo-300">
                  &gt; Server-Side Rendering & Cookie HttpOnly
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-lg font-bold text-white">Rust-Powered Biome Toolchain</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Migrasi dari legacy Webpack ke engine Rust Biome menghasilkan efisiensi kompilasi
                  dan linting kode sub-detik, menjamin konsistensi gaya kode dan zero-error secara
                  otomatis.
                </p>
                <div className="pt-2 text-xs font-mono text-blue-300">
                  &gt; 25x Lebih Cepat dibanding ESLint/Prettier
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-lg font-bold text-white">Kriptografi PBKDF2 & Web Crypto</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Hashing kata sandi menggunakan standar OWASP dengan 100.000 iterasi dan salt unik
                  kriptografis. Token sesi ditandatangani dengan HMAC-SHA256 untuk memblokir
                  peniruan peran.
                </p>
                <div className="pt-2 text-xs font-mono text-emerald-300">
                  &gt; 0 Security Vulnerabilities (SonarQube Gate)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Frequently Asked Questions */}
        <LandingFaq />

        {/* 8. Call To Action Banner */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]"
                aria-hidden="true"
              />
              <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-700/60 border border-indigo-500/40 text-xs font-semibold text-indigo-200">
                  <span>Mulai Sekarang Tanpa Biaya</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Tingkatkan Pemahaman Algoritma & Pemrograman Anda Hari Ini
                </h2>
                <p className="text-indigo-200 text-base leading-relaxed">
                  Bergabunglah dengan ekosistem pembelajaran adaptif NexedAI. Rasakan kemudahan
                  belajar dengan panduan tutor AI yang disesuaikan dengan kurikulum resmi D3 TI SV
                  UNS.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-indigo-900 font-bold text-sm sm:text-base hover:bg-indigo-50 transition-all shadow-md"
                  >
                    Daftar Akun Mahasiswa
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-700/80 border border-indigo-500/50 text-white font-bold text-sm sm:text-base hover:bg-indigo-700 transition-all shadow-xs"
                  >
                    Masuk ke Sistem
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Institutional Modern Footer */}
      <LandingFooter />
    </div>
  );
}
