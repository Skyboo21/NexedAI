// app/profil/layout.tsx

import { cookies } from "next/headers";
import type React from "react";
import { verifySessionToken } from "../../src/lib/server/sessionToken";
import ProfileLayoutClient from "./ProfileLayoutClient";

export const metadata = {
  title: "Profil Pengguna - NexedAI",
  description: "Informasi profil akun dan kredensial akses pembelajaran NexedAI",
};

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("nexed_session_token")?.value;
  const verifiedSession = await verifySessionToken(sessionToken);

  const initialRole = verifiedSession?.role || "mahasiswa";

  return <ProfileLayoutClient initialRole={initialRole}>{children}</ProfileLayoutClient>;
}
