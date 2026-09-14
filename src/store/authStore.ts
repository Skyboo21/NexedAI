// src/store/authStore.ts
import { create } from 'zustand';

type Role = 'dosen' | 'mahasiswa' | null;

interface AuthState {
  user: { email: string; role: Role } | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  
  login: (email: string) => {
    // Simple logic: if email contains "dosen", assign dosen role, otherwise mahasiswa.
    const role: Role = email.toLowerCase().includes('dosen') ? 'dosen' : 'mahasiswa';
    set({ user: { email, role } });
  },
  
  logout: () => set({ user: null })
}));
