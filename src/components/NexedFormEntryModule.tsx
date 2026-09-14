// @ts-nocheck
// src/components/NexedFormEntryModule.tsx
import React, { useState } from 'react';
import { CreateTaskSchema, CreateTaskInput, StudentTask } from '../schemas/taskSchema';

interface NexedFormEntryProps {
  onTaskCreated?: (newTask: StudentTask) => void;
}

export default function NexedFormEntryModule({ onTaskCreated }: NexedFormEntryProps) {
  const [formData, setFormData] = useState<Partial<CreateTaskInput>>({
    title: '',
    category: 'Materi',
    complexity: 'Beginner'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field: keyof CreateTaskInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setSuccessMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Zod Validation Execution
    const validationResult = CreateTaskSchema.safeParse(formData);
    
    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    const validData = validationResult.data;
    const newTask: StudentTask = {
      id: Date.now().toString(),
      ...validData,
      status: 'In Progress',
      createdAt: new Date().toISOString()
    };

    setSuccessMessage(`Target "${validData.title}" berhasil ditambahkan!`);
    if (onTaskCreated) onTaskCreated(newTask);
    
    // Reset Form
    setFormData({ title: '', category: 'Materi', complexity: 'Beginner' });
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl border-t border-white/20 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none"></div>

      <div className="mb-6 relative z-10">
        <span className="inline-block text-xs font-bold text-blue-300 bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-inner shadow-blue-500/20">
          Target Manager
        </span>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          📝 Input Target Belajar
        </h2>
        <p className="text-slate-400 text-xs mt-2 font-light">Tambahkan target topik baru untuk rencana studi Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10 flex-1 flex flex-col">
        
        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
            Judul Topik <span className="text-pink-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Contoh: Pemahaman Tree"
            className={`w-full p-3 rounded-xl bg-black/30 border transition-all duration-300 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:bg-black/50 text-sm ${
              errors.title ? 'border-pink-500/50 focus:border-pink-500 focus:ring-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.1)]' : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'
            }`}
          />
          {errors.title && (
            <p className="text-pink-400 text-[10px] font-semibold mt-1 flex items-center">
              <span className="mr-1">⚠️</span> {errors.title}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Category Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
              Kategori
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white text-sm appearance-none transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-black/50"
              >
                <option value="Materi" className="bg-slate-900">📚 Materi</option>
                <option value="Praktikum" className="bg-slate-900">💻 Praktik</option>
                <option value="Kuis" className="bg-slate-900">📝 Kuis</option>
                <option value="Proyek" className="bg-slate-900">🚀 Proyek</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          {/* Complexity Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
              Level
            </label>
            <div className="relative">
              <select
                value={formData.complexity}
                onChange={(e) => handleInputChange('complexity', e.target.value)}
                className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white text-sm appearance-none transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-black/50"
              >
                <option value="Beginner" className="bg-slate-900">🌱 Bgnr</option>
                <option value="Intermediate" className="bg-slate-900">🌟 Intrm</option>
                <option value="Advanced" className="bg-slate-900">🔥 Adv</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button & Messages */}
        <div className="pt-4 mt-auto border-t border-white/5">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 border border-blue-500/50 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300"
          >
            + Tambah
          </button>
          
          {successMessage && (
            <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-2 rounded-lg text-xs font-semibold flex items-center shadow-inner shadow-emerald-500/10 animate-in fade-in">
              <span className="mr-2">✅</span> {successMessage}
            </div>
          )}
        </div>

      </form>
    </div>
  );
}
