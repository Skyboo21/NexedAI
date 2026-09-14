// src/pages/StudentDashboard.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import NexedDashboardModule from '../components/NexedDashboardModule';
import NexedFormEntryModule from '../components/NexedFormEntryModule';
import TaskTodoList from '../components/TaskTodoList';

export default function StudentDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Basic route protection
    if (!user || user.role !== 'mahasiswa') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'mahasiswa') return null;

  return (
    <div className="bg-[#020617] text-slate-100 min-h-screen flex flex-col relative overflow-x-hidden font-['Outfit']">
      
      <div className="absolute top-0 -left-20 w-[30rem] h-[30rem] bg-purple-600 rounded-full mix-blend-screen filter blur-[140px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-[30rem] h-[30rem] bg-blue-600 rounded-full mix-blend-screen filter blur-[140px] opacity-20 pointer-events-none"></div>

      <header className="bg-slate-900/60 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 transition-all" role="banner">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/30 text-xl">
              NX
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight">Pusat Pembelajaran</h1>
              <p className="text-xs text-purple-400 font-bold tracking-wide uppercase">{user.email}</p>
            </div>
          </div>
          <nav aria-label="Navigasi Mahasiswa" className="flex space-x-3">
            <button onClick={() => navigate('/profil')} className="flex items-center space-x-2 text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all shadow-sm">
              <span>Profil Saya</span>
            </button>
            <button onClick={handleLogout} className="flex items-center space-x-2 text-sm font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-all shadow-sm">
              <span>Keluar</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 w-full relative z-10">
        <div className="relative glass-card rounded-3xl p-8 mb-10 border-t border-white/20 overflow-hidden group bg-white/5 backdrop-blur-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 shadow-inner shadow-purple-500/20">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              <span>Adaptive AI Ecosystem</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-slate-400 mb-4">
              Pusat Pembelajaran Cerdas
            </h2>
            <p className="text-slate-400 max-w-3xl text-lg font-light leading-relaxed">
              Akses peta belajar adaptif, tetapkan target belajar pribadi, dan pantau kemajuanmu dengan sistem pembelajaran yang disesuaikan oleh AI.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <NexedDashboardModule />
          </div>

          <div className="lg:col-span-1 flex flex-col gap-8">
            <NexedFormEntryModule />
            <TaskTodoList />
          </div>
        </div>
      </main>
    </div>
  );
}
