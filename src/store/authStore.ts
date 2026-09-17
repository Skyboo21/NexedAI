// src/store/authStore.ts
import { create } from "zustand";

type Role = "dosen" | "mahasiswa" | null;

interface AuthState {
  user: { email: string; role: Role } | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (email: string) => {
    // Simple logic: if email contains "dosen", assign dosen role, otherwise mahasiswa.
    const role: Role = email.toLowerCase().includes("dosen") ? "dosen" : "mahasiswa";

    // Set cookie for Next.js Middleware (Modul 6)
    if (typeof document !== "undefined") {
      document.cookie = `role=${role}; path=/; max-age=86400`;
    }

    set({ user: { email, role } });
  },

  logout: () => {
    if (typeof document !== "undefined") {
      document.cookie = `role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    set({ user: null });
  },
}));
