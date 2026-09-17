// src/store/authStore.ts
import { create } from "zustand";

export type Role = "mahasiswa" | "dosen" | "admin" | null;

export interface User {
  email: string;
  role: Role;
  name?: string;
}

export interface AuthState {
  user: User | null;
  role: Role;
  setRole: (role: Role) => void;
  login: (email: string, roleOverride?: Role) => void;
  logout: () => void;
}

// Helper to safely get initial auth state from localStorage or cookies
function getInitialAuth(): { user: User | null; role: Role } {
  if (typeof window === "undefined") {
    return { user: null, role: null };
  }

  // 1. Check localStorage first
  try {
    const saved = localStorage.getItem("uns_auth_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.role) {
        return { user: parsed, role: parsed.role };
      }
    }
  } catch {
    // Ignore JSON errors
  }

  // 2. Check session cookies
  try {
    const match =
      document.cookie.match(/(?:^|;\s*)uns_session_role=([^;]+)/) ||
      document.cookie.match(/(?:^|;\s*)role=([^;]+)/);
    const cookieRole = (match ? match[1] : null) as Role;
    if (
      cookieRole &&
      (cookieRole === "mahasiswa" || cookieRole === "dosen" || cookieRole === "admin")
    ) {
      const defaultUser: User = {
        email:
          cookieRole === "admin"
            ? "admin@nexed.ai"
            : cookieRole === "dosen"
              ? "dosen@nexed.ai"
              : "mahasiswa@nexed.ai",
        role: cookieRole,
        name:
          cookieRole === "admin"
            ? "Admin Nexed"
            : cookieRole === "dosen"
              ? "Dr. Hendra Wijaya"
              : "Muhammad Hariz",
      };
      return { user: defaultUser, role: cookieRole };
    }
  } catch {
    // Ignore cookie errors
  }

  return { user: null, role: null };
}

const initialAuth = getInitialAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialAuth.user,
  role: initialAuth.role,

  setRole: (newRole: Role) => {
    if (typeof document !== "undefined") {
      if (newRole) {
        document.cookie = `uns_session_role=${newRole}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `role=${newRole}; path=/; max-age=86400; SameSite=Lax`;
      } else {
        document.cookie =
          "uns_session_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
        document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
      }
    }

    set((state) => {
      const updatedUser = state.user
        ? { ...state.user, role: newRole }
        : newRole
          ? {
              email: `${newRole}@nexed.ai`,
              role: newRole,
              name:
                newRole === "admin"
                  ? "Admin Nexed"
                  : newRole === "dosen"
                    ? "Dr. Hendra Wijaya"
                    : "Muhammad Hariz",
            }
          : null;

      if (typeof window !== "undefined") {
        if (updatedUser) {
          localStorage.setItem("uns_auth_user", JSON.stringify(updatedUser));
        } else {
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
    } else if (lower.includes("admin")) {
      resolvedRole = "admin";
    } else if (lower.includes("dosen")) {
      resolvedRole = "dosen";
    } else {
      resolvedRole = "mahasiswa";
    }

    const userData: User = {
      email,
      role: resolvedRole,
      name:
        resolvedRole === "admin"
          ? "Admin Nexed"
          : resolvedRole === "dosen"
            ? "Dr. Hendra Wijaya"
            : "Muhammad Hariz",
    };

    // Set cookies for Next.js Middleware Guard
    if (typeof document !== "undefined") {
      document.cookie = `uns_session_role=${resolvedRole}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `role=${resolvedRole}; path=/; max-age=86400; SameSite=Lax`;
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("uns_auth_user", JSON.stringify(userData));
      } catch {
        // Ignore storage errors
      }
    }

    set({
      role: resolvedRole,
      user: userData,
    });
  },

  logout: () => {
    if (typeof document !== "undefined") {
      document.cookie =
        "uns_session_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("uns_auth_user");
      } catch {
        // Ignore storage errors
      }
    }
    set({ user: null, role: null });
  },
}));
