// src/views/UserProfile.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export default function UserProfile() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const activeUser = user || {
    email: "mahasiswa@nexed.ai",
    role: "mahasiswa" as const,
    name: "Muhammad Hariz",
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleBack = () => {
    if (activeUser.role === "admin") {
      router.push("/admin-dashboard");
    } else if (activeUser.role === "dosen") {
      router.push("/dosen-dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  let roleLabel = "Mahasiswa Aktif";
  if (activeUser.role === "admin") {
    roleLabel = "Super Administrator";
  } else if (activeUser.role === "dosen") {
    roleLabel = "Tenaga Pendidik / Dosen";
  }

  return (
    <div className="bg-[#FAFAFA] text-black min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 font-['Inter',sans-serif] antialiased">
      <div className="w-full max-w-2xl bg-white border border-black/8 rounded-3xl p-6 sm:p-10 shadow-xs hover:border-black/20 transition-all duration-300">
        {/* Back navigation button */}
        <button
          type="button"
          onClick={handleBack}
          className="text-neutral-500 hover:text-black flex items-center gap-2 text-xs font-medium mb-8 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>Kembali</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Kembali ke Portal Dashboard</span>
        </button>

        {/* User Identity Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-black/8 pb-8 mb-8">
          <div
            suppressHydrationWarning
            className="w-20 h-20 sm:w-24 sm:h-24 bg-black rounded-2xl flex items-center justify-center font-light text-white text-3xl shadow-sm shrink-0"
          >
            {activeUser.email.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <span
              suppressHydrationWarning
              className="inline-block text-[11px] font-mono font-medium px-3 py-1 rounded-full mb-2 uppercase tracking-wider bg-[#F4F4F6] text-black border border-black/10"
            >
              {roleLabel}
            </span>
            <h1
              suppressHydrationWarning
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight truncate"
            >
              {activeUser.name || activeUser.email.split("@")[0]}
            </h1>
            <p suppressHydrationWarning className="text-slate-500 text-sm mt-1 font-medium">
              {activeUser.email}
            </p>
          </div>
        </div>

        {/* User Metadata Grid - Bento Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">
              Status Akun & Verifikasi
            </div>
            <div className="text-emerald-700 font-semibold text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Terverifikasi Aktif (SSO UNS)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">
              {activeUser.role === "dosen"
                ? "Nomor Induk Pegawai (NIP)"
                : activeUser.role === "admin"
                  ? "ID Administrator"
                  : "Nomor Induk Mahasiswa (NIM)"}
            </div>
            <div className="text-slate-800 font-bold text-xs font-mono">
              {activeUser.nimOrNip ||
                (activeUser.role === "admin"
                  ? "ADM-001"
                  : activeUser.role === "dosen"
                    ? "198504122010121003"
                    : "M3124001")}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">
              Program Studi / Unit
            </div>
            <div className="text-slate-800 font-bold text-xs">
              {activeUser.prodi || "D3 Teknik Informatika SV UNS"}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">
              Hak Akses Portal
            </div>
            <div className="text-indigo-700 font-bold text-xs">{roleLabel}</div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="flex justify-end border-t border-slate-200/80 pt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-semibold py-2.5 px-5 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Keluar</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}
