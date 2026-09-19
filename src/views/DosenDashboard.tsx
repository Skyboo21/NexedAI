// src/views/DosenDashboard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NexedMasteryTableModule from "../components/NexedMasteryTableModule";
import NexedStudentLogModal from "../components/NexedStudentLogModal";
import { useAuthStore } from "../store/authStore";

export default function DosenDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [selectedStudentForLog, setSelectedStudentForLog] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [studentStatuses, setStudentStatuses] = useState<
    Record<string, "Belum Ditangani" | "Dalam Penanganan" | "Selesai Ditinjau">
  >({
    "Budi Santoso": "Belum Ditangani",
    "Siti Aminah": "Belum Ditangani",
  });

  const handleOpenLog = (studentName: string) => {
    setSelectedStudentForLog(studentName);
    setIsLogModalOpen(true);
  };

  const handleCloseLog = () => {
    setIsLogModalOpen(false);
  };

  const handleStatusChange = (
    studentName: string,
    newStatus: "Belum Ditangani" | "Dalam Penanganan" | "Selesai Ditinjau",
  ) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentName]: newStatus,
    }));
  };

  useEffect(() => {
    if (user?.role && user.role !== "dosen") {
      if (user.role === "mahasiswa") {
        router.push("/dashboard");
      } else if (user.role === "admin") {
        router.push("/admin-dashboard");
      }
    }
  }, [user, router]);

  const activeUser = user ?? {
    email: "dosen@nexed.ai",
    role: "dosen" as const,
    name: "Dr. Ir. Hendra Wijaya, M.T.",
  };

  const gradeDistribution = [
    { grade: "A (85-100)", count: 18, percentage: 43, color: "bg-emerald-500" },
    { grade: "B (70-84)", count: 16, percentage: 38, color: "bg-indigo-500" },
    { grade: "C (55-69)", count: 5, percentage: 12, color: "bg-amber-500" },
    { grade: "D (40-54)", count: 2, percentage: 5, color: "bg-orange-500" },
    { grade: "E (<40)", count: 1, percentage: 2, color: "bg-rose-500" },
  ];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-['Outfit'] antialiased">
      {/* Top Header Navbar */}
      <header
        className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 transition-all"
        role="banner"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
              <span>Portal Pengajar & Pembimbing</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">Algoritma & Pemrograman (Kelas TI-A)</span>
            </div>
            <h1
              suppressHydrationWarning
              className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight"
            >
              Dashboard Analitik: {activeUser.name || activeUser.email.split("@")[0]}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700">
              ● Semester Genap 2026
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 w-full" role="main">
        {/* Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Mahasiswa
            </div>
            <div className="text-2xl font-black text-slate-900">42 Mahasiswa</div>
            <p className="text-xs text-emerald-600 mt-1.5 font-semibold">
              ● 100% Terdaftar di Sistem
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Rata-rata Skor Kelas
            </div>
            <div className="text-2xl font-black text-indigo-600">84.6%</div>
            <p className="text-xs text-slate-500 mt-1.5">Target Penguasaan: &gt;75%</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Perlu Intervensi Remedial
            </div>
            <div className="text-2xl font-black text-rose-600">2 Mahasiswa</div>
            <p className="text-xs text-rose-600 mt-1.5 font-semibold">⚠️ Peringatan Dini AI</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Tingkat Ketuntasan
            </div>
            <div className="text-2xl font-black text-emerald-600">78.5%</div>
            <p className="text-xs text-emerald-600 mt-1.5">Kategori: Sangat Baik</p>
          </div>
        </div>

        {/* Section 1: Alert Mahasiswa Berisiko */}
        <section id="alerts" aria-labelledby="alert-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              id="alert-heading"
              className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2"
            >
              <span>⚠️</span>
              <span>Peringatan Dini Mahasiswa Berisiko (AI Early Warning)</span>
            </h2>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full uppercase tracking-wider">
              2 Peringatan Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 bg-white border border-rose-200 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Budi Santoso</h3>
                  <span className="text-xs text-slate-500 font-mono">NIM: 202401048</span>
                </div>
                {studentStatuses["Budi Santoso"] === "Selesai Ditinjau" ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    ✓ Selesai Ditinjau
                  </span>
                ) : studentStatuses["Budi Santoso"] === "Dalam Penanganan" ? (
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                    🔵 Dalam Bimbingan
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                    Risiko Tinggi
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Gagal menyelesaikan Kuis Modul Looping & Iterasi 3 kali berturut-turut. Skor kuis
                terakhir: 35/100.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  Rekomendasi AI: Berikan latihan analogi sehari-hari
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenLog("Budi Santoso")}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50"
                >
                  <span>Tinjau Log</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            <div className="p-5 bg-white border border-amber-200 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Siti Aminah</h3>
                  <span className="text-xs text-slate-500 font-mono">NIM: 202401092</span>
                </div>
                {studentStatuses["Siti Aminah"] === "Selesai Ditinjau" ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    ✓ Selesai Ditinjau
                  </span>
                ) : studentStatuses["Siti Aminah"] === "Dalam Penanganan" ? (
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                    🔵 Dalam Bimbingan
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    Perlu Atensi
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Durasi pengerjaan praktikum Struktur Data Array melebihi rata-rata kelas 200%. Belum
                mencatatkan target mandiri.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  Rekomendasi AI: Jadwalkan asistensi tatap muka lab
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenLog("Siti Aminah")}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50"
                >
                  <span>Tinjau Log</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Visual Distribution Chart */}
        <section
          id="distribusi"
          aria-labelledby="chart-heading"
          className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5"
        >
          <div>
            <span className="inline-block text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Visualisasi Analitik Kelas
            </span>
            <h2
              id="chart-heading"
              className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight"
            >
              Distribusi Grade & Capaian Belajar Mahasiswa
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Sebaran nilai hasil evaluasi modul dan kuis komprehensif 42 mahasiswa aktif.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {gradeDistribution.map((item) => (
              <div key={item.grade} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{item.grade}</span>
                  <span className="text-slate-500">
                    {item.count} Mahasiswa ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Tabel Penguasaan (Mastery Table TanStack Query) */}
        <section aria-labelledby="table-heading" className="space-y-4">
          <NexedMasteryTableModule onReviewLog={handleOpenLog} />
        </section>
      </main>

      {/* Modal Tinjau Log Aktivitas & Intervensi Dosen */}
      <NexedStudentLogModal
        isOpen={isLogModalOpen}
        studentName={selectedStudentForLog}
        onClose={handleCloseLog}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
