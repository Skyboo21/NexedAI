// app/api/modul/analyze/route.ts
/**
 * API Route: Real AI Module Analysis using Groq LLM
 * Receives JSON body { content: string, title?: string, fileName?: string }
 * Returns structured AnalyzedModuleResult.
 */

import { type NextRequest, NextResponse } from "next/server";
import { generateAiModuleAnalysis } from "@/lib/aiModuleServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body harus berformat JSON yang valid." },
        { status: 400 },
      );
    }

    const { content, title, fileName } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Konten materi tidak boleh kosong." }, { status: 400 });
    }

    const result = await generateAiModuleAnalysis(content, fileName, title);

    return NextResponse.json(
      {
        success: true,
        analyzedResult: result,
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
