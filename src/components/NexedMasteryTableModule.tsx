// src/components/NexedMasteryTableModule.tsx
"use client";

import { useState } from "react";
import { useStudentMastery } from "../services/queries";

interface NexedMasteryTableModuleProps {
  onReviewLog?: (studentName: string) => void;
}

export default function NexedMasteryTableModule({
  onReviewLog,
}: NexedMasteryTableModuleProps = {}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "Semua" | "Aman" | "Perlu Perhatian" | "Berisiko"
  >("Semua");

  // React Query for Server State Management
  const { data = [], isLoading, isError, error, refetch, isFetching } = useStudentMastery();

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded uppercase tracking-wider mb-2">
            Monitoring Penguasaan Siswa
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Matriks Penguasaan Materi (Live)
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Data performa komputasional mahasiswa yang disinkronkan secara real-time via TanStack
            Query.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-2 ${
            isFetching
              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs"
          }`}
        >
          <span className={isFetching ? "animate-spin" : ""}>🔄</span>
          <span>{isFetching ? "Menyinkronkan..." : "Segarkan Data"}</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari nama mahasiswa atau topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["Semua", "Aman", "Perlu Perhatian", "Berisiko"] as const).map((st) => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="py-8 space-y-3">
          <div className="text-xs text-slate-500 font-semibold mb-2">
            Sinkronisasi matriks nilai real-time...
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 space-y-3">
          <div className="font-bold text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>Gagal Memuat Data Server</span>
          </div>
          <p className="text-xs text-rose-600">
            {error?.message || "Terjadi kesalahan koneksi saat meminta data matriks."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition-colors"
          >
            Coba Sinkron Ulang
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="py-14 px-6 text-center">
              <div className="text-sm font-bold text-slate-800 mb-1">Tidak Ada Data Ditemukan</div>
              <div className="text-xs text-slate-500">
                Silakan ubah kata kunci pencarian atau ganti filter status.
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                      ID
                    </th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                      Nama Mahasiswa
                    </th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                      Topik Pembelajaran
                    </th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                      Tingkat Penguasaan
                    </th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">
                      Status Risiko
                    </th>
                    {onReviewLog && (
                      <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">
                        Aksi Audit
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((row) => {
                    let statusBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
                    let progressColor = "bg-emerald-600";

                    if (row.status === "Perlu Perhatian") {
                      statusBg = "bg-amber-50 text-amber-800 border-amber-200";
                      progressColor = "bg-amber-500";
                    } else if (row.status === "Berisiko") {
                      statusBg = "bg-rose-50 text-rose-800 border-rose-200";
                      progressColor = "bg-rose-500";
                    }

                    return (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400">#{row.id}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{row.name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{row.topic}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[90px] border border-slate-200">
                              <div
                                className={`h-full ${progressColor} rounded-full transition-all duration-300`}
                                style={{ width: `${row.mastery}%` }}
                              />
                            </div>
                            <span className="font-semibold text-slate-700 w-10 text-right">
                              {row.mastery}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${statusBg}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        {onReviewLog && (
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => onReviewLog(row.name)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <span>Tinjau Log</span>
                              <span>&rarr;</span>
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
