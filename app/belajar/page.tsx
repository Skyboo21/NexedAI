// app/belajar/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function BelajarRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const topicId = searchParams.get("topicId") || "3";
    router.replace(`/modul/${topicId}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Outfit'] text-slate-600">
      <div className="flex items-center gap-2 text-xs font-semibold">
        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>Mengarahkan ke Modul Belajar...</span>
      </div>
    </div>
  );
}

export default function BelajarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Outfit'] text-slate-600">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span>Memuat Modul...</span>
          </div>
        </div>
      }
    >
      <BelajarRedirect />
    </Suspense>
  );
}
