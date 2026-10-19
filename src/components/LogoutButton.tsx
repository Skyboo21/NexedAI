"use client";

import { useAuthStore } from "../store/authStore";
import { LogOut } from "lucide-react";

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
        "w-full flex items-center justify-center space-x-2 text-xs font-semibold text-neutral-800 bg-[#F4F4F6] hover:bg-neutral-200 border border-black/10 px-4 py-2.5 rounded-full transition-all shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-black"
      }
    >
      <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
      <span>Keluar dari Akun</span>
    </button>
  );
}
