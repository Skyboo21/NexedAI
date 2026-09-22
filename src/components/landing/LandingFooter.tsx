"use client";

import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                N
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Nexed<span className="text-indigo-400">AI</span>
                </span>
                <span className="block text-[11px] font-medium text-indigo-300">
                  D3 TI SV Universitas Sebelas Maret
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Inovasi platform e-learning adaptif dengan kecerdasan buatan terpersonalisasi untuk
              akselerasi pemahaman mahasiswa vokasi di bidang algoritma, pemrograman, dan rekayasa
              perangkat lunak.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/60 w-fit">
              <svg
                className="w-4 h-4 text-emerald-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Sistem Operasional: Standar OWASP & Next.js 15 Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Eksplorasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#fitur" className="hover:text-white transition-colors">
                  Fitur Unggulan
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-white transition-colors">
                  Demo AI Interaktif
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-white transition-colors">
                  Akses Tiga Peran
                </a>
              </li>
              <li>
                <a href="#arsitektur" className="hover:text-white transition-colors">
                  Arsitektur & Rust Tooling
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Portal Masuk
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Pendaftaran Baru
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard Mahasiswa
                </Link>
              </li>
              <li>
                <Link href="/dosen-dashboard" className="hover:text-white transition-colors">
                  Portal Dosen
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard" className="hover:text-white transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack & Standards */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Spesifikasi
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <svg
                  className="w-4 h-4 text-indigo-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                <div>
                  <div className="font-semibold text-white">Next.js 15 App Router</div>
                  <div className="text-slate-400">Server Actions + BFF Pattern</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <svg
                  className="w-4 h-4 text-blue-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <div className="font-semibold text-white">Rust Biome Engine</div>
                  <div className="text-slate-400">Sub-second Lint & Formatting</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <svg
                  className="w-4 h-4 text-emerald-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div>
                  <div className="font-semibold text-white">PBKDF2 Cryptographic</div>
                  <div className="text-slate-400">100.000 Iterations & HMAC</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>
              &copy; {new Date().getFullYear()} NexedAI &bull; D3 Teknik Informatika Sekolah Vokasi
              Universitas Sebelas Maret (UNS).
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Surakarta, Jawa Tengah, Indonesia</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-slate-400">v2.1.0-prod</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
