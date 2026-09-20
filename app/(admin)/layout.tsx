// app/(admin)/layout.tsx
import type React from "react";
import AppSidebar from "../../src/components/AppSidebar";

export const metadata = {
  title: "Portal Administrator - NexedAI",
  description: "Manajemen hak akses pengguna, pemantauan sistem, dan konfigurasi platform",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-['Outfit'] antialiased">
      <AppSidebar
        userRole="admin"
        portalTitle="Portal Admin"
        portalSubtitle="Sistem Kontrol Akses Terpusat"
        userStatusTitle="Super Administrator"
        userStatusSubtitle="Akses Penuh Konfigurasi & Audit"
        navItems={[
          { label: "Kelola Pengguna", href: "/admin-dashboard", icon: "👥" },
          { label: "Konfigurasi Sistem", href: "/admin-dashboard#config", icon: "⚙️" },
          { label: "Profil Admin", href: "/profil", icon: "👤" },
        ]}
      />

      {/* Main Page Content */}
      <main className="flex-1 min-w-0 bg-slate-50">{children}</main>
    </div>
  );
}
