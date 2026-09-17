// src/pages/UserProfile.tsx

import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export default function UserProfile() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleBack = () => {
    if (user.role === "dosen") {
      router.push("/dosen");
    } else {
      router.push("/mahasiswa");
    }
  };

  return (
    <div className="bg-[#020617] text-slate-100 min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-['Outfit']">
      {/* Ambient Background */}
      <div className="absolute top-0 -left-40 w-[40rem] h-[40rem] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 -right-40 w-[40rem] h-[40rem] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-2xl p-8 sm:p-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl relative z-10 m-4">
        <button
          onClick={handleBack}
          className="text-slate-400 hover:text-white flex items-center space-x-2 text-sm font-bold mb-8 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Kembali ke Dashboard</span>
        </button>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-white/10 pb-8 mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center font-extrabold text-white shadow-xl shadow-purple-500/40 text-5xl border-4 border-white/10 relative overflow-hidden">
            {user.email.charAt(0).toUpperCase()}
            <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {user.role === "dosen" ? "Tenaga Pendidik" : "Mahasiswa Aktif"}
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 truncate">
              {user.email.split("@")[0]}
            </h1>
            <p className="text-slate-400 text-lg">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-black/30 p-5 rounded-2xl border border-white/5">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
              Status Akun
            </div>
            <div className="text-emerald-400 font-bold flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>{" "}
              Terverifikasi
            </div>
          </div>
          <div className="bg-black/30 p-5 rounded-2xl border border-white/5">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
              Bergabung Sejak
            </div>
            <div className="text-slate-200 font-bold">14 September 2026</div>
          </div>
        </div>

        <div className="flex justify-end border-t border-white/10 pt-8">
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-3 px-6 rounded-xl transition-all flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
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
