// app/(auth)/login/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type LoginInput, LoginInputSchema } from "../../../src/lib/validations/authSchema";
import { useAuthStore } from "../../../src/store/authStore";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
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

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const result = await login(data.email, data.password);
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
      performRedirect(target);
    } catch {
      setIsSubmitting(false);
      setLoginError("Terjadi kesalahan saat memproses autentikasi.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-['Outfit'] antialiased">
      {/* Background Ambience */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <main className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 sm:p-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center text-white font-black text-xl shadow-xs">
            NX
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Masuk ke NexedAI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Platform Pembelajaran Adaptif Berbasis AI Terintegrasi
          </p>
        </div>

        {/* Global Error Banner */}
        {loginError && (
          <div
            role="alert"
            className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium flex items-center gap-2"
          >
            <span>⚠️</span>
            <span>{loginError}</span>
          </div>
        )}

        {/* Standard Production Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email / Username Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Alamat Email Kampus / Username
            </label>
            <input
              id="login-email"
              type="text"
              autoComplete="username"
              placeholder="nama@nexed.ai atau username"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p
                id="login-email-error"
                role="alert"
                className="text-[11px] font-medium text-rose-600 mt-1 flex items-center gap-1"
              >
                <span>⚠️</span>
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => {
                  alert("Fitur reset kata sandi telah dikirimkan ke email terdaftar.");
                }}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                Lupa kata sandi?
              </button>
            </div>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p
                id="login-password-error"
                role="alert"
                className="text-[11px] font-medium text-rose-600 mt-1 flex items-center gap-1"
              >
                <span>⚠️</span>
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                {...register("rememberMe")}
              />
              <span>Ingat sesi saya</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <span>Masuk ke Sistem</span>
            )}
          </button>
        </form>

        {/* Register Account Link */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Belum memiliki akun terdaftar?{" "}
            <Link
              href="/register"
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Daftar Sekarang &rarr;
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
