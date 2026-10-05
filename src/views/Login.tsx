"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { type Role, useAuthStore } from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const performRedirect = (targetPath: string) => {
    if (typeof window !== "undefined") {
      window.location.href = targetPath;
    } else {
      router.push(targetPath);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    login(email, activeRole || undefined);

    const lower = email.toLowerCase();
    let target = "/dashboard";
    if (lower.includes("admin") || activeRole === "admin") {
      target = "/admin-dashboard";
    } else if (lower.includes("dosen") || activeRole === "dosen") {
      target = "/dosen-dashboard";
    }

    performRedirect(target);
  };

  const handleQuickDemo = (demoEmail: string, demoRole: Role, targetPath: string) => {
    setActiveRole(demoRole);
    setEmail(demoEmail);
    setPassword("demo12345");
    setIsLoading(true);

    login(demoEmail, demoRole);

    // Direct browser navigation with brief feedback so user sees the active selection
    setTimeout(() => {
      performRedirect(targetPath);
    }, 150);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex items-center justify-center p-4 sm:p-6 relative font-['Outfit'] antialiased">
      <main className="w-full max-w-md p-8 sm:p-10 bg-white border border-slate-200 rounded-xl shadow-xs relative z-10 space-y-6">
        <div className="text-center">
          <div className="w-11 h-11 bg-blue-600 text-white rounded-lg mx-auto flex items-center justify-center font-bold text-base shadow-xs mb-3">
            NX
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang</h1>
          <p className="text-slate-500 mt-1 text-xs font-normal">
            Masuk ke platform pembelajaran adaptif <strong>NEXED AI</strong>
          </p>
        </div>

        {/* 1-Click Role Login Presets */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Pilih Cepat Role Pengguna:</span>
            <span className="text-blue-700 font-semibold bg-blue-100/70 px-2 py-0.5 rounded text-[10px]">
              1-Klik Masuk
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickDemo("mahasiswa@nexed.ai", "mahasiswa", "/dashboard")}
              className={`p-3 rounded-lg border text-xs font-semibold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer select-none active:scale-[0.98] ${
                activeRole === "mahasiswa"
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white hover:bg-blue-50/60 border-slate-200 text-slate-700 hover:text-blue-700"
              }`}
            >
              <span className="text-lg">🎓</span>
              <span>Mahasiswa</span>
              {activeRole === "mahasiswa" && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
                  ✓ Masuk...
                </span>
              )}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickDemo("dosen@nexed.ai", "dosen", "/dosen-dashboard")}
              className={`p-3 rounded-lg border text-xs font-semibold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer select-none active:scale-[0.98] ${
                activeRole === "dosen"
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white hover:bg-blue-50/60 border-slate-200 text-slate-700 hover:text-blue-700"
              }`}
            >
              <span className="text-lg">👨‍🏫</span>
              <span>Dosen</span>
              {activeRole === "dosen" && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
                  ✓ Masuk...
                </span>
              )}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickDemo("admin@nexed.ai", "admin", "/admin-dashboard")}
              className={`p-3 rounded-lg border text-xs font-semibold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer select-none active:scale-[0.98] ${
                activeRole === "admin"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
            >
              <span className="text-lg">🛡️</span>
              <span>Admin</span>
              {activeRole === "admin" && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
                  ✓ Masuk...
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="login-email-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Email Pengguna
            </label>
            <input
              id="login-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none text-slate-900 text-sm transition-colors placeholder-slate-400"
              placeholder="contoh: mahasiswa@nexed.ai"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="login-password-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Kata Sandi
              </label>
              <span className="text-[11px] text-blue-600 font-medium">Demo (Bebas)</span>
            </div>
            <input
              id="login-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none text-slate-900 text-sm transition-colors placeholder-slate-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg shadow-xs hover:shadow-sm transition-colors flex justify-center items-center text-sm cursor-pointer"
          >
            {isLoading ? "Sedang Mengalihkan..." : "Masuk ke Sistem"}
          </button>
        </form>
      </main>
    </div>
  );
}
