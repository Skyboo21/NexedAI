import type React from "react";
import { useEffect, useState } from "react";
import NexedDashboardModule from "./components/NexedDashboardModule";
import NexedFormEntryModule from "./components/NexedFormEntryModule";
import NexedMasteryTableModule from "./components/NexedMasteryTableModule";
import TaskTodoList from "./components/TaskTodoList";

interface BuildMetric {
  tool: string;
  buildTimeMs: number;
  hmrTimeMs: number;
  satisfaction: string;
}

export const App: React.FC = () => {
  const [metrics, setMetrics] = useState<BuildMetric[]>([]);
  const [renderCount, setRenderCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"benchmarking" | "mahasiswa" | "dosen" | "target">(
    "benchmarking",
  );

  useEffect(() => {
    // Data Indikator Benchmarking Toolchain 2026 (Sesuai Bab 8 Langkah 4)
    setMetrics([
      { tool: "Vite + Esbuild (Go)", buildTimeMs: 280, hmrTimeMs: 4, satisfaction: "98%" },
      { tool: "Tailwind v4 (Rust Oxide)", buildTimeMs: 8, hmrTimeMs: 2, satisfaction: "96%" },
      { tool: "Rolldown (Rust Bundler)", buildTimeMs: 90, hmrTimeMs: 3, satisfaction: "94%" },
      { tool: "Legacy Webpack (JS)", buildTimeMs: 14500, hmrTimeMs: 850, satisfaction: "26%" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-['Outfit'] antialiased">
      {/* Ambient background lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30">
              ⚡
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight leading-none">
                UNS FastBuild Analytics Dashboard
              </h1>
              <p className="text-xs text-blue-400 font-semibold tracking-wide mt-1">
                Laboratorium RPL - Sekolah Vokasi Universitas Sebelas Maret
              </p>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <nav className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab("benchmarking")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "benchmarking"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              ⚡ Benchmarking Rust
            </button>
            <button
              onClick={() => setActiveTab("mahasiswa")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "mahasiswa"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              🎓 Proyek SRS: Mahasiswa
            </button>
            <button
              onClick={() => setActiveTab("dosen")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "dosen"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              📊 Proyek SRS: Dosen
            </button>
            <button
              onClick={() => setActiveTab("target")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "target"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              📝 Target & Tasks
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* TAB 1: BENCHMARKING (LANGKAH 4 PRAKTIKUM TERPANDU) */}
        {activeTab === "benchmarking" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Banner Section */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-purple-950/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span>Bab 8: Build Tools Modern & Rust Toolchain</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                  Evolusi Build Pipeline: Vite, Native ESM, & Rust Toolchain
                </h2>
                <p className="text-slate-300 text-sm sm:text-base font-light max-w-3xl leading-relaxed">
                  Pergeseran dari bundler monolitik tradisional (Webpack) menuju ekosistem kompilasi
                  instan berbasis <strong>Esbuild (Go)</strong>, <strong>Rolldown (Rust)</strong>,
                  dan linter/formatter <strong>Biome (Rust)</strong> yang memangkas waktu eksekusi
                  hingga 100x lebih cepat.
                </p>
              </div>
            </div>

            {/* HMR Interactive Test Section */}
            <section className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>⚡ Pengujian Interaktivitas HMR (Hot Module Replacement)</span>
                  </h3>
                  <p className="text-sm text-slate-400 font-light mt-1">
                    Ubah kode pada berkas ini dan simpan. Perhatikan pemutakhiran tampilan secara
                    instan (<span className="text-emerald-400 font-bold">&lt;5 ms</span>) tanpa
                    mereset state aplikasi!
                  </p>
                </div>
                <button
                  onClick={() => setRenderCount((prev) => prev + 1)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-blue-500/30 border border-blue-400/30 transition-all transform hover:scale-[1.02] cursor-pointer"
                >
                  Trigger State Render:{" "}
                  <span className="underline ml-1 font-mono text-base">{renderCount}</span>
                </button>
              </div>
            </section>

            {/* Metrik Performa Build Tools Table */}
            <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/10 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Metrik Performa Build Tools Modern (2026)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-light">
                    Berdasarkan laporan industri State of JavaScript 2025/2026 & Benchmarking
                    Laboratorium RPL SV UNS
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  ✓ Verified Rust/Go Acceleration
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-xs font-extrabold text-slate-400 uppercase tracking-wider bg-white/5">
                      <th className="p-4 rounded-l-xl">Build Toolchain</th>
                      <th className="p-4">Kompilasi / Build Time</th>
                      <th className="p-4">HMR Latency</th>
                      <th className="p-4 rounded-r-xl">Kepuasan Pengembang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {metrics.map((m, idx) => (
                      <tr key={m.tool} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                          <span>{m.tool}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-200">
                          {m.buildTimeMs} ms
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-200">{m.hmrTimeMs} ms</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                              idx === 3
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            }`}
                          >
                            {m.satisfaction} {idx !== 3 && "🔥 Tertinggi"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: PROYEK SRS - MAHASISWA */}
        {activeTab === "mahasiswa" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Proyek SRS: NexedAI
                </span>
                <h3 className="text-lg font-bold text-white">Dashboard Peta Belajar Mahasiswa</h3>
              </div>
              <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full font-semibold">
                Client Component
              </span>
            </div>
            <NexedDashboardModule />
          </div>
        )}

        {/* TAB 3: PROYEK SRS - DOSEN */}
        {activeTab === "dosen" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Proyek SRS: NexedAI
                </span>
                <h3 className="text-lg font-bold text-white">
                  Matriks Penguasaan Mahasiswa (Portal Dosen)
                </h3>
              </div>
              <span className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-semibold">
                TanStack React Query Live
              </span>
            </div>
            <NexedMasteryTableModule />
          </div>
        )}

        {/* TAB 4: PROYEK SRS - TARGET & TODOS */}
        {activeTab === "target" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <NexedFormEntryModule />
            <TaskTodoList />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
