// src/views/AdminDashboardView.tsx
"use client";

import { useState } from "react";
import { type Role, useAuthStore } from "../store/authStore";

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "Aktif" | "Nonaktif";
  lastActive: string;
}

interface BuildMetric {
  tool: string;
  buildTimeMs: number;
  hmrTimeMs: number;
  satisfaction: string;
}

export default function AdminDashboardView() {
  const { user } = useAuthStore();
  const [renderCount, setRenderCount] = useState<number>(0);

  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: 1,
      name: "Muhammad Hariz Lazuardi",
      email: "mahasiswa@nexed.ai",
      role: "mahasiswa",
      status: "Aktif",
      lastActive: "5 menit lalu",
    },
    {
      id: 2,
      name: "Dr. Ir. Hendra Wijaya, M.Kom.",
      email: "dosen@nexed.ai",
      role: "dosen",
      status: "Aktif",
      lastActive: "12 menit lalu",
    },
    {
      id: 3,
      name: "Administrator Sistem",
      email: "admin@nexed.ai",
      role: "admin",
      status: "Aktif",
      lastActive: "Sekarang",
    },
    {
      id: 4,
      name: "Siti Aminah",
      email: "siti.aminah@student.uns.ac.id",
      role: "mahasiswa",
      status: "Aktif",
      lastActive: "1 jam lalu",
    },
    {
      id: 5,
      name: "Budi Santoso",
      email: "budi.santoso@student.uns.ac.id",
      role: "mahasiswa",
      status: "Aktif",
      lastActive: "2 jam lalu",
    },
  ]);

  const metrics: BuildMetric[] = [
    {
      tool: "Next.js App Router (Turbopack/SWC Rust)",
      buildTimeMs: 240,
      hmrTimeMs: 4,
      satisfaction: "98%",
    },
    { tool: "Tailwind CSS Modern Engine", buildTimeMs: 8, hmrTimeMs: 2, satisfaction: "96%" },
    { tool: "Biome Linter & Formatter (Rust)", buildTimeMs: 21, hmrTimeMs: 3, satisfaction: "99%" },
    { tool: "Legacy Webpack 5 (Node.js)", buildTimeMs: 14500, hmrTimeMs: 850, satisfaction: "26%" },
  ];

  const handleRoleChange = (id: number, newRole: Role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto font-['Inter',sans-serif] antialiased">
      {/* Header Banner - Bento Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-xs hover:border-black/20 transition-all duration-300">
        <div>
          <div className="inline-flex items-center space-x-2 bg-[#F4F4F6] text-black border border-black/10 px-3 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-wider mb-3">
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-black tracking-tight mb-2">
            Panel Kontrol Administrator Platform
          </h1>
          <p className="text-neutral-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Kelola data akun pengguna, alokasi perizinan role (
            <span className="text-black font-medium">mahasiswa</span>,{" "}
            <span className="text-black font-medium">dosen</span>,{" "}
            <span className="text-black font-semibold">admin</span>), serta pantau integritas
            infrastruktur sistem NexedAI secara terpusat.
          </p>
        </div>
      </div>

      {/* Metric Cards - Bento 3-Col */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-1">
            Total Pengguna
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{users.length} Akun</div>
          <p className="text-xs text-emerald-700 mt-1.5 font-semibold">Terdaftar di SSO UNS</p>
        </div>

        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-1">
            Sesi Berjalan
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">Online</div>
          <p suppressHydrationWarning className="text-xs text-slate-500 mt-1.5 truncate font-medium">
            Aktif: {user?.email || "admin@nexed.ai"}
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-1">
            Sistem Guard
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 tracking-tight">Strict RBAC</div>
          <p className="text-xs text-slate-500 mt-1.5 font-mono">
            Cookie: nexed_session_token (HttpOnly)
          </p>
        </div>
      </div>

      {/* User Management Table */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Kelola Pengguna & Perizinan Akses
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Ubah role untuk memvalidasi proteksi server-side middleware guard secara langsung.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 font-semibold">
            {users.length} Pengguna Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-semibold text-slate-700 uppercase tracking-wider bg-slate-50/70">
                <th className="p-3.5 rounded-l-xl">Nama Pengguna</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Role Akses</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 rounded-r-xl">Aktivitas Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                  <td className="p-3.5 font-mono text-slate-500">{u.email}</td>
                  <td className="p-3.5">
                    <select
                      value={u.role || ""}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      className="bg-white border border-slate-200/80 rounded-xl px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-600 cursor-pointer"
                    >
                      <option value="mahasiswa">Mahasiswa</option>
                      <option value="dosen">Dosen</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modern Build Tools & Rust Toolchain Analytics */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1.5">
              Infrastruktur Toolchain Modern
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Analitik Kinerja Toolchain & Benchmark Kompilasi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Data benchmarking kecepatan kompilasi, HMR latency, dan efisiensi eksekusi sistem.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRenderCount((c) => c + 1)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition-colors cursor-pointer"
          >
            Uji HMR Latency: <span className="font-mono">{renderCount}</span> (&lt;5ms)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-semibold text-slate-700 uppercase tracking-wider bg-slate-50/70">
                <th className="p-3.5 rounded-l-xl">Build Toolchain</th>
                <th className="p-3.5">Waktu Kompilasi</th>
                <th className="p-3.5">HMR Latency</th>
                <th className="p-3.5 rounded-r-xl">Indeks Kepuasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.map((m, idx) => (
                <tr key={m.tool} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>{m.tool}</span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-700">{m.buildTimeMs} ms</td>
                  <td className="p-3.5 font-mono font-bold text-slate-700">{m.hmrTimeMs} ms</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        idx === 3
                          ? "bg-rose-50 text-rose-800 border-rose-200/80"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                      }`}
                    >
                      {m.satisfaction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* System Configuration Section */}
      <section
        id="config"
        className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-4"
      >
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
          Konfigurasi Sistem, Keamanan & Route Groups
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-900 text-xs">Proteksi Middleware Session</div>
            <p className="text-slate-500">
              Cookie Name:{" "}
              <code className="text-indigo-700 font-mono font-semibold">nexed_session_token (HttpOnly)</code>
            </p>
            <p className="text-slate-500 leading-relaxed">
              Aturan Isolasi: Mahasiswa terisolasi dari portal Dosen/Admin, Dosen terisolasi dari
              portal Mahasiswa/Admin.
            </p>
          </div>
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-900 text-xs">
              Arsitektur Next.js Route Groups & RSC
            </div>
            <p className="text-slate-500">
              Route Groups: <code className="text-indigo-700 font-mono font-semibold">(auth)</code>,{" "}
              <code className="text-indigo-700 font-mono font-semibold">(mahasiswa)</code>,{" "}
              <code className="text-indigo-700 font-mono font-semibold">(dosen)</code>,{" "}
              <code className="text-indigo-700 font-mono font-semibold">(admin)</code>.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Rendering Mode: React Server Components (RSC) dengan Client Component terisolasi
              secara modular.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
