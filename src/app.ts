// src/app.ts
import { fetchLearningNodesApi } from "./services/apiService";
import { nodeVariants, iconVariants, nodeBadgeVariants } from "./components/badge";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById('learning-path-container');
  if (!container) return;

  try {
    const nodes = await fetchLearningNodesApi();
    
    container.innerHTML = nodes.map((node, index) => {
      const isEven = index % 2 === 0;
      const alignmentClass = isEven ? "mr-auto pr-8 md:pr-12 lg:pr-16" : "ml-auto pl-8 md:pl-12 lg:pl-16";
      const flexDir = isEven ? "flex-row-reverse" : "flex-row";
      
      const statusLabel = node.status === 'recommended' ? 'AI Recommended' : 
                          node.status === 'completed' ? 'Selesai' : 'Terkunci';

      const isLocked = node.status === 'locked';
      const linkOpenTag = isLocked 
        ? `<div class="${nodeVariants({ status: node.status })}">` 
        : `<a href="modul.html" class="${nodeVariants({ status: node.status })} focus:outline-none focus:ring-4 focus:ring-purple-500/30">`;
      const linkCloseTag = isLocked ? `</div>` : `</a>`;

      const iconStr = node.status === 'completed' ? '✓' : node.status === 'recommended' ? '★' : '🔒';

      return `
        <div class="relative w-full flex justify-center items-center group/tooltip">
          <div class="${iconVariants({ status: node.status })}">
            ${iconStr}
          </div>
          <article class="w-1/2 ${alignmentClass} flex ${flexDir}">
            ${linkOpenTag}
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-xl font-bold tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors">${node.title}</h3>
              </div>
              <p class="text-sm text-slate-600 mb-5 leading-relaxed">${node.description}</p>
              <div class="flex items-center space-x-3">
                <span class="${nodeBadgeVariants({ status: node.status })}">
                  ${statusLabel}
                </span>
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
  } catch (error) {
    console.error("Error loading path:", error);
    container.innerHTML = `<p class="text-red-500">Gagal memuat peta belajar.</p>`;
  }
});
