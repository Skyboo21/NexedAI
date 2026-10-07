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
  const registerAccount = useAuthStore((state) => state.registerAccount);
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

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    setRegisterError(null);

    try {
      const result = await registerAccount({
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role,
        nimOrNip: data.nimOrNip.trim(),
        password: data.password,
        semester: data.role === "mahasiswa" ? 1 : undefined,
        prodi: "D3 Teknik Informatika SV UNS",
      });

      if (!result.success) {
        setIsSubmitting(false);
        setRegisterError(result.message || "Pendaftaran akun gagal.");
        return;
      }

      setSuccessMessage("Pendaftaran akun berhasil! Mengalihkan ke portal Anda...");

      setTimeout(() => {
        if (data.role === "dosen") {
          router.push("/dosen-dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 800);
    } catch {
      setIsSubmitting(false);
      setRegisterError("Terjadi kesalahan saat memproses registrasi akun.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] bento-bg-grid flex items-center justify-center p-4 sm:p-6 lg:p-12 font-['Inter',sans-serif] text-black antialiased">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SISI KIRI: BENTO PREVIEW CARDS (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col gap-4">
          {/* Card 1: Modular Roadmap Perkuliahan */}
          <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-xs hover:border-black/20 transition-all duration-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-[#F4F4F6] text-black/80 border border-black/8 font-mono text-xs px-2.5 py-1 rounded-full">
                🗺️ Kurikulum Berbasis AI
              </span>
              <span className="text-xs font-mono text-black/50">D3 TI UNS</span>
            </div>
            <h4 className="text-black font-medium text-base tracking-tight">
              Roadmap Belajar Terpersonalisasi
            </h4>
            <p className="text-black/60 text-xs leading-relaxed">
              Materi praktikum otomatis dipecah menjadi modul adaptif, flashcard recall, dan kuis diagnostik yang menyesuaikan ritme belajar Anda.
            </p>
          </div>

          {/* Card 2: AI Retrieval Speed & Tutor */}
          <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-xs hover:border-black/20 transition-all duration-300 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F4F6] border border-black/8 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
              🤖
            </div>
            <div className="space-y-1">
              <span className="bg-black text-white text-[11px] font-mono px-2 py-0.5 rounded-full">
                Real-time Feedback
              </span>
              <h5 className="text-black font-medium text-sm tracking-tight">AI Teaching Assistant 24/7</h5>
              <p className="text-black/55 text-xs">Tanya jawab modul langsung dari materi perkuliahan resmi.</p>
            </div>
          </div>

          {/* Card 3: Keamanan & Integritas Kampus */}
          <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-xs hover:border-black/20 transition-all duration-300 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-black text-sm">🔒</span>
              <span className="text-black font-medium text-xs uppercase tracking-wider font-mono">
                Keamanan Terverifikasi
              </span>
            </div>
            <p className="text-black/60 text-xs leading-relaxed">
              Data pengerjaan, skor pemahaman, dan analitik Anda disimpan secara terenkripsi dengan standar enkripsi PBKDF2.
            </p>
          </div>
        </div>

        {/* SISI KANAN: BENTO FORM REGISTRATION */}
        <div className="lg:col-span-7">
          <main className="w-full bg-white border border-black/8 rounded-3xl shadow-xs hover:border-black/20 transition-all duration-300 p-8 sm:p-10 space-y-6">
            {/* Brand Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g transform="rotate(-35 12 12)">
                      <rect x="5" y="3.5" width="4.5" height="17" rx="2.25" fill="#ffffff" />
                      <rect x="14.5" y="3.5" width="4.5" height="17" rx="2.25" fill="#ffffff" />
                    </g>
                  </svg>
                </div>
                <span className="font-semibold text-black tracking-tight text-lg">
                  Nexed<span className="font-light">AI</span>
                </span>
                <span className="bg-[#F4F4F6] text-black/75 border border-black/8 font-mono text-xs px-2.5 py-0.5 rounded-full ml-auto">
                  Registrasi Akun
                </span>
              </div>
              <h1 className="text-2xl font-light tracking-tight text-black pt-2">
                Daftar Akun Baru
              </h1>
              <p className="text-black/55 text-xs font-normal">
                Mulai pengalaman belajar adaptif bersama NexedAI
              </p>
            </div>

            {/* Global Feedback Banners */}
            {registerError && (
              <div
                role="alert"
                className="p-3.5 bg-neutral-100 border border-black/15 rounded-2xl text-black text-xs font-medium flex items-center gap-2"
              >
                <span>⚠️</span>
                <span>{registerError}</span>
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="p-3.5 bg-neutral-100 border border-black/15 rounded-2xl text-black text-xs font-medium flex items-center gap-2"
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
                  className="block text-black/60 font-mono text-xs uppercase tracking-wider"
                >
                  Nama Lengkap <span className="text-black">*</span>
                </label>
                <input
                  id="register-name"
                  type="text"
                  placeholder="Contoh: Muhammad Hariz"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-black placeholder:text-black/35 bg-white focus:outline-none transition-colors ${
                    errors.name
                      ? "border-black focus:ring-1 focus:ring-black"
                      : "border-black/10 focus:border-black focus:ring-1 focus:ring-black"
                  }`}
                  {...register("name")}
                />
                {errors.name && (
                  <p role="alert" className="text-[11px] font-medium text-neutral-800 mt-1 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{errors.name.message}</span>
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-email"
                  className="block text-black/60 font-mono text-xs uppercase tracking-wider"
                >
                  Alamat Email Kampus <span className="text-black">*</span>
                </label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="nama@nexed.ai"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-black placeholder:text-black/35 bg-white focus:outline-none transition-colors ${
                    errors.email
                      ? "border-black focus:ring-1 focus:ring-black"
                      : "border-black/10 focus:border-black focus:ring-1 focus:ring-black"
                  }`}
                  {...register("email")}
                />
                {errors.email && (
                  <p role="alert" className="text-[11px] font-medium text-neutral-800 mt-1 flex items-center gap-1">
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
                    className="block text-black/60 font-mono text-xs uppercase tracking-wider"
                  >
                    Peran Pengguna
                  </label>
                  <select
                    id="register-role"
                    className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-white text-xs text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    {...register("role")}
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="dosen">Dosen Pengampu</option>
                  </select>
                </div>

                {/* NIM / NIP Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="register-nim"
                    className="block text-black/60 font-mono text-xs uppercase tracking-wider"
                  >
                    NIM / NIP <span className="text-black">*</span>
                  </label>
                  <input
                    id="register-nim"
                    type="text"
                    placeholder="M3124001 / 1985..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-black placeholder:text-black/35 bg-white focus:outline-none transition-colors ${
                      errors.nimOrNip
                        ? "border-black focus:ring-1 focus:ring-black"
                        : "border-black/10 focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                    {...register("nimOrNip")}
                  />
                  {errors.nimOrNip && (
                    <p role="alert" className="text-[11px] font-medium text-neutral-800 mt-1 flex items-center gap-1">
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
                    className="block text-black/60 font-mono text-xs uppercase tracking-wider"
                  >
                    Kata Sandi <span className="text-black">*</span>
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-black placeholder:text-black/35 bg-white focus:outline-none transition-colors ${
                      errors.password
                        ? "border-black focus:ring-1 focus:ring-black"
                        : "border-black/10 focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p role="alert" className="text-[11px] font-medium text-neutral-800 mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{errors.password.message}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="register-confirm-password"
                    className="block text-black/60 font-mono text-xs uppercase tracking-wider"
                  >
                    Ulangi Sandi <span className="text-black">*</span>
                  </label>
                  <input
                    id="register-confirm-password"
                    type="password"
                    placeholder="Ketik ulang sandi"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-black placeholder:text-black/35 bg-white focus:outline-none transition-colors ${
                      errors.confirmPassword
                        ? "border-black focus:ring-1 focus:ring-black"
                        : "border-black/10 focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p role="alert" className="text-[11px] font-medium text-neutral-800 mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{errors.confirmPassword.message}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="pt-1">
                <label className="flex items-start space-x-2 text-xs text-black/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-black/20 text-black focus:ring-black mt-0.5 shrink-0 accent-black"
                    {...register("terms")}
                  />
                  <span>
                    Saya menyetujui Ketentuan Layanan dan Kebijakan Privasi platform pembelajaran NexedAI.
                  </span>
                </label>
                {errors.terms && (
                  <p role="alert" className="text-[11px] font-medium text-neutral-800 mt-1 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{errors.terms.message}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-medium text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
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
            <div className="pt-4 border-t border-black/8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-black/60">
              <p>
                Sudah memiliki akun terdaftar?{" "}
                <Link
                  href="/login"
                  className="font-medium text-black underline underline-offset-4 hover:text-black/70"
                >
                  Masuk di sini &rarr;
                </Link>
              </p>
              <Link href="/" className="hover:text-black transition-colors">
                &larr; Kembali ke Beranda
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
