// src/lib/server/authHelper.ts
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./sessionToken";
import { prisma, isDatabaseConfigured } from "./db";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  nimOrNip?: string;
}

export async function getSessionUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  let token = request.cookies?.get?.("nexed_session_token")?.value;
  if (!token) {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/nexed_session_token=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  // Support explicit x-user-email header if session cookie is not set
  const headerEmail = request.headers.get("x-user-email");
  if (!token && headerEmail && prisma && isDatabaseConfigured()) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: headerEmail.trim().toLowerCase() },
        select: { id: true, email: true, name: true, role: true, nimOrNip: true },
      });
      if (dbUser) {
        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          nimOrNip: dbUser.nimOrNip ?? undefined,
        };
      }
    } catch {}
  }

  if (token) {
    const session = await verifySessionToken(token);
    if (session) {
      // Find actual user ID in PostgreSQL database by email if needed
      if (prisma && isDatabaseConfigured()) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.email.toLowerCase() },
            select: { id: true, email: true, name: true, role: true, nimOrNip: true },
          });
          if (dbUser) {
            return {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              role: dbUser.role,
              nimOrNip: dbUser.nimOrNip ?? undefined,
            };
          }
        } catch {}
      }

      return {
        id: session.sub,
        email: session.email,
        name: session.name,
        role: session.role,
        nimOrNip: session.nimOrNip,
      };
    }
  }

  // Fallback for development/demo: retrieve primary mahasiswa user
  if (prisma && isDatabaseConfigured()) {
    try {
      const defaultMhs = await prisma.user.findFirst({
        where: { role: "mahasiswa" },
        select: { id: true, email: true, name: true, role: true, nimOrNip: true },
      });
      if (defaultMhs) {
        return {
          id: defaultMhs.id,
          email: defaultMhs.email,
          name: defaultMhs.name,
          role: defaultMhs.role,
          nimOrNip: defaultMhs.nimOrNip ?? undefined,
        };
      }
    } catch {}
  }

  return {
    id: "usr_mhs_001",
    email: "mahasiswa@nexed.ai",
    name: "Muhammad Hariz Lazuardi",
    role: "mahasiswa",
    nimOrNip: "M3124001",
  };
}
