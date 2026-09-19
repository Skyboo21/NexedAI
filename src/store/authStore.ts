// src/store/authStore.ts
import { create } from "zustand";
import type { Role, User } from "../lib/validations/authSchema";

export type { Role, User };

export interface AuthState {
  user: User | null;
  role: Role;
  token: string | null;
  setRole: (role: Role) => void;
  login: (email: string, roleOverride?: Role) => void;
  logout: () => void;
}

// Helper to safely get initial auth state from localStorage or cookies
function getInitialAuth(): { user: User | null; role: Role; token: string | null } {
  if (typeof window === "undefined") {
    return { user: null, role: null, token: null };
  }

  // 1. Cek localStorage terlebih dahulu
  try {
    const saved = localStorage.getItem("nexed_auth_user") || localStorage.getItem("uns_auth_user");
    const savedToken = localStorage.getItem("nexed_auth_token");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.role) {
        return { user: parsed, role: parsed.role, token: savedToken || "mock-jwt-token-2026" };
      }
    }
  } catch {
    // Abaikan error JSON parsing
  }

  // 2. Cek session cookie sebagai fallback
  try {
    const match =
      document.cookie.match(/(?:^|;\s*)nexed_session_role=([^;]+)/) ||
      document.cookie.match(/(?:^|;\s*)uns_session_role=([^;]+)/) ||
      document.cookie.match(/(?:^|;\s*)role=([^;]+)/);
    const cookieRole = (match ? match[1] : null) as Role;
    if (
      cookieRole &&
      (cookieRole === "mahasiswa" || cookieRole === "dosen" || cookieRole === "admin")
    ) {
      const defaultUser: User = {
        name:
          cookieRole === "dosen"
            ? "Dr. Ir. Hendra Wijaya, M.Kom."
            : cookieRole === "admin"
              ? "Administrator Sistem"
              : "Muhammad Hariz Lazuardi",
        email:
          cookieRole === "dosen"
            ? "dosen@nexed.ai"
            : cookieRole === "admin"
              ? "admin@nexed.ai"
              : "mahasiswa@nexed.ai",
        role: cookieRole,
        nimOrNip: cookieRole === "dosen" ? "198504122010121003" : "M3124001",
        semester: cookieRole === "mahasiswa" ? 4 : undefined,
        prodi: "D3 Teknik Informatika SV UNS",
      };
      return { user: defaultUser, role: cookieRole, token: "mock-jwt-token-2026" };
    }
  } catch {
    // Abaikan error cookie
  }

  return { user: null, role: null, token: null };
}

const initialAuth = getInitialAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialAuth.user,
  role: initialAuth.role,
  token: initialAuth.token,

  setRole: (newRole: Role) => {
    if (typeof document !== "undefined") {
      if (newRole) {
        document.cookie = `nexed_session_role=${newRole}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `uns_session_role=${newRole}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `role=${newRole}; path=/; max-age=86400; SameSite=Lax`;
      } else {
        document.cookie =
          "nexed_session_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
        document.cookie =
          "uns_session_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
        document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
      }
    }

    set((state) => {
      const updatedUser: User | null = newRole
        ? state.user
          ? { ...state.user, role: newRole }
          : {
              name:
                newRole === "dosen"
                  ? "Dr. Ir. Hendra Wijaya, M.Kom."
                  : newRole === "admin"
                    ? "Administrator Sistem"
                    : "Muhammad Hariz Lazuardi",
              email: `${newRole}@nexed.ai`,
              role: newRole,
              nimOrNip: newRole === "dosen" ? "198504122010121003" : "M3124001",
            }
        : null;

      if (typeof window !== "undefined") {
        if (updatedUser) {
          localStorage.setItem("nexed_auth_user", JSON.stringify(updatedUser));
          localStorage.setItem("uns_auth_user", JSON.stringify(updatedUser));
        } else {
          localStorage.removeItem("nexed_auth_user");
          localStorage.removeItem("uns_auth_user");
        }
      }

      return {
        role: newRole,
        user: updatedUser,
      };
    });
  },

  login: (email: string, roleOverride?: Role) => {
    let resolvedRole: Role = "mahasiswa";
    const lower = email.toLowerCase();

    if (roleOverride) {
      resolvedRole = roleOverride;
    } else if (lower.includes("dosen")) {
      resolvedRole = "dosen";
    } else if (lower.includes("admin")) {
      resolvedRole = "admin";
    } else {
      resolvedRole = "mahasiswa";
    }

    const userData: User = {
      name:
        resolvedRole === "dosen"
          ? "Dr. Ir. Hendra Wijaya, M.Kom."
          : resolvedRole === "admin"
            ? "Administrator Sistem"
            : "Muhammad Hariz Lazuardi",
      email,
      role: resolvedRole,
      nimOrNip: resolvedRole === "dosen" ? "198504122010121003" : "M3124001",
      semester: resolvedRole === "mahasiswa" ? 4 : undefined,
      prodi: "D3 Teknik Informatika SV UNS",
    };

    const mockToken = `jwt_nexed_${resolvedRole}_${Date.now()}`;

    // Set cookie untuk Next.js Server-Side Middleware Guard
    if (typeof document !== "undefined") {
      document.cookie = `nexed_session_role=${resolvedRole}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `uns_session_role=${resolvedRole}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `role=${resolvedRole}; path=/; max-age=86400; SameSite=Lax`;
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("nexed_auth_user", JSON.stringify(userData));
        localStorage.setItem("uns_auth_user", JSON.stringify(userData));
        localStorage.setItem("nexed_auth_token", mockToken);
      } catch {
        // Abaikan error penyimpanan lokal
      }
    }

    set({
      role: resolvedRole,
      user: userData,
      token: mockToken,
    });
  },

  logout: () => {
    if (typeof document !== "undefined") {
      document.cookie =
        "nexed_session_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
      document.cookie =
        "uns_session_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("nexed_auth_user");
        localStorage.removeItem("uns_auth_user");
        localStorage.removeItem("nexed_auth_token");
      } catch {
        // Abaikan error penyimpanan lokal
      }
    }
    set({ user: null, role: null, token: null });
  },
}));
