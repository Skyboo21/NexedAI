"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useAuthStore } from "../store/authStore";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    } else {
      router.push("/login");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        className ||
        "w-full flex items-center justify-center space-x-2 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 px-4 py-2.5 rounded-xl transition-all shadow-sm"
      }
    >
      <span>🚪</span>
      <span>Keluar</span>
    </button>
  );
}
