// app/(dosen)/layout.tsx
// React Server Component (RSC) - Zero Client JS for layout structure
import type React from 'react';
import Link from 'next/link';
import LogoutButton from '../../src/components/LogoutButton';

export const metadata = {
  title: 'Portal Dosen - NexedAI',
  description: 'Monitoring analitik penguasaan materi dan status performa mahasiswa',
};

export default function DosenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col md:flex-row font-['Outfit'] antialiased">
      {/* Sidebar Server Component (RSC) */}
      <aside className="w-full md:w-64 bg-slate-900/80 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-5 shrink-0 z-30">
        <div>
          {/* Logo & Header */}
          <div className="flex items-center space-x-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30 text-lg">
              NX
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight leading-none">
                NEXED AI
              </h2>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                Portal Dosen
              </span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav aria-label="Sidebar Dosen" className="space-y-2">
            <Link
              href="/dosen-dashboard"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
            >
              <span className="text-base">📊</span>
              <span>Analitik Kelas</span>
            </Link>

            <Link
              href="/dosen-dashboard#alerts"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
            >
              <span className="text-base">⚠️</span>
              <span>Alert Mahasiswa</span>
            </Link>

            <Link
              href="/profil"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
            >
              <span className="text-base">👤</span>
              <span>Profil Dosen</span>
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar with Client Component Logout */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="px-2 py-2 bg-white/5 rounded-xl border border-white/5 text-[11px] text-slate-400">
            <span className="text-blue-400 font-bold">● Peran:</span> Dosen Pengampu
          </div>
          {/* Isolated Client Component */}
          <LogoutButton />
        </div>
      </aside>

      {/* Main Page Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
