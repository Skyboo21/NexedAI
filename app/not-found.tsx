// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Outfit'] antialiased">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 shadow-xs text-center space-y-5">
        <div className="w-14 h-14 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xl mx-auto font-bold shadow-xs">
          404
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900">Halaman Tidak Ditemukan</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rute akademik yang Anda tuju belum terdaftar atau telah dipindahkan ke Route Groups
            resmi.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <span>&larr;</span>
            <span>Kembali ke Beranda Utama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
