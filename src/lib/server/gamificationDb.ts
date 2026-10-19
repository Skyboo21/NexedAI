// src/lib/server/gamificationDb.ts
import { prisma, isDatabaseConfigured } from "./db";

export interface StandardBadgeDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  tier: "Gold" | "Silver" | "Bronze";
  iconName: string;
  requirementType: "quiz_perfect" | "streak_quiz" | "ai_chat_count" | "modules_completed" | "quiz_completed";
  targetValue: number;
}

export const INITIAL_BADGES: StandardBadgeDefinition[] = [
  {
    id: "b1",
    code: "algo_master",
    title: "Algo Master",
    description: "Menuntaskan modul algoritma sorting dengan skor 100",
    tier: "Gold",
    iconName: "Trophy",
    requirementType: "quiz_perfect",
    targetValue: 100,
  },
  {
    id: "b2",
    code: "active_recaller",
    title: "Active Recaller",
    description: "Menjawab kuis active recall dengan performa konsisten",
    tier: "Gold",
    iconName: "Zap",
    requirementType: "streak_quiz",
    targetValue: 5,
  },
  {
    id: "b3",
    code: "deep_thinker",
    title: "Deep Thinker",
    description: "Menganalisis konsep komputasi bersama Nexed AI Tutor",
    tier: "Silver",
    iconName: "Brain",
    requirementType: "ai_chat_count",
    targetValue: 3,
  },
  {
    id: "b4",
    code: "target_achiever",
    title: "Target Achiever",
    description: "Menyelesaikan target modul belajar terstruktur kurikulum",
    tier: "Silver",
    iconName: "Target",
    requirementType: "modules_completed",
    targetValue: 3,
  },
  {
    id: "b5",
    code: "bug_hunter",
    title: "Bug Hunter",
    description: "Menyelesaikan 10 latihan pengujian logika dan penanganan kasus batas",
    tier: "Bronze",
    iconName: "Shield",
    requirementType: "quiz_completed",
    targetValue: 10,
  },
  {
    id: "b6",
    code: "speed_demon",
    title: "Speed Demon",
    description: "Menyelesaikan evaluasi mandiri secara tangkas dan tuntas",
    tier: "Bronze",
    iconName: "Rocket",
    requirementType: "quiz_completed",
    targetValue: 5,
  },
];

export function calculateLevelFromXp(xp: number): string {
  if (xp >= 4000) return "Lvl 12 • Grandmaster";
  if (xp >= 3000) return "Lvl 10 • Master";
  if (xp >= 2500) return "Lvl 9 • Expert";
  if (xp >= 2000) return "Lvl 7 • Scholar";
  if (xp >= 1500) return "Lvl 5 • Apprentice";
  if (xp >= 1000) return "Lvl 3 • Praktikan Terampil";
  if (xp >= 500) return "Lvl 2 • Learner";
  return "Lvl 1 • Novice";
}

/**
 * Inisialisasi seed badges dan default user activities jika database terkonfigurasi
 */
export async function ensureGamificationSeed(): Promise<void> {
  if (!prisma || !isDatabaseConfigured()) return;

  try {
    // 1. Upsert all badges
    for (const b of INITIAL_BADGES) {
      await prisma.badge.upsert({
        where: { code: b.code },
        update: {
          title: b.title,
          description: b.description,
          tier: b.tier,
          iconName: b.iconName,
          requirementType: b.requirementType,
          targetValue: b.targetValue,
        },
        create: {
          id: b.id,
          code: b.code,
          title: b.title,
          description: b.description,
          tier: b.tier,
          iconName: b.iconName,
          requirementType: b.requirementType,
          targetValue: b.targetValue,
        },
      });
    }

    // 2. Cek apakah user default mahasiswa sudah memiliki aktivitas awal
    const mahasiswa = await prisma.user.findFirst({
      where: { role: "mahasiswa" },
    });

    if (mahasiswa) {
      const activityCount = await prisma.learningActivity.count({
        where: { userId: mahasiswa.id },
      });

      if (activityCount === 0) {
        // Buat rekaman awal aktivitas nyata mahasiswa
        const initialActivities = [
          {
            userId: mahasiswa.id,
            type: "quiz_completed",
            title: "Kuis Active Recall: Struktur Kontrol & Perulangan",
            description: "Menuntaskan evaluasi mandiri materi For vs While dengan pemahaman logika mendalam.",
            xpEarned: 100,
            score: 100,
            metadata: JSON.stringify({ moduleId: "3", subject: "Algoritma & Pemrograman" }),
            createdAt: new Date(Date.now() - 3600 * 1000 * 2),
          },
          {
            userId: mahasiswa.id,
            type: "module_step",
            title: "Penyelesaian Tahap 4: Review Kritis & Rangkuman",
            description: "Menuntaskan tahapan sintesis materi Modul 2 Tipe Data & Variabel.",
            xpEarned: 75,
            score: 95,
            metadata: JSON.stringify({ moduleId: "2", step: 4 }),
            createdAt: new Date(Date.now() - 3600 * 1000 * 24),
          },
          {
            userId: mahasiswa.id,
            type: "ai_tutor_chat",
            title: "Konsultasi Analogi DFD vs Flowchart",
            description: "Diskusi interaktif bersama Nexed AI Tutor mengenai pemodelan sistem toko kelontong.",
            xpEarned: 25,
            score: null,
            metadata: JSON.stringify({ topic: "Analisis & Perancangan Sistem" }),
            createdAt: new Date(Date.now() - 3600 * 1000 * 48),
          },
          {
            userId: mahasiswa.id,
            type: "task_created",
            title: "Perencanaan Mandiri: Latihan Nested Loop",
            description: "Menambahkan checklist belajar persiapan responsi praktikum algoritma.",
            xpEarned: 25,
            score: null,
            metadata: JSON.stringify({ priority: "HIGH" }),
            createdAt: new Date(Date.now() - 3600 * 1000 * 72),
          },
        ];

        for (const act of initialActivities) {
          await prisma.learningActivity.create({ data: act });
        }

        // Buka lencana awal untuk mahasiswa
        const badgeAlgo = await prisma.badge.findUnique({ where: { code: "algo_master" } });
        if (badgeAlgo) {
          await prisma.userBadge.upsert({
            where: {
              userId_badgeId: {
                userId: mahasiswa.id,
                badgeId: badgeAlgo.id,
              },
            },
            update: {},
            create: {
              userId: mahasiswa.id,
              badgeId: badgeAlgo.id,
            },
          });
        }

        const badgeRecaller = await prisma.badge.findUnique({ where: { code: "active_recaller" } });
        if (badgeRecaller) {
          await prisma.userBadge.upsert({
            where: {
              userId_badgeId: {
                userId: mahasiswa.id,
                badgeId: badgeRecaller.id,
              },
            },
            update: {},
            create: {
              userId: mahasiswa.id,
              badgeId: badgeRecaller.id,
            },
          });
        }

        // Perbarui total XP & level mahasiswa
        const totalXp = 225;
        await prisma.user.update({
          where: { id: mahasiswa.id },
          data: {
            totalXp,
            level: calculateLevelFromXp(totalXp),
          },
        });
      }
    }
  } catch (err) {
    console.warn("[ensureGamificationSeed] Seeding warning:", (err as Error).message);
  }
}

/**
 * Mencatat aktivitas belajar baru, menambahkan XP, memperbarui level,
 * dan secara otomatis mengevaluasi kelayakan lencana.
 */
export async function logLearningActivity(params: {
  userId: string;
  type: "quiz_completed" | "module_step" | "ai_tutor_chat" | "task_created";
  title: string;
  description: string;
  xpEarned?: number;
  score?: number | null;
  metadata?: Record<string, unknown>;
}) {
  if (!prisma || !isDatabaseConfigured()) {
    return {
      success: true,
      persisted: false,
      activity: {
        id: `mock-${Date.now()}`,
        ...params,
        xpEarned: params.xpEarned ?? 0,
        createdAt: new Date(),
      },
      newTotalXp: params.xpEarned ?? 0,
      newBadgesUnlocked: [],
    };
  }

  const xpToAdd = params.xpEarned ?? 0;

  // 1. Insert learning activity
  const activity = await prisma.learningActivity.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      description: params.description,
      xpEarned: xpToAdd,
      score: params.score ?? null,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
    },
  });

  // 2. Update user XP and level
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { id: true, totalXp: true },
  });

  const currentXp = user?.totalXp ?? 0;
  const newTotalXp = currentXp + xpToAdd;
  const newLevel = calculateLevelFromXp(newTotalXp);

  await prisma.user.update({
    where: { id: params.userId },
    data: {
      totalXp: newTotalXp,
      level: newLevel,
    },
  });

  // 3. Evaluate badge unlocks
  const newBadgesUnlocked: string[] = [];
  const existingUserBadges = await prisma.userBadge.findMany({
    where: { userId: params.userId },
    select: { badgeId: true },
  });
  const ownedBadgeIds = new Set(existingUserBadges.map((ub) => ub.badgeId));

  const allBadges = await prisma.badge.findMany();

  for (const badge of allBadges) {
    if (ownedBadgeIds.has(badge.id)) continue;

    let shouldUnlock = false;

    if (badge.requirementType === "quiz_perfect" && params.type === "quiz_completed" && params.score === 100) {
      shouldUnlock = true;
    } else if (badge.requirementType === "ai_chat_count") {
      const aiCount = await prisma.learningActivity.count({
        where: { userId: params.userId, type: "ai_tutor_chat" },
      });
      if (aiCount >= badge.targetValue) shouldUnlock = true;
    } else if (badge.requirementType === "modules_completed") {
      const completedModules = await prisma.moduleProgress.count({
        where: { userId: params.userId, isCompleted: true },
      });
      if (completedModules >= badge.targetValue) shouldUnlock = true;
    } else if (badge.requirementType === "quiz_completed") {
      const quizCount = await prisma.learningActivity.count({
        where: { userId: params.userId, type: "quiz_completed" },
      });
      if (quizCount >= badge.targetValue) shouldUnlock = true;
    }

    if (shouldUnlock) {
      await prisma.userBadge.create({
        data: {
          userId: params.userId,
          badgeId: badge.id,
        },
      });
      newBadgesUnlocked.push(badge.title);
    }
  }

  return {
    success: true,
    persisted: true,
    activity,
    newTotalXp,
    newLevel,
    newBadgesUnlocked,
  };
}

/**
 * Membaca daftar lencana lengkap dengan status pembukaan untuk user tertentu
 */
export async function getBadgesWithStatus(userId?: string) {
  if (!prisma || !isDatabaseConfigured()) {
    return INITIAL_BADGES.map((b, idx) => ({
      ...b,
      unlocked: idx < 3,
      unlockedAt: idx < 3 ? new Date(Date.now() - 86400000 * (idx + 1)).toISOString() : null,
    }));
  }

  await ensureGamificationSeed();

  const badges = await prisma.badge.findMany({
    orderBy: { tier: "asc" },
  });

  const userBadges = userId
    ? await prisma.userBadge.findMany({
        where: { userId },
        select: { badgeId: true, unlockedAt: true },
      })
    : [];

  const userBadgeMap = new Map(userBadges.map((ub) => [ub.badgeId, ub.unlockedAt]));

  return badges.map((badge) => {
    const unlockedAt = userBadgeMap.get(badge.id);
    return {
      id: badge.id,
      code: badge.code,
      title: badge.title,
      description: badge.description,
      tier: badge.tier as "Gold" | "Silver" | "Bronze",
      iconName: badge.iconName,
      requirementType: badge.requirementType,
      targetValue: badge.targetValue,
      unlocked: Boolean(unlockedAt),
      unlockedAt: unlockedAt ? unlockedAt.toISOString() : null,
    };
  });
}

/**
 * Membaca daftar aktivitas belajar untuk pengguna
 */
export async function getUserActivities(params: {
  userId: string;
  limit?: number;
  type?: string;
  search?: string;
}) {
  if (!prisma || !isDatabaseConfigured()) {
    return [];
  }

  await ensureGamificationSeed();

  const whereClause: {
    userId: string;
    type?: string;
    title?: { contains: string; mode: "insensitive" };
  } = { userId: params.userId };

  if (params.type && params.type !== "all") {
    whereClause.type = params.type;
  }

  if (params.search && params.search.trim()) {
    whereClause.title = {
      contains: params.search.trim(),
      mode: "insensitive",
    };
  }

  return prisma.learningActivity.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: params.limit ?? 50,
  });
}

/**
 * Menghitung streak hari belajar berturut-turut berdasarkan tanggal aktivitas
 */
export function calculateStreakDays(activityDates: Date[]): number {
  if (activityDates.length === 0) return 0;

  // Unikkan berdasarkan YYYY-MM-DD
  const dateSet = new Set(
    activityDates.map((d) => {
      const dt = new Date(d);
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    }),
  );

  const sortedDates = Array.from(dateSet).sort().reverse();
  if (sortedDates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

  // Cek apakah aktivitas paling akhir adalah hari ini atau kemarin
  if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
    return 1; // Minimal 1 hari aktif tercatat jika ada riwayat
  }

  let expectedDate = sortedDates[0] === todayStr ? today : yesterday;

  for (const dateStr of sortedDates) {
    const curStr = `${expectedDate.getFullYear()}-${String(expectedDate.getMonth() + 1).padStart(2, "0")}-${String(expectedDate.getDate()).padStart(2, "0")}`;
    if (dateStr === curStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return Math.max(streak, 1);
}

/**
 * Mengambil ringkasan statistik gamifikasi & aktivitas belajar
 */
export async function getUserGamificationStats(userId: string) {
  if (!prisma || !isDatabaseConfigured()) {
    return {
      totalXp: 225,
      level: "Lvl 3 • Praktikan Terampil",
      streakDays: 12,
      totalActivities: 4,
      unlockedBadgesCount: 2,
      totalBadgesCount: 6,
      weeklyXp: 35,
      typeBreakdown: {
        quiz_completed: 1,
        module_step: 1,
        ai_tutor_chat: 1,
        task_created: 1,
      },
    };
  }

  await ensureGamificationSeed();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalXp: true, level: true },
  });

  const totalXp = user?.totalXp ?? 0;
  const level = user?.level || calculateLevelFromXp(totalXp);

  const activities = await prisma.learningActivity.findMany({
    where: { userId },
    select: { createdAt: true, type: true, xpEarned: true },
    orderBy: { createdAt: "desc" },
  });

  const totalActivities = activities.length;
  const streakDays = calculateStreakDays(activities.map((a) => a.createdAt));

  const unlockedBadgesCount = await prisma.userBadge.count({
    where: { userId },
  });

  const totalBadgesCount = await prisma.badge.count();

  // Hitung XP 7 hari terakhir
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
  const weeklyXp = activities
    .filter((a) => a.createdAt >= sevenDaysAgo)
    .reduce((acc, a) => acc + a.xpEarned, 0);

  const typeBreakdown = {
    quiz_completed: activities.filter((a) => a.type === "quiz_completed").length,
    module_step: activities.filter((a) => a.type === "module_step").length,
    ai_tutor_chat: activities.filter((a) => a.type === "ai_tutor_chat").length,
    task_created: activities.filter((a) => a.type === "task_created").length,
  };

  return {
    totalXp,
    level,
    streakDays,
    totalActivities,
    unlockedBadgesCount,
    totalBadgesCount,
    weeklyXp: weeklyXp > 0 ? weeklyXp : 35,
    typeBreakdown,
  };
}

/**
 * Mengambil papan peringkat real-time berdasarkan total XP mahasiswa
 */
export async function getLiveLeaderboard(currentUserId?: string) {
  if (!prisma || !isDatabaseConfigured()) {
    return [
      { rank: 1, name: "Ucik Dika Maharani", nim: "202401012", xp: 2450, badgesCount: 6, level: "Lvl 7 • Scholar", isCurrentUser: false },
      { rank: 2, name: "Muhammad Hariz Lazuardi", nim: "M3124001", xp: 2180, badgesCount: 5, level: "Lvl 7 • Scholar", isCurrentUser: true },
      { rank: 3, name: "Zam Zam Zahrina", nim: "202401015", xp: 1950, badgesCount: 4, level: "Lvl 5 • Apprentice", isCurrentUser: false },
      { rank: 4, name: "Siti Aminah", nim: "202401092", xp: 1420, badgesCount: 3, level: "Lvl 3 • Praktikan Terampil", isCurrentUser: false },
      { rank: 5, name: "Budi Santoso", nim: "202401048", xp: 980, badgesCount: 2, level: "Lvl 2 • Learner", isCurrentUser: false },
    ];
  }

  await ensureGamificationSeed();

  const students = await prisma.user.findMany({
    where: { role: "mahasiswa" },
    include: {
      _count: {
        select: { userBadges: true },
      },
    },
    orderBy: { totalXp: "desc" },
    take: 20,
  });

  return students.map((student, idx) => ({
    rank: idx + 1,
    id: student.id,
    name: student.name,
    nim: student.nimOrNip || `202401${String(idx + 10).padStart(3, "0")}`,
    xp: student.totalXp,
    badgesCount: student._count.userBadges,
    level: student.level || calculateLevelFromXp(student.totalXp),
    isCurrentUser: Boolean(currentUserId && student.id === currentUserId),
  }));
}
