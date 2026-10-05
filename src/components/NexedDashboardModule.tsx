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
    title: "Pengantar Logika & Algoritma",
    description: "Notasi pseudocode standar, perancangan flowchart, dan alur sekuensial program.",
    status: "completed",
    xp: 50,
  },
  {
    id: 2,
    title: "Struktur Kontrol & Percabangan",
    description: "Implementasi logika IF-ELSE bertingkat dan multiway branching switch-case.",
    status: "completed",
    xp: 75,
  },
  {
    id: 3,
    title: "Struktur Perulangan (Loops)",
    description: "Pemahaman for, while, do-while serta penanganan iterasi bersarang (nested loops).",
    status: "recommended",
    xp: 100,
  },
  {
    id: 4,
    title: "Array & Struktur Data Linear",
    description:
      "Alokasi memori larik 1-dimensi dan matriks 2-dimensi beserta operasi traversal data.",
    status: "locked",
    xp: 0,
  },
  {
    id: 5,
    title: "Fungsi, Parameter & Rekursi",
    description: "Modularisasi kode, passing by value/reference, dan pemanggilan fungsi rekursif.",
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
    <div className="bg-white rounded-3xl border border-black/8 p-6 md:p-8 shadow-xs hover:border-black/20 transition-all duration-300">
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="bg-[#F4F4F6] text-black border border-black/10 font-mono text-xs px-3 py-1 rounded-full inline-block mb-2">
            Silabus Terstruktur
          </span>
          <h2 className="text-xl md:text-2xl font-light text-black tracking-tight">
            Peta Capaian Pembelajaran Modul
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Tahapan penguasaan materi praktikum semester berdasarkan kurikulum vokasi TI UNS.
          </p>
        </div>

        <div className="bg-black text-white px-5 py-3 rounded-2xl shadow-xs flex items-center gap-3">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
              Total XP Terkumpul
            </div>
            <div className="text-xl font-light text-white">{totalXp} XP</div>
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
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer ${
                isActive
                  ? "bg-black text-white border-black shadow-xs"
                  : "bg-[#F4F4F6] text-neutral-600 border-black/10 hover:bg-neutral-200 hover:text-black"
              }`}
            >
              {status === "all" && "Semua Topik"}
              {status === "recommended" && "Rekomendasi"}
              {status === "completed" && "Selesai"}
              {status === "locked" && "Terkunci"}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left = Node list, Right = Selected Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-3">
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;

            let badgeClass = "bg-[#F4F4F6] text-neutral-500 border-black/10";
            let badgeText = "Terkunci";
            if (node.status === "recommended") {
              badgeClass = "bg-amber-50 text-amber-800 border-amber-200/80";
              badgeText = "Perlu Penguatan";
            } else if (node.status === "completed") {
              badgeClass = "bg-emerald-50 text-emerald-800 border-emerald-200/80";
              badgeText = "Selesai";
            }

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNode(node)}
                className={`text-left p-4 rounded-2xl transition-all border cursor-pointer ${
                  isSelected
                    ? "border-black bg-neutral-50 shadow-xs ring-1 ring-black/10"
                    : "border-black/8 bg-white hover:border-black/20 hover:bg-neutral-50/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-medium text-black text-sm">{node.title}</h3>
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border shrink-0 ${badgeClass}`}
                  >
                    {badgeText}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {node.description}
                </p>
                <div className="mt-2 text-xs font-mono font-medium text-black flex items-center gap-1">
                  <span>{node.xp > 0 ? `+${node.xp} XP` : "0 XP"}</span>
                </div>
              </button>
            );
          })}
        </div>

        {selectedNode && (
          <div className="lg:col-span-2 bg-[#FAFAFA] border border-black/8 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                Topik Terpilih
              </div>
              <h3 className="text-base font-light text-black mb-2">{selectedNode.title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {selectedNode.description}
              </p>

              <div className="bg-white border border-black/8 rounded-xl p-3.5 space-y-1 shadow-2xs">
                <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  Status Capaian
                </div>
                <div className="text-xs font-medium flex items-center gap-2">
                  {selectedNode.status === "recommended" && (
                    <span className="text-amber-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                      Perlu Penguatan Materi
                    </span>
                  )}
                  {selectedNode.status === "completed" && (
                    <span className="text-emerald-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Materi Telah Tuntas
                    </span>
                  )}
                  {selectedNode.status === "locked" && (
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 inline-block" />
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
              className={`mt-6 w-full py-2.5 px-4 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                selectedNode.status === "locked"
                  ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
                  : "bg-black hover:bg-neutral-800 text-white"
              }`}
            >
              <span>
                {selectedNode.status === "locked" ? "Modul Belum Terbuka" : "Buka Modul Belajar &rarr;"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
