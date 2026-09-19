// app/(auth)/register/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type RegisterInput, RegisterInputSchema } from "../../../src/lib/validations/authSchema";
import { useAuthStore } from "../../../src/store/authStore";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterInputSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "mahasiswa",
      nimOrNip: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = (data: RegisterInput) => {
    setIsSubmitting(true);
    setRegisterError(null);

    try {
      // Simulate account registration & initialize user session
      login(data.email, data.role);

      // Save newly registered user details
      if (typeof window !== "undefined") {
        const newUser = {
          name: data.name,
          email: data.email,
          role: data.role,
          nimOrNip: data.nimOrNip,
          semester: data.role === "mahasiswa" ? 1 : undefined,
          prodi: "D3 Teknik Informatika SV UNS",
        };
        localStorage.setItem("nexed_auth_user", JSON.stringify(newUser));
        localStorage.setItem("uns_auth_user", JSON.stringify(newUser));
      }

      setSuccessMessage("Pendaftaran akun berhasil! Mengalihkan ke portal Anda...");

      setTimeout(() => {
        if (data.role === "dosen") {
          router.push("/dosen-dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 1000);
    } catch {
      setIsSubmitting(false);
      setRegisterError("Terjadi kesalahan saat memproses registrasi akun.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-['Outfit'] antialiased">
      {/* Background Ambience */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <main className="w-full max-w-lg bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 sm:p-10 space-y-6 my-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center text-white font-black text-xl shadow-xs">
            NX
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Daftar Akun Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Bergabung ke Platform Pembelajaran Adaptif AI NexedAI
          </p>
        </div>

        {/* Global Feedback Banners */}
        {registerError && (
          <div
            role="alert"
            className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium flex items-center gap-2"
          >
            <span>⚠️</span>
            <span>{registerError}</span>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2"
          >
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-name"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              id="register-name"
              type="text"
              placeholder="Contoh: Muhammad Hariz"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              }`}
              {...register("name")}
            />
            {errors.name && (
              <p
                role="alert"
                className="text-[11px] font-medium text-rose-600 mt-1 flex items-center gap-1"
              >
                <span>⚠️</span>
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-email"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Alamat Email Kampus <span className="text-rose-500">*</span>
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="nama@nexed.ai"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p
                role="alert"
                className="text-[11px] font-medium text-rose-600 mt-1 flex items-center gap-1"
              >
                <span>⚠️</span>
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Role & NIM/NIP Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Role Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="register-role"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                Peran Pengguna
              </label>
              <select
                id="register-role"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                {...register("role")}
              >
                <option value="mahasiswa">🎓 Mahasiswa</option>
                <option value="dosen">👨‍🏫 Dosen Pengampu</option>
              </select>
            </div>

            {/* NIM / NIP Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="register-nim"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                NIM / NIP <span className="text-rose-500">*</span>
              </label>
              <input
                id="register-nim"
                type="text"
                placeholder="M3124001 / 1985..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.nimOrNip
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                }`}
                {...register("nimOrNip")}
              />
              {errors.nimOrNip && (
                <p
                  role="alert"
                  className="text-[11px] font-medium text-rose-600 mt-1 flex items-center gap-1"
                >
                  <span>⚠️</span>
                  <span>{errors.nimOrNip.message}</span>
                </p>
              )}
            </div>
          </div>

          {/* Password Fields Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="register-password"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <input
                id="register-password"
                type="password"
                placeholder="Minimal 6 karakter"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                }`}
                {...register("password")}
              />
              {errors.password && (
                <p
                  role="alert"
                  className="text-[11px] font-medium text-rose-600 mt-1 flex items-center gap-1"
                >
                  <span>⚠️</span>
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="register-confirm-password"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                Ulangi Sandi <span className="text-rose-500">*</span>
              </label>
              <input
                id="register-confirm-password"
                type="password"
                placeholder="Ketik ulang sandi"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                }`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p
                  role="alert"
                  className="text-[11px] font-medium text-rose-600 mt-1 flex items-center gap-1"
                >
                  <span>⚠️</span>
                  <span>{errors.confirmPassword.message}</span>
                </p>
              )}
            </div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="pt-1">
            <label className="flex items-start space-x-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5 shrink-0"
                {...register("terms")}
              />
              <span>
                Saya menyetujui Ketentuan Layanan dan Kebijakan Privasi platform pembelajaran
                NexedAI.
              </span>
            </label>
            {errors.terms && (
              <p
                role="alert"
                className="text-[11px] font-medium text-rose-600 mt-1 flex items-center gap-1"
              >
                <span>⚠️</span>
                <span>{errors.terms.message}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses Akun Baru...</span>
              </>
            ) : (
              <span>Daftarkan Akun Sekarang</span>
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Sudah memiliki akun terdaftar?{" "}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Masuk di sini &rarr;
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
