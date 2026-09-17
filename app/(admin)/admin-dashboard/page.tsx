'use client';

import React, { useState } from 'react';
import { useAuthStore, Role } from '../../../src/store/authStore';

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: 'Aktif' | 'Nonaktif';
  lastActive: string;
}

interface BuildMetric {
  tool: string;
  buildTimeMs: number;
  hmrTimeMs: number;
  satisfaction: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [renderCount, setRenderCount] = useState<number>(0);

  const [users, setUsers] = useState<UserRecord[]>([
    { id: 1, name: 'Muhammad Hariz', email: 'hariz@nexed.ai', role: 'mahasiswa', status: 'Aktif', lastActive: '5 menit lalu' },
    { id: 2, name: 'Dr. Ir. Hendra Wijaya', email: 'dosen.hendra@nexed.ai', role: 'dosen', status: 'Aktif', lastActive: '12 menit lalu' },
    { id: 3, name: 'System Administrator', email: 'admin@nexed.ai', role: 'admin', status: 'Aktif', lastActive: 'Sekarang' },
    { id: 4, name: 'Siti Aminah', email: 'siti@nexed.ai', role: 'mahasiswa', status: 'Aktif', lastActive: '1 jam lalu' },
    { id: 5, name: 'Budi Santoso', email: 'budi@nexed.ai', role: 'mahasiswa', status: 'Aktif', lastActive: '2 jam lalu' },
  ]);

  const metrics: BuildMetric[] = [
    { tool: 'Vite + Esbuild (Go)', buildTimeMs: 280, hmrTimeMs: 4, satisfaction: '98%' },
    { tool: 'Tailwind v4 (Rust Oxide)', buildTimeMs: 8, hmrTimeMs: 2, satisfaction: '96%' },
    { tool: 'Rolldown (Rust Bundler)', buildTimeMs: 90, hmrTimeMs: 3, satisfaction: '94%' },
    { tool: 'Legacy Webpack (JS)', buildTimeMs: 14500, hmrTimeMs: 850, satisfaction: '26%' },
  ];

  const handleRoleChange = (id: number, newRole: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative glass-card rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-amber-950/40 via-slate-900/60 to-purple-950/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Role-Based Access Control (RBAC) Portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Panel Kontrol Administrator
          </h1>
          <p className="text-slate-300 text-sm md:text-base font-light max-w-3xl leading-relaxed">
            Kelola data pengguna, alokasi role akses (<span className="text-amber-400 font-bold">mahasiswa</span>,{' '}
            <span className="text-blue-400 font-bold">dosen</span>,{' '}
            <span className="text-purple-400 font-bold">admin</span>), dan audit integritas sistem NexedAI.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/70 border border-white/10 rounded-3xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Pengguna</div>
          <div className="text-3xl font-black text-white">{users.length} Akun</div>
          <p className="text-xs text-emerald-400 mt-2">● Semua akun tersinkronisasi</p>
        </div>

        <div className="p-6 bg-slate-900/70 border border-white/10 rounded-3xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sesi Aktif</div>
          <div className="text-3xl font-black text-emerald-400">Online</div>
          <p suppressHydrationWarning className="text-xs text-slate-400 mt-2">
            Login sebagai: {user?.email || 'admin@nexed.ai'}
          </p>
        </div>

        <div className="p-6 bg-slate-900/70 border border-white/10 rounded-3xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Server Guard</div>
          <div className="text-3xl font-black text-purple-400">Strict RBAC</div>
          <p className="text-xs text-slate-400 mt-2">Cookie: uns_session_role</p>
        </div>
      </div>

      {/* User Management Table */}
      <section className="bg-slate-900/70 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">👥 Kelola Pengguna & Hak Akses</h2>
            <p className="text-xs text-slate-400 mt-1">Perbarui role secara langsung untuk menguji server-side middleware guard.</p>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono">
            {users.length} Pengguna Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-extrabold text-slate-400 uppercase tracking-wider bg-white/5">
                <th className="p-4 rounded-l-xl">Nama Pengguna</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role Akses</th>
                <th className="p-4">Status</th>
                <th className="p-4 rounded-r-xl">Aktivitas Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white">{u.name}</td>
                  <td className="p-4 font-mono text-xs text-slate-300">{u.email}</td>
                  <td className="p-4">
                    <select
                      value={u.role || ''}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold cursor-pointer"
                    >
                      <option value="mahasiswa">Mahasiswa</option>
                      <option value="dosen">Dosen</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modern Build Tools & Rust Toolchain Analytics */}
      <section className="bg-slate-900/70 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
              Infrastruktur & Arsitektur Toolchain Modern
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              ⚡ FastBuild Engine: Analitik Kinerja Toolchain
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Data benchmarking performa kompilasi, HMR latency, dan efisiensi eksekusi sistem secara real-time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRenderCount((c) => c + 1)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/30 transition-all cursor-pointer"
          >
            Trigger HMR Render: <span className="font-mono underline">{renderCount}</span> (&lt;5ms)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-extrabold text-slate-400 uppercase tracking-wider bg-white/5">
                <th className="p-4 rounded-l-xl">Build Toolchain</th>
                <th className="p-4">Build Time</th>
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
                  <td className="p-4 font-mono font-bold text-slate-200">{m.buildTimeMs} ms</td>
                  <td className="p-4 font-mono font-bold text-slate-200">{m.hmrTimeMs} ms</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                        idx === 3
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {m.satisfaction} {idx !== 3 && '🔥'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* System Configuration Section */}
      <section id="config" className="bg-slate-900/70 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">⚙️ Konfigurasi Sistem & Keamanan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 bg-black/30 rounded-2xl border border-white/5 space-y-2">
            <div className="font-bold text-white text-sm">Proteksi Middleware Session</div>
            <p className="text-slate-400">Cookie Name: <code className="text-amber-400">uns_session_role</code></p>
            <p className="text-slate-400">Aturan Pengalihan: Mahasiswa dibatasi dari Dosen/Admin, Dosen dibatasi dari Mahasiswa/Admin.</p>
          </div>
          <div className="p-4 bg-black/30 rounded-2xl border border-white/5 space-y-2">
            <div className="font-bold text-white text-sm">Arsitektur Route Groups & RSC</div>
            <p className="text-slate-400">Route Groups: <code className="text-blue-400">(auth)</code>, <code className="text-purple-400">(mahasiswa)</code>, <code className="text-emerald-400">(dosen)</code>, <code className="text-amber-400">(admin)</code>.</p>
            <p className="text-slate-400">Rendering Mode: React Server Components (RSC) dengan Client Component terisolasi.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
