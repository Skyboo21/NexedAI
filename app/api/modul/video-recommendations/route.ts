// app/api/modul/video-recommendations/route.ts
/**
 * API Route: AI User Needs Analysis + Quota-Free YouTube Video Validation (yt-dlp) + Prisma Cache
 * Tidak pernah mengalami crash 500 berkat Zero-Error Fallback saat FastAPI atau DB sedang offline.
 */
import { type NextRequest, NextResponse } from "next/server";
import { resolveValidatedTopicVideos } from "@/lib/videoRecommendationPipeline";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const topic =
      typeof body?.topic === "string" && body.topic.trim().length > 0
        ? body.topic.trim()
        : typeof body?.moduleTitle === "string" && body.moduleTitle.trim().length > 0
          ? body.moduleTitle.trim()
          : "Materi Pembelajaran";
    const detectedTopic =
      typeof body?.detectedTopic === "string" && body.detectedTopic.trim().length > 0
        ? body.detectedTopic.trim()
        : undefined;
    const extractedText =
      typeof body?.extractedText === "string" && body.extractedText.trim().length > 0
        ? body.extractedText.trim()
        : typeof body?.contentSample === "string" && body.contentSample.trim().length > 0
          ? body.contentSample.trim()
          : undefined;
    const userFocus =
      typeof body?.userFocus === "string" && body.userFocus.trim().length > 0
        ? body.userFocus.trim()
        : typeof body?.userLearningGoal === "string" && body.userLearningGoal.trim().length > 0
          ? body.userLearningGoal.trim()
          : undefined;
    const coreKeywords = Array.isArray(body?.coreKeywords)
      ? body.coreKeywords.map((kw: unknown) => String(kw || "").trim()).filter(Boolean)
      : undefined;
    const forceRefresh = Boolean(body?.forceRefresh);

    const result = await resolveValidatedTopicVideos({
      topic,
      detectedTopic,
      extractedText,
      contentSample: extractedText,
      userFocus,
      userLearningGoal: userFocus,
      coreKeywords,
      forceRefresh,
    });

    return NextResponse.json(
      {
        success: true,
        ...result,
        learningStages: result.learningStages ?? [],
        validatedVideos: result.videos,
      },
      { status: 200 },
    );
  } catch (error) {
    console.warn("[video-recommendations] Fallback safety triggered:", error);
    return NextResponse.json(
      {
        success: true,
        topicKey: "fallback",
        detectedTopic: "Materi Pembelajaran",
        coreKeywords: [],
        learningStages: [],
        userNeedsSummary:
          "Server validator video (FastAPI) sedang tidak aktif atau tidak ditemukan video yang lolos filter kualitas.",
        recommendedQueries: [],
        webReferences: [],
        videos: [],
        validatedVideos: [],
        cacheHit: false,
        source: "empty",
      },
      { status: 200 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") || "Algoritma & Pemrograman";
  const goal = searchParams.get("goal") || undefined;

  const result = await resolveValidatedTopicVideos({
    topic,
    userLearningGoal: goal,
  });

  return NextResponse.json(
    {
      success: true,
      ...result,
    },
    { status: 200 },
  );
}

