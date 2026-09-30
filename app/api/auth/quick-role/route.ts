// app/api/auth/quick-role/route.ts
import { NextResponse } from "next/server";
import { signSessionToken } from "../../../../src/lib/server/sessionToken";
import {
  findUserByIdentifier,
  initServerUserRegistry,
} from "../../../../src/lib/server/userRegistry";

export async function GET(request: Request) {
  await initServerUserRegistry();
  const { searchParams } = new URL(request.url);
  const requestedRole = searchParams.get("role") || "mahasiswa";

  const email =
    requestedRole === "dosen"
      ? "dosen@nexed.ai"
      : requestedRole === "admin"
        ? "admin@nexed.ai"
        : "mahasiswa@nexed.ai";

  const user = await findUserByIdentifier(email);
  const role = requestedRole === "dosen" || requestedRole === "admin" ? requestedRole : "mahasiswa";

  const userData = user || {
    id: `usr_${role}_001`,
    email,
    name:
      role === "dosen"
        ? "Dr. Ir. Hendra Wijaya, M.Kom."
        : role === "admin"
          ? "Administrator Sistem"
          : "Muhammad Hariz Lazuardi",
    role,
    nimOrNip: role === "dosen" ? "198504122010121003" : role === "admin" ? "ADM-001" : "M3124001",
    semester: role === "mahasiswa" ? 4 : undefined,
    prodi: "D3 Teknik Informatika SV UNS",
  };

  const tokenMaxAge = 30 * 24 * 60 * 60 * 1000;
  const sessionToken = await signSessionToken({
    sub: userData.id,
    email: userData.email,
    role,
    name: userData.name,
    nimOrNip: userData.nimOrNip,
    exp: Date.now() + tokenMaxAge,
  });

  const targetPath =
    role === "dosen" ? "/dosen-dashboard" : role === "admin" ? "/admin-dashboard" : "/dashboard";

  const response = NextResponse.redirect(new URL(targetPath, request.url), 302);

  response.cookies.set("nexed_session_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(tokenMaxAge / 1000),
  });

  response.cookies.set("nexed_session_role", role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(tokenMaxAge / 1000),
  });

  return response;
}
