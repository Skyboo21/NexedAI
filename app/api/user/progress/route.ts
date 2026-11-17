// app/api/user/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma, isDatabaseConfigured } from "@/lib/server/db";
import { verifySessionToken } from "@/lib/server/sessionToken";

export const dynamic = "force-dynamic";

async function resolveUserId(request: NextRequest, bodyGuestId?: string): Promise<string> {
  const token = request.cookies.get("nexed_session_token")?.value;
  if (token) {
    const session = await verifySessionToken(token);
    if (session?.sub) return session.sub;
  }
  const urlGuest = request.nextUrl.searchParams.get("guestId");
  return bodyGuestId || urlGuest || "guest-default";
}

export async function GET(request: NextRequest) {
  try {
    const userId = await resolveUserId(request);
    const moduleKey = request.nextUrl.searchParams.get("moduleKey");

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        {
          success: true,
          userId,
          modules: [],
          totalXp: 0,
          badges: [],
          activities: [],
          certificates: [],
          source: "local-only",
        },
        { status: 200 },
      );
    }

    // Gunakan akses dinamis agar tetap aman sebelum prisma generate ulang DLL
    const progressDelegate = (prisma as unknown as {
      userLearningProgress?: {
        findMany: (args: unknown) => Promise<Array<Record<string, unknown>>>;
      };
    }).userLearningProgress;

    const moduleRows = progressDelegate
      ? await progressDelegate
          .findMany({
            where: moduleKey ? { userId, moduleKey } : { userId },
            orderBy: { updatedAt: "desc" },
          })
          .catch(() => [])
      : [];

    let totalXp = 0;
    let badges: Array<Record<string, unknown>> = [];
    let activities: Array<Record<string, unknown>> = [];

    if (!userId.startsWith("guest-")) {
      const userRecord = await prisma.user
        .findUnique({
          where: { id: userId },
          select: { totalXp: true },
        })
        .catch(() => null);
      if (userRecord) totalXp = userRecord.totalXp;

      const userBadges = await prisma.userBadge
        .findMany({
          where: { userId },
          include: { badge: true },
          orderBy: { unlockedAt: "desc" },
        })
        .catch(() => []);

      badges = userBadges.map((ub) => ({
        id: ub.badge.id,
        code: ub.badge.code,
        title: ub.badge.title,
        description: ub.badge.description,
        tier: ub.badge.tier,
        unlockedAt: ub.unlockedAt,
      }));

      const userActivities = await prisma.learningActivity
        .findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 30,
        })
        .catch(() => []);

      activities = userActivities.map((a) => ({
        id: a.id,
        type: a.type,
        title: a.title,
        description: a.description,
        xpEarned: a.xpEarned,
        score: a.score,
        createdAt: a.createdAt,
      }));
    }

    const certificates = moduleRows
      .map((m) => m.certificate)
      .filter((c): c is Record<string, unknown> => Boolean(c && typeof c === "object"));

    return NextResponse.json(
      {
        success: true,
        userId,
        modules: moduleRows,
        totalXp,
        badges,
        activities,
        certificates,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal memuat progres pengguna.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      guestId?: string;
      moduleKey?: string;
      moduleTitle?: string;
      completedStageIds?: number[];
      checkedActions?: Record<string, Record<string, boolean>>;
      quizAnswers?: Record<string, Record<string, number>>;
      stage3Completed?: boolean;
      stage4Completed?: boolean;
      progressPercent?: number;
      xpDelta?: number;
      badgeTitle?: string;
      activity?: {
        type: string;
        title: string;
        description: string;
        xpEarned?: number;
        score?: number;
      };
      certificate?: Record<string, unknown> | null;
    };

    const userId = await resolveUserId(request, body.guestId);
    const moduleKey = (body.moduleKey || "modul-aktif").toLowerCase().trim();
    const moduleTitle = body.moduleTitle || "Modul Pembelajaran";

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { success: true, userId, moduleKey, source: "local-only" },
        { status: 200 },
      );
    }

    const progressDelegate = (prisma as unknown as {
      userLearningProgress?: {
        upsert: (args: unknown) => Promise<Record<string, unknown>>;
      };
    }).userLearningProgress;

    let savedProgress: Record<string, unknown> | null = null;

    if (progressDelegate) {
      savedProgress = await progressDelegate
        .upsert({
          where: { userId_moduleKey: { userId, moduleKey } },
          create: {
            userId,
            moduleKey,
            moduleTitle,
            completedStageIds: (body.completedStageIds || []) as unknown as Prisma.InputJsonValue,
            checkedActions: (body.checkedActions || {}) as unknown as Prisma.InputJsonValue,
            quizAnswers: (body.quizAnswers || {}) as unknown as Prisma.InputJsonValue,
            stage3Completed: Boolean(body.stage3Completed),
            stage4Completed: Boolean(body.stage4Completed),
            progressPercent: typeof body.progressPercent === "number" ? body.progressPercent : 0,
            certificate: body.certificate ? (body.certificate as unknown as Prisma.InputJsonValue) : undefined,
          },
          update: {
            moduleTitle,
            ...(Array.isArray(body.completedStageIds)
              ? { completedStageIds: body.completedStageIds as unknown as Prisma.InputJsonValue }
              : {}),
            ...(body.checkedActions
              ? { checkedActions: body.checkedActions as unknown as Prisma.InputJsonValue }
              : {}),
            ...(body.quizAnswers
              ? { quizAnswers: body.quizAnswers as unknown as Prisma.InputJsonValue }
              : {}),
            ...(typeof body.stage3Completed === "boolean"
              ? { stage3Completed: body.stage3Completed }
              : {}),
            ...(typeof body.stage4Completed === "boolean"
              ? { stage4Completed: body.stage4Completed }
              : {}),
            ...(typeof body.progressPercent === "number"
              ? { progressPercent: body.progressPercent }
              : {}),
            ...(body.certificate
              ? { certificate: body.certificate as unknown as Prisma.InputJsonValue }
              : {}),
          },
        })
        .catch(() => null);
    }

    if (!userId.startsWith("guest-")) {
      if (typeof body.xpDelta === "number" && body.xpDelta > 0) {
        await prisma.user
          .update({
            where: { id: userId },
            data: { totalXp: { increment: body.xpDelta } },
          })
          .catch(() => {});
      }

      if (body.activity) {
        await prisma.learningActivity
          .create({
            data: {
              userId,
              type: body.activity.type || "module_step",
              title: body.activity.title,
              description: body.activity.description,
              xpEarned: body.activity.xpEarned || 0,
              score: body.activity.score ?? null,
              metadata: JSON.stringify({ moduleKey }),
            },
          })
          .catch(() => {});
      }
    }

    return NextResponse.json(
      {
        success: true,
        userId,
        moduleKey,
        progress: savedProgress,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal menyimpan progres pengguna.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
