// app/api/modul/upload/route.ts
/**
 * API Route: Module Document Upload & Automatic Chunking for RAG
 * Accepts multipart/form-data with 'file' and 'moduleId'.
 * Extracts text from PDF or text documents, generates overlapping chunks,
 * and saves into the module registry.
 */

import { type NextRequest, NextResponse } from "next/server";
import { generateAiModuleAnalysis } from "@/lib/aiModuleServer";
import { chunkText, extractTextFromPdf, getModule, listModules, saveModule } from "@/lib/ragEngine";

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

    const fileName =
      typeof (file as { name?: unknown }).name === "string"
        ? (file as { name: string }).name
        : "dokumen.pdf";

    // 2. Tentukan moduleId (dari form data atau gunakan slug nama file)
    const moduleId =
      typeof rawModuleId === "string" && rawModuleId.trim().length > 0
        ? rawModuleId.trim()
        : fileName
            .replace(/\.[^/.]+$/, "")
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, "-");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json({ error: "File yang diunggah kosong (0 bytes)." }, { status: 400 });
    }

    // 3. Ekstraksi teks multi-strategi: Prioritaskan FastAPI /api/modul/extract-text (pypdf),
    //    dengan fallback ke ekstraktor lokal Next.js jika FastAPI sedang offline.
    let extractedText = "";
    let pageCount = 1;
    const fastApiBaseUrl = (
      process.env.FASTAPI_URL ||
      process.env.NEXT_PUBLIC_FASTAPI_URL ||
      "https://nexed-backend.vercel.app"
    ).replace(/\/$/, "");

    try {
      const fastApiForm = new FormData();
      const fileBlob = new Blob([buffer], {
        type:
          typeof (file as { type?: unknown }).type === "string"
            ? (file as { type: string }).type
            : "application/octet-stream",
      });
      fastApiForm.append("file", fileBlob, fileName);

      const fastApiRes = await fetch(`${fastApiBaseUrl}/api/modul/extract-text`, {
        method: "POST",
        body: fastApiForm,
        signal: AbortSignal.timeout(15000),
      });

      if (fastApiRes.ok) {
        const fastApiData = (await fastApiRes.json().catch(() => null)) as {
          extractedText?: string;
          pageCount?: number;
        } | null;
        if (
          fastApiData &&
          typeof fastApiData.extractedText === "string" &&
          fastApiData.extractedText.trim().length >= 20
        ) {
          extractedText = fastApiData.extractedText.trim();
          if (typeof fastApiData.pageCount === "number" && fastApiData.pageCount > 0) {
            pageCount = fastApiData.pageCount;
          }
        }
      }
    } catch (fastApiErr) {
      console.warn(
        "[upload] FastAPI /api/modul/extract-text tidak terjangkau, menggunakan fallback ekstraktor lokal Next.js:",
        fastApiErr,
      );
    }

    const lowerName = fileName.toLowerCase();
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

    if (!extractedText || extractedText.trim().length < 20) {
      if (isPdf) {
        try {
          extractedText = await extractTextFromPdf(buffer);
        } catch (pdfErr) {
          console.warn(
            "Ekstraksi standar PDF dilewati, menggunakan stream regex fallback:",
            pdfErr,
          );
        }

        // Jika PDF parse tidak menghasilkan teks (misal font encoding non-standar), ekstrak string terbaca
        if (!extractedText || extractedText.trim().length < 20) {
          const raw = buffer.toString("latin1");
          const printableMatches = raw.match(
            /[A-Za-z0-9\s.,;:!?'"()_\-–—/\\+*=<>@#$%^&[\]{}]{4,}/g,
          );
          if (printableMatches && printableMatches.length > 0) {
            extractedText = printableMatches.filter((s) => s.trim().length > 3).join(" ");
          }
        }
      } else if (isOffice) {
        const raw = buffer.toString("latin1");
        // Cocokkan tag teks Word <w:t> dan PowerPoint <a:t>
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
        // Format teks biasa, markdown, code (.js, .ts, .py, .java, .sql, .html, .css, dsb)
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
    }

    // 4. Validasi & Pembersihan Teks (maksimal 15000 karakter bersih untuk pipeline analisis)
    let cleanText = extractedText.replace(/[^\x20-\x7E\r\n\t\u00A0-\u024F]/g, " ").trim();
    cleanText = cleanText.replace(/[ \t]{2,}/g, " ").trim();

    if (cleanText.length < 20) {
      const prettyTitle = fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      cleanText = `Dokumen: ${prettyTitle}\nCatatan: Dokumen ini memiliki teks yang sangat minim atau berbasis gambar.`;
    }

    const boundedCleanText = cleanText.slice(0, 15000);
    const previewSnippet = boundedCleanText.slice(0, 300);

    // 5. Pecah teks menjadi potongan konteks (~500 kata, 100 kata overlap)
    const chunks = chunkText(boundedCleanText, 500, 100);
    const totalWords = boundedCleanText.split(/\s+/).length;

    // 6. Simpan potongan konteks ke RAG Engine Store
    const saved = saveModule(moduleId, fileName, chunks, totalWords);

    // 7. Hasilkan analisis AI HANYA jika diminta eksplisit (field 'analyze' === 'true')
    const shouldAnalyze = formData.get("analyze") === "true";
    const userFocusField = formData.get("userFocus") || formData.get("userLearningGoal");
    const userFocus =
      typeof userFocusField === "string" && userFocusField.trim().length > 0
        ? userFocusField.trim()
        : undefined;
    let analyzedResult = null;
    if (shouldAnalyze) {
      try {
        analyzedResult = await generateAiModuleAnalysis(boundedCleanText, fileName, undefined, {
          userFocus,
          userLearningGoal: userFocus,
        });
      } catch (analysisErr) {
        console.warn("AI module analysis warning (fallback applied):", analysisErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Modul '${fileName}' berhasil diunggah dan diekstrak (${pageCount} halaman, ${chunks.length} potongan konteks).`,
        filename: saved.filename,
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
