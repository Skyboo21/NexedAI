// app/(mahasiswa)/layout.tsx
import type React from "react";
import AppSidebar from "../../src/components/AppSidebar";

export const metadata = {
  title: "Portal Mahasiswa - NexedAI",
  description: "Ruang pembelajaran adaptif mahasiswa berbasis AI terintegrasi",
};

export default function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-['Outfit'] antialiased">
      <AppSidebar
        role="mahasiswa"
        portalTitle="Portal Mahasiswa"
        portalSubtitle="D3 Teknik Informatika SV UNS"
        userStatusTitle="Mahasiswa Aktif"
        userStatusSubtitle="Semester 4 • Algoritma & Pemrograman"
        navItems={[
          { label: "Beranda", href: "/dashboard", icon: "🏠" },
          {
            label: "Modul Adaptif",
            href: "/modul",
            icon: "📚",
            badge: "5 Bab",
            badgeColor: "indigo",
          },
          { label: "Peta Belajar", href: "/dashboard#peta", icon: "🗺️" },
          { label: "Riwayat Aktivitas", href: "/dashboard#riwayat", icon: "📝" },
          { label: "Profil Saya", href: "/profil", icon: "👤" },
        ]}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-50" role="main">
        {children}
      </main>
    </div>
  );
}
