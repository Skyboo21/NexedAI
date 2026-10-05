"use client";

import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                NX
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  Nexed<span className="text-blue-600">AI</span>
                </span>
                <span className="block text-[11px] font-medium text-slate-500">
                  D3 TI SV Universitas Sebelas Maret
                </span>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              Platform e-learning adaptif dengan kecerdasan buatan terpersonalisasi untuk akselerasi pemahaman mahasiswa vokasi di bidang algoritma, pemrograman, dan rekayasa perangkat lunak.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Standar Keamanan OWASP PBKDF2 Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Eksplorasi
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#fitur" className="hover:text-slate-900 transition-colors">
                  Fitur Utama
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-slate-900 transition-colors">
                  Demo AI Interaktif
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-slate-900 transition-colors">
                  Akses Tiga Peran
                </a>
              </li>
              <li>
                <a href="#arsitektur" className="hover:text-slate-900 transition-colors">
                  Arsitektur & Kinerja
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-slate-900 transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Portal Masuk
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/login" className="hover:text-slate-900 transition-colors">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-slate-900 transition-colors">
                  Pendaftaran Baru
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
                  Dashboard Mahasiswa
                </Link>
              </li>
              <li>
                <Link href="/dosen-dashboard" className="hover:text-slate-900 transition-colors">
                  Portal Dosen
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard" className="hover:text-slate-900 transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack & Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Spesifikasi
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="font-semibold text-slate-900">Next.js 15 App Router</div>
                <div className="text-slate-500">Server Actions + BFF Pattern</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="font-semibold text-slate-900">Rust Biome Engine</div>
                <div className="text-slate-500">Format & Validasi Sub-Detik</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="font-semibold text-slate-900">PBKDF2 Cryptographic</div>
                <div className="text-slate-500">100.000 Iterasi & HMAC Token</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} NexedAI &bull; D3 Teknik Informatika Sekolah Vokasi Universitas Sebelas Maret (UNS).
          </div>
          <div className="flex items-center gap-4">
            <span>Surakarta, Jawa Tengah</span>
            <span>&bull;</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
