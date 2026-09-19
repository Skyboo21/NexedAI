// app/(auth)/login/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type LoginInput,
  LoginInputSchema,
  type Role,
} from "../../../src/lib/validations/authSchema";
import { useAuthStore } from "../../../src/store/authStore";

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginInputSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const performRedirect = (targetPath: string) => {
    if (typeof window !== "undefined") {
      window.location.href = targetPath;
    }
  };

  const onSubmit = (data: LoginInput) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      login(data.email, activeRole || undefined);
      const lower = data.email.toLowerCase();
      let target = "/dashboard";
      if (lower.includes("dosen") || activeRole === "dosen") {
        target = "/dosen-dashboard";
      } else if (lower.includes("admin") || activeRole === "admin") {
        target = "/admin-dashboard";
      }
      performRedirect(target);
    } catch {
      setIsSubmitting(false);
      setLoginError("Terjadi kesalahan saat memproses autentikasi.");
    }
  };

  const handleQuickRole = (emailValue: string, role: Role, targetPath: string) => {
    setActiveRole(role);
    setValue("email", emailValue, { shouldValidate: true });
    setValue("password", "sandirahasia2026", { shouldValidate: true });
    setIsSubmitting(true);

    login(emailValue, role);

    setTimeout(() => {
      performRedirect(targetPath);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-['Outfit'] antialiased">
      {/* Decorative Light Theme Ambient Accents */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <main className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 sm:p-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center text-white font-black text-xl shadow-sm shadow-indigo-200">
            NX
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Masuk ke NexedAI
          </h1>
          <p className="text-sm text-slate-500 font-normal">
            Platform Pembelajaran Adaptif Berbasis AI Terintegrasi
          </p>
        </div>

        {/* 1-Click Role Login Presets */}
        <section
          aria-labelledby="role-select-heading"
          className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-2.5"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span id="role-select-heading">Pilih Cepat Akses Demo (RBAC)</span>
            <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              1-Klik Masuk
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickRole("mahasiswa@nexed.ai", "mahasiswa", "/dashboard")}
              className={`p-3 rounded-xl border text-xs font-semibold text-center flex flex-col items-center gap-1 transition-all cursor-pointer select-none active:scale-95 ${
                activeRole === "mahasiswa"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="text-lg">🎓</span>
              <span>Mahasiswa</span>
              <span
                className={`text-[10px] ${activeRole === "mahasiswa" ? "text-indigo-100" : "text-slate-400"}`}
              >
                {activeRole === "mahasiswa" ? "Mengalihkan..." : "Portal Belajar"}
              </span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickRole("dosen@nexed.ai", "dosen", "/dosen-dashboard")}
              className={`p-3 rounded-xl border text-xs font-semibold text-center flex flex-col items-center gap-1 transition-all cursor-pointer select-none active:scale-95 ${
                activeRole === "dosen"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="text-lg">👨‍🏫</span>
              <span>Dosen</span>
              <span
                className={`text-[10px] ${activeRole === "dosen" ? "text-indigo-100" : "text-slate-400"}`}
              >
                {activeRole === "dosen" ? "Mengalihkan..." : "Analitik Kelas"}
              </span>
            </button>
          </div>
        </section>

        {loginError && (
          <div
            role="alert"
            className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium"
          >
            {loginError}
          </div>
        )}

        {/* Manual Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="email-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Alamat Email Kampus
            </label>
            <input
              id="email-input"
              type="email"
              autoComplete="email"
              placeholder="contoh: mahasiswa@nexed.ai"
              {...register("email")}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-slate-900 text-sm placeholder-slate-400 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                errors.email
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 focus:border-indigo-500"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-rose-600 font-medium" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Kata Sandi
              </label>
              <span className="text-xs text-slate-400 font-normal">Demo: bebas</span>
            </div>
            <input
              id="password-input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-slate-900 text-sm placeholder-slate-400 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                errors.password
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 focus:border-indigo-500"
              }`}
            />
            {errors.password && (
              <p className="text-xs text-rose-600 font-medium" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Ingat sesi saya</span>
            </label>
            <span className="text-indigo-600 hover:text-indigo-700 cursor-pointer font-medium">
              Lupa kata sandi?
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none cursor-pointer text-sm"
          >
            {isSubmitting ? "Memverifikasi Kredensial..." : "Masuk ke Sistem"}
          </button>
        </form>

        {/* Security & Standard Footer Note */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            D3 Teknik Informatika SV UNS &bull; Proteksi OWASP & Strict RBAC 2026
          </p>
        </div>
      </main>
    </div>
  );
}
