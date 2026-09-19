// app/(dosen)/layout.tsx
import type React from "react";
import AppSidebar from "../../src/components/AppSidebar";

export const metadata = {
  title: "Portal Dosen - NexedAI",
  description: "Monitoring analitik penguasaan materi dan status performa mahasiswa",
};

export default function DosenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-['Outfit'] antialiased">
      <AppSidebar
        role="dosen"
        portalTitle="Portal Dosen"
        portalSubtitle="D3 Teknik Informatika SV UNS"
        userStatusTitle="Dosen Pengampu Aktif"
        userStatusSubtitle="Algoritma & Pemrograman (Kelas TI-A)"
        navItems={[
          {
            label: "Analitik Kelas",
            href: "/dosen-dashboard",
            icon: "📊",
            badge: "Live",
            badgeColor: "emerald",
          },
          {
            label: "Alert Mahasiswa",
            href: "/dosen-dashboard#alerts",
            icon: "⚠️",
            badge: "2 Alert",
            badgeColor: "rose",
          },
          { label: "Distribusi Nilai", href: "/dosen-dashboard#distribusi", icon: "📈" },
          { label: "Profil Dosen", href: "/profil", icon: "👤" },
        ]}
      />

      {/* Main Page Content */}
      <main className="flex-1 min-w-0 bg-slate-50" role="main">
        {children}
      </main>
    </div>
  );
}
