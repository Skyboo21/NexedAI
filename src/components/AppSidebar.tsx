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
        return "text-indigo-700 bg-indigo-50 border-indigo-100";
      case "admin":
        return "text-amber-700 bg-amber-50 border-amber-100";
      default:
        return "text-indigo-700 bg-indigo-50 border-indigo-100";
    }
  };

  const getLogoBadge = () => {
    switch (userRole) {
      case "admin":
        return "🛡️";
      default:
        return "NX";
    }
  };

  return (
    <>
      {/* Mobile Top Header Bar (Only visible on small screens < md) */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-xs">
            {getLogoBadge()}
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 leading-none">NEXED AI</h1>
            <span className="text-[10px] text-indigo-700 font-bold">{portalTitle}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
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
          className="md:hidden fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs w-full h-full border-none cursor-default p-0 m-0"
        />
      )}

      {/* Main Sidebar: Sticky on Desktop, Collapsible Drawer on Mobile */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-35 md:z-30
          w-72 md:w-64 lg:w-68 h-screen
          bg-white border-r border-slate-200/80
          flex flex-col justify-between
          p-5 shrink-0 shadow-sm md:shadow-none
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
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-xs text-base shrink-0">
                {getLogoBadge()}
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  NEXED AI
                </h2>
                <span
                  className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRoleBadgeColor()}`}
                >
                  {portalTitle}
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Tutup sidebar"
            >
              ✕
            </button>
          </div>

          {/* Subtitle / Department note */}
          <div className="px-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">{portalSubtitle}</span>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Menu Utama" className="space-y-1.5 pt-1">
            {navItems.map((item) => {
              const isActive = item.href.includes("#")
                ? false
                : item.href === "/dashboard" ||
                    item.href === "/dosen-dashboard" ||
                    item.href === "/admin-dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold shadow-xs"
                      : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50 hover:border-slate-200/80"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-base shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.badgeColor === "emerald"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : item.badgeColor === "rose"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : item.badgeColor === "amber"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-indigo-50 text-indigo-700 border-indigo-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Subtle active pill indicator on left border */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar: User Status & Logout */}
        <div className="pt-4 border-t border-slate-200/80 space-y-3 mt-6">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-600">
            <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{userStatusTitle}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{userStatusSubtitle}</p>
          </div>

          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
