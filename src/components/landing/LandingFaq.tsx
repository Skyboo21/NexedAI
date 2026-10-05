"use client";

import { useState } from "react";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-1",
    category: "Tentang Platform",
    question: "Apa itu NexedAI dan siapa yang mengembangkannya?",
    answer:
      "NexedAI adalah platform e-learning adaptif berbasis kecerdasan buatan (Gen-AI) yang dirancang khusus untuk Program Studi D3 Teknik Informatika Sekolah Vokasi Universitas Sebelas Maret (UNS). Platform ini mengintegrasikan pemrosesan modul cerdas, kuis diagnostik, dan peta belajar dinamis.",
  },
  {
    id: "faq-2",
    category: "Personalisasi AI",
    question: "Bagaimana NexedAI mempersonalisasi materi belajar mahasiswa?",
    answer:
      "Setelah modul diunggah, AI memecah materi menjadi konsep inti (knowledge units), menghasilkan ringkasan eksekutif, peta jalan (roadmap) langkah-demi-langkah, dan kuis adaptif. Algoritma mengevaluasi akurasi jawaban dan tingkat retensi untuk menyesuaikan kecepatan dan kedalaman materi.",
  },
  {
    id: "faq-3",
    category: "Peran & Aksesibilitas",
    question: "Apa perbedaan fitur antara Mahasiswa, Dosen, dan Administrator?",
    answer:
      "Mahasiswa fokus pada penyerapan materi, simulasi kuis, tutor AI, dan perolehan XP. Dosen memiliki dashboard analitik perkembangan kelas, verifikasi log aktivitas belajar mahasiswa, dan manajemen modul. Administrator mengawasi RBAC keamanan, audit log aktivitas, dan performa sistem.",
  },
  {
    id: "faq-4",
    category: "Keamanan & Privasi",
    question: "Bagaimana NexedAI menjamin keamanan data dan autentikasi pengguna?",
    answer:
      "NexedAI mengadopsi standar industri OWASP: pengacakan kata sandi menggunakan PBKDF2 dengan salt kriptografis dan 100.000 iterasi, token sesi HttpOnly bertanda tangan HMAC-SHA256, perlindungan RBAC di level middleware, dan proteksi komprehensif dari kerentanan web modern.",
  },
  {
    id: "faq-5",
    category: "Format Modul",
    question: "Format dokumen kuliah apa saja yang didukung oleh sistem?",
    answer:
      "Sistem mendukung dokumen PDF materi kuliah, slide presentasi teknis, file teks/markdown modul laboratorium, serta silabus mata kuliah pemrograman seperti Algoritma, Struktur Data, dan Pemrograman Web.",
  },
];

export function LandingFaq() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 bg-neutral-50/50 border-t border-black/8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/10 text-xs font-semibold text-neutral-800 mb-3 shadow-xs">
            <span className="font-mono text-black font-bold text-[11px]">008</span>
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            <span className="uppercase tracking-wider text-[11px] text-neutral-600">Tanya Jawab (FAQ)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-black tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-3 text-neutral-600 text-base sm:text-lg font-normal">
            Temukan jawaban lengkap seputar kapabilitas kecerdasan buatan, keamanan, dan integrasi
            kurikulum di NexedAI.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-black shadow-sm"
                    : "border-black/10 hover:border-black/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-xl"
                >
                  <div className="space-y-1">
                    <span className="inline-block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-base font-medium text-black">
                      {item.question}
                    </h3>
                  </div>
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ${
                      isOpen ? "bg-black text-white rotate-180" : "bg-[#F4F4F6] text-neutral-700"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    className="px-6 pb-5 pt-1 text-neutral-600 leading-relaxed text-sm sm:text-base border-t border-black/5 mt-1"
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sub-card Support */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-black/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-semibold text-black">
                Masih punya pertanyaan seputar kurikulum atau sistem?
              </h4>
              <p className="text-sm text-neutral-500">
                Tim pengembang siap membantu dosen dan mahasiswa mengoptimalkan proses pembelajaran.
              </p>
            </div>
          </div>
          <a
            href="mailto:support@nexedai.uns.ac.id"
            className="px-5 py-2.5 rounded-full bg-[#000000] text-white hover:bg-neutral-800 font-medium text-xs sm:text-sm transition-all whitespace-nowrap shadow-xs"
          >
            Hubungi Tim Teknis
          </a>
        </div>
      </div>
    </section>
  );
}

export default LandingFaq;
