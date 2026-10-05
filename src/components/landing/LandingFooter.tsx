"use client";

import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-white text-black/70 border-t border-black/10 font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g transform="rotate(-35 12 12)">
                    <rect x="5" y="3.5" width="4.5" height="17" rx="2.25" fill="#000000" />
                    <rect x="14.5" y="3.5" width="4.5" height="17" rx="2.25" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div>
                <span className="text-base font-semibold text-black tracking-tight">
                  Nexed<span className="font-light">AI</span>
                </span>
                <span className="block text-[11px] font-medium text-black/50">
                  D3 TI SV Universitas Sebelas Maret
                </span>
              </div>
            </div>
            <p className="text-black/60 text-xs sm:text-sm leading-relaxed max-w-sm">
              Platform e-learning adaptif dengan kecerdasan buatan terpersonalisasi untuk akselerasi pemahaman mahasiswa vokasi di bidang algoritma, pemrograman, dan rekayasa perangkat lunak.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-black bg-[#F4F4F6] px-3 py-1.5 rounded-full border border-black/5 w-fit">
              <span className="w-2 h-2 rounded-full bg-black" />
              <span>Standar Keamanan OWASP PBKDF2 Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-black uppercase tracking-wider">
              Eksplorasi
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#fitur" className="hover:text-black transition-colors">
                  Fitur Utama
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-black transition-colors">
                  Demo AI Interaktif
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-black transition-colors">
                  Akses Tiga Peran
                </a>
              </li>
              <li>
                <a href="#arsitektur" className="hover:text-black transition-colors">
                  Arsitektur & Kinerja
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-black transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-black uppercase tracking-wider">
              Portal Masuk
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/login" className="hover:text-black transition-colors">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-black transition-colors">
                  Pendaftaran Baru
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-black transition-colors">
                  Dashboard Mahasiswa
                </Link>
              </li>
              <li>
                <Link href="/dosen-dashboard" className="hover:text-black transition-colors">
                  Portal Dosen
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard" className="hover:text-black transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack & Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-black uppercase tracking-wider">
              Spesifikasi
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-black/8">
                <div className="font-medium text-black">Next.js 15 App Router</div>
                <div className="text-black/50 text-[11px]">Server Actions + BFF Pattern</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-black/8">
                <div className="font-medium text-black">Rust Biome Engine</div>
                <div className="text-black/50 text-[11px]">Format & Validasi Sub-Detik</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-black/8">
                <div className="font-medium text-black">PBKDF2 Cryptographic</div>
                <div className="text-black/50 text-[11px]">100.000 Iterasi & HMAC Token</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-14 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-black/50">
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
