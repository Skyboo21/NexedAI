// src/lib/progressStorage.ts
/**
 * Engine Persistensi Progres Belajar Mahasiswa
 * Menyimpan rekaman per modul (tahap selesai, status tuntas, skor kuis, perolehan XP)
 * di LocalStorage dengan sinkronisasi reaktif ke seluruh antarmuka.
 */

export interface ModuleProgress {
  moduleId: string;
  title: string;
  completedSteps: number[]; // Contoh: [1, 2, 3, 4]
  progressPercent: number; // 0 - 100
  isCompleted: boolean;
  quizScore?: number;
  xpEarned: number;
  lastUpdated: string;
}

const STORAGE_KEY = "nexed_module_progress_v1";
const TOTAL_XP_KEY = "nexed_total_user_xp";
const COMPLETED_TOPICS_KEY = "completed_topics";
const PROGRESS_EVENT = "nexed_progress_updated";

/**
 * Membaca semua progres modul yang tersimpan
 */
export function getAllModuleProgress(): Record<string, ModuleProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Membaca progres modul tertentu berdasarkan moduleId atau slug judul
 */
export function getModuleProgress(moduleId: string): ModuleProgress | null {
  if (!moduleId) return null;
  const all = getAllModuleProgress();
  const cleanId = moduleId.toLowerCase().trim();
  return all[cleanId] ?? null;
}

/**
 * Menyimpan atau memperbarui progres modul tertentu
 */
export function saveModuleProgress(progress: ModuleProgress): void {
  if (typeof window === "undefined" || !progress.moduleId) return;

  try {
    const all = getAllModuleProgress();
    const cleanId = progress.moduleId.toLowerCase().trim();
    all[cleanId] = {
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    // Sinkronisasi dengan completed_topics untuk kompatibilitas katalog modul
    if (progress.isCompleted) {
      syncLegacyCompletedTopic(progress.moduleId);
    }

    // Panggil event bus lokal
    window.dispatchEvent(
      new CustomEvent(PROGRESS_EVENT, { detail: { moduleId: cleanId, progress } }),
    );
  } catch (err) {
    console.warn("[saveModuleProgress] Gagal menyimpan ke localStorage:", err);
  }
}

/**
 * Menandai modul sebagai selesai (100% tuntas) dan mencatat perolehan XP
 */
export function markModuleCompleted(
  moduleId: string,
  title: string,
  xpReward = 150,
  quizScore?: number,
): ModuleProgress {
  const existing = getModuleProgress(moduleId);
  const alreadyCompleted = existing?.isCompleted ?? false;
  const xpToAdd = alreadyCompleted ? 0 : xpReward;

  const updated: ModuleProgress = {
    moduleId: moduleId.toLowerCase().trim(),
    title,
    completedSteps: [1, 2, 3, 4],
    progressPercent: 100,
    isCompleted: true,
    quizScore: quizScore ?? existing?.quizScore ?? 100,
    xpEarned: (existing?.xpEarned ?? 0) + xpToAdd,
    lastUpdated: new Date().toISOString(),
  };

  saveModuleProgress(updated);

  if (xpToAdd > 0) {
    addTotalUserXp(xpToAdd);
  }

  return updated;
}

/**
 * Menambah total akumulasi XP pengguna
 */
export function addTotalUserXp(amount: number): number {
  if (typeof window === "undefined" || amount <= 0) return getTotalUserXp();
  try {
    const current = getTotalUserXp();
    const next = current + amount;
    localStorage.setItem(TOTAL_XP_KEY, next.toString());

    // Perbarui auth user jika ada
    try {
      const userRaw = localStorage.getItem("nexed_auth_user");
      if (userRaw) {
        const userObj = JSON.parse(userRaw);
        userObj.xp = (userObj.xp ?? current) + amount;
        localStorage.setItem("nexed_auth_user", JSON.stringify(userObj));
      }
    } catch {}

    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { totalXp: next } }));
    return next;
  } catch {
    return getTotalUserXp();
  }
}

/**
 * Membaca total XP akumulasi pengguna (default 225 jika baru)
 */
export function getTotalUserXp(baseDefault = 225): number {
  if (typeof window === "undefined") return baseDefault;
  try {
    const raw = localStorage.getItem(TOTAL_XP_KEY);
    if (raw) {
      const num = Number.parseInt(raw, 10);
      if (!Number.isNaN(num) && num >= 0) return num;
    }

    // Fallback dari nexed_auth_user jika ada
    const userRaw = localStorage.getItem("nexed_auth_user");
    if (userRaw) {
      const userObj = JSON.parse(userRaw);
      if (typeof userObj?.xp === "number" && userObj.xp >= 0) {
        return userObj.xp;
      }
    }
  } catch {}
  return baseDefault;
}

/**
 * Menghitung jumlah modul yang telah tuntas
 */
export function getCompletedModulesCount(): number {
  const all = getAllModuleProgress();
  const directCompleted = Object.values(all).filter((p) => p.isCompleted).length;

  if (typeof window !== "undefined") {
    try {
      const legacyRaw = localStorage.getItem(COMPLETED_TOPICS_KEY);
      if (legacyRaw) {
        const arr = JSON.parse(legacyRaw);
        if (Array.isArray(arr)) {
          return Math.max(directCompleted, arr.length);
        }
      }
    } catch {}
  }

  return directCompleted;
}

/**
 * Membaca ID topik yang telah diselesaikan (berupa array number untuk katalog & dashboard)
 */
export function getCompletedTopicIds(): number[] {
  const ids = new Set<number>([1, 2]); // Default topik dasar aktif
  if (typeof window === "undefined") return Array.from(ids);

  try {
    const raw = localStorage.getItem(COMPLETED_TOPICS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === "number" && !Number.isNaN(item)) {
            ids.add(item);
          } else if (typeof item === "string") {
            const match = item.match(/\d+/);
            if (match) {
              const num = Number.parseInt(match[0], 10);
              if (!Number.isNaN(num)) ids.add(num);
            }
          }
        }
      }
    }

    // Periksa juga dari all module progress
    const all = getAllModuleProgress();
    for (const [id, progress] of Object.entries(all)) {
      if (progress.isCompleted) {
        const match = id.match(/\d+/);
        if (match) {
          const num = Number.parseInt(match[0], 10);
          if (!Number.isNaN(num)) ids.add(num);
        }
      }
    }
  } catch {}

  return Array.from(ids);
}

/**
 * Berlangganan event perubahan progres secara reaktif
 */
export function onProgressUpdate(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(PROGRESS_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/**
 * Sinkronisasi dengan array legacy completed_topics (misal topik ID numerik)
 */
function syncLegacyCompletedTopic(moduleId: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(COMPLETED_TOPICS_KEY);
    const list: Array<number | string> = raw ? JSON.parse(raw) : [];

    // Jika numeric id (e.g. "modul-3" atau "3")
    const numMatch = moduleId.match(/\d+/);
    const numericId = numMatch ? Number.parseInt(numMatch[0], 10) : null;

    let changed = false;
    if (numericId && !list.includes(numericId)) {
      list.push(numericId);
      changed = true;
    }
    if (!list.includes(moduleId)) {
      list.push(moduleId);
      changed = true;
    }

    if (changed) {
      localStorage.setItem(COMPLETED_TOPICS_KEY, JSON.stringify(list));
    }
  } catch {}
}
