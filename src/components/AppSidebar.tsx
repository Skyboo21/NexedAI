// src/components/AppSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  badgeColor?: "indigo" | "emerald" | "amber" | "rose";
}

interface AppSidebarProps {
  userRole?: "mahasiswa" | "dosen" | "admin";
  portalTitle: string;
  portalSubtitle: string;
  userStatusTitle: string;
  userStatusSubtitle: string;
  navItems: NavItem[];
}

export default function AppSidebar({
  userRole = "mahasiswa",
  portalTitle,
  portalSubtitle,
  userStatusTitle,
  userStatusSubtitle,
  navItems,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case "dosen":
        return "text-black bg-[#F4F4F6] border-black/15";
      case "admin":
        return "text-black bg-[#F4F4F6] border-black/20 font-bold";
      default:
        return "text-black bg-[#F4F4F6] border-black/15";
    }
  };

  const getLogoBadge = () => {
    switch (userRole) {
      case "admin":
        return "🛡️";
      default:
        return (
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="5" width="7" height="14" rx="3.5" fill="currentColor" transform="rotate(-35 7.5 12)" />
            <rect x="13" y="5" width="7" height="14" rx="3.5" fill="currentColor" transform="rotate(-35 16.5 12)" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Mobile Top Header Bar (Only visible on small screens < md) */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/8 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center font-bold text-white text-xs shadow-sm">
            {getLogoBadge()}
          </div>
          <div>
            <h1 className="text-sm font-semibold text-black leading-none">NEXED AI</h1>
            <span className="text-[10px] text-neutral-500 font-medium">{portalTitle}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          className="p-2 rounded-xl bg-[#F4F4F6] hover:bg-neutral-200 text-black text-xs font-medium border border-black/10 transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? "✕ Tutup" : "☰ Menu"}
        </button>
      </header>

      {/* Mobile Menu Dropdown Backdrop */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Tutup menu navigasi samping"
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-xs w-full h-full border-none cursor-default p-0 m-0"
        />
      )}

      {/* Main Sidebar: Bento Docked on Desktop, Drawer on Mobile */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-35 md:z-30
          w-72 md:w-64 lg:w-68 h-screen
          bg-white border-r border-black/8
          flex flex-col justify-between
          p-5 shrink-0 shadow-xs md:shadow-none
          transition-transform duration-300 ease-in-out
          overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        aria-label={`Sidebar Navigasi ${portalTitle}`}
      >
        <div className="space-y-6">
          {/* Logo & Platform Brand */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center font-bold text-white shadow-sm text-sm shrink-0">
                {getLogoBadge()}
              </div>
              <div>
                <h2 className="text-base font-semibold text-black tracking-tight leading-none">
                  NEXED AI
                </h2>
                <span
                  className={`inline-block mt-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRoleBadgeColor()}`}
                >
                  {portalTitle}
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100"
              aria-label="Tutup sidebar"
            >
              ✕
            </button>
          </div>

          {/* Subtitle / Department note */}
          <div className="px-3 py-2 bg-[#F4F4F6] border border-black/5 rounded-xl text-[11px] text-neutral-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
            <span className="truncate font-normal">{portalSubtitle}</span>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Menu Utama" className="space-y-1.5 pt-1">
            {navItems.map((item) => {
              const currentPath = pathname || "";
              const isActive = item.href.includes("#")
                ? false
                : item.href === "/dashboard" ||
                    item.href === "/dosen-dashboard" ||
                    item.href === "/admin-dashboard"
                  ? currentPath === item.href
                  : currentPath.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all border ${
                    isActive
                      ? "bg-black border-black text-white font-medium shadow-xs"
                      : "text-neutral-600 border-transparent hover:text-black hover:bg-[#F4F4F6] hover:border-black/5"
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="text-sm shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        isActive
                          ? "bg-neutral-800 text-white border-white/20"
                          : "bg-[#F4F4F6] text-black border-black/10"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar: User Status & Logout */}
        <div className="pt-4 border-t border-slate-200/80 space-y-3 mt-6">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{userStatusTitle}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate">{userStatusSubtitle}</p>
          </div>

          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
