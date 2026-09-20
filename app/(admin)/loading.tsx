// app/(admin)/loading.tsx
export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-slate-50 font-['Outfit'] p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
      <div className="h-16 bg-white border border-slate-200 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 bg-white border border-slate-200 rounded-2xl p-5 space-y-2"
          />
        ))}
      </div>
      <div className="h-96 bg-white border border-slate-200 rounded-2xl" />
    </div>
  );
}
