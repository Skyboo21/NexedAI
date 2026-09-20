// src/lib/server/userRegistry.ts
/**
 * Server-Side User Registry & Secure Password Verifier.
 * This runs exclusively on server runtime (Node.js / Route Handlers),
 * keeping sensitive credentials and hashing logic safe from client bundles.
 */

export interface ServerUserRecord {
  id: string;
  name: string;
  email: string;
  role: "mahasiswa" | "dosen" | "admin";
  nimOrNip?: string;
  passwordHash: string;
  salt: string;
  semester?: number;
  prodi?: string;
  createdAt: string;
}

// In-memory server registry (persists during server lifetime)
const SERVER_USERS: Map<string, ServerUserRecord> = new Map();

/**
 * Hash a password using PBKDF2 or SHA-256 + Salt via Web Crypto
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateSalt(): string {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Initialize seed users
let isInitialized = false;

export async function initServerUserRegistry() {
  if (isInitialized) return;

  const defaultUsers = [
    {
      id: "usr_mhs_001",
      name: "Muhammad Hariz Lazuardi",
      email: "mahasiswa@nexed.ai",
      role: "mahasiswa" as const,
      nimOrNip: "M3124001",
      semester: 4,
      prodi: "D3 Teknik Informatika SV UNS",
      password: "password123",
    },
    {
      id: "usr_dsn_001",
      name: "Dr. Ir. Hendra Wijaya, M.Kom.",
      email: "dosen@nexed.ai",
      role: "dosen" as const,
      nimOrNip: "198504122010121003",
      prodi: "D3 Teknik Informatika SV UNS",
      password: "password123",
    },
    {
      id: "usr_adm_001",
      name: "Administrator Sistem",
      email: "admin@nexed.ai",
      role: "admin" as const,
      nimOrNip: "ADM-001",
      prodi: "D3 Teknik Informatika SV UNS",
      password: "password123",
    },
  ];

  for (const u of defaultUsers) {
    const salt = generateSalt();
    const passwordHash = await hashPassword(u.password, salt);
    const userRecord: ServerUserRecord = {
      id: u.id,
      name: u.name,
      email: u.email.toLowerCase(),
      role: u.role,
      nimOrNip: u.nimOrNip,
      passwordHash,
      salt,
      semester: u.semester,
      prodi: u.prodi,
      createdAt: new Date().toISOString(),
    };
    SERVER_USERS.set(userRecord.email, userRecord);
  }

  isInitialized = true;
}

/**
 * Find user by email, NIM, or username prefix
 */
export async function findUserByIdentifier(identifier: string): Promise<ServerUserRecord | null> {
  await initServerUserRegistry();
  const cleanId = identifier.trim().toLowerCase();

  for (const user of SERVER_USERS.values()) {
    if (
      user.email === cleanId ||
      user.email.split("@")[0] === cleanId ||
      (user.nimOrNip && user.nimOrNip.toLowerCase() === cleanId) ||
      user.name.toLowerCase() === cleanId
    ) {
      return user;
    }
  }

  return null;
}

/**
 * Verify user password against stored salt and hash
 */
export async function verifyUserCredentials(
  identifier: string,
  plainPassword: string,
): Promise<ServerUserRecord | null> {
  const user = await findUserByIdentifier(identifier);
  if (!user) return null;

  const inputHash = await hashPassword(plainPassword, user.salt);
  if (inputHash === user.passwordHash) {
    return user;
  }

  return null;
}

/**
 * Register a new user securely on the server
 */
export async function registerServerUser(params: {
  name: string;
  email: string;
  role: "mahasiswa" | "dosen" | "admin";
  nimOrNip?: string;
  password: string;
  semester?: number;
  prodi?: string;
}): Promise<ServerUserRecord> {
  await initServerUserRegistry();

  const cleanEmail = params.email.trim().toLowerCase();
  const existing = await findUserByIdentifier(cleanEmail);
  if (existing) {
    throw new Error("Email atau identitas sudah terdaftar dalam sistem.");
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(params.password, salt);

  const newUser: ServerUserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: params.name.trim(),
    email: cleanEmail,
    role: params.role,
    nimOrNip: params.nimOrNip?.trim(),
    passwordHash,
    salt,
    semester: params.semester || 1,
    prodi: params.prodi || "D3 Teknik Informatika SV UNS",
    createdAt: new Date().toISOString(),
  };

  SERVER_USERS.set(cleanEmail, newUser);
  return newUser;
}
