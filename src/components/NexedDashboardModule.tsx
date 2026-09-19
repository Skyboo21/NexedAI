// src/components/NexedDashboardModule.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { LearningNode } from "../schemas/taskSchema";

interface NexedDashboardProps {
  initialNodes?: LearningNode[];
}

export const defaultNodes: LearningNode[] = [
  {
    id: 1,
    title: "Pengantar Algoritma & Logika",
    description: "Pemahaman dasar struktur logika dan algoritma sekuensial.",
    status: "completed",
    xp: 50,
  },
  {
    id: 2,
    title: "Struktur Kondisional (IF-ELSE)",
    description: "Mempelajari percabangan IF-ELSE dan Switch Case.",
    status: "completed",
    xp: 75,
  },
  {
    id: 3,
    title: "Looping & Iterasi (FOR/WHILE)",
    description: "Kamu membutuhkan penguatan di materi ini. Mari pelajari bersama NEXED Bot!",
    status: "recommended",
    xp: 100,
  },
  {
    id: 4,
    title: "Struktur Data Array & Matrix",
    description:
      "Menyimpan banyak data dalam satu variabel terstruktur. (Selesaikan tahap sebelumnya)",
    status: "locked",
    xp: 0,
  },
  {
    id: 5,
    title: "Fungsi & Rekursi Kompleks",
    description: "Modularisasi kode dengan fungsi dan panggilan rekursif. (Terkunci)",
    status: "locked",
    xp: 0,
  },
];

export default function NexedDashboardModule({ initialNodes = defaultNodes }: NexedDashboardProps) {
  const [nodes, setNodes] = useState<LearningNode[]>(initialNodes);
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "recommended" | "locked">(
    "all",
  );
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(nodes[2] ?? null);
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("completed_topics");
      if (saved) {
        const completedIds: number[] = JSON.parse(saved);
        setNodes((prev) =>
          prev.map((n) => {
            if (completedIds.includes(n.id)) {
              return {
                ...n,
                status: "completed",
                xp: n.xp || (n.id === 4 ? 120 : n.id === 5 ? 150 : 100),
              };
            }
            return n;
          }),
        );
      }
    } catch {
      // safe fallback
    }
  }, []);

  const totalXp = nodes.reduce((sum, n) => (n.status === "completed" ? sum + n.xp : sum), 0);

  const filteredNodes = nodes.filter((n) => {
    if (filterStatus === "all") return true;
    return n.status === filterStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-2">
            Learning Path
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Peta Belajar Adaptif AI
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Jalur pembelajaran dinamis yang disesuaikan dengan tingkat penguasaan konsep Anda.
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-3 rounded-xl shadow-xs flex items-center gap-3">
          <div className="text-2xl">⚡</div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-100">
              Total Akumulasi XP
            </div>
            <div className="text-xl font-black">{totalXp} XP</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex gap-2 mb-6 flex-wrap"
        role="tablist"
        aria-label="Filter status peta belajar"
      >
        {(["all", "recommended", "completed", "locked"] as const).map((status) => {
          const isActive = filterStatus === status;
          return (
            <button
              key={status}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {status === "all" && "Semua Topik"}
              {status === "recommended" && "⭐ Rekomendasi AI"}
              {status === "completed" && "✅ Selesai"}
              {status === "locked" && "🔒 Terkunci"}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left = Node list, Right = Selected Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-3">
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;

            let badgeClass = "bg-slate-100 text-slate-600 border-slate-200";
            let badgeText = "Terkunci";
            if (node.status === "recommended") {
              badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
              badgeText = "AI Recommended";
            } else if (node.status === "completed") {
              badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
              badgeText = "Selesai";
            }

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNode(node)}
                className={`text-left p-4 rounded-xl transition-all border ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-slate-900 text-base">{node.title}</h3>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${badgeClass}`}
                  >
                    {badgeText}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {node.description}
                </p>
                <div className="mt-2 text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <span>💎</span>
                  <span>{node.xp > 0 ? `+${node.xp} XP` : "0 XP"}</span>
                </div>
              </button>
            );
          })}
        </div>

        {selectedNode && (
          <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 mb-1">
                Topik Terpilih
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">{selectedNode.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {selectedNode.description}
              </p>

              <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase">
                  Status Pembelajaran
                </div>
                <div className="text-xs font-semibold flex items-center gap-2">
                  {selectedNode.status === "recommended" && (
                    <span className="text-amber-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                      Perlu Penguatan (Rekomendasi AI)
                    </span>
                  )}
                  {selectedNode.status === "completed" && (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      Materi Telah Dikuasai
                    </span>
                  )}
                  {selectedNode.status === "locked" && (
                    <span className="text-slate-500 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                      Terkunci (Selesaikan Prasyarat)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/modul/${selectedNode.id}`)}
              disabled={selectedNode.status === "locked"}
              className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                selectedNode.status === "locked"
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              }`}
            >
              <span>🚀</span>
              <span>
                {selectedNode.status === "locked" ? "Topik Terkunci" : "Buka Modul Belajar"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
