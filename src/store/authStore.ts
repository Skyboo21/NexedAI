// src/store/authStore.ts
import { create } from "zustand";
import type { Role, User } from "../lib/validations/authSchema";

export type { Role, User };

export interface RegisteredUserRecord {
  name: string;
  email: string;
  role: "mahasiswa" | "dosen" | "admin";
  nimOrNip?: string;
  password?: string;
  semester?: number;
  prodi?: string;
}

export interface AuthState {
  user: User | null;
  role: Role;
  token: string | null;
  isLoading: boolean;
  setRole: (role: Role) => void;
  login: (
    identifier: string,
    passwordOrRole?: string | Role,
    roleOverride?: Role,
  ) => Promise<{ success: boolean; user?: User; message?: string }>;
  registerAccount: (
    newUser: RegisteredUserRecord,
  ) => Promise<{ success: boolean; user?: User; message?: string }>;
  checkSession: () => Promise<User | null>;
  logout: () => Promise<void>;
}

// Safely get initial auth state on hydration
function getInitialAuth(): { user: User | null; role: Role; token: string | null } {
  if (typeof window === "undefined") {
    return { user: null, role: null, token: null };
  }

  try {
    const saved = localStorage.getItem("nexed_auth_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.role && parsed?.email) {
        return { user: parsed, role: parsed.role, token: "bff-session-active" };
      }
    }
  } catch {
    // ignore
  }

  try {
    const match = document.cookie.match(/(?:^|;\s*)nexed_session_role=([^;]+)/);
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
        email: `${cookieRole}@nexed.ai`,
        role: cookieRole,
        nimOrNip: cookieRole === "dosen" ? "198504122010121003" : "M3124001",
        semester: cookieRole === "mahasiswa" ? 4 : undefined,
        prodi: "D3 Teknik Informatika SV UNS",
      };
      return { user: defaultUser, role: cookieRole, token: "bff-session-active" };
    }
  } catch {
    // ignore
  }

  return { user: null, role: null, token: null };
}

const initialAuth = getInitialAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialAuth.user,
  role: initialAuth.role,
  token: initialAuth.token,
  isLoading: false,

  setRole: (newRole: Role) => {
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
        } else {
          localStorage.removeItem("nexed_auth_user");
        }
      }

      return {
        role: newRole,
        user: updatedUser,
      };
    });
  },

  checkSession: async (): Promise<User | null> => {
    try {
      set({ isLoading: true });
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          const validUser: User = data.user;
          if (typeof window !== "undefined") {
            localStorage.setItem("nexed_auth_user", JSON.stringify(validUser));
          }
          set({
            user: validUser,
            role: validUser.role,
            token: "bff-session-active",
            isLoading: false,
          });
          return validUser;
        }
      }
    } catch {
      // ignore
    } finally {
      set({ isLoading: false });
    }
    return null;
  },

  login: async (
    identifier: string,
    passwordOrRole?: string | Role,
    roleOverride?: Role,
  ): Promise<{ success: boolean; user?: User; message?: string }> => {
    set({ isLoading: true });

    // Determine password vs role parameter
    const isRoleArg =
      passwordOrRole === "mahasiswa" || passwordOrRole === "dosen" || passwordOrRole === "admin";
    const password = !isRoleArg && typeof passwordOrRole === "string" ? passwordOrRole : "";

    try {
      // Call BFF login route handler
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: identifier.trim(),
          password,
          rememberMe: true,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        set({ isLoading: false });
        return {
          success: false,
          message: data.message || "Email / Username atau Kata Sandi salah.",
        };
      }

      const userData: User = {
        name: data.user.name,
        email: data.user.email,
        role: (roleOverride || data.user.role) as "mahasiswa" | "dosen" | "admin",
        nimOrNip: data.user.nimOrNip,
        semester: data.user.semester,
        prodi: data.user.prodi,
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("nexed_auth_user", JSON.stringify(userData));
        } catch {
          // safe
        }
      }

      set({
        role: userData.role,
        user: userData,
        token: "bff-session-active",
        isLoading: false,
      });

      return {
        success: true,
        user: userData,
        message: data.message,
      };
    } catch (_err) {
      set({ isLoading: false });
      return {
        success: false,
        message: "Gagal menghubungi server otentikasi.",
      };
    }
  },

  registerAccount: async (
    newUser: RegisteredUserRecord,
  ): Promise<{ success: boolean; user?: User; message?: string }> => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          nimOrNip: newUser.nimOrNip,
          password: newUser.password ?? "",
          confirmPassword: newUser.password ?? "",
          semester: newUser.semester || 1,
          prodi: newUser.prodi || "D3 Teknik Informatika SV UNS",
          terms: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        set({ isLoading: false });
        return {
          success: false,
          message: data.message || "Pendaftaran gagal.",
        };
      }

      const userData: User = {
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        nimOrNip: data.user.nimOrNip,
        semester: data.user.semester,
        prodi: data.user.prodi,
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("nexed_auth_user", JSON.stringify(userData));
        } catch {
          // safe
        }
      }

      set({
        role: userData.role,
        user: userData,
        token: "bff-session-active",
        isLoading: false,
      });

      return {
        success: true,
        user: userData,
        message: data.message,
      };
    } catch {
      set({ isLoading: false });
      return {
        success: false,
        message: "Terjadi kesalahan saat pendaftaran akun.",
      };
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("nexed_auth_user");
        localStorage.removeItem("uns_auth_user");
        localStorage.removeItem("nexed_auth_token");
      } catch {
        // ignore
      }
    }

    set({ user: null, role: null, token: null, isLoading: false });
  },
}));
