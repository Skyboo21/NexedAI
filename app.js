import { z } from "zod";
import { cva } from "class-variance-authority";

const NodeStatusEnum = z.enum(["completed", "recommended", "locked"]);
const LearningNodeSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  status: NodeStatusEnum,
  xp: z.number().min(0)
});

const rawLearningNodes = [
  { id: 1, title: "Pengantar Algoritma", description: "Pemahaman dasar struktur logika dan algoritma sekuensial.", status: "completed", xp: 50 },
  { id: 2, title: "Struktur Kondisional", description: "Mempelajari percabangan IF-ELSE dan Switch Case.", status: "completed", xp: 75 },
  { id: 3, title: "Looping & Iterasi", description: "Kamu butuh penguatan di bagian ini. Mari pelajari FOR dan WHILE loop bersama NEXED Bot!", status: "recommended", xp: 100 },
  { id: 4, title: "Struktur Data Array", description: "Menyimpan banyak data dalam satu variabel. (Terkunci, selesaikan materi sebelumnya)", status: "locked", xp: 0 }
];

const learningNodes = rawLearningNodes.map(node => LearningNodeSchema.parse(node));

const nodeVariants = cva(
  "block w-full max-w-md p-6 rounded-3xl border transition-all duration-500 relative",
  {
    variants: {
      status: {
        completed: "bg-white border-emerald-200 shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        recommended: "bg-white border-purple-400 ai-glow transform hover:scale-105 group cursor-pointer shadow-xl",
        locked: "bg-slate-50 border-slate-200 opacity-60 grayscale cursor-not-allowed"
      }
    }
  }
);

const iconVariants = cva(
  "absolute left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-lg z-20 text-xl transition-transform duration-300", 
  {
    variants: {
      status: {
        completed: "bg-emerald-500 shadow-emerald-500/30 hover:scale-110 hover:rotate-6",
        recommended: "bg-gradient-to-br from-purple-600 to-blue-600 shadow-purple-500/40 hover:scale-110",
        locked: "bg-slate-300 shadow-none"
      }
    }
  }
);

const badgeVariants = cva(
  "text-xs font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider", 
  {
    variants: {
      status: {
        completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
        recommended: "bg-purple-100 text-purple-800 border-purple-300",
        locked: "bg-slate-100 text-slate-500 border-slate-200"
      }
    }
  }
);

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('learning-path-container');
  if(!container) return;

  container.innerHTML = learningNodes.map((node, index) => {
    const isEven = index % 2 === 0;
    const alignmentClass = isEven ? "mr-auto pr-8 md:pr-12 lg:pr-16" : "ml-auto pl-8 md:pl-12 lg:pl-16";
    const flexDir = isEven ? "flex-row-reverse" : "flex-row";
    const statusLabel = node.status === 'recommended' ? 'AI Recommended' : node.status === 'completed' ? 'Selesai' : 'Terkunci';
    const isLocked = node.status === 'locked';
    const linkOpenTag = isLocked 
      ? `<div class="${nodeVariants({ status: node.status })}">` 
      : `<a href="modul.html" class="${nodeVariants({ status: node.status })} focus:outline-none focus:ring-4 focus:ring-purple-500/30">`;
    const linkCloseTag = isLocked ? `</div>` : `</a>`;
    const iconStr = node.status === 'completed' ? '✓' : node.status === 'recommended' ? '★' : '🔒';

    return `
      <div class="relative w-full flex justify-center items-center group/tooltip">
        <div class="${iconVariants({ status: node.status })}">${iconStr}</div>
        <article class="w-1/2 ${alignmentClass} flex ${flexDir}">
          ${linkOpenTag}
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-xl font-bold tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors">${node.title}</h3>
            </div>
            <p class="text-sm text-slate-600 mb-5 leading-relaxed">${node.description}</p>
            <div class="flex items-center space-x-3">
              <span class="${badgeVariants({ status: node.status })}">${statusLabel}</span>
              ${node.xp > 0 ? `<span class="text-sm font-extrabold text-amber-500">+${node.xp} XP</span>` : ''}
            </div>
            ${node.status === 'recommended' ? `
              <div class="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl whitespace-nowrap pointer-events-none z-30 shadow-2xl font-medium">
                Klik untuk mulai belajar dengan NEXED Bot!
                <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
              </div>
            ` : ''}
          ${linkCloseTag}
        </article>
      </div>
    `;
  }).join('');
});
