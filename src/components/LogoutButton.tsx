"use client";

import { useAuthStore } from "../store/authStore";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Keluar dari akun"
      className={
        className ||
        "w-full flex items-center justify-center space-x-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500"
      }
    >
      <span aria-hidden="true">🚪</span>
      <span>Keluar dari Akun</span>
    </button>
  );
}
