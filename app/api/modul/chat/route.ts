// app/api/modul/chat/route.ts
/**
 * API Route: RAG Chat Assistant for Learning Modules
 * Receives JSON body { moduleId: string, message: string }
 * Retrieves top matching context chunks from the module and queries Groq LLaMA-3.3-70B.
 */

import { type NextRequest, NextResponse } from "next/server";
import { generateAiChatTutorResponse } from "@/lib/aiModuleServer";
import { findRelevantChunks, generateRagResponse, getModule } from "@/lib/ragEngine";

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
      moduleId,
      message,
      moduleTitle,
      moduleOverview,
      keyPoints,
      quizContext,
      contentSample,
    } = body;

    // 1. Validasi pesan
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Pesan pertanyaan tidak boleh kosong." }, { status: 400 });
    }

    // 2. Jika dipanggil dari NexedAiModuleHub dengan moduleTitle
    if (moduleTitle && typeof moduleTitle === "string" && moduleTitle.trim().length > 0) {
      const storedModule = moduleId ? getModule(String(moduleId).trim()) : null;
      const chunksSnippet = storedModule
        ? findRelevantChunks(message, storedModule.chunks, 2).join("\n")
        : contentSample;

      const reply = await generateAiChatTutorResponse({
        message: message.trim(),
        moduleTitle: moduleTitle.trim(),
        moduleOverview: moduleOverview ? String(moduleOverview) : undefined,
        keyPoints: Array.isArray(keyPoints) ? keyPoints : undefined,
        quizContext: Array.isArray(quizContext) ? quizContext : undefined,
        contentSample: chunksSnippet ? String(chunksSnippet) : undefined,
      });

      return NextResponse.json(
        {
          reply,
          usedChunks: storedModule ? 2 : 0,
        },
        { status: 200 },
      );
    }

    // 3. Validasi moduleId untuk RAG chat konvensional
    if (!moduleId || typeof moduleId !== "string" || moduleId.trim().length === 0) {
      return NextResponse.json(
        { error: "Parameter 'moduleId' wajib disertakan." },
        { status: 400 },
      );
    }

    // 4. Fallback ke Strict RAG Engine jika mode RAG aktif
    const storedModule = getModule(String(moduleId).trim());
    if (!storedModule || storedModule.chunks.length === 0) {
      return NextResponse.json(
        {
          reply: "Silakan unggah dokumen modul terlebih dahulu sebelum bertanya.",
          usedChunks: 0,
        },
        { status: 200 },
      );
    }

    const relevantChunks = findRelevantChunks(message, storedModule.chunks, 3);
    const reply = await generateRagResponse(message, relevantChunks);

    return NextResponse.json(
      {
        reply,
        usedChunks: relevantChunks.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error pada RAG chat route:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan internal saat memproses jawaban RAG.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
