// app/(mahasiswa)/layout.tsx
import type React from "react";
import AppSidebar from "../../src/components/AppSidebar";

export const metadata = {
  title: "Portal Mahasiswa - NexedAI",
  description: "Ruang pembelajaran adaptif mahasiswa berbasis AI terintegrasi",
};

export default function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black flex flex-col md:flex-row font-['Inter',sans-serif] antialiased">
      <AppSidebar
        userRole="mahasiswa"
        portalTitle="Portal Mahasiswa"
        portalSubtitle="D3 Teknik Informatika SV UNS"
        userStatusTitle="Mahasiswa Aktif"
        userStatusSubtitle="Semester 4 • Algoritma & Pemrograman"
        navItems={[
          { label: "Beranda", href: "/dashboard" },
          {
            label: "Modul Adaptif",
            href: "/modul",
            badge: "5 Bab",
            badgeColor: "indigo",
          },
          { label: "Peta Belajar", href: "/peta-belajar" },
          { label: "Riwayat Aktivitas", href: "/riwayat" },
          { label: "Profil Saya", href: "/profil" },
        ]}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-transparent">{children}</main>
    </div>
  );
}
