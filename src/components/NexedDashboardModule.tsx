// @ts-nocheck
// src/components/NexedDashboardModule.tsx
import React, { useState } from 'react';
import { LearningNode } from '../schemas/taskSchema';

interface NexedDashboardProps {
  initialNodes?: LearningNode[];
}

export const defaultNodes: LearningNode[] = [
  { id: 1, title: 'Pengantar Algoritma & Logika', description: 'Pemahaman dasar struktur logika dan algoritma sekuensial.', status: 'completed', xp: 50 },
  { id: 2, title: 'Struktur Kondisional (IF-ELSE)', description: 'Mempelajari percabangan IF-ELSE dan Switch Case.', status: 'completed', xp: 75 },
  { id: 3, title: 'Looping & Iterasi (FOR/WHILE)', description: 'Kamu membutuhkan penguatan di materi ini. Mari pelajari bersama NEXED Bot!', status: 'recommended', xp: 100 },
  { id: 4, title: 'Struktur Data Array & Matrix', description: 'Menyimpan banyak data dalam satu variabel terstruktur. (Selesaikan tahap sebelumnya)', status: 'locked', xp: 0 },
  { id: 5, title: 'Fungsi & Rekursi Kompleks', description: 'Modularisasi kode dengan fungsi dan panggilan rekursif. (Terkunci)', status: 'locked', xp: 0 }
];

export default function NexedDashboardModule({ initialNodes = defaultNodes }: NexedDashboardProps) {
  const [nodes, setNodes] = useState<LearningNode[]>(initialNodes);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'recommended' | 'locked'>('all');
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(nodes[2] || null);

  const totalXp = nodes.reduce((sum, n) => n.status === 'completed' ? sum + n.xp : sum, 0);

  const filteredNodes = nodes.filter(n => {
    if (filterStatus === 'all') return true;
    return n.status === filterStatus;
  });

  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl border-t border-white/20">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="inline-block text-xs font-bold text-purple-300 bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-inner shadow-purple-500/20">
            Learning Path
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            🎓 Dashboard Peta Belajar AI
          </h2>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl text-center shadow-lg shadow-purple-500/30 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50 mix-blend-overlay"></div>
          <div className="text-xs uppercase tracking-widest text-purple-200 relative z-10">Total Terkumpul</div>
          <div className="text-2xl font-black relative z-10">⚡ {totalXp} XP</div>
        </div>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {(['all', 'recommended', 'completed', 'locked'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${
              filterStatus === status 
                ? 'bg-purple-600/30 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
          >
            {status === 'all' && '📑 Semua Topik'}
            {status === 'recommended' && '⭐ AI Recommended'}
            {status === 'completed' && '✅ Selesai'}
            {status === 'locked' && '🔒 Terkunci'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-4">
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            
            let badgeStyle = "bg-slate-800 text-slate-400 border-slate-700";
            let borderStyle = isSelected ? "border-purple-500/50 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]" : "border-white/10 bg-white/5 hover:bg-white/10";
            
            if (node.status === 'recommended') badgeStyle = "bg-orange-500/20 text-orange-400 border-orange-500/30";
            if (node.status === 'completed') badgeStyle = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-md ${borderStyle}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="m-0 text-lg font-bold text-white tracking-tight">{node.title}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md border ${badgeStyle}`}>
                    {node.status === 'recommended' ? 'AI Recommended' : node.status === 'completed' ? 'Selesai' : 'Terkunci'}
                  </span>
                </div>
                <p className="m-0 text-sm text-slate-400 leading-relaxed font-light">{node.description}</p>
                <div className="mt-3 text-sm font-bold text-orange-400">
                  {node.xp > 0 ? `+${node.xp} XP` : '0 XP'}
                </div>
              </div>
            );
          })}
        </div>

        {selectedNode && (
          <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-dashed border-slate-500/30 flex flex-col justify-between bg-slate-900/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="text-xs font-bold text-purple-400 tracking-wider uppercase mb-2">Detail Topik Terpilih</div>
              <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">{selectedNode.title}</h3>
              <p className="text-sm text-slate-300 font-light leading-relaxed">{selectedNode.description}</p>
              
              <div className="mt-6 p-4 bg-black/40 rounded-xl border border-white/5 backdrop-blur-sm">
                <div className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Status Pembelajaran:</div>
                <div className={`text-sm font-bold ${
                  selectedNode.status === 'recommended' ? 'text-orange-400' : 
                  selectedNode.status === 'completed' ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {selectedNode.status === 'recommended' ? '🔥 Perlu Diwaspadai (AI Recommendation)' : selectedNode.status === 'completed' ? '🎉 Berhasil Dikuasai' : '🔒 Belum Terbuka'}
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Membuka ruang belajar interaktif untuk: ${selectedNode.title}`)}
              className={`mt-6 w-full p-4 rounded-xl font-bold text-sm transition-all relative overflow-hidden group ${
                selectedNode.status === 'locked' 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white cursor-pointer shadow-lg shadow-purple-500/25 border border-purple-500/50 hover:shadow-purple-500/40'
              }`}
              disabled={selectedNode.status === 'locked'}
            >
              {selectedNode.status !== 'locked' && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              )}
              <span className="relative z-10">
                {selectedNode.status === 'locked' ? 'Topik Terkunci' : '🚀 Pelajari Bersama NEXED Bot'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
