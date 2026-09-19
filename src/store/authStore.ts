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

export const DEFAULT_REGISTERED_USERS: RegisteredUserRecord[] = [
  {
    name: "Muhammad Hariz Lazuardi",
    email: "mahasiswa@nexed.ai",
    role: "mahasiswa",
    nimOrNip: "M3124001",
    semester: 4,
    prodi: "D3 Teknik Informatika SV UNS",
    password: "password123",
  },
  {
    name: "Dr. Ir. Hendra Wijaya, M.Kom.",
    email: "dosen@nexed.ai",
    role: "dosen",
    nimOrNip: "198504122010121003",
    prodi: "D3 Teknik Informatika SV UNS",
    password: "password123",
  },
  {
    name: "Administrator Sistem",
    email: "admin@nexed.ai",
    role: "admin",
    nimOrNip: "ADM-001",
    prodi: "D3 Teknik Informatika SV UNS",
    password: "password123",
  },
];

export function getRegisteredUsers(): RegisteredUserRecord[] {
  if (typeof window === "undefined") return DEFAULT_REGISTERED_USERS;
  try {
    const raw = localStorage.getItem("nexed_registered_users");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_REGISTERED_USERS;
}

export function saveRegisteredUser(newUser: RegisteredUserRecord) {
  if (typeof window === "undefined") return;
  try {
    const users = getRegisteredUsers();
    // Filter out jika email sudah ada agar diperbarui
    const filtered = users.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase());
    filtered.push(newUser);
    localStorage.setItem("nexed_registered_users", JSON.stringify(filtered));
  } catch {
    // fallback
  }
}

export interface AuthState {
  user: User | null;
  role: Role;
  token: string | null;
  setRole: (role: Role) => void;
  login: (identifier: string, passwordOrRole?: string | Role, roleOverride?: Role) => User;
  registerAccount: (newUser: RegisteredUserRecord) => User;
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

  login: (identifier: string, passwordOrRole?: string | Role, roleOverride?: Role): User => {
    const cleanId = identifier.trim().toLowerCase();
    const registeredList = getRegisteredUsers();

    // Deteksi apakah parameter kedua adalah roleOverride atau kata sandi
    const isRoleArg =
      passwordOrRole === "mahasiswa" || passwordOrRole === "dosen" || passwordOrRole === "admin";
    const explicitRole = roleOverride || (isRoleArg ? (passwordOrRole as Role) : undefined);

    // 1. Cari kecocokan di database akun terdaftar (berdasarkan email lengkap, username depan, atau nama)
    const foundUser = registeredList.find((u) => {
      const emailMatch = u.email.toLowerCase() === cleanId;
      const usernameMatch = u.email.split("@")[0]?.toLowerCase() === cleanId;
      const nameMatch = u.name.toLowerCase() === cleanId;
      return emailMatch || usernameMatch || nameMatch;
    });

    let resolvedRole: Role = explicitRole || "mahasiswa";
    let userData: User;

    if (foundUser) {
      resolvedRole = foundUser.role;
      userData = {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        nimOrNip:
          foundUser.nimOrNip || (foundUser.role === "dosen" ? "198504122010121003" : "M3124001"),
        semester: foundUser.semester || (foundUser.role === "mahasiswa" ? 4 : undefined),
        prodi: foundUser.prodi || "D3 Teknik Informatika SV UNS",
      };
    } else {
      // Fallback jika login dengan email baru yang belum ada di registry
      if (explicitRole) {
        resolvedRole = explicitRole;
      } else if (cleanId.includes("dosen")) {
        resolvedRole = "dosen";
      } else if (cleanId.includes("admin")) {
        resolvedRole = "admin";
      } else {
        resolvedRole = "mahasiswa";
      }

      const prefix = identifier.split("@")[0] || identifier;
      const formattedName = prefix
        .replace(/[._-]/g, " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      userData = {
        name:
          resolvedRole === "dosen"
            ? "Dr. Ir. Hendra Wijaya, M.Kom."
            : resolvedRole === "admin"
              ? "Administrator Sistem"
              : formattedName || "Pengguna NexedAI",
        email: identifier.includes("@") ? identifier : `${identifier}@nexed.ai`,
        role: resolvedRole,
        nimOrNip: resolvedRole === "dosen" ? "198504122010121003" : "M3124001",
        semester: resolvedRole === "mahasiswa" ? 4 : undefined,
        prodi: "D3 Teknik Informatika SV UNS",
      };
    }

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

    return userData;
  },

  registerAccount: (newUser: RegisteredUserRecord): User => {
    saveRegisteredUser(newUser);

    const resolvedRole = newUser.role;
    const userData: User = {
      name: newUser.name,
      email: newUser.email,
      role: resolvedRole,
      nimOrNip: newUser.nimOrNip,
      semester: newUser.role === "mahasiswa" ? newUser.semester || 1 : undefined,
      prodi: newUser.prodi || "D3 Teknik Informatika SV UNS",
    };

    const mockToken = `jwt_nexed_${resolvedRole}_${Date.now()}`;

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
        // safe
      }
    }

    set({
      role: resolvedRole,
      user: userData,
      token: mockToken,
    });

    return userData;
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
