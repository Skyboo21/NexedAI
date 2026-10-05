// src/components/landing/LandingNavbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, role } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardHref = () => {
    if (role === "dosen") return "/dosen-dashboard";
    if (role === "admin") return "/admin-dashboard";
    return "/dashboard";
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3"
          : "bg-white/80 backdrop-blur-sm border-b border-slate-100 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs transition-colors">
              NX
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Nexed<span className="text-blue-600">AI</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                D3 Teknik Informatika • SV UNS
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav aria-label="Navigasi Utama" className="hidden md:flex items-center gap-6">
            <a
              href="#fitur"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Fitur Utama
            </a>
            <a
              href="#demo"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Simulasi AI
            </a>
            <a
              href="#roles"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Pengalaman Peran
            </a>
            <a
              href="#arsitektur"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Arsitektur
            </a>
            <a
              href="#faq"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {mounted && user ? (
              <Link
                href={getDashboardHref()}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>Buka Dashboard</span>
                <span className="text-blue-200 font-normal">({user.name.split(" ")[0]})</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Masuk Akun
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Mulai Belajar Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka menu navigasi"
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav aria-label="Navigasi Menu Mobile" className="flex flex-col space-y-2">
            <Link
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Fitur Utama
            </Link>
            <Link
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Simulasi AI
            </Link>
            <Link
              href="#peran"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Pengalaman Peran
            </Link>
            <Link
              href="#performa"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Arsitektur & Performa
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              FAQ
            </Link>
          </nav>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {mounted && user ? (
              <Link
                href={getDashboardHref()}
                className="w-full text-center px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
              >
                Buka Dashboard ({user.role})
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full text-center px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Masuk Akun
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Mulai Belajar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default LandingNavbar;
