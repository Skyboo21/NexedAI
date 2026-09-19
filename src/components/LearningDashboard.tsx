import NexedDashboardModule from "./NexedDashboardModule";
import NexedFormEntryModule from "./NexedFormEntryModule";
import NexedMasteryTableModule from "./NexedMasteryTableModule";
import TaskTodoList from "./TaskTodoList";

export default function LearningDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Main Banner */}
      <div className="relative glass-card rounded-3xl p-8 mb-10 border-t border-white/20 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span>Adaptive AI Ecosystem</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-slate-400 mb-4">
            Pusat Pembelajaran Cerdas
          </h2>
          <p className="text-slate-400 max-w-3xl text-lg font-light leading-relaxed">
            Akses peta belajar adaptif, tetapkan target belajar pribadi, dan pantau kemajuan kelas
            dengan sistem monitoring terintegrasi berbasis AI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Peta Belajar & Analitik (Lebar 2) */}
        <div className="lg:col-span-2 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <NexedDashboardModule />
          <NexedMasteryTableModule />
        </div>

        {/* Kolom Kanan: Form Entry & Todo List (Lebar 1) */}
        <div className="lg:col-span-1 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <NexedFormEntryModule />
          <TaskTodoList />
        </div>
      </div>
    </div>
  );
}
