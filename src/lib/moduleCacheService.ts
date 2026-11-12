// src/lib/moduleCacheService.ts
/**
 * Service: Supabase (Prisma) Full Database Caching untuk Peta Belajar NEXED AI
 * Menghemat 100% token LLM & scraper YouTube saat cache hit (0 Token).
 */

import { createHash } from "crypto";
import type { Prisma } from "@prisma/client";
import { prisma, isDatabaseConfigured } from "./server/db";
import type { LearningStageItem, RecommendedDoc, RecommendedVideo } from "../components/NexedAiModuleHub";

export interface CachedModuleLearningPlan {
  cacheKey: string;
  topic: string;
  userGoal?: string;
  summary: string;
  coreKeywords: string[];
  recommendedQueries: string[];
  stages: LearningStageItem[];
  videos: RecommendedVideo[];
  curatedDocs?: RecommendedDoc[];
  fromCache: boolean;
  savedAt: string;
}

const memoryPlanCache = new Map<string, CachedModuleLearningPlan>();

/**
 * Menghasilkan kunci cache deterministik dari kombinasi:
 * topic + userGoal + hash teks PDF (konten materi)
 */
export function computeModuleCacheKey(
  topic: string,
  userGoal?: string,
  contentSample?: string,
): string {
  const cleanTopic = (topic || "modul-umum")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);

  const cleanGoal = (userGoal || "standar")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 30);

  const sample = (contentSample || "").trim().slice(0, 4000);
  const contentHash = createHash("sha256")
    .update(sample || cleanTopic)
    .digest("hex")
    .slice(0, 12);

  return `nxd_plan_${cleanTopic}_${cleanGoal}_${contentHash}`;
}

/**
 * Membaca Peta Belajar Lengkap dari Database Supabase (Prisma)
 * Mengembalikan data lengkap jika cache valid dan setiap tahap memiliki video (0 Token).
 */
export async function getCachedLearningPlan(
  cacheKey: string,
  forceRefresh = false,
): Promise<CachedModuleLearningPlan | null> {
  if (forceRefresh) return null;

  // 1. Cek Prisma Database Cache di Supabase
  if (isDatabaseConfigured()) {
    try {
      const record = await prisma.topicVideoCache.findUnique({
        where: { topicKey: cacheKey },
      });

      if (record && record.learningStages && Array.isArray(record.learningStages)) {
        const rawStages = record.learningStages as unknown as LearningStageItem[];
        const rawVideos = (Array.isArray(record.videos) ? record.videos : []) as unknown as RecommendedVideo[];

        // Pastikan cache tidak tercemar pesan status dan memiliki minimal 3 tahap
        const summaryLower = (record.userNeedsSummary || "").toLowerCase();
        const isPoisoned =
          summaryLower.includes("vector store") ||
          summaryLower.includes("tidak ada konten materi akademik") ||
          rawStages.length < 3;

        if (!isPoisoned) {
          // Garansi setiap tahap memiliki video tutorial aktif
          const verifiedStages = rawStages.map((stage, idx) => {
            const fallbackVideo =
              rawVideos.length > 0
                ? rawVideos[idx % rawVideos.length]
                : stage.stageVideo;

            return {
              ...stage,
              stageVideo: stage.stageVideo || fallbackVideo,
            };
          });

          const plan: CachedModuleLearningPlan = {
            cacheKey,
            topic: cacheKey.split("_")[2] || "Materi Pembelajaran",
            summary: record.userNeedsSummary,
            coreKeywords: [],
            recommendedQueries: Array.isArray(record.recommendedQueries)
              ? (record.recommendedQueries as string[])
              : [],
            stages: verifiedStages,
            videos: rawVideos,
            fromCache: true,
            savedAt: record.updatedAt.toISOString(),
          };

          memoryPlanCache.set(cacheKey, plan);
          return plan;
        }
      }
    } catch (err) {
      console.warn("[moduleCacheService] Gagal membaca cache Prisma Supabase:", err);
    }
  }

  // 2. Fallback Memory Cache
  const inMemory = memoryPlanCache.get(cacheKey);
  if (inMemory && inMemory.stages && inMemory.stages.length >= 3) {
    return { ...inMemory, fromCache: true };
  }

  return null;
}

/**
 * Menyimpan Peta Belajar Lengkap ke Database Supabase (Prisma)
 */
export async function saveCachedLearningPlan(params: {
  cacheKey: string;
  topic: string;
  userGoal?: string;
  summary: string;
  coreKeywords: string[];
  recommendedQueries: string[];
  stages: LearningStageItem[];
  videos: RecommendedVideo[];
  curatedDocs?: RecommendedDoc[];
}): Promise<void> {
  const {
    cacheKey,
    topic,
    userGoal,
    summary,
    coreKeywords,
    recommendedQueries,
    stages,
    videos,
    curatedDocs,
  } = params;

  // Pastikan setiap tahap memiliki video tutorial
  const stagesWithGuaranteedVideos = stages.map((s, idx) => {
    const video =
      s.stageVideo ||
      (videos.length > 0 ? videos[idx % videos.length] : undefined);

    const checklist =
      Array.isArray(s.actionChecklist) && s.actionChecklist.length >= 2
        ? s.actionChecklist
        : [
            `Pahami konsep kunci: ${(s.keyConcepts || []).slice(0, 2).join(" & ") || s.title}.`,
            s.selfAction || `Pelajari dan terapkan langkah kerja ${s.title}.`,
            s.practiceScenario || `Terapkan konsep pada studi kasus dan verifikasi hasil output.`,
          ];

    return {
      ...s,
      stageVideo: video,
      actionChecklist: checklist,
    };
  });

  const planPayload: CachedModuleLearningPlan = {
    cacheKey,
    topic,
    userGoal,
    summary,
    coreKeywords,
    recommendedQueries,
    stages: stagesWithGuaranteedVideos,
    videos,
    curatedDocs,
    fromCache: false,
    savedAt: new Date().toISOString(),
  };

  memoryPlanCache.set(cacheKey, planPayload);

  if (isDatabaseConfigured() && stagesWithGuaranteedVideos.length > 0) {
    try {
      await prisma.topicVideoCache.upsert({
        where: { topicKey: cacheKey },
        create: {
          topicKey: cacheKey,
          userNeedsSummary: summary,
          recommendedQueries: recommendedQueries as unknown as Prisma.InputJsonValue,
          videos: videos as unknown as Prisma.InputJsonValue,
          learningStages: stagesWithGuaranteedVideos as unknown as Prisma.InputJsonValue,
        },
        update: {
          userNeedsSummary: summary,
          recommendedQueries: recommendedQueries as unknown as Prisma.InputJsonValue,
          videos: videos as unknown as Prisma.InputJsonValue,
          learningStages: stagesWithGuaranteedVideos as unknown as Prisma.InputJsonValue,
        },
      });
    } catch (err) {
      console.warn("[moduleCacheService] Gagal menyimpan cache ke Supabase Prisma:", err);
    }
  }
}

/**
 * Menyinkronkan progres tahap belajar user ke Prisma database (Web & Mobile sync)
 */
export async function syncUserStageProgress(params: {
  userId?: string;
  moduleId: string;
  moduleTitle: string;
  completedStages: number[];
  progressPercent: number;
  isCompleted?: boolean;
  quizScore?: number;
  certificateCode?: string;
}): Promise<void> {
  const {
    userId,
    moduleId,
    moduleTitle,
    completedStages,
    progressPercent,
    isCompleted = false,
    quizScore,
  } = params;

  if (!userId || !isDatabaseConfigured()) return;

  try {
    await prisma.moduleProgress.upsert({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
        },
      },
      create: {
        userId,
        moduleId,
        moduleTitle,
        completedSteps: JSON.stringify(completedStages),
        progressPercent,
        isCompleted,
        quizScore: quizScore !== undefined ? quizScore : null,
      },
      update: {
        moduleTitle,
        completedSteps: JSON.stringify(completedStages),
        progressPercent,
        isCompleted,
        quizScore: quizScore !== undefined ? quizScore : undefined,
      },
    });
  } catch (err) {
    console.warn("[moduleCacheService] Gagal menyinkronkan moduleProgress ke database:", err);
  }
}

