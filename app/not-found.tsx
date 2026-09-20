// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Outfit'] antialiased">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-3xl mx-auto font-black shadow-xs">
          404
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-slate-900">Halaman Tidak Ditemukan</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rute akademik yang Anda tuju belum terdaftar atau telah dipindahkan ke Route Groups
            resmi.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <span>&larr;</span>
            <span>Kembali ke Beranda Utama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
