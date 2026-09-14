// src/pages/DosenDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import NexedMasteryTableModule from '../components/NexedMasteryTableModule';

export default function DosenDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Basic route protection
    if (!user || user.role !== 'dosen') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'dosen') return null;

  return (
    <div className="bg-[#020617] text-slate-100 min-h-screen flex flex-col relative overflow-x-hidden font-['Outfit']">
      
      {/* Ambient Light Background */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] opacity-40 pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] opacity-40 pointer-events-none -z-10"></div>

      {/* Header Semantik */}
      <header className="bg-slate-900/60 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 transition-all" role="banner">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30 text-xl">
              NX
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight">Dosen Portal</h1>
              <p className="text-xs text-blue-400 font-bold tracking-wide uppercase">Algoritma Pemrograman</p>
            </div>
          </div>
          <nav aria-label="Navigasi Dosen" className="flex space-x-3">
            <button onClick={() => navigate('/profil')} className="flex items-center space-x-2 text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all shadow-sm">
              <span>Profil Saya</span>
            </button>
            <button onClick={handleLogout} className="flex items-center space-x-2 text-sm font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-all shadow-sm">
              <span>Keluar</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10 w-full relative z-10" role="main">
        {/* Section 1: Alert Mahasiswa Berisiko */}
        <section aria-labelledby="alert-heading">
          <h2 id="alert-heading" className="text-2xl font-extrabold text-white mb-6 flex items-center space-x-3">
            <span className="text-3xl">⚠️</span>
            <span>Perhatian Khusus</span>
            <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse shadow-sm">Real-time Alert</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-red-950/40 border border-red-500/30 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">Budi Santoso</h3>
                <span className="text-xs font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded">Berisiko Tinggi</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">Gagal menyelesaikan Kuis Logika 3 kali berturut-turut.</p>
              <button className="text-sm font-bold text-red-400 hover:text-red-300">Tinjau Log Belajar &rarr;</button>
            </div>
            
            <div className="p-6 bg-orange-950/40 border border-orange-500/30 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">Siti Aminah</h3>
                <span className="text-xs font-bold text-orange-400 bg-orange-500/20 px-2 py-1 rounded">Perlu Perhatian</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">Waktu pengerjaan tugas Array melebihi rata-rata kelas (200%).</p>
              <button className="text-sm font-bold text-orange-400 hover:text-orange-300">Tinjau Log Belajar &rarr;</button>
            </div>
          </div>
        </section>

        {/* Section 2: Tabel Penguasaan (Mastery) dari Modul 7 */}
        <section aria-labelledby="table-heading">
          {/* Reuse the Mastery Table Component, but it fits perfectly for Dosen */}
          <NexedMasteryTableModule />
        </section>
      </main>
    </div>
  );
}
