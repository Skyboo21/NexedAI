// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Set user in global state
    login(email);
    
    // Redirect based on role
    if (email.toLowerCase().includes('dosen')) {
      navigate('/dosen');
    } else {
      navigate('/mahasiswa');
    }
  };

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-40 pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-40 pointer-events-none"></div>

      <main className="w-full max-w-md p-8 sm:p-10 bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl relative z-10 m-4 border-t border-white/20">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/40 text-2xl mb-4">NX</div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Selamat Datang</h1>
          <p className="text-slate-400 mt-2 font-light">Masuk ke platform pembelajaran NEXED AI</p>
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300 font-semibold">
            Gunakan email mengandung kata "dosen" untuk masuk ke Portal Dosen.
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Akses</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
              </div>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-white text-sm transition-all shadow-inner" 
                placeholder="anda@institusi.ac.id" 
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-slate-300">Kata Sandi</label>
              <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Lupa sandi?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-white text-sm transition-all shadow-inner" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center mt-2">
            Masuk Dashboard
          </button>
        </form>
      </main>
    </div>
  );
}
