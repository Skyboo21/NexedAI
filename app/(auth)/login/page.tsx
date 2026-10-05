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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-['Outfit'] antialiased">
      <main className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xs p-8 sm:p-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-11 h-11 bg-blue-600 text-white rounded-lg mx-auto flex items-center justify-center font-bold text-base shadow-xs">
            NX
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Masuk ke NexedAI
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Platform Pembelajaran Adaptif Berbasis AI Terintegrasi
          </p>
        </div>

        {/* Primary 1-Click Entry to Student Learning Area */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wide uppercase text-blue-700 flex items-center gap-1.5">
              <span>Akses Cepat</span>
            </span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
              Mahasiswa
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Klik tombol di bawah untuk langsung masuk ke Portal Pembelajaran & Modul Belajar.
          </p>
          <a
            href="/api/auth/quick-role?role=mahasiswa"
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-center no-underline"
          >
            <span>Masuk ke Halaman Belajar Mahasiswa &rarr;</span>
          </a>
        </div>

        {/* Global Error Banner */}
        {loginError && (
          <div
            role="alert"
            className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-medium space-y-1.5"
          >
            <div className="flex items-center gap-2 font-semibold">
              <span>⚠️</span>
              <span>{loginError}</span>
            </div>
            <a
              href="/api/auth/quick-role?role=mahasiswa"
              className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer block"
            >
              Gunakan akun resmi mahasiswa (Klik di sini) &rarr;
            </a>
          </div>
        )}

        {/* Quick Demo Switcher */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700">
              Pilihan Peran Pengguna
            </span>
            <span className="text-[10px] font-mono text-slate-500">Pass: password123</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            <a
              href="/api/auth/quick-role?role=mahasiswa"
              className="px-2 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold transition-colors text-center flex flex-col items-center justify-center cursor-pointer no-underline"
            >
              <span>Mahasiswa</span>
              <span className="text-[9px] text-slate-500 font-normal">Belajar</span>
            </a>
            <a
              href="/api/auth/quick-role?role=dosen"
              className="px-2 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold transition-colors text-center flex flex-col items-center justify-center cursor-pointer no-underline"
            >
              <span>Dosen</span>
              <span className="text-[9px] text-slate-500 font-normal">Pengajar</span>
            </a>
            <a
              href="/api/auth/quick-role?role=admin"
              className="px-2 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold transition-colors text-center flex flex-col items-center justify-center cursor-pointer no-underline"
            >
              <span>Admin</span>
              <span className="text-[9px] text-slate-500 font-normal">Sistem</span>
            </a>
          </div>
        </div>

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
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
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
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => {
                  alert("Kata sandi default akun demo adalah: password123");
                }}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline bg-transparent border-none p-0 cursor-pointer"
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
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
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

        {/* Register Account Link */}
        <div className="pt-4 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            Belum memiliki akun terdaftar?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Daftar Sekarang &rarr;
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
