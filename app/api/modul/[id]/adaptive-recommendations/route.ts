// app/api/modul/[id]/adaptive-recommendations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { resolveCuratedResources } from "@/lib/curatedResources";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const moduleId = decodeURIComponent(context.params.id || "modul-aktif");
    const body = (await request.json().catch(() => ({}))) as {
      topic?: string;
      summary?: string;
      completedStage?: number;
      quizScore?: number;
    };

    const rawTopic =
      typeof body.topic === "string" && body.topic.trim().length > 0
        ? body.topic.trim()
        : moduleId.replace(/[-_]+/g, " ").trim();

    const curated = resolveCuratedResources(
      `${rawTopic} ${body.summary || ""}`,
      rawTopic,
    );

    const external_resources = curated.docs.map((d) => ({
      title: d.title,
      type: "Dokumentasi" as const,
      url: d.url,
      duration: "15 Min Read",
      description: d.description,
    }));

    return NextResponse.json(
      {
        success: true,
        moduleId,
        topic: rawTopic,
        summary:
          body.summary?.trim() ||
          `Rekomendasi adaptif dan dokumentasi teknis terverifikasi untuk pendalaman materi "${rawTopic}".`,
        diagnostic_questions: [
          `Bagaimana konsep utama pada "${rawTopic}" diterapkan dalam alur kerja nyata?`,
          `Apa kesalahan umum (pitfall) yang perlu dihindari saat mempraktikkan "${rawTopic}"?`,
        ],
        external_resources,
        nextStageRecommendation:
          typeof body.completedStage === "number" ? body.completedStage + 1 : 1,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal menyusun rekomendasi adaptif modul.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  const moduleId = decodeURIComponent(context.params.id || "modul-aktif");
  const rawTopic = moduleId.replace(/[-_]+/g, " ").trim();
  const curated = resolveCuratedResources(rawTopic, rawTopic);

  return NextResponse.json(
    {
      success: true,
      moduleId,
      topic: rawTopic,
      summary: `Referensi dokumentasi resmi untuk materi "${rawTopic}".`,
      diagnostic_questions: [
        `Apa fondasi konseptual paling penting dalam "${rawTopic}"?`,
      ],
      external_resources: curated.docs.map((d) => ({
        title: d.title,
        type: "Dokumentasi" as const,
        url: d.url,
        duration: "15 Min Read",
        description: d.description,
      })),
    },
    { status: 200 },
  );
}
