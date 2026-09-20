// app/(mahasiswa)/loading.tsx
export default function MahasiswaLoading() {
  return (
    <div className="min-h-screen bg-slate-50 font-['Outfit'] p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-32 bg-slate-200/80 rounded-3xl" />

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="h-3 w-20 bg-slate-200 rounded-full" />
            <div className="h-7 w-28 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-white border border-slate-200 rounded-2xl" />
        <div className="h-96 bg-white border border-slate-200 rounded-2xl" />
      </div>
    </div>
  );
}
