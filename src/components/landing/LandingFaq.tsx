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
    <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Tanya Jawab Populer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Temukan jawaban lengkap seputar kapabilitas kecerdasan buatan, keamanan, dan integrasi
            kurikulum di NexedAI.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
                  isOpen
                    ? "border-indigo-300 ring-2 ring-indigo-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
                >
                  <div className="space-y-1">
                    <span className="inline-block text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {item.question}
                    </h3>
                  </div>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                      isOpen ? "bg-indigo-600 text-white rotate-180" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className="px-6 pb-6 pt-1 text-slate-600 leading-relaxed text-sm sm:text-base border-t border-slate-100 mt-1"
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sub-card Support */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-50 via-slate-50 to-blue-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Masih punya pertanyaan lain seputar implementasi?
              </h4>
              <p className="text-sm text-slate-600">
                Tim kami siap membantu dosen dan mahasiswa mengoptimalkan proses belajar.
              </p>
            </div>
          </div>
          <a
            href="mailto:support@nexedai.uns.ac.id"
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 font-semibold text-sm transition-all shadow-sm whitespace-nowrap"
          >
            Hubungi Tim Teknis
          </a>
        </div>
      </div>
    </section>
  );
}

export default LandingFaq;
