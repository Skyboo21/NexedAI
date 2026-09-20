// app/(dosen)/loading.tsx
export default function DosenLoading() {
  return (
    <div className="min-h-screen bg-slate-50 font-['Outfit'] p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
      <div className="h-16 bg-white border border-slate-200 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="h-3 w-24 bg-slate-200 rounded-full" />
            <div className="h-7 w-32 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="h-80 bg-white border border-slate-200 rounded-2xl" />
      <div className="h-96 bg-white border border-slate-200 rounded-2xl" />
    </div>
  );
}
