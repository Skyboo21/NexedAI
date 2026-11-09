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

// =========================================================================
// SINGLE SOURCE OF TRUTH UNTUK SESI MODUL & PETA BELAJAR AKTIF
// =========================================================================

export interface ActiveModuleSessionStage {
  stageNumber: number;
  phaseLabel: string;
  title: string;
  shortSummary: string;
  selfAction: string;
  detailedMaterial: string;
  keyConcepts: string[];
  practiceScenario: string;
  comprehensionQuestion: string;
  searchQuery: string;
  understood?: boolean;
}

export interface ActiveModuleSessionVideo {
  videoId?: string;
  embedId: string;
  videoUrl: string;
  title: string;
  channel: string;
  channelName?: string;
  duration: string;
  summaryTopic: string;
  viewCount?: number;
  likeCount?: number;
  qualityScore?: number;
  isValidated?: boolean;
  topComments?: Array<{ author: string; text: string; likes?: number }>;
}

export interface ActiveModuleSessionDoc {
  title: string;
  source: string;
  url: string;
  description: string;
}

export interface ActiveModuleSession {
  id?: string;
  moduleId?: string;
  title: string;
  detectedTopic: string;
  filename?: string;
  fileName?: string;
  userFocus?: string;
  extractedText?: string;
  rawText?: string;
  chunkCount?: number;
  totalWords?: number;
  coreKeywords: string[];
  userNeedsSummary: string;
  recommendedQueries: string[];
  learningStages: ActiveModuleSessionStage[];
  validatedVideos: ActiveModuleSessionVideo[];
  webReferences: ActiveModuleSessionDoc[];
  analyzedResult?: unknown;
  updatedAt: string;
}

const ACTIVE_MODULE_SESSION_KEY = "nexedai_active_module_session_v1";
const LEGACY_ACTIVE_MODULE_KEY = "nexed_active_analyzed_module";
export const MODULE_UPDATED_EVENT = "nexedai-module-updated";

/**
 * Menyimpan sesi modul aktif terbaru sebagai Single Source of Truth
 * antara halaman /modul (NexedAiModuleHub) dan /peta-belajar.
 */
export function saveActiveModuleSession(session: ActiveModuleSession): void {
  if (typeof window === "undefined") return;
  try {
    const resolvedId = session.id || session.moduleId || "modul-aktif";
    const resolvedFilename = session.filename || session.fileName;
    const normalized: ActiveModuleSession = {
      ...session,
      id: resolvedId,
      moduleId: resolvedId,
      filename: resolvedFilename,
      fileName: resolvedFilename,
      updatedAt: session.updatedAt || new Date().toISOString(),
    };
    localStorage.setItem(ACTIVE_MODULE_SESSION_KEY, JSON.stringify(normalized));

    // Sinkronkan juga ke key legacy agar komponen katalog lama tetap kompatibel
    if (normalized.analyzedResult) {
      const legacyPayload = {
        id: resolvedId,
        title: normalized.detectedTopic || normalized.title,
        filename: resolvedFilename || `${normalized.title}.pdf`,
        chunkCount: normalized.chunkCount || 1,
        totalWords:
          normalized.totalWords ||
          (normalized.extractedText || normalized.rawText || "").split(/\s+/).filter(Boolean).length ||
          100,
        rawText: normalized.extractedText || normalized.rawText || "",
        analyzedResult: normalized.analyzedResult,
        savedAt: normalized.updatedAt,
      };
      localStorage.setItem(LEGACY_ACTIVE_MODULE_KEY, JSON.stringify(legacyPayload));
    }

    window.dispatchEvent(
      new CustomEvent(MODULE_UPDATED_EVENT, { detail: normalized }),
    );
    window.dispatchEvent(new Event("nexed_modules_updated"));
  } catch (err) {
    console.warn("[saveActiveModuleSession] Gagal menyimpan sesi modul aktif:", err);
  }
}

function isCorruptedModuleText(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const lower = value.toLowerCase();
  return (
    lower.includes("berhasil diindeks ke vector store") ||
    lower.includes("tidak ada konten materi akademik") ||
    lower.includes("konfirmasi teknis bahwa file")
  );
}

/**
 * Membaca sesi modul aktif terbaru dari localStorage
 */
export function getActiveModuleSession(): ActiveModuleSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_MODULE_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ActiveModuleSession;
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.learningStages)) {
        const isCorrupted =
          isCorruptedModuleText(parsed.title) ||
          isCorruptedModuleText(parsed.detectedTopic) ||
          isCorruptedModuleText(parsed.userNeedsSummary) ||
          isCorruptedModuleText(parsed.extractedText) ||
          isCorruptedModuleText(parsed.rawText) ||
          parsed.learningStages.some(
            (s) => isCorruptedModuleText(s.title) || isCorruptedModuleText(s.shortSummary),
          );

        if (isCorrupted) {
          localStorage.removeItem(ACTIVE_MODULE_SESSION_KEY);
          localStorage.removeItem(LEGACY_ACTIVE_MODULE_KEY);
          return null;
        }
        return parsed;
      }
    }

    // Fallback migrasi dari key legacy jika ada
    const legacyRaw = localStorage.getItem(LEGACY_ACTIVE_MODULE_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      const ar = legacy?.analyzedResult;
      if (
        isCorruptedModuleText(legacy?.title) ||
        isCorruptedModuleText(legacy?.rawText) ||
        isCorruptedModuleText(ar?.title) ||
        isCorruptedModuleText(ar?.detectedTopic) ||
        isCorruptedModuleText(ar?.userNeedsSummary) ||
        isCorruptedModuleText(ar?.summary?.overview)
      ) {
        localStorage.removeItem(ACTIVE_MODULE_SESSION_KEY);
        localStorage.removeItem(LEGACY_ACTIVE_MODULE_KEY);
        return null;
      }
      if (ar && typeof ar === "object") {
        const stages: ActiveModuleSessionStage[] = Array.isArray(ar.learningStages) && ar.learningStages.length > 0
          ? ar.learningStages
          : Array.isArray(ar.roadmap)
            ? ar.roadmap.map((r: Record<string, unknown>, idx: number) => ({
                stageNumber: typeof r.step === "number" ? r.step : idx + 1,
                phaseLabel: String(r.stage || `Tahap ${idx + 1}`),
                title: String(r.title || `Tahap ${idx + 1}`),
                shortSummary: String(r.description || ""),
                selfAction: String(r.actionItem || ""),
                detailedMaterial: String(r.detailedGuide || r.description || ""),
                keyConcepts: Array.isArray(r.keyConcepts) ? r.keyConcepts.map(String) : [],
                practiceScenario: String(r.practiceScenario || ""),
                comprehensionQuestion: String(r.checkQuestion || ""),
                searchQuery: String(r.searchQuery || `${ar.detectedTopic || ar.title || ""} ${r.title || ""}`.trim()),
              }))
            : [];
        if (stages.length > 0) {
          return {
            id: String(legacy.id || "active-module"),
            title: String(ar.title || legacy.title || "Modul Aktif"),
            detectedTopic: String(ar.detectedTopic || ar.title || legacy.title || "Modul Aktif"),
            filename: legacy.filename,
            extractedText: legacy.rawText,
            rawText: legacy.rawText,
            chunkCount: legacy.chunkCount,
            totalWords: legacy.totalWords,
            coreKeywords: Array.isArray(ar.coreKeywords) ? ar.coreKeywords : [],
            userNeedsSummary: String(ar.userNeedsSummary || ar.summary?.overview || ""),
            recommendedQueries: Array.isArray(ar.recommendedQueries) ? ar.recommendedQueries : [],
            learningStages: stages,
            validatedVideos: Array.isArray(ar.validatedVideos)
              ? ar.validatedVideos
              : Array.isArray(ar.videos)
                ? ar.videos
                : [],
            webReferences: Array.isArray(ar.webReferences)
              ? ar.webReferences
              : Array.isArray(ar.recommendedDocs)
                ? ar.recommendedDocs
                : [],
            analyzedResult: ar,
            updatedAt: String(legacy.savedAt || new Date().toISOString()),
          };
        }
      }
    }
  } catch (err) {
    console.warn("[getActiveModuleSession] Gagal membaca sesi modul aktif:", err);
  }
  return null;
}

/**
 * Menghapus sesi modul aktif dari localStorage
 */
export function clearActiveModuleSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVE_MODULE_SESSION_KEY);
    localStorage.removeItem(LEGACY_ACTIVE_MODULE_KEY);
    window.dispatchEvent(new CustomEvent(MODULE_UPDATED_EVENT, { detail: null }));
    window.dispatchEvent(new Event("nexed_modules_updated"));
  } catch {}
}

/**
 * Berlangganan event perubahan sesi modul aktif (nexedai-module-updated)
 */
export function onActiveModuleSessionUpdate(
  callback: (session: ActiveModuleSession | null) => void,
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    callback(getActiveModuleSession());
  };
  window.addEventListener(MODULE_UPDATED_EVENT, handler);
  window.addEventListener("nexed_modules_updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(MODULE_UPDATED_EVENT, handler);
    window.removeEventListener("nexed_modules_updated", handler);
    window.removeEventListener("storage", handler);
  };
}

