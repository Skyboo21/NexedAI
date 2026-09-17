// src/components/NexedMasteryTableModule.tsx
import React, { useState } from "react";
import { useStudentMastery } from "../services/queries";

export default function NexedMasteryTableModule() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "Semua" | "Aman" | "Perlu Perhatian" | "Berisiko"
  >("Semua");

  // React Query for Server State Management (Modul 7 Requirement)
  const { data = [], isLoading, isError, error, refetch, isFetching } = useStudentMastery();

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="inline-block text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-inner shadow-emerald-500/20">
            Analytics Data
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            📊 Matriks Penguasaan Materi (Live)
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-300 flex items-center space-x-2 ${
              isFetching
                ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"
                : "bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-lg shadow-black/20"
            }`}
          >
            <span className={isFetching ? "animate-spin" : ""}>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari nama mahasiswa atau topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {(["Semua", "Aman", "Perlu Perhatian", "Berisiko"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                statusFilter === st
                  ? "bg-purple-600/30 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="py-8">
          <div className="text-sm text-slate-400 font-semibold mb-4 animate-pulse">
            ⏳ Sinkronisasi data real-time...
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-white/5 border border-white/10 rounded-xl mb-3 animate-pulse relative overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="p-6 bg-pink-950/30 border border-pink-500/30 rounded-2xl text-pink-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-[40px] -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="font-extrabold text-lg mb-2 text-pink-400 flex items-center">
              <span className="mr-2">⚠️</span> Gagal Memuat Data
            </div>
            <div className="text-sm text-pink-200/80 mb-4">
              {error?.message || "Koneksi terputus."}
            </div>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-pink-600/30"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <div className="text-lg font-bold text-slate-300 mb-2">Tidak Ada Data Ditemukan</div>
              <div className="text-sm text-slate-500">
                Coba ubah kata kunci pencarian atau reset filter.
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                    <th className="py-4 px-6 font-semibold uppercase tracking-wider text-xs">ID</th>
                    <th className="py-4 px-6 font-semibold uppercase tracking-wider text-xs">
                      Nama Mahasiswa
                    </th>
                    <th className="py-4 px-6 font-semibold uppercase tracking-wider text-xs">
                      Topik Pembelajaran
                    </th>
                    <th className="py-4 px-6 font-semibold uppercase tracking-wider text-xs">
                      Penguasaan
                    </th>
                    <th className="py-4 px-6 font-semibold uppercase tracking-wider text-xs">
                      Status Risiko
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredData.map((row) => {
                    const statusBg =
                      row.status === "Aman"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : row.status === "Perlu Perhatian"
                          ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          : "bg-pink-500/10 text-pink-400 border-pink-500/20";
                    const progressColor =
                      row.mastery >= 80
                        ? "from-emerald-400 to-emerald-600"
                        : row.mastery >= 60
                          ? "from-orange-400 to-orange-600"
                          : "from-pink-400 to-pink-600";

                    return (
                      <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-6 font-medium text-slate-500 group-hover:text-slate-400">
                          #{row.id}
                        </td>
                        <td className="py-4 px-6 font-bold text-white">{row.name}</td>
                        <td className="py-4 px-6 text-slate-300">{row.topic}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden min-w-[80px] shadow-inner">
                              <div
                                className={`h-full bg-gradient-to-r ${progressColor} rounded-full relative`}
                                style={{ width: `${row.mastery}%` }}
                              >
                                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                              </div>
                            </div>
                            <span className="font-bold text-slate-300 w-10 text-right">
                              {row.mastery}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold border ${statusBg}`}
                          >
                            {row.status}
                          </span>
                        </td>
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
