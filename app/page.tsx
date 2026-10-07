// app/page.tsx

import Link from "next/link";
import { InteractiveAiDemo } from "@/components/landing/InteractiveAiDemo";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { RoleShowcaseTabs } from "@/components/landing/RoleShowcaseTabs";
import { HeroSection } from "@/components/landing/HeroSection";

export const metadata = {
  title: "NexedAI - Platform Pembelajaran Adaptif Berbasis AI",
  description:
    "Platform pembelajaran adaptif dengan kecerdasan buatan terpersonalisasi untuk akselerasi pemahaman siswa dan mahasiswa di seluruh jenjang pendidikan.",
};

const MARQUEE_PARTNERS = [
  "Universitas Sebelas Maret",
  "Semua Jenjang Pendidikan (SD / SMP / SMA / SMK / Kuliah)",
  "Kurikulum Merdeka & Global",
  "Standar Capaian Terukur",
  "PBKDF2 Security Certified",
  "Next.js 15 App Router",
  "Rust Biome Toolchain",
  "Active Recall Engine",
  "RAG Knowledge Retriever",
  "Adaptive Personalized Learning",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col font-['Inter',sans-serif] antialiased">
      {/* 1. Global Fixed Floating Navbar */}
      <LandingNavbar />

      <main className="flex-1">
        {/* 2. Full-Screen Cinematic Video Hero Section */}
        <HeroSection />

        {/* 3. Infinite Logo & Standards Marquee Strip (Conicorn Style) */}
        <section aria-label="Mitra & Standar Akademik" className="py-6 border-y border-black/8 bg-[#FAFAFA] overflow-hidden">
          <div className="mask-marquee w-full">
            <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
              {[...MARQUEE_PARTNERS, ...MARQUEE_PARTNERS].map((partner, idx) => (
                <div key={idx} className="flex items-center gap-3 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-black/60 font-mono">
                    {partner}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Section 001: ABOUT ("Who We Are" - Conicorn Style) */}
        <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-6 max-w-4xl">
            <div className="eye-brow-pill">
              <span className="font-mono text-[11px] font-bold">001</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>Who We Are</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-black tracking-tight leading-[1.15]">
              Satu Platform Pembelajaran Adaptif untuk Semua Jenjang Pendidikan.
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-black/65 font-normal leading-relaxed max-w-3xl">
              NexedAI mentransformasi materi kurikulum dan buku ajar menjadi rute belajar cerdas yang mempersonalisasi pemahaman konsep, mengeliminasi kesulitan belajar, dan mengoptimalkan potensi setiap peserta didik secara global.
            </p>
            {/* Clean Educational Level Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F4F6] border border-black/8 text-[11px] font-medium text-black/75">
                <span>🎒</span>
                <span>SD &amp; SMP</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F4F6] border border-black/8 text-[11px] font-medium text-black/75">
                <span>📚</span>
                <span>SMA &amp; SMK</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F4F6] border border-black/8 text-[11px] font-medium text-black/75">
                <span>🎓</span>
                <span>Perguruan Tinggi</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F4F6] border border-black/8 text-[11px] font-medium text-black/75">
                <span>🌐</span>
                <span>Pembelajar Global</span>
              </span>
            </div>
          </div>

          {/* Interactive Video Showcase Card with Statics Marquee */}
          <div className="mt-12 bg-[#FAFAFA] border border-black/8 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-md">
                <span className="text-[11px] font-mono uppercase tracking-widest text-black/40">
                  Visual Blueprint Pendidikan Global
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-black tracking-tight">
                  Simulasi Belajar Berbasis Graf Pengetahuan Otomatis
                </h3>
                <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                  Setiap dokumen silabus, buku teks, dan modul ajar diolah oleh RAG Engine menjadi unit pembelajaran modular dengan evaluasi penguasaan konsep secara seketika untuk semua tingkatan.
                </p>
                <div className="pt-2">
                  <a
                    href="#demo"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-black underline underline-offset-4 hover:text-black/70 transition-colors"
                  >
                    <span>Jalankan simulasi sekarang</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>

              {/* Video Play Mockup Container */}
              <div className="w-full md:w-1/2 aspect-video bg-black rounded-2xl relative overflow-hidden flex items-center justify-center shadow-lg group">
                <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:scale-110 shadow-md">
                    <svg className="w-5 h-5 ml-0.5 fill-black" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/70 text-[11px] font-mono">
                  <span>NEXED-RAG-ENGINE v2.4</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE TELEMETRY
                  </span>
                </div>
              </div>
            </div>

            {/* Statics Ticker Row */}
            <div className="mt-10 pt-8 border-t border-black/8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
              <div>
                <div className="text-3xl sm:text-4xl font-light text-black tracking-tight">500+</div>
                <div className="text-xs text-black/50 uppercase tracking-wider font-medium mt-1">
                  Jam Pembelajaran Terdata
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-light text-black tracking-tight">80%</div>
                <div className="text-xs text-black/50 uppercase tracking-wider font-medium mt-1">
                  Peningkatan Retensi Pemahaman
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-light text-black tracking-tight">5x</div>
                <div className="text-xs text-black/50 uppercase tracking-wider font-medium mt-1">
                  Akselerasi Bimbingan Belajar AI
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Section 002: VALUES ("Why Choose Us?" - Conicorn Style) */}
        <section id="values" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/8">
          <div className="space-y-4 max-w-3xl mb-14">
            <div className="eye-brow-pill">
              <span className="font-mono text-[11px] font-bold">002</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>Values</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-black">
              Mengapa Memilih NexedAI?
            </h2>
            <p className="text-sm sm:text-base text-black/60 leading-relaxed font-normal">
              Kami membangun ekosistem pembelajaran adaptif berbasis model kognitif yang dirancang inklusif untuk memenuhi kebutuhan belajar modern di seluruh jenjang pendidikan — mulai dari tingkat dasar, menengah, kejuruan, hingga universitas dan profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Value Card 01 */}
            <div className="bg-[#FAFAFA] border border-black/8 rounded-3xl p-8 flex flex-col justify-between hover:border-black/20 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                  01
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-black/40">Strategy</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-black">Outcome-First Curriculum</h3>
                <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                  Struktur materi didesain langsung berdasarkan target capaian pembelajaran terukur dan standar kurikulum yang relevan di setiap jenjang pendidikan.
                </p>
              </div>
            </div>

            {/* Value Card 02 */}
            <div className="bg-[#FAFAFA] border border-black/8 rounded-3xl p-8 flex flex-col justify-between hover:border-black/20 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                  02
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-black/40">Execution</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-black">End-to-End Implementation</h3>
                <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                  Dari ekstraksi dokumen silabus dan modul ajar, pembagian node kompetensi, hingga pembuatan kuis formatif dan monitoring pengajar secara menyeluruh.
                </p>
              </div>
            </div>

            {/* Value Card 03 */}
            <div className="bg-[#FAFAFA] border border-black/8 rounded-3xl p-8 flex flex-col justify-between hover:border-black/20 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                  03
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-black/40">Engine</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-black">Custom Adaptive Automation</h3>
                <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                  Tanpa template kaku. Setiap alur belajar beradaptasi mandiri terhadap riwayat pemahaman, retensi konsep, dan kecepatan belajar setiap peserta didik.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Section 003: CAPABILITIES ("Dirancang untuk Kebutuhan Riil Setiap Jenjang Pendidikan") */}
        <section id="fitur" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/8">
          <div className="space-y-4 max-w-3xl mb-14">
            <div className="eye-brow-pill">
              <span className="font-mono text-[11px] font-bold">003</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-black leading-tight">
              Dirancang untuk Kebutuhan Riil Setiap Jenjang Pendidikan
            </h2>
            <p className="text-sm sm:text-base text-black/60 leading-relaxed font-normal">
              Mengintegrasikan sistem Retrieval-Augmented Generation (RAG) cerdas untuk mengubah dokumen silabus, buku ajar, dan materi pelajaran menjadi peta kompetensi bertahap.
            </p>
          </div>

          {/* Asymmetric Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Card 1: Adaptive Learning Roadmap */}
            <div className="md:col-span-7 bg-[#FAFAFA] border border-black/8 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-black/20 transition-all">
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-black/50">
                  Kemampuan Inti 01
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-black tracking-tight">
                  Adaptive Learning Roadmap & Dynamic Node Graph
                </h3>
                <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                  Pohon materi terstruktur yang merefleksikan prasyarat pemahaman konsep. Setiap tahapan materi terkunci otomatis hingga konsep prasyarat teruji tuntas.
                </p>
                <div className="pt-2 space-y-1.5 text-xs text-black/70">
                  <div className="flex items-center gap-2">
                    <span className="text-black font-bold">✓</span>
                    <span>Pemetaan materi dan silabus terotomatisasi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-black font-bold">✓</span>
                    <span>Sinkronisasi kurikulum mata pelajaran/kuliah real-time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-black font-bold">✓</span>
                    <span>Validasi capaian belajar terstandar nasional & global</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs font-medium text-black">Dynamic Node Graph</span>
                <span className="tag-pill">Automated System</span>
              </div>
            </div>

            {/* Card 2: Active Recall Generator */}
            <div className="md:col-span-5 bg-[#FAFAFA] border border-black/8 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-black/20 transition-all">
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-black/50">
                  Kemampuan Inti 02
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-black tracking-tight">
                  Active Recall Generator
                </h3>
                <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                  Ekstraksi instan flashcard dan pertanyaan diagnostik dari dokumen materi peserta didik untuk menguji daya retensi konsep secara interaktif dan menyenangkan.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs font-medium text-black">Real-time Formatif</span>
                <span className="tag-pill">Cognitive Engine</span>
              </div>
            </div>

            {/* Card 3: Instant Feedback */}
            <div className="md:col-span-5 bg-[#FAFAFA] border border-black/8 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-black/20 transition-all">
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-black/50">
                  Kemampuan Inti 03
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-black tracking-tight">
                  Instant Feedback & Scoring
                </h3>
                <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                  Skor penguasaan konsep terhitung tanpa jeda dengan penjelasan rasional jawaban langsung untuk mempercepat pemahaman dan evaluasi diri peserta didik.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs font-medium text-black">Validasi Otomatis</span>
                <span className="tag-pill">&lt; 50ms</span>
              </div>
            </div>

            {/* Card 4: Educator Monitoring & Risk Alerts */}
            <div className="md:col-span-7 bg-[#FAFAFA] border border-black/8 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-black/20 transition-all">
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-black/50">
                  Kemampuan Inti 04
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-black tracking-tight">
                  Educator Monitoring & Early Risk Alerts
                </h3>
                <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                  Deteksi dini peserta didik yang mengalami hambatan pemahaman materi, memungkinkan intervensi akademik terarah dan bimbingan guru atau dosen secara tepat sasaran.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs font-medium text-black">TanStack Query Live Sync</span>
                <span className="tag-pill">Portal Pengajar</span>
              </div>
            </div>
          </div>

          {/* Sub-Bento: Callout CTA + Data Protection Card (Conicorn style) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5">
            <div className="md:col-span-6 bg-black text-white rounded-3xl p-8 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                  Konsultasi Kurikulum AI
                </span>
                <h3 className="text-xl font-normal">Belum yakin modul mana yang harus dipelajari lebih dulu?</h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  AI kami menganalisis riwayat kuis dan pemahaman komputasi Anda untuk menyusun rekomendasi modul belajar yang paling efektif.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/register"
                  className="btn-pill-black bg-white text-black hover:bg-neutral-200 border-white text-xs"
                >
                  Jadwalkan Sesi Diagnostik Cerdas &rarr;
                </Link>
              </div>
            </div>

            <div className="md:col-span-6 bg-[#FAFAFA] border border-black/8 rounded-3xl p-8 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-black/50">
                  Keamanan & Privasi
                </span>
                <h3 className="text-xl font-normal text-black">Data Anda Terproteksi. Selalu.</h3>
                <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                  Seluruh data akademik, hasil kuis, dan token otentikasi dienkripsi dengan standar internasional ISO/IEC dan OWASP Web Security.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-6">
                <div className="bg-white border border-black/8 rounded-xl p-2.5 text-center text-[11px] font-medium text-black">
                  PBKDF2 100k Salt
                </div>
                <div className="bg-white border border-black/8 rounded-xl p-2.5 text-center text-[11px] font-medium text-black">
                  Secure HttpOnly Cookies
                </div>
                <div className="bg-white border border-black/8 rounded-xl p-2.5 text-center text-[11px] font-medium text-black">
                  Role-Based RBAC
                </div>
                <div className="bg-white border border-black/8 rounded-xl p-2.5 text-center text-[11px] font-medium text-black">
                  Zero Data Leakage
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Section 004: PROCESS ("How We Work" - Conicorn Vertical Timeline) */}
        <section id="process" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/8">
          <div className="space-y-4 max-w-3xl mb-14">
            <div className="eye-brow-pill">
              <span className="font-mono text-[11px] font-bold">004</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-black">
              Alur Pembelajaran Adaptif
            </h2>
            <p className="text-sm sm:text-base text-black/60 leading-relaxed font-normal">
              Metodologi teruji untuk mentransformasi materi pemrograman yang kompleks menjadi kurikulum adaptif bertahap yang mudah dikuasai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 01 */}
            <div className="bg-[#FAFAFA] border border-black/8 rounded-3xl p-6 space-y-4 hover:border-black/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center justify-center">
                  01
                </span>
                <span className="text-[10px] font-mono text-black/40 uppercase">Analisis</span>
              </div>
              <h3 className="font-medium text-base text-black">Discovery & Audit</h3>
              <p className="text-xs text-black/60 leading-relaxed">
                Pemeriksaan silabus dokumen kuliah, pemetaan prasyarat materi, dan identifikasi materi inti pemrograman.
              </p>
            </div>

            {/* Step 02 */}
            <div className="bg-[#FAFAFA] border border-black/8 rounded-3xl p-6 space-y-4 hover:border-black/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center justify-center">
                  02
                </span>
                <span className="text-[10px] font-mono text-black/40 uppercase">Arsitektur</span>
              </div>
              <h3 className="font-medium text-base text-black">Knowledge Blueprint</h3>
              <p className="text-xs text-black/60 leading-relaxed">
                Penyusunan graf pengetahuan dinamis dengan hubungan ketergantungan antar-topik logika komputasi.
              </p>
            </div>

            {/* Step 03 */}
            <div className="bg-[#FAFAFA] border border-black/8 rounded-3xl p-6 space-y-4 hover:border-black/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center justify-center">
                  03
                </span>
                <span className="text-[10px] font-mono text-black/40 uppercase">Generasi</span>
              </div>
              <h3 className="font-medium text-base text-black">Build & Active Recall</h3>
              <p className="text-xs text-black/60 leading-relaxed">
                Pembuatan flashcard diagnostik, kuis interaktif formatif, dan asisten tutor AI 24/7 untuk pendampingan.
              </p>
            </div>

            {/* Step 04 */}
            <div className="bg-[#FAFAFA] border border-black/8 rounded-3xl p-6 space-y-4 hover:border-black/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center justify-center">
                  04
                </span>
                <span className="text-[10px] font-mono text-black/40 uppercase">Evaluasi</span>
              </div>
              <h3 className="font-medium text-base text-black">Testing & Optimization</h3>
              <p className="text-xs text-black/60 leading-relaxed">
                Uji retensi mahasiswa secara berkelanjutan, diagnosis celah logika, dan pembaruan materi secara adaptif.
              </p>
            </div>
          </div>
        </section>

        {/* 8. Section 005: Interactive Live Demo Section */}
        <section id="demo" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/8">
          <div className="space-y-4 max-w-3xl mb-12">
            <div className="eye-brow-pill">
              <span className="font-mono text-[11px] font-bold">005</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>Simulasi Nyata</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-black">
              Uji Coba Langsung Mesin Pembelajaran
            </h2>
            <p className="text-sm text-black/60 font-normal">
              Pilih topik di bawah ini untuk melihat bagaimana kecerdasan buatan menyusun intisari materi, roadmap bertahap, dan kuis diagnostik secara langsung.
            </p>
          </div>
          <InteractiveAiDemo />
        </section>

        {/* 9. Section 006: Role-Adaptive Experience Showcase */}
        <section id="roles" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/8">
          <div className="space-y-4 max-w-3xl mb-12">
            <div className="eye-brow-pill">
              <span className="font-mono text-[11px] font-bold">006</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>Multi-Role Ecosystem</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-black">
              Pengalaman Terintegrasi untuk Setiap Peran
            </h2>
            <p className="text-sm text-black/60 font-normal">
              Satu platform terpadu untuk peserta didik di semua jenjang (SD/SMP/SMA/SMK/Kuliah), pendidik (guru & dosen), dan pengelola institusi.
            </p>
          </div>
          <RoleShowcaseTabs />
        </section>

        {/* 10. Section 007: Technical Engineering Architecture Section */}
        <section id="arsitektur" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/8">
          <div className="space-y-4 max-w-3xl mb-12">
            <div className="eye-brow-pill">
              <span className="font-mono text-[11px] font-bold">007</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>Standar Rekayasa Tinggi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-black">
              Dibangun di Atas Fondasi Rekayasa Modern
            </h2>
            <p className="text-sm text-black/60 font-normal">
              Infrastruktur web mutakhir yang menjamin kecepatan respon milidetik, integritas keamanan data, dan reliabilitas tinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#FAFAFA] border border-black/8 rounded-3xl p-6 space-y-3 hover:border-black/20 transition-all">
              <span className="text-xs font-mono font-bold text-black/40">TECH 01</span>
              <h3 className="font-medium text-base text-black">Next.js 15 App Router</h3>
              <p className="text-xs text-black/60 leading-relaxed">
                Pemisahan tegas Server Components dan Client Components dengan routing aman.
              </p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/8 rounded-3xl p-6 space-y-3 hover:border-black/20 transition-all">
              <span className="text-xs font-mono font-bold text-black/40">TECH 02</span>
              <h3 className="font-medium text-base text-black">Rust Biome Engine</h3>
              <p className="text-xs text-black/60 leading-relaxed">
                Linting dan format kode secepat kilat dengan zero tech-debt.
              </p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/8 rounded-3xl p-6 space-y-3 hover:border-black/20 transition-all">
              <span className="text-xs font-mono font-bold text-black/40">TECH 03</span>
              <h3 className="font-medium text-base text-black">PBKDF2 Cryptographic</h3>
              <p className="text-xs text-black/60 leading-relaxed">
                Penyimpanan kata sandi ter-salt aman sesuai standar ISO/OWASP.
              </p>
            </div>
            <div className="bg-[#FAFAFA] border border-black/8 rounded-3xl p-6 space-y-3 hover:border-black/20 transition-all">
              <span className="text-xs font-mono font-bold text-black/40">TECH 04</span>
              <h3 className="font-medium text-base text-black">Universal Multi-Curriculum</h3>
              <p className="text-xs text-black/60 leading-relaxed">
                Arsitektur fleksibel yang siap mendukung kurikulum nasional, kejuruan, hingga perkuliahan.
              </p>
            </div>
          </div>
        </section>

        {/* 11. Section 008: FAQ Section */}
        <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/8">
          <LandingFaq />
        </section>

        {/* 12. Modern Call-to-Action Section */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-black text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium">
              <span>●</span>
              <span>Siap Memulai Sekarang?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight max-w-3xl mx-auto leading-tight">
              Tingkatkan Potensi dan Kecepatan Belajar Anda Hari Ini
            </h2>
            <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan siswa, pelajar, dan mahasiswa di berbagai jenjang yang telah menikmati bimbingan belajar adaptif bertenaga AI.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href="/register"
                className="btn-pill-black bg-white text-black hover:bg-neutral-200 border-white"
              >
                Mulai Belajar Sekarang &rarr;
              </Link>
              <Link
                href="/login"
                className="btn-pill-outline border-white/40 text-white hover:bg-white/10"
              >
                Masuk ke Akun Anda
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 13. Minimalist Monochromatic Footer */}
      <LandingFooter />
    </div>
  );
}
