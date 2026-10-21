"use client";

import { useEffect, useState } from "react";
import AppSidebar, { type NavItem } from "../../src/components/AppSidebar";
import type { Role } from "../../src/lib/validations/authSchema";
import { useAuthStore } from "../../src/store/authStore";

interface ProfileLayoutClientProps {
  initialRole: Role;
  children: React.ReactNode;
}

export default function ProfileLayoutClient({ initialRole, children }: ProfileLayoutClientProps) {
  const [mounted, setMounted] = useState(false);
  const { role: storeRole } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentRole = mounted && storeRole ? storeRole : initialRole || "mahasiswa";

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
            { label: "Kelola Pengguna", href: "/admin-dashboard" },
            { label: "Konfigurasi Sistem", href: "/admin-dashboard#config" },
            { label: "Profil Admin", href: "/profil" },
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
              badge: "Live",
              badgeColor: "emerald" as const,
            },
            {
              label: "Alert Mahasiswa",
              href: "/dosen-dashboard#alerts",
              badge: "2 Alert",
              badgeColor: "rose" as const,
            },
            {
              label: "Distribusi Nilai",
              href: "/dosen-dashboard#distribusi",
            },
            { label: "Profil Dosen", href: "/profil" },
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
            { label: "Beranda", href: "/dashboard" },
            {
              label: "Modul Adaptif",
              href: "/modul",
              badge: "5 Bab",
              badgeColor: "indigo" as const,
            },
            { label: "Peta Belajar", href: "/peta-belajar" },
            { label: "Riwayat Aktivitas", href: "/riwayat" },
            { label: "Profil Saya", href: "/profil" },
          ] as NavItem[],
        };
    }
  };

  const config = getSidebarConfig();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black flex flex-col md:flex-row font-['Inter',sans-serif] antialiased">
      <AppSidebar
        userRole={config.userRole}
        portalTitle={config.portalTitle}
        portalSubtitle={config.portalSubtitle}
        userStatusTitle={config.userStatusTitle}
        userStatusSubtitle={config.userStatusSubtitle}
        navItems={config.navItems}
      />
      <main className="flex-1 min-w-0 bg-transparent">{children}</main>
    </div>
  );
}
