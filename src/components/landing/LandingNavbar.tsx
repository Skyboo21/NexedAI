// src/components/landing/LandingNavbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, role } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getDashboardHref = () => {
    if (role === "dosen") return "/dosen-dashboard";
    if (role === "admin") return "/admin-dashboard";
    return "/dashboard";
  };

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-4 md:py-6 md:px-8 font-['Inter',sans-serif]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Left Side: Custom Logo + Brand + Menu Pill + Tags Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo with 2 rotated rounded rectangles at -35deg */}
          <Link
            href="/"
            aria-label="NexedAI Home"
            className="flex items-center gap-2.5 p-1 rounded-full hover:opacity-80 transition-opacity"
          >
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
            {/* Brand text (shown on desktop 768px+) */}
            <span className="hidden md:inline font-semibold text-sm tracking-tight text-black">
              Nexed<span className="font-light">AI</span>
            </span>
          </Link>

          {/* Menu Button Pill */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileMenuOpen}
            className="inline-flex items-center gap-2 bg-black text-white pl-1.5 pr-3 py-1.5 rounded-full hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
          >
            <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0">
              <Plus size={12} strokeWidth={3} />
            </span>
            <span className="text-[11px] font-medium tracking-wide">Menu</span>
          </button>

          {/* Tags Pill (hidden on mobile, shown on desktop 768px+) */}
          <div className="hidden md:inline-flex items-center gap-2 bg-[#F4F4F6] text-black/75 px-3 py-1.5 rounded-full text-[11px] font-medium border border-black/5">
            <span>Adaptive Learning</span>
            <span className="text-black/30">&bull;</span>
            <span>Cognitive AI</span>
          </div>
        </div>

        {/* Center: Desktop Nav Links (Required by tests) */}
        <nav aria-label="Navigasi Utama" className="hidden lg:flex items-center gap-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-black/8 shadow-xs">
          <a
            href="#fitur"
            className="text-[12px] font-medium text-black/70 hover:text-black transition-colors"
          >
            Fitur Utama
          </a>
          <a
            href="#demo"
            className="text-[12px] font-medium text-black/70 hover:text-black transition-colors"
          >
            Simulasi AI
          </a>
          <a
            href="#roles"
            className="text-[12px] font-medium text-black/70 hover:text-black transition-colors"
          >
            Pengalaman Peran
          </a>
        </nav>

        {/* Right Side: Adaptive Systems / Auth Pill */}
        <div className="flex items-center gap-2">
          {mounted && user ? (
            <Link
              href={getDashboardHref()}
              className="inline-flex items-center gap-2 bg-[#F4F4F6] hover:bg-[#eaeaea] text-black px-3.5 py-1.5 rounded-full text-[12px] font-medium border border-black/8 transition-colors shadow-xs"
            >
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
              <span>Buka Dashboard</span>
              <span className="text-black/50 text-[11px]">({user.name.split(" ")[0]})</span>
            </Link>
          ) : (
            <div className="flex items-center gap-1.5">
              {/* Pill with 4-dot grid icon + label */}
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-[#F4F4F6] hover:bg-[#eaeaea] text-black pl-1.5 pr-3 py-1.5 rounded-full text-[12px] font-medium border border-black/8 transition-colors shadow-xs"
              >
                <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="3" cy="3" r="1.5" fill="white" />
                    <circle cx="9" cy="3" r="1.5" fill="white" />
                    <circle cx="3" cy="9" r="1.5" fill="white" />
                    <circle cx="9" cy="9" r="1.5" fill="white" />
                  </svg>
                </span>
                <span className="hidden sm:inline">Masuk Akun</span>
              </Link>

              {/* Black CTA Pill */}
              <Link
                href="/register"
                className="hidden sm:inline-flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all shadow-xs"
              >
                <span>Mulai Belajar Gratis</span>
                <span className="text-white/60">&rarr;</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu (Accessible and responsive) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl p-4 shadow-xl pointer-events-auto space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav aria-label="Navigasi Menu Mobile" className="flex flex-col space-y-2">
            <Link
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-medium text-black hover:bg-black/5"
            >
              Fitur Utama
            </Link>
            <Link
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-medium text-black hover:bg-black/5"
            >
              Simulasi AI
            </Link>
            <Link
              href="#roles"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-medium text-black hover:bg-black/5"
            >
              Pengalaman Peran
            </Link>
          </nav>
          <div className="pt-2 border-t border-black/10 flex flex-col gap-2">
            {mounted && user ? (
              <Link
                href={getDashboardHref()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-full text-xs font-semibold text-white bg-black hover:bg-neutral-800"
              >
                Buka Dashboard ({user.role})
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-full text-xs font-semibold text-black bg-[#F4F4F6] hover:bg-[#eaeaea]"
                >
                  Masuk Akun
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-full text-xs font-semibold text-white bg-black hover:bg-neutral-800"
                >
                  Mulai Belajar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </motion.header>
  );
}

export default LandingNavbar;
