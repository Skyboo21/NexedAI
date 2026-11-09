// app/api/modul/upload/route.ts
/**
 * API Route: Module Document Upload & Automatic Chunking for RAG
 * Accepts multipart/form-data with 'file' and 'moduleId'.
 * Extracts text directly in Next.js Node.js runtime (unpdf / pdf-parse)
 * with fallback to FastAPI /api/modul/extract-text, validates against status messages,
 * generates overlapping chunks, and saves into the module registry.
 */

import { type NextRequest, NextResponse } from "next/server";
import { generateAiModuleAnalysis } from "@/lib/aiModuleServer";
import {
  chunkText,
  extractTextAndPagesFromPdf,
  getModule,
  listModules,
  saveModule,
} from "@/lib/ragEngine";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Permintaan harus berupa multipart/form-data." },
        { status: 400 },
      );
    }
    const file = formData.get("file");
    const rawModuleId = formData.get("moduleId");

    // 1. Validasi keberadaan file
    if (!file || typeof file === "string" || !("arrayBuffer" in file)) {
      return NextResponse.json(
        { error: "File dokumen modul wajib diunggah (field: 'file')." },
        { status: 400 },
      );
    }

    const rawFileName =
      typeof (file as { name?: unknown }).name === "string"
        ? (file as { name: string }).name
        : "dokumen.pdf";

    const cleanFileNameWithoutExt =
      rawFileName
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, " ")
        .trim() || "modul-pembelajaran";

    // 2. Tentukan moduleId (dari form data atau gunakan slug nama file)
    const moduleId =
      typeof rawModuleId === "string" && rawModuleId.trim().length > 0
        ? rawModuleId.trim()
        : cleanFileNameWithoutExt
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, "-")
            .replace(/-+/g, "-");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json({ error: "File yang diunggah kosong (0 bytes)." }, { status: 400 });
    }

    const lowerName = rawFileName.toLowerCase();
    const isPdf =
      lowerName.endsWith(".pdf") ||
      (typeof (file as { type?: unknown }).type === "string" &&
        (file as { type: string }).type === "application/pdf");
    const isOffice =
      lowerName.endsWith(".docx") ||
      lowerName.endsWith(".doc") ||
      lowerName.endsWith(".pptx") ||
      lowerName.endsWith(".ppt") ||
      lowerName.endsWith(".odt");

    let extractedText = "";
    let pageCount = 1;

    // 3. Ekstraksi teks langsung di server Next.js terlebih dahulu
    if (isPdf) {
      try {
        const localPdf = await extractTextAndPagesFromPdf(buffer);
        extractedText = localPdf.text;
        pageCount = localPdf.pageCount;
      } catch (pdfErr) {
        console.warn("[upload] Ekstraksi PDF lokal Next.js gagal, mencoba cadangan:", pdfErr);
      }
    } else if (isOffice) {
      const raw = buffer.toString("latin1");
      const xmlMatches = raw.match(/<(?:w|a):t[^>]*>([^<]+)<\/(?:w|a):t>/g);
      if (xmlMatches && xmlMatches.length > 0) {
        extractedText = xmlMatches.map((m) => m.replace(/<[^>]+>/g, "")).join(" ");
      } else {
        const printableMatches = raw.match(
          /[A-Za-z0-9\s.,;:!?'"()_\-–—/\\+*=<>@#$%^&[\]{}]{4,}/g,
        );
        if (printableMatches && printableMatches.length > 0) {
          extractedText = printableMatches.filter((s) => s.trim().length > 3).join(" ");
        }
      }
    } else {
      extractedText = buffer.toString("utf-8");
      if (extractedText.trim().length === 0) {
        return NextResponse.json(
          {
            error:
              "Tidak ada teks terbaca di dalam dokumen. Pastikan file bukan berupa scan gambar tanpa OCR.",
          },
          { status: 422 },
        );
      }
    }

    // 4. Cadangan: Jika ekstraksi lokal gagal/kurang dari 150 karakter untuk PDF, panggil FastAPI /api/modul/extract-text
    if (
      (!extractedText ||
        extractedText.trim().length < (isPdf ? 150 : 20) ||
        extractedText.toLowerCase().includes("berhasil diindeks ke vector store")) &&
      (isPdf || isOffice)
    ) {
      const fastApiBaseUrl = (
        process.env.FASTAPI_URL ||
        process.env.NEXT_PUBLIC_FASTAPI_URL ||
        "https://nexed-backend.vercel.app"
      ).replace(/\/+$/, "");

      try {
        const fastApiForm = new FormData();
        const fileBlob = new Blob([buffer], {
          type:
            typeof (file as { type?: unknown }).type === "string"
              ? (file as { type: string }).type
              : "application/pdf",
        });
        fastApiForm.append("file", fileBlob, rawFileName);

        const fastApiRes = await fetch(`${fastApiBaseUrl}/api/modul/extract-text`, {
          method: "POST",
          body: fastApiForm,
          signal: AbortSignal.timeout(20000),
        });

        if (fastApiRes.ok) {
          const fastApiData = (await fastApiRes.json().catch(() => null)) as {
            extractedText?: string;
            pageCount?: number;
          } | null;
          if (
            fastApiData &&
            typeof fastApiData.extractedText === "string" &&
            fastApiData.extractedText.trim().length > extractedText.trim().length &&
            !fastApiData.extractedText.toLowerCase().includes("berhasil diindeks ke vector store")
          ) {
            extractedText = fastApiData.extractedText.trim();
            if (typeof fastApiData.pageCount === "number" && fastApiData.pageCount > 0) {
              pageCount = fastApiData.pageCount;
            }
          }
        }
      } catch (fastApiErr) {
        console.warn("[upload] Cadangan FastAPI /api/modul/extract-text tidak terjangkau:", fastApiErr);
      }
    }

    // 5. Bersihkan whitespace berlebih dan ambil maksimal 18.000 karakter pertama yang representatif
    let cleanText = extractedText
      .replace(/[^\x20-\x7E\r\n\t\u00A0-\u024F]/g, " ")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Hapus kalimat status sistem jika tidak sengaja terbawa
    cleanText = cleanText
      .replace(/Modul\s+['"][^'"]+['"]\s+berhasil\s+diindeks\s+ke\s+vector\s+store\.?/gi, "")
      .trim();

    // Validasi Anti-Status-Message & panjang minimum PDF
    if (
      cleanText.toLowerCase().includes("berhasil diindeks ke vector store") ||
      (isPdf && cleanText.length < 150)
    ) {
      return NextResponse.json(
        {
          error:
            "Isi teks PDF tidak terbaca. Pastikan file PDF berisi teks yang dapat disalin.",
        },
        { status: 400 },
      );
    }

    if (cleanText.length === 0) {
      return NextResponse.json(
        {
          error:
            "Tidak ada teks terbaca di dalam dokumen. Pastikan file bukan berupa scan gambar tanpa OCR.",
        },
        { status: 422 },
      );
    }

    const boundedCleanText = cleanText.slice(0, 18000);
    const previewSnippet = boundedCleanText.slice(0, 250).replace(/\s+/g, " ").trim();

    // 6. Pecah teks menjadi potongan konteks (~500 kata, 100 kata overlap)
    const chunks = chunkText(boundedCleanText, 500, 100);
    const totalWords = boundedCleanText.split(/\s+/).filter(Boolean).length;

    // 7. Simpan potongan konteks ke RAG Engine Store
    const saved = saveModule(moduleId, rawFileName, chunks, totalWords);

    // 8. Hasilkan analisis AI HANYA jika diminta eksplisit (field 'analyze' === 'true')
    const shouldAnalyze = formData.get("analyze") === "true";
    const userFocusField = formData.get("userFocus") || formData.get("userLearningGoal");
    const userFocus =
      typeof userFocusField === "string" && userFocusField.trim().length > 0
        ? userFocusField.trim()
        : undefined;
    let analyzedResult = null;
    if (shouldAnalyze) {
      try {
        analyzedResult = await generateAiModuleAnalysis(
          boundedCleanText,
          rawFileName,
          cleanFileNameWithoutExt,
          {
            userFocus,
            userLearningGoal: userFocus,
            forceRefresh: true,
          },
        );
      } catch (analysisErr) {
        console.warn("AI module analysis warning (fallback applied):", analysisErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        filename: cleanFileNameWithoutExt,
        originalFilename: saved.filename,
        moduleId: saved.moduleId,
        pageCount,
        chunkCount: saved.chunks.length,
        totalWords: saved.totalWords,
        extractedText: boundedCleanText,
        previewSnippet,
        rawText: boundedCleanText,
        analyzedResult,
        uploadedAt: saved.uploadedAt,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error pada upload route:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan internal saat memproses upload modul.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET: Cek status atau informasi modul yang sudah tersimpan
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const moduleId = searchParams.get("moduleId");

  if (searchParams.get("list") === "all") {
    return NextResponse.json(
      {
        modules: listModules(),
      },
      { status: 200 },
    );
  }

  if (!moduleId) {
    return NextResponse.json(
      { error: "Query parameter 'moduleId' wajib disertakan." },
      { status: 400 },
    );
  }

  const moduleData = getModule(moduleId);
  if (!moduleData) {
    return NextResponse.json(
      {
        found: false,
        message: `Modul '${moduleId}' belum diunggah atau tidak ditemukan.`,
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    found: true,
    moduleId: moduleData.moduleId,
    filename: moduleData.filename,
    chunkCount: moduleData.chunks.length,
    totalWords: moduleData.totalWords,
    uploadedAt: moduleData.uploadedAt,
  });
}
