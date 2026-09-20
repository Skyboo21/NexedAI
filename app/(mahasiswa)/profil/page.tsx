// app/(mahasiswa)/profil/page.tsx
import UserProfile from "../../../src/views/UserProfile";

export const metadata = {
  title: "Profil Pengguna | NexedAI - Single Sign-On UNS",
  description: "Informasi profil akademik dan status verifikasi akun pembelajaran mahasiswa.",
};

export default function MahasiswaProfilePage() {
  return <UserProfile />;
}
