// app/api/modul/analyze/route.ts
/**
 * API Route: Real AI Module Analysis using Groq LLM
 * Receives JSON body { content: string, title?: string, fileName?: string }
 * Returns structured AnalyzedModuleResult.
 */

import { type NextRequest, NextResponse } from "next/server";
import { generateAiModuleAnalysis } from "@/lib/aiModuleServer";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body harus berformat JSON yang valid." },
        { status: 400 },
      );
    }

    const {
      content,
      extractedText,
      title,
      moduleTitle,
      fileName,
      forceRefresh,
      userFocus,
      userLearningGoal,
    } = body;

    const rawTextToAnalyze =
      typeof extractedText === "string" && extractedText.trim().length > 0
        ? extractedText.trim()
        : typeof content === "string"
          ? content.trim()
          : "";

    if (!rawTextToAnalyze) {
      return NextResponse.json(
        { error: "Konten materi (extractedText) tidak boleh kosong." },
        { status: 400 },
      );
    }

    const effectiveTitle =
      typeof moduleTitle === "string" && moduleTitle.trim().length > 0
        ? moduleTitle.trim()
        : typeof title === "string" && title.trim().length > 0
          ? title.trim()
          : undefined;

    const effectiveFocus =
      typeof userFocus === "string" && userFocus.trim().length > 0
        ? userFocus.trim()
        : typeof userLearningGoal === "string" && userLearningGoal.trim().length > 0
          ? userLearningGoal.trim()
          : undefined;

    const result = await generateAiModuleAnalysis(
      rawTextToAnalyze,
      typeof fileName === "string" ? fileName : undefined,
      effectiveTitle,
      {
        forceRefresh: Boolean(forceRefresh),
        userFocus: effectiveFocus,
        userLearningGoal: effectiveFocus,
        strictGrounded: true,
      },
    );

    if (!result.learningStages || result.learningStages.length === 0) {
      return NextResponse.json(
        {
          error:
            "Gagal mengekstrak tahapan belajar spesifik dari isi dokumen. Pastikan teks dokumen terbaca dengan jelas dan coba lagi.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        analyzedResult: result,
        detectedTopic: result.detectedTopic ?? result.title ?? "",
        coreKeywords: result.coreKeywords ?? [],
        learningStages: result.learningStages ?? [],
        moduleChapters: result.moduleChapters ?? [],
        webReferences: result.webReferences ?? result.recommendedDocs ?? [],
        videos: result.videos ?? result.recommendedVideos ?? [],
        validatedVideos: result.validatedVideos ?? result.recommendedVideos ?? [],
        userNeedsSummary: result.userNeedsSummary ?? "",
        recommendedQueries: result.recommendedQueries ?? [],
        videoCacheHit: Boolean(result.videoCacheHit),
        videoValidationSource: result.videoValidationSource ?? "empty",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error pada analyze route:", error);
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan saat memproses analisis AI.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
