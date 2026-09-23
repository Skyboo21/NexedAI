"use client";

import type React from "react";
import AppSidebar, { type NavItem } from "../../src/components/AppSidebar";
import type { Role } from "../../src/lib/validations/authSchema";
import { useAuthStore } from "../../src/store/authStore";

interface ProfileLayoutClientProps {
  initialRole: Role;
  children: React.ReactNode;
}

export default function ProfileLayoutClient({ initialRole, children }: ProfileLayoutClientProps) {
  const { role: storeRole } = useAuthStore();
  const currentRole = storeRole || initialRole || "mahasiswa";

  const getSidebarConfig = () => {
    switch (currentRole) {
      case "admin":
        return {
          userRole: "admin" as const,
          portalTitle: "Portal Admin",
          portalSubtitle: "Sistem Kontrol Akses Terpusat",
          userStatusTitle: "Super Administrator",
          userStatusSubtitle: "Akses Penuh Konfigurasi & Audit",
          navItems: [
            { label: "Kelola Pengguna", href: "/admin-dashboard", icon: "👥" },
            {
              label: "Konfigurasi Sistem",
              href: "/admin-dashboard#config",
              icon: "⚙️",
            },
            { label: "Profil Admin", href: "/profil", icon: "👤" },
          ] as NavItem[],
        };
      case "dosen":
        return {
          userRole: "dosen" as const,
          portalTitle: "Portal Dosen",
          portalSubtitle: "D3 Teknik Informatika SV UNS",
          userStatusTitle: "Dosen Pengampu Aktif",
          userStatusSubtitle: "Algoritma & Pemrograman (Kelas TI-A)",
          navItems: [
            {
              label: "Analitik Kelas",
              href: "/dosen-dashboard",
              icon: "📊",
              badge: "Live",
              badgeColor: "emerald" as const,
            },
            {
              label: "Alert Mahasiswa",
              href: "/dosen-dashboard#alerts",
              icon: "⚠️",
              badge: "2 Alert",
              badgeColor: "rose" as const,
            },
            {
              label: "Distribusi Nilai",
              href: "/dosen-dashboard#distribusi",
              icon: "📈",
            },
            { label: "Profil Dosen", href: "/profil", icon: "👤" },
          ] as NavItem[],
        };
      default:
        return {
          userRole: "mahasiswa" as const,
          portalTitle: "Portal Mahasiswa",
          portalSubtitle: "D3 Teknik Informatika SV UNS",
          userStatusTitle: "Mahasiswa Aktif",
          userStatusSubtitle: "Semester 4 • Algoritma & Pemrograman",
          navItems: [
            { label: "Beranda", href: "/dashboard", icon: "🏠" },
            {
              label: "Modul Adaptif",
              href: "/modul",
              icon: "📚",
              badge: "5 Bab",
              badgeColor: "indigo" as const,
            },
            { label: "Peta Belajar", href: "/dashboard#peta", icon: "🗺️" },
            { label: "Riwayat Aktivitas", href: "/dashboard#riwayat", icon: "📝" },
            { label: "Profil Saya", href: "/profil", icon: "👤" },
          ] as NavItem[],
        };
    }
  };

  const config = getSidebarConfig();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-['Outfit'] antialiased">
      <AppSidebar
        userRole={config.userRole}
        portalTitle={config.portalTitle}
        portalSubtitle={config.portalSubtitle}
        userStatusTitle={config.userStatusTitle}
        userStatusSubtitle={config.userStatusSubtitle}
        navItems={config.navItems}
      />
      <main className="flex-1 min-w-0 bg-slate-50">{children}</main>
    </div>
  );
}
