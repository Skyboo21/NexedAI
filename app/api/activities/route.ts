// app/api/activities/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "../../../src/lib/server/authHelper";
import {
  getUserActivities,
  logLearningActivity,
  getUserGamificationStats,
} from "../../../src/lib/server/gamificationDb";

const LogActivitySchema = z.object({
  type: z.enum(["quiz_completed", "module_step", "ai_tutor_chat", "task_created"]),
  title: z.string().min(2, "Judul aktivitas wajib diisi"),
  description: z.string().min(2, "Deskripsi aktivitas wajib diisi"),
  xpEarned: z.number().int().nonnegative().optional().default(0),
  score: z.number().nullable().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const search = searchParams.get("search") || "";
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10);

    const [activities, stats] = await Promise.all([
      getUserActivities({
        userId: user.id,
        type: type !== "all" ? type : undefined,
        search,
        limit,
      }),
      getUserGamificationStats(user.id),
    ]);

    return NextResponse.json({
      success: true,
      data: activities,
      stats,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Gagal mengambil daftar aktivitas" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = LogActivitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Payload tidak valid", details: parsed.error.format() },
        { status: 400 },
      );
    }

    const result = await logLearningActivity({
      userId: user.id,
      type: parsed.data.type,
      title: parsed.data.title,
      description: parsed.data.description,
      xpEarned: parsed.data.xpEarned,
      score: parsed.data.score,
      metadata: parsed.data.metadata,
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Gagal mencatat aktivitas" },
      { status: 500 },
    );
  }
}
