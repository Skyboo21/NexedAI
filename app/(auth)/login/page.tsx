// app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../src/store/authStore";

export default function LoginPage() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const executeLogin = async (emailVal: string, passwordVal: string) => {
    const cleanEmail = emailVal.trim();
    if (!cleanEmail) {
      setLoginError("Email atau username akun wajib diisi.");
      return;
    }
    if (!passwordVal || passwordVal.length < 6) {
      setLoginError("Kata sandi minimal 6 karakter.");
      return;
    }

    setIsSubmitting(true);
    setLoginError(null);

    try {
      const result = await login(cleanEmail, passwordVal);
      if (!result.success || !result.user) {
        setIsSubmitting(false);
        setLoginError(result.message || "Email / Username atau Kata Sandi salah.");
        return;
      }

      let target = "/dashboard";
      if (result.user.role === "dosen") {
        target = "/dosen-dashboard";
      } else if (result.user.role === "admin") {
        target = "/admin-dashboard";
      }

      if (typeof window !== "undefined") {
        window.location.replace(target);
      }
    } catch {
      setIsSubmitting(false);
      setLoginError("Terjadi kesalahan saat memproses autentikasi. Silakan coba lagi.");
    }
  };

  // Automatically authenticate if credentials are present in the URL query
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    const passParam = params.get("password");
    if (emailParam && passParam) {
      setEmailInput(emailParam);
      setPasswordInput(passParam);
      executeLogin(emailParam, passParam);
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formEmail = (formData.get("email") as string) || emailInput;
    const formPassword = (formData.get("password") as string) || passwordInput;
    await executeLogin(formEmail, formPassword);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] bento-bg-grid flex items-center justify-center p-4 sm:p-6 lg:p-12 font-['Outfit'] antialiased">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SISI KIRI: BENTO PREVIEW CARDS (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col gap-4">
          {/* Card 1: XP Simulation & Streak */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-medium text-xs px-2.5 py-1 rounded-full">
                ⚡ Progres Belajar Aktif
              </span>
              <span className="text-xs font-semibold text-slate-500">Semester 2</span>
            </div>
            <div>
              <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Akumulasi Skor</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">225 XP</span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium text-xs px-2 py-0.5 rounded-full">
                  +35 XP hari ini
                </span>
              </div>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Level 3 • Pengembang Menengah</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full w-[85%]" />
              </div>
            </div>
          </div>

          {/* Card 2: Gamification Badge Preview */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-2xl shrink-0 shadow-xs">
              🏆
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-amber-50 text-amber-700 border border-amber-200/80 font-medium text-[11px] px-2 py-0.5 rounded-full">
                  Pencapaian Baru
                </span>
              </div>
              <h4 className="text-slate-900 font-bold text-sm tracking-tight">Pakar Looping & Rekursi</h4>
              <p className="text-slate-500 text-xs">Menyelesaikan 15 recall kuis dengan akurasi 100%.</p>
            </div>
          </div>

          {/* Card 3: Student Testimonial */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-3">
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed italic">
              &ldquo;NexedAI membantu saya memahami konsep algoritma praktikum dalam 2 hari tanpa merasa stuck. Roadmap belajarnya sangat adaptif!&rdquo;
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                DA
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Dimas Arya</p>
                <p className="text-[10px] text-slate-400">Mahasiswa D3 TI SV UNS</p>
              </div>
            </div>
          </div>
        </div>

        {/* SISI KANAN: BENTO FORM CARD */}
        <div className="lg:col-span-7">
          <main className="w-full bg-white border border-slate-200/80 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 p-8 sm:p-10 space-y-6">
            {/* Brand Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-indigo-200">
                  NX
                </div>
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">NexedAI</span>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-medium text-xs px-2.5 py-0.5 rounded-full ml-auto">
                  Auth Portal
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 pt-2">
                Masuk ke NexedAI
              </h1>
              <p className="text-slate-500 text-xs font-medium">
                Platform Pembelajaran Adaptif Berbasis AI Terintegrasi
              </p>
            </div>

            {/* Quick 1-Click Role Entry Bento Pills */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">
                  Masuk Instan Cepat:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Demo Auto-Fill</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="/api/auth/quick-role?role=mahasiswa"
                  className="py-2.5 px-3 bg-white hover:bg-indigo-50/70 border border-slate-200/80 text-slate-800 hover:text-indigo-700 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-center no-underline cursor-pointer group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">🎓</span>
                  <span>Masuk Instan Mahasiswa &rarr;</span>
                </a>
                <a
                  href="/api/auth/quick-role?role=dosen"
                  className="py-2.5 px-3 bg-white hover:bg-indigo-50/70 border border-slate-200/80 text-slate-800 hover:text-indigo-700 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-center no-underline cursor-pointer group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">👨‍🏫</span>
                  <span>Masuk Instan Dosen &rarr;</span>
                </a>
              </div>
            </div>

            {/* Global Error Banner */}
            {loginError && (
              <div
                role="alert"
                className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl text-rose-800 text-xs font-medium space-y-1.5"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <span>⚠️</span>
                  <span>{loginError}</span>
                </div>
                <a
                  href="/api/auth/quick-role?role=mahasiswa"
                  className="text-[11px] text-indigo-600 font-bold hover:underline cursor-pointer block"
                >
                  Gunakan akun resmi mahasiswa (Klik di sini) &rarr;
                </a>
              </div>
            )}

            {/* Standard Manual Login Form */}
            <form
              action="/api/auth/login"
              method="POST"
              onSubmit={handleFormSubmit}
              className="space-y-4"
            >
              {/* Email / Username Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-slate-500 font-medium text-xs uppercase tracking-wider"
                >
                  Alamat Email Kampus / Username
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  placeholder="mahasiswa@nexed.ai atau nama akun"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 text-xs text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-slate-500 font-medium text-xs uppercase tracking-wider"
                  >
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      alert("Kata sandi default akun demo adalah: password123");
                    }}
                    className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 text-xs text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-xs rounded-xl shadow-sm shadow-indigo-200 transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses Masuk...</span>
                  </>
                ) : (
                  <span>Masuk Akun</span>
                )}
              </button>
            </form>

            {/* Quick Link Footer */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <p>
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Daftar Sekarang &rarr;
                </Link>
              </p>
              <Link href="/" className="hover:text-slate-800 transition-colors">
                &larr; Kembali ke Beranda
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
