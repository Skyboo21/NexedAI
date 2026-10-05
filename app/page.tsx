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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      {/* 1. Global Sticky Navigation */}
      <LandingNavbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              {/* Institution Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>PROYEK INOVASI VOKASI &bull; D3 TEKNIK INFORMATIKA SV UNS</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Platform E-Learning Adaptif Berbasis AI untuk Mahasiswa Vokasi
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Asisten pembelajaran terstruktur untuk algoritma dan struktur data. Unggah modul praktikum, pelajari intisari materi, ikuti peta capaian kompetensi, dan uji pemahaman dengan evaluasi interaktif.
              </p>

              {/* CTA Group */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <a
                  href="#demo"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm sm:text-base hover:bg-blue-700 transition-colors shadow-xs flex items-center justify-center gap-2"
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
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-sm sm:text-base hover:border-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs flex items-center justify-center gap-2"
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
                  className="w-full sm:w-auto px-4 py-3 rounded-lg text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Sudah Punya Akun? Masuk</span>
                </Link>
              </div>

              {/* Trust & Key Stats Strip */}
              <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900">&lt; 1.2s</div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    Ekstraksi Modul Cepat
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Parsing teks & intisari real-time
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900">94.2%</div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    Akurasi Personalisasi
                  </div>
                  <div className="text-[11px] text-slate-500">Rekomendasi remedial adaptif</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900">OWASP</div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">PBKDF2 Cryptography</div>
                  <div className="text-[11px] text-slate-500">100.000 iterasi & HttpOnly token</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900">3 Peran</div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">RBAC Terintegrasi</div>
                  <div className="text-[11px] text-slate-500">Mahasiswa, Dosen, dan Admin</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Core Features Grid */}
        <section id="fitur" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Fitur Utama
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Dirancang untuk Kebutuhan Riil Praktikum Vokasi
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg">
                Membantu mahasiswa menguasai materi teknis melalui ekstraksi kontekstual, pemetaan kompetensi, dan evaluasi terarah.
              </p>
            </div>

            {/* Structured Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Ekstraksi Modul Cerdas Berbasis Konteks
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                    Unggah dokumen silabus atau materi praktikum PDF. Sistem membedah konsep dan sintaks kode, menghasilkan intisari ringkas, poin kunci, dan glosarium teknis tanpa kehilangan konteks akademis.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Parsing PDF</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Ekstraksi Logika</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Ringkasan Materi</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Peta Belajar Adaptif Berbasis XP
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                    Setiap materi dipecah menjadi tahapan belajar bertingkat. Mahasiswa mengumpulkan XP di setiap milestone, memetakan progres pemahaman secara transparan.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Milestone Berjenjang</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Indikator XP</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Kuis Diagnostik & Umpan Balik Instan
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                    Evaluasi formatif mandiri yang memeriksa logika berpikir mahasiswa dan memberikan penjelasan teknis mengapa sebuah opsi benar atau salah secara instan.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Evaluasi Mandiri</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Penjelasan Rasional</span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Tutor Interaktif Khusus Modul
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                    Chatbot tanya-jawab yang terkunci pada konteks modul praktikum yang sedang dipelajari, mencegah halusinasi dan memberikan arahan tanpa membocorkan jawaban kuis.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Konteks Modul</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Bimbingan 24 Jam</span>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between md:col-span-2 lg:col-span-2">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Tinjau Log & Validasi Dosen
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                    Portal pengajar untuk meninjau log aktivitas belajar mahasiswa secara objektif, menyetujui riwayat praktikum, dan mengidentifikasi mahasiswa yang memerlukan intervensi bimbingan akademik secara dini.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Audit Trail Pembelajaran</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">Validasi Capaian Dosen</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Live Demo Section */}
        <section id="demo" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Simulasi Interaktif
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Uji Langsung Kemampuan AI NexedAI
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg">
                Pilih modul pemrograman di bawah ini untuk melihat bagaimana kecerdasan buatan menyusun intisari materi, peta belajar adaptif, dan evaluasi diagnostik.
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
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Hak Akses Berbasis Peran
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Satu Platform, Tiga Pengalaman Terintegrasi
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg">
                Didesain secara terpadu untuk alur kerja Mahasiswa, Dosen Pengampu, dan Administrator dengan isolasi otorisasi RBAC yang terverifikasi.
              </p>
            </div>

            {/* Role Showcase Tabs Component */}
            <RoleShowcaseTabs />
          </div>
        </section>

        {/* 6. Architecture & Performance Showcase (Clean Light Theme) */}
        <section id="arsitektur" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Arsitektur & Kinerja
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Dibangun di Atas Fondasi Rekayasa Modern
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg">
                Menghadirkan stabilitas tingkat enterprise melalui Next.js 15 App Router, Rust toolchain, dan standar keamanan OWASP.
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900">BFF & Next.js 15 App Router</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Pemisahan tegas logika server-side melalui Backend-for-Frontend (BFF). Autentikasi dan pemrosesan sesi diisolasi sepenuhnya di server sehingga aman dari eksfiltrasi skrip klien.
                </p>
                <div className="pt-2 text-xs font-medium text-blue-700">
                  Server-Side Rendering & Cookie HttpOnly
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900">Rust-Powered Biome Toolchain</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Migrasi dari legacy Webpack ke engine Rust Biome menghasilkan efisiensi kompilasi dan linting kode sub-detik, menjamin konsistensi gaya kode dan zero-error secara otomatis.
                </p>
                <div className="pt-2 text-xs font-medium text-blue-700">
                  Format & Validasi Sub-Detik
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900">Kriptografi PBKDF2 & Web Crypto</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Hashing kata sandi menggunakan standar OWASP dengan 100.000 iterasi dan salt unik kriptografis. Token sesi ditandatangani dengan HMAC-SHA256 untuk memblokir peniruan peran.
                </p>
                <div className="pt-2 text-xs font-medium text-emerald-700">
                  Standar Keamanan OWASP PBKDF2
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Frequently Asked Questions */}
        <LandingFaq />

        {/* 8. Call To Action Banner (Clean Light Academic Card) */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-slate-900 p-8 sm:p-12 text-center text-white relative shadow-sm">
              <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                  <span>Mulai Pembelajaran Sekarang</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Tingkatkan Pemahaman Algoritma & Pemrograman Anda Hari Ini
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Bergabunglah dengan ekosistem pembelajaran adaptif NexedAI. Akses materi terstruktur dan kuis diagnostik yang dirancang khusus untuk mahasiswa D3 TI SV UNS.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm sm:text-base hover:bg-blue-500 transition-colors shadow-xs"
                  >
                    Daftar Akun Mahasiswa
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm sm:text-base hover:bg-slate-700 transition-colors"
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
