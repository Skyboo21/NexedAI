// src/views/UserProfile.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function UserProfile() {
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return (
      <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-['Outfit'] antialiased">
        <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-12 shadow-sm flex items-center justify-center">
          <div className="flex items-center gap-2.5 text-xs text-slate-500 font-semibold">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span>Memuat profil akun...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-['Outfit'] antialiased">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
        {/* Back navigation button */}
        <button
          type="button"
          onClick={handleBack}
          className="text-slate-600 hover:text-indigo-600 flex items-center gap-2 text-xs font-bold mb-8 transition-colors"
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
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-8 mb-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-4xl shadow-xs shrink-0">
            {activeUser.email.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
              {roleLabel}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
              {activeUser.name || activeUser.email.split("@")[0]}
            </h1>
            <p className="text-slate-500 text-sm mt-1">{activeUser.email}</p>
          </div>
        </div>

        {/* User Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
              Status Akun & Verifikasi
            </div>
            <div className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Terverifikasi Aktif (SSO UNS)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
              Terdaftar Dalam Sistem Sejak
            </div>
            <div className="text-slate-800 font-bold text-xs">14 September 2026</div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="flex justify-end border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-2.5 px-5 rounded-xl text-xs transition-colors flex items-center gap-2"
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
