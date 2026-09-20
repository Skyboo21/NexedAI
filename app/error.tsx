// app/error.tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("NexedAI Global Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Outfit'] antialiased">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-2xl mx-auto shadow-xs">
          ⚠️
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900">Terjadi Kendala Komputasi</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {error.message || "Aplikasi mengalami kendala teknis saat merender komponen."}
          </p>
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            Coba Pulihkan
          </button>
          <a
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            Ke Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
