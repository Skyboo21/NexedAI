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
    <div className="bg-slate-950 text-slate-200 min-h-screen flex items-center justify-center relative overflow-hidden font-['Outfit'] antialiased">
      {/* Ambient Background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-40 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-40 pointer-events-none" />

      <main className="w-full max-w-md p-8 sm:p-10 bg-slate-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl relative z-10 m-4 border-t border-white/20 border-b border-white/10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/40 text-2xl mb-4">
            NX
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Selamat Datang</h1>
          <p className="text-slate-400 mt-1.5 text-sm font-light">
            Masuk ke platform pembelajaran adaptif <strong>NEXED AI</strong>
          </p>
        </div>

        {/* 1-Click Role Login Presets */}
        <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Pilih Cepat Role Pengguna:</span>
            <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              1-Klik Masuk
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickDemo("mahasiswa@nexed.ai", "mahasiswa", "/dashboard")}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer select-none active:scale-95 ${
                activeRole === "mahasiswa"
                  ? "bg-purple-600 text-white border-purple-400 ring-2 ring-purple-500/50 shadow-lg shadow-purple-600/30"
                  : "bg-purple-600/15 hover:bg-purple-600/30 border-purple-500/30 text-purple-300 hover:text-white"
              }`}
            >
              <span className="text-xl">🎓</span>
              <span>Mahasiswa</span>
              {activeRole === "mahasiswa" && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                  ✓ Masuk...
                </span>
              )}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickDemo("dosen@nexed.ai", "dosen", "/dosen-dashboard")}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer select-none active:scale-95 ${
                activeRole === "dosen"
                  ? "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/50 shadow-lg shadow-blue-600/30"
                  : "bg-blue-600/15 hover:bg-blue-600/30 border-blue-500/30 text-blue-300 hover:text-white"
              }`}
            >
              <span className="text-xl">👨‍🏫</span>
              <span>Dosen</span>
              {activeRole === "dosen" && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                  ✓ Masuk...
                </span>
              )}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickDemo("admin@nexed.ai", "admin", "/admin-dashboard")}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer select-none active:scale-95 ${
                activeRole === "admin"
                  ? "bg-amber-600 text-white border-amber-400 ring-2 ring-amber-500/50 shadow-lg shadow-amber-600/30"
                  : "bg-amber-600/15 hover:bg-amber-600/30 border-amber-500/30 text-amber-300 hover:text-white"
              }`}
            >
              <span className="text-xl">🛡️</span>
              <span>Admin</span>
              {activeRole === "admin" && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                  ✓ Masuk...
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Pengguna
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black/40 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-white text-sm transition-all placeholder-slate-500"
              placeholder="contoh: mahasiswa@nexed.ai"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Kata Sandi
              </label>
              <span className="text-[11px] text-purple-400">Demo (Bebas)</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-white text-sm transition-all placeholder-slate-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center mt-3 cursor-pointer"
          >
            {isLoading ? "Sedang Mengalihkan..." : "Masuk ke Sistem"}
          </button>
        </form>
      </main>
    </div>
  );
}
