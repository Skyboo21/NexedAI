// @ts-nocheck
// src/components/TaskListFetcher.tsx - React Server Component (Zero Bundle JS sent to client)
import React from "react";
import { fetchLearningNodesApi } from "../services/apiService";

export default async function TaskListFetcher() {
  // Simulasi data fetching langsung di server Node.js
  const nodes = await fetchLearningNodesApi();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
          <span>📑</span> Daftar Modul Belajar (Dirender Langsung dari Server RSC)
        </h3>
        <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-md">
          Zero-KB JS Component
        </span>
      </div>

      <div className="space-y-3">
        {nodes.map((node) => {
          const statusBg = node.status === 'recommended' ? 'bg-amber-100 text-amber-800' : node.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600';
          const statusLabel = node.status === 'recommended' ? 'AI Recommended' : node.status === 'completed' ? 'Selesai' : 'Terkunci';

          return (
            <div
              key={node.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{node.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{node.description}</p>
              </div>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-lg ${statusBg}`}>
                {statusLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
