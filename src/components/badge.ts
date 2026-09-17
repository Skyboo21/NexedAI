// src/components/badge.ts
import { cva } from "class-variance-authority";

// 1. Badge Variants
export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        LOW: "border border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200",
        MEDIUM: "border border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
        HIGH: "border border-red-200 bg-red-100 text-red-800 hover:bg-red-200 font-bold",
        Aman: "border border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
        "Perlu Perhatian": "border border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-200",
        Berisiko:
          "border border-red-200 bg-red-100 text-red-800 hover:bg-red-200 font-bold animate-pulse",
      },
    },
    defaultVariants: {
      variant: "LOW",
    },
  },
);

// 2. Chat Bubble Variants (Modul AI)
export const chatBubbleVariants = cva(
  "p-4 rounded-2xl shadow-sm max-w-[85%] text-sm leading-relaxed transition-all transform animate-fade-in-up",
  {
    variants: {
      role: {
        user: "bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-tr-none shadow-purple-500/20",
        bot: "bg-white border border-slate-200 text-slate-700 rounded-tl-none",
      },
    },
  },
);

export const avatarVariants = cva(
  "w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-md",
  {
    variants: {
      role: {
        user: "bg-purple-100 text-purple-700",
        bot: "bg-gradient-to-br from-purple-500 to-blue-600 text-white",
      },
    },
  },
);

// 3. Node Variants (Skill Tree / Student Path)
export const nodeVariants = cva(
  "block w-full max-w-md p-6 rounded-3xl border transition-all duration-500 relative",
  {
    variants: {
      status: {
        completed:
          "bg-white border-emerald-200 shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        recommended:
          "bg-white border-purple-400 ai-glow transform hover:scale-105 group cursor-pointer shadow-xl",
        locked: "bg-slate-50 border-slate-200 opacity-60 grayscale cursor-not-allowed",
      },
    },
  },
);

export const iconVariants = cva(
  "absolute left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-lg z-20 text-xl transition-transform duration-300",
  {
    variants: {
      status: {
        completed: "bg-emerald-500 shadow-emerald-500/30 hover:scale-110 hover:rotate-6",
        recommended:
          "bg-gradient-to-br from-purple-600 to-blue-600 shadow-purple-500/40 hover:scale-110",
        locked: "bg-slate-300 shadow-none",
      },
    },
  },
);

export const nodeBadgeVariants = cva(
  "text-xs font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider",
  {
    variants: {
      status: {
        completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
        recommended: "bg-purple-100 text-purple-800 border-purple-300",
        locked: "bg-slate-100 text-slate-500 border-slate-200",
      },
    },
  },
);
