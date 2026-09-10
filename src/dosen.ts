// src/dosen.ts
import { fetchStudentMasteryApi } from "./services/apiService";
import { badgeVariants } from "./components/badge";
import type { StudentMastery } from "./schemas/taskSchema";

// Untuk menyimpan state di client
let students: StudentMastery[] = [];

// =================================================================
// 1. RENDER KARTU ALERT (Manipulasi DOM Dinamis)
// =================================================================
const alertContainer = document.getElementById('alert-container');

function renderAlerts() {
  if (!alertContainer) return;
  const atRiskStudents = students.filter((s) => s.status === 'Berisiko');
  
  if (atRiskStudents.length === 0) {
    alertContainer.innerHTML = `<div class="bg-white/50 border border-slate-200 p-6 rounded-2xl col-span-full flex items-center justify-center"><p class="text-slate-500 text-sm font-medium">✨ Semua mahasiswa terpantau aman.</p></div>`;
    return;
  }

  alertContainer.innerHTML = atRiskStudents.map((student) => `
    <div id="alert-${student.id}" class="bg-white p-6 rounded-2xl border border-red-100 shadow-[0_4px_20px_rgba(239,68,68,0.08)] flex justify-between items-start transition-all duration-300 relative overflow-hidden group" role="alert">
      <div class="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
      <div class="pl-3">
        <h3 class="font-extrabold text-slate-900 text-lg tracking-tight">${student.name}</h3>
        <p class="text-sm text-slate-600 mt-2 leading-relaxed">Mastery drop ke <strong class="text-red-600 text-base">${student.mastery}%</strong> pada topik <strong class="text-slate-800">${student.topic}</strong>. Sistem AI telah mengalihkan ke rute remedial.</p>
      </div>
      <button class="btn-dismiss text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0" data-id="${student.id}" aria-label="Tutup pemberitahuan">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
      </button>
    </div>
  `).join('');

  // Event Delegation for Dismiss Buttons
  const dismissButtons = document.querySelectorAll('.btn-dismiss');
  dismissButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.target as HTMLButtonElement;
      const id = target.getAttribute('data-id');
      if (id) dismissAlert(Number(id));
    });
  });
}

function dismissAlert(id: number) {
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
}

// =================================================================
// 2. RENDER TABEL MASTERY MAHASISWA
// =================================================================
const tableBody = document.getElementById('student-table-body');

function getStatusStyles(status: string) {
  if (status === 'Aman') return { bar: "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]", trHover: "hover:shadow-emerald-500/10", icon: "bg-emerald-500" };
  if (status === 'Perlu Perhatian') return { bar: "bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]", trHover: "hover:shadow-amber-500/10", icon: "bg-amber-500" };
  return { bar: "bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]", trHover: "hover:shadow-red-500/10", icon: "bg-red-500 animate-ping" };
}

function renderTable() {
  if (!tableBody) return;
  tableBody.innerHTML = students.map((student) => {
    const styles = getStatusStyles(student.status);
    const badgeHtml = badgeVariants({ variant: student.status });

    return `
      <tr class="bg-white transition-all duration-300 hover:-translate-y-0.5 rounded-2xl group ${styles.trHover}">
        <td class="px-6 py-5 font-bold text-slate-900 rounded-l-2xl">${student.name}</td>
        <td class="px-6 py-5 font-medium text-slate-600">${student.topic}</td>
        <td class="px-6 py-5">
          <div class="flex items-center space-x-4">
            <span class="text-sm font-extrabold w-10 text-right">${student.mastery}%</span>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div class="h-full rounded-full transition-all duration-1000 ${styles.bar}" style="width: 0%;" data-target-width="${student.mastery}%"></div>
            </div>
          </div>
        </td>
        <td class="px-6 py-5 rounded-r-2xl">
          <span class="${badgeHtml}">
            <span class="w-2 h-2 rounded-full ${styles.icon}"></span>
            <span>${student.status}</span>
          </span>
        </td>
      </tr>
    `;
  }).join('');

  setTimeout(() => {
    document.querySelectorAll<HTMLElement>('[data-target-width]').forEach((el) => {
      el.style.width = el.getAttribute('data-target-width') || '0%';
    });
  }, 100);
}

// =================================================================
// 3. EKSEKUSI ASINKRON (Fetch Simulation)
// =================================================================
const btnRefresh = document.getElementById('btn-refresh') as HTMLButtonElement | null;

if (btnRefresh) {
  btnRefresh.addEventListener('click', async function() {
    const btn = this;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="animate-spin text-xl">↻</span> <span>Memuat...</span>`;
    btn.disabled = true;
    btn.classList.add('opacity-70');
    
    try {
      students = await fetchStudentMasteryApi();
      renderAlerts();
      renderTable();
    } catch(e) {
      console.error("Gagal refresh data", e);
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.classList.remove('opacity-70');
    }
  });
}

// Inisialisasi awal
document.addEventListener("DOMContentLoaded", async () => {
  try {
    students = await fetchStudentMasteryApi();
    renderAlerts();
    renderTable();
  } catch (error) {
    console.error("Failed to load students data", error);
  }
});
