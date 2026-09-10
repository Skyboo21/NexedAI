import { z } from "zod";
import { cva } from "class-variance-authority";

const StatusEnum = z.enum(["Aman", "Perlu Perhatian", "Berisiko"]);
const StudentMasterySchema = z.object({
  id: z.number(),
  name: z.string(),
  topic: z.string(),
  mastery: z.number().min(0).max(100),
  status: StatusEnum
});

const rawStudents = [
  { id: 101, name: "Ucik Dika Maharani", topic: "Looping & Iterasi", mastery: 92, status: "Aman" },
  { id: 102, name: "Budi Santoso", topic: "Struktur Array", mastery: 45, status: "Berisiko" },
  { id: 103, name: "Siti Aminah", topic: "Pengantar Algoritma", mastery: 78, status: "Perlu Perhatian" },
  { id: 104, name: "Zam Zam Zahrina", topic: "Looping & Iterasi", mastery: 88, status: "Aman" },
  { id: 105, name: "Rita Tri Rahmawati", topic: "Struktur Kondisional", mastery: 30, status: "Berisiko" }
];

let students = rawStudents.map(s => StudentMasterySchema.parse(s));

const badgeVariants = cva(
  "px-3 py-1.5 text-xs font-bold rounded-lg border uppercase tracking-wider inline-flex items-center space-x-1.5 shadow-sm",
  {
    variants: {
      status: {
        "Aman": "bg-emerald-50 text-emerald-700 border-emerald-200",
        "Perlu Perhatian": "bg-amber-50 text-amber-700 border-amber-200",
        "Berisiko": "bg-red-50 text-red-700 border-red-200"
      }
    }
  }
);

const barVariants = cva(
  "h-2.5 rounded-full transition-all duration-1000",
  {
    variants: {
      status: {
        "Aman": "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
        "Perlu Perhatian": "bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]",
        "Berisiko": "bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
      }
    }
  }
);

const trVariants = cva(
  "bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 rounded-2xl group",
  {
    variants: {
      status: {
        "Aman": "hover:shadow-emerald-500/10",
        "Perlu Perhatian": "hover:shadow-amber-500/10",
        "Berisiko": "hover:shadow-red-500/10"
      }
    }
  }
);

const alertContainer = document.getElementById('alert-container');
function renderAlerts() {
  const atRiskStudents = students.filter(s => s.status === 'Berisiko');
  if (atRiskStudents.length === 0) {
    if(alertContainer) alertContainer.innerHTML = `<div class="bg-white/50 border border-slate-200 p-6 rounded-2xl col-span-full flex items-center justify-center"><p class="text-slate-500 text-sm font-medium">✨ Semua mahasiswa terpantau aman.</p></div>`;
    return;
  }
  if(alertContainer) {
    alertContainer.innerHTML = atRiskStudents.map(student => `
      <div id="alert-${student.id}" class="bg-white p-6 rounded-2xl border border-red-100 shadow-[0_4px_20px_rgba(239,68,68,0.08)] flex justify-between items-start transition-all duration-300 relative overflow-hidden group" role="alert">
        <div class="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
        <div class="pl-3">
          <h3 class="font-extrabold text-slate-900 text-lg tracking-tight">${student.name}</h3>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">Mastery drop ke <strong class="text-red-600 text-base">${student.mastery}%</strong> pada topik <strong class="text-slate-800">${student.topic}</strong>. Sistem AI telah mengalihkan ke rute remedial.</p>
        </div>
        <button onclick="dismissAlert(${student.id})" class="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0" aria-label="Tutup pemberitahuan">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </button>
      </div>
    `).join('');
  }
}

window.dismissAlert = function(id) {
  const alertCard = document.getElementById(`alert-${id}`);
  if (alertCard) {
    alertCard.style.opacity = '0';
    alertCard.style.transform = 'scale(0.95)';
    setTimeout(() => {
      alertCard.remove();
      if (alertContainer && alertContainer.children.length === 0) {
        alertContainer.innerHTML = `<div class="bg-white/50 border border-slate-200 p-6 rounded-2xl col-span-full flex items-center justify-center"><p class="text-slate-500 text-sm font-medium">✨ Semua peringatan telah ditinjau.</p></div>`;
      }
    }, 300);
  }
};

const tableBody = document.getElementById('student-table-body');
function renderTable() {
  if(!tableBody) return;
  tableBody.innerHTML = students.map(student => {
    let iconHTML = student.status === 'Aman' ? '<span class="w-2 h-2 rounded-full bg-emerald-500"></span>' :
                   student.status === 'Perlu Perhatian' ? '<span class="w-2 h-2 rounded-full bg-amber-500"></span>' :
                   '<span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>';
    return `
      <tr class="${trVariants({ status: student.status })}">
        <td class="px-6 py-5 font-bold text-slate-900 rounded-l-2xl">${student.name}</td>
        <td class="px-6 py-5 font-medium text-slate-600">${student.topic}</td>
        <td class="px-6 py-5">
          <div class="flex items-center space-x-4">
            <span class="text-sm font-extrabold w-10 text-right">${student.mastery}%</span>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div class="${barVariants({ status: student.status })}" style="width: 0%;" data-target-width="${student.mastery}%"></div>
            </div>
          </div>
        </td>
        <td class="px-6 py-5 rounded-r-2xl">
          <span class="${badgeVariants({ status: student.status })}">
            ${iconHTML}
            <span>${student.status}</span>
          </span>
        </td>
      </tr>
    `;
  }).join('');

  setTimeout(() => {
    document.querySelectorAll('[data-target-width]').forEach(el => {
      el.style.width = el.getAttribute('data-target-width');
    });
  }, 100);
}

document.getElementById('btn-refresh')?.addEventListener('click', async function() {
  const btn = this;
  const originalText = btn.innerHTML;
  btn.innerHTML = `<span class="animate-spin text-xl">↻</span> <span>Memuat...</span>`;
  btn.disabled = true;
  btn.classList.add('opacity-70');
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    students = rawStudents.map(s => StudentMasterySchema.parse(s));
    renderAlerts();
    renderTable();
  } catch(e) {
    console.error(e);
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
    btn.classList.remove('opacity-70');
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderAlerts();
  renderTable();
});
